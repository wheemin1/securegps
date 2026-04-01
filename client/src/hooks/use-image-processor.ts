import { useState, useCallback, useRef } from 'react';
import {
  ProcessingOptions,
  ProcessingState,
  FileProcessingResult,
  ProcessingPayload,
  ProcessingOperation,
  FileMetadata,
  GpsEditByIndex,
  TableRowEdit,
} from '@/types';
import { isFormatSupported, generateZipFilename, downloadFile } from '@/utils/image-processor';
import { createZipFile } from '@/utils/zip-handler';
import { extractMetadata } from '@/utils/metadata-extractor';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

const toExifLikeDate = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (trimmed.includes(':') && trimmed.includes(' ')) return trimmed;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${parsed.getFullYear()}:${pad(parsed.getMonth() + 1)}:${pad(parsed.getDate())} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
};

const parseExifLikeDate = (input: string): Date | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const normalized = trimmed.includes(':') && trimmed.includes(' ')
    ? trimmed.replace(/^(\d{4}):(\d{2}):(\d{2})\s/, '$1-$2-$3T')
    : trimmed;
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
};

const isValidCoordinate = (lat: string, lng: string) => {
  const latitude = Number(lat);
  const longitude = Number(lng);
  return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

export function useImageProcessor() {
  const [state, setState] = useState<ProcessingState>({
    status: 'idle',
    currentFile: null,
    processed: 0,
    total: 0,
    progress: 0,
    message: '',
    operation: 'remove',
    selectedFiles: [],
    previewData: [],
    tableEdits: {},
    selectedRowIndices: [],
    bulkDraftLocation: { latitude: '', longitude: '' },
    bulkTimeDraft: { mode: 'offset', offsetMinutes: 0, absoluteDateTime: '' },
  });

  const [options, setOptions] = useState<ProcessingOptions>({
    keepICC: false,
    forceJPEG: false,
    quality: 85,
  });

  const { toast } = useToast();
  const { t } = useLanguage();
  const workerRef = useRef<Worker | null>(null);
  const processingResults = useRef<FileProcessingResult[]>([]);
  const resultIndexById = useRef<Record<string, number>>({});
  const downloadableRef = useRef<{ blob: Blob; filename: string; kind: 'single' | 'zip'; count: number } | null>(null);

  const calculateProgress = (processed: number, total: number) => {
    if (total <= 0) return 0;
    return Math.min(100, (processed / total) * 100);
  };

  const buildDeletionLog = useCallback((files: File[], previewData?: FileMetadata[]) => {
    if (!previewData || previewData.length === 0) return [];
    return files.map((file, index) => {
      const meta = previewData[index];
      const entries: Array<{ label: string; before: string }> = [];
      if (meta?.hasGps) {
        entries.push({ label: 'GPS', before: meta.location ? `${meta.location.latitude.toFixed(6)}, ${meta.location.longitude.toFixed(6)}` : 'Present' });
      }
      if (meta?.dateTimeOriginal) entries.push({ label: 'Date Taken', before: meta.dateTimeOriginal });
      if (meta?.cameraInfo) entries.push({ label: 'Device', before: meta.cameraInfo });
      return { fileName: meta?.fileName || file.name, entries };
    });
  }, []);

  const buildGpsEdits = (operation: ProcessingOperation, tableEdits: Record<number, TableRowEdit>): GpsEditByIndex => {
    if (operation !== 'edit') return {};
    const result: GpsEditByIndex = {};
    Object.entries(tableEdits).forEach(([idxText, row]) => {
      if (isValidCoordinate(row.latitude.trim(), row.longitude.trim())) {
        result[Number(idxText)] = {
          latitude: Number(row.latitude.trim()),
          longitude: Number(row.longitude.trim()),
        };
      }
    });
    return result;
  };

  const buildSummary = (
    operation: ProcessingOperation,
    previewData: FileMetadata[] | undefined,
    tableEdits: Record<number, TableRowEdit>
  ) => {
    return Object.entries(tableEdits).reduce(
      (acc, [idxText, row]) => {
        const idx = Number(idxText);
        const meta = previewData?.[idx];
        const hasOriginalGps = Boolean(meta?.hasGps);

        if (operation === 'remove') {
          if (hasOriginalGps) acc.locationRemoved += 1;
          return acc;
        }

        const hasNewGps = isValidCoordinate(row.latitude, row.longitude);
        if (!hasOriginalGps && hasNewGps) acc.locationAdded += 1;
        if (hasOriginalGps && hasNewGps) acc.locationUpdated += 1;
        if (hasOriginalGps && !hasNewGps) acc.locationRemoved += 1;
        if ((meta?.dateTimeOriginal || '') !== row.dateTime.trim()) acc.dateUpdated += 1;
        if ((meta?.cameraInfo || '') !== row.device.trim()) acc.deviceUpdated += 1;
        return acc;
      },
      { locationAdded: 0, locationUpdated: 0, locationRemoved: 0, dateUpdated: 0, deviceUpdated: 0 }
    );
  };

  const initWorker = useCallback(() => {
    if (workerRef.current) return;
    workerRef.current = new Worker(new URL('../workers/image-worker.ts', import.meta.url), { type: 'module' });
    workerRef.current.onmessage = (event) => {
      const { type, id, blob, filename, error } = event.data;
      const fileIndex = resultIndexById.current[id];

      if (type === 'PROCESSING_COMPLETE' && blob && filename) {
        const result: FileProcessingResult = {
          originalFile: processingResults.current.find((r) => r.__uniqueId === id)?.originalFile || ({} as File),
          cleanedBlob: blob,
          filename,
          success: true,
          pending: false,
          __uniqueId: id,
        };
        processingResults.current = processingResults.current.map((r) => (r.__uniqueId === id ? result : r));

        setState((prev) => {
          const processed = prev.processed + 1;
          const tableEdits = { ...(prev.tableEdits || {}) };
          if (typeof fileIndex === 'number' && tableEdits[fileIndex]) {
            tableEdits[fileIndex] = { ...tableEdits[fileIndex], status: 'done' };
          }
          return { ...prev, processed, progress: calculateProgress(processed, prev.total), tableEdits };
        });
      }

      if (type === 'PROCESSING_ERROR') {
        const result: FileProcessingResult = {
          originalFile: processingResults.current.find((r) => r.__uniqueId === id)?.originalFile || ({} as File),
          cleanedBlob: new Blob(),
          filename: '',
          success: false,
          error,
          pending: false,
          __uniqueId: id,
        };
        processingResults.current = processingResults.current.map((r) => (r.__uniqueId === id ? result : r));

        setState((prev) => {
          const processed = prev.processed + 1;
          const tableEdits = { ...(prev.tableEdits || {}) };
          if (typeof fileIndex === 'number' && tableEdits[fileIndex]) {
            tableEdits[fileIndex] = { ...tableEdits[fileIndex], status: 'failed' };
          }
          return { ...prev, processed, progress: calculateProgress(processed, prev.total), tableEdits };
        });
      }
    };
  }, []);

  const previewFiles = useCallback(async (files: File[]) => {
    const supportedFiles = files.filter((file) => {
      if (!isFormatSupported(file)) {
        toast({ title: t('toast.errors.unsupportedTitle'), description: t('errors.unsupported', { filename: file.name }), variant: 'destructive' });
        return false;
      }
      return true;
    });
    if (supportedFiles.length === 0) return;

    setState((prev) => ({
      ...prev,
      status: 'preview',
      total: supportedFiles.length,
      selectedFiles: supportedFiles,
      previewData: [],
      selectedRowIndices: supportedFiles.map((_, idx) => idx),
      tableEdits: Object.fromEntries(supportedFiles.map((_, idx) => [idx, { latitude: '', longitude: '', dateTime: '', device: '', status: 'analyzing' }])),
    }));

    const previewData = await Promise.all(supportedFiles.map((file) => extractMetadata(file)));
    setState((prev) => ({
      ...prev,
      previewData,
      tableEdits: Object.fromEntries(
        previewData.map((meta, idx) => [
          idx,
          {
            latitude: meta.location ? String(meta.location.latitude) : '',
            longitude: meta.location ? String(meta.location.longitude) : '',
            dateTime: meta.dateTimeOriginal || '',
            device: meta.cameraInfo || '',
            status: 'ready',
          },
        ])
      ),
    }));
  }, [t, toast]);

  const setOperation = useCallback((operation: ProcessingOperation) => setState((prev) => ({ ...prev, operation })), []);

  const updateTableField = useCallback((index: number, field: 'latitude' | 'longitude' | 'dateTime' | 'device', value: string) => {
    setState((prev) => ({
      ...prev,
      tableEdits: {
        ...(prev.tableEdits || {}),
        [index]: {
          ...(prev.tableEdits?.[index] || { latitude: '', longitude: '', dateTime: '', device: '', status: 'ready' }),
          [field]: value,
          status: prev.tableEdits?.[index]?.status === 'analyzing' ? 'analyzing' : 'ready',
        },
      },
    }));
  }, []);

  const toggleRowSelection = useCallback((index: number) => {
    setState((prev) => {
      const set = new Set(prev.selectedRowIndices || []);
      if (set.has(index)) set.delete(index); else set.add(index);
      return { ...prev, selectedRowIndices: Array.from(set).sort((a, b) => a - b) };
    });
  }, []);

  const toggleSelectAllRows = useCallback(() => {
    setState((prev) => {
      const total = prev.selectedFiles?.length || 0;
      const selected = prev.selectedRowIndices?.length || 0;
      return { ...prev, selectedRowIndices: selected === total ? [] : Array.from({ length: total }, (_, i) => i) };
    });
  }, []);

  const updateBulkDraftLocation = useCallback((field: 'latitude' | 'longitude', value: string) => {
    setState((prev) => ({
      ...prev,
      bulkDraftLocation: {
        latitude: prev.bulkDraftLocation?.latitude || '',
        longitude: prev.bulkDraftLocation?.longitude || '',
        [field]: value,
      },
    }));
  }, []);

  const applyBulkLocationToSelection = useCallback(() => {
    setState((prev) => {
      const lat = prev.bulkDraftLocation?.latitude || '';
      const lng = prev.bulkDraftLocation?.longitude || '';
      if (!isValidCoordinate(lat, lng)) return prev;
      const tableEdits = { ...(prev.tableEdits || {}) };
      (prev.selectedRowIndices || []).forEach((idx) => {
        const row = tableEdits[idx] || { latitude: '', longitude: '', dateTime: '', device: '', status: 'ready' };
        tableEdits[idx] = { ...row, latitude: lat, longitude: lng, status: 'ready' };
      });
      return { ...prev, tableEdits };
    });
  }, []);

  const applyLocationToSelected = useCallback((latitude: number, longitude: number) => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return;

    setState((prev) => {
      const lat = String(latitude);
      const lng = String(longitude);
      const tableEdits = { ...(prev.tableEdits || {}) };
      (prev.selectedRowIndices || []).forEach((idx) => {
        const row = tableEdits[idx] || { latitude: '', longitude: '', dateTime: '', device: '', status: 'ready' };
        tableEdits[idx] = { ...row, latitude: lat, longitude: lng, status: 'ready' };
      });

      return {
        ...prev,
        bulkDraftLocation: { latitude: lat, longitude: lng },
        tableEdits,
      };
    });
  }, []);

  const clearGpsForSelection = useCallback(() => {
    setState((prev) => {
      const tableEdits = { ...(prev.tableEdits || {}) };
      (prev.selectedRowIndices || []).forEach((idx) => {
        const row = tableEdits[idx] || { latitude: '', longitude: '', dateTime: '', device: '', status: 'ready' };
        tableEdits[idx] = { ...row, latitude: '', longitude: '', status: 'ready' };
      });
      return { ...prev, tableEdits };
    });
  }, []);

  const applyRiskCleanupForSelection = useCallback(() => {
    setState((prev) => {
      const tableEdits = { ...(prev.tableEdits || {}) };
      (prev.selectedRowIndices || []).forEach((idx) => {
        const row = tableEdits[idx] || { latitude: '', longitude: '', dateTime: '', device: '', status: 'ready' };
        tableEdits[idx] = { ...row, latitude: '', longitude: '', dateTime: '', device: '', status: 'ready' };
      });
      return { ...prev, tableEdits };
    });
  }, []);

  const updateBulkTimeDraft = useCallback((field: 'mode' | 'offsetMinutes' | 'absoluteDateTime', value: string | number) => {
    setState((prev) => ({
      ...prev,
      bulkTimeDraft: {
        mode: prev.bulkTimeDraft?.mode || 'offset',
        offsetMinutes: prev.bulkTimeDraft?.offsetMinutes || 0,
        absoluteDateTime: prev.bulkTimeDraft?.absoluteDateTime || '',
        [field]: value,
      },
    }));
  }, []);

  const applyBulkTimeToSelection = useCallback(() => {
    setState((prev) => {
      const draft = prev.bulkTimeDraft || { mode: 'offset', offsetMinutes: 0, absoluteDateTime: '' };
      const tableEdits = { ...(prev.tableEdits || {}) };
      (prev.selectedRowIndices || []).forEach((idx) => {
        const row = tableEdits[idx] || { latitude: '', longitude: '', dateTime: '', device: '', status: 'ready' };
        if (draft.mode === 'absolute') {
          tableEdits[idx] = { ...row, dateTime: toExifLikeDate(String(draft.absoluteDateTime || '')), status: 'ready' };
        } else {
          const baseDate = parseExifLikeDate(row.dateTime);
          if (!baseDate) return;
          const shifted = new Date(baseDate.getTime() + (Number(draft.offsetMinutes) || 0) * 60000);
          tableEdits[idx] = { ...row, dateTime: toExifLikeDate(shifted.toISOString()), status: 'ready' };
        }
      });
      return { ...prev, tableEdits };
    });
  }, []);

  const confirmProcessing = useCallback(async (filesToProcess?: File[], payload?: ProcessingPayload) => {
    const selectedFiles = filesToProcess || state.selectedFiles;
    const operation: ProcessingOperation = payload?.operation || state.operation || 'remove';
    if (!selectedFiles || selectedFiles.length === 0) return;

    const tableEdits = state.tableEdits || {};
    const gpsEdits = payload?.gpsEdits || buildGpsEdits(operation, tableEdits);
    const metadataEdits = payload?.metadataEdits || Object.fromEntries(
      Object.entries(tableEdits).map(([idx, row]) => [idx, { dateTime: toExifLikeDate(row.dateTime), device: row.device.trim() }])
    );

    const deletionLog = buildDeletionLog(selectedFiles, state.previewData);
    const editSummary = buildSummary(operation, state.previewData, tableEdits);

    setState((prev) => ({
      ...prev,
      status: 'processing',
      operation,
      currentFile: selectedFiles[0].name,
      processed: 0,
      progress: 0,
      editSummary,
      tableEdits: Object.fromEntries(
        Object.entries(prev.tableEdits || {}).map(([idx, row]) => [idx, { ...row, status: 'processing' }])
      ),
    }));

    processingResults.current = selectedFiles.map((file, index) => ({
      originalFile: file,
      cleanedBlob: new Blob(),
      filename: '',
      success: false,
      pending: true,
      __uniqueId: `${file.name}_${Date.now()}_${index}`,
    }));
    resultIndexById.current = Object.fromEntries(processingResults.current.map((r, idx) => [String(r.__uniqueId), idx]));

    initWorker();

    const batchSize = 5;
    for (let i = 0; i < selectedFiles.length; i += batchSize) {
      const batch = selectedFiles.slice(i, i + batchSize);
      await Promise.all(
        batch.map((file, localIndex) => {
          const idx = i + localIndex;
          const uniqueId = processingResults.current[idx].__uniqueId!;
          return new Promise<void>((resolve) => {
            const startedAt = Date.now();
            const check = () => {
              const result = processingResults.current.find((r) => r.__uniqueId === uniqueId);
              if (Date.now() - startedAt > 30000) {
                processingResults.current = processingResults.current.map((r) => r.__uniqueId === uniqueId ? { ...r, success: false, pending: false, error: 'timeout' } : r);
                resolve();
                return;
              }
              if (result && !result.pending) {
                resolve();
                return;
              }
              setTimeout(check, 100);
            };

            workerRef.current?.postMessage({
              type: 'PROCESS_IMAGE',
              file,
              options,
              id: uniqueId,
              operation,
              gpsLocation: gpsEdits[idx],
              metadataEdit: metadataEdits[idx],
            });
            check();
          });
        })
      );
    }

    const successful = processingResults.current.filter((r) => r.success);
    if (successful.length === 0) {
      setState((prev) => ({ ...prev, status: 'error', message: t('toast.errors.noSuccessfulFiles') }));
      return;
    }

    if (successful.length === 1) {
      downloadableRef.current = {
        blob: successful[0].cleanedBlob,
        filename: successful[0].filename,
        kind: 'single',
        count: 1,
      };
    } else {
      const zipBlob = await createZipFile(successful.map((r) => ({ blob: r.cleanedBlob, filename: r.filename })));
      downloadableRef.current = {
        blob: zipBlob,
        filename: generateZipFilename(),
        kind: 'zip',
        count: successful.length,
      };
    }

    setState((prev) => ({
      ...prev,
      status: 'result',
      currentFile: null,
      processed: successful.length,
      total: selectedFiles.length,
      progress: 100,
      deletionLog,
      download: downloadableRef.current ? {
        kind: downloadableRef.current.kind,
        filename: downloadableRef.current.filename,
        count: downloadableRef.current.count,
      } : undefined,
    }));
  }, [buildDeletionLog, initWorker, options, state.operation, state.previewData, state.selectedFiles, state.tableEdits, t]);

  const downloadResults = useCallback(async () => {
    const downloadable = downloadableRef.current;
    if (!downloadable) {
      toast({ title: t('toast.download.nothingTitle'), description: t('toast.download.nothingDescription'), variant: 'destructive' });
      return;
    }
    try {
      await downloadFile(downloadable.blob, downloadable.filename);
      toast({
        title: t('toast.download.startedTitle'),
        description: downloadable.kind === 'zip' ? t('toast.download.startedZip', { count: downloadable.count }) : t('toast.download.startedSingle'),
      });
    } catch {
      toast({ title: t('toast.download.failedTitle'), description: t('toast.download.failedDescription'), variant: 'destructive' });
    }
  }, [t, toast]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      currentFile: null,
      processed: 0,
      total: 0,
      progress: 0,
      message: '',
      operation: 'remove',
      selectedFiles: [],
      previewData: [],
      tableEdits: {},
      selectedRowIndices: [],
      bulkDraftLocation: { latitude: '', longitude: '' },
      bulkTimeDraft: { mode: 'offset', offsetMinutes: 0, absoluteDateTime: '' },
    });
    processingResults.current = [];
    resultIndexById.current = {};
    downloadableRef.current = null;
  }, []);

  const updateOptions = useCallback((newOptions: Partial<ProcessingOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  return {
    state,
    options,
    previewFiles,
    confirmProcessing,
    downloadResults,
    reset,
    updateOptions,
    setOperation,
    updateTableField,
    toggleRowSelection,
    toggleSelectAllRows,
    updateBulkDraftLocation,
    applyBulkLocationToSelection,
    applyLocationToSelected,
    clearGpsForSelection,
    applyRiskCleanupForSelection,
    updateBulkTimeDraft,
    applyBulkTimeToSelection,
  };
}
