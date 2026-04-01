import { ProcessingPayload, ProcessingState } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { ChevronDown, ChevronUp, Loader2, Trash2, Wand2, Clock3 } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

interface MetadataPreviewProps {
  files: File[];
  metadata: ProcessingState['previewData'];
  state: ProcessingState;
  onConfirm: (files?: File[], payload?: ProcessingPayload) => void;
  onCancel: () => void;
  onModeChange: (mode: 'remove' | 'edit') => void;
  onFieldChange: (index: number, field: 'latitude' | 'longitude' | 'dateTime' | 'device', value: string) => void;
  onToggleRow: (index: number) => void;
  onToggleAllRows: () => void;
  onBulkDraftChange: (field: 'latitude' | 'longitude', value: string) => void;
  onApplyBulkLocation: () => void;
  onApplyLocationFromMap: (latitude: number, longitude: number) => void;
  onClearSelectedGps: () => void;
  onRiskCleanup: () => void;
  onBulkTimeDraftChange: (field: 'mode' | 'offsetMinutes' | 'absoluteDateTime', value: string | number) => void;
  onApplyBulkTime: () => void;
}

const isValidCoordinate = (latText: string, lngText: string) => {
  const lat = Number(latText);
  const lng = Number(lngText);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

const StaticMapContainer = MapContainer as any;

function MapClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(event: any) {
      map.flyTo(event.latlng, Math.max(map.getZoom(), 12), {
        animate: true,
        duration: 0.45,
      });
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export function MetadataPreview({
  files,
  metadata,
  state,
  onConfirm,
  onCancel,
  onModeChange,
  onFieldChange,
  onToggleRow,
  onToggleAllRows,
  onBulkDraftChange,
  onApplyBulkLocation,
  onApplyLocationFromMap,
  onClearSelectedGps,
  onRiskCleanup,
  onBulkTimeDraftChange,
  onApplyBulkTime,
}: MetadataPreviewProps) {
  const { t } = useLanguage();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const operation = state.operation || 'remove';
  const tableEdits = state.tableEdits || {};
  const selectedRows = state.selectedRowIndices || [];
  const allSelected = files.length > 0 && selectedRows.length === files.length;

  const gpsEdits = useMemo(() => {
    if (operation !== 'edit') return {};
    const edits: Record<number, { latitude: number; longitude: number }> = {};
    Object.entries(tableEdits).forEach(([idxText, row]) => {
      const idx = Number(idxText);
      const lat = row.latitude.trim();
      const lng = row.longitude.trim();
      if (isValidCoordinate(lat, lng)) {
        edits[idx] = { latitude: Number(lat), longitude: Number(lng) };
      }
    });
    return edits;
  }, [operation, tableEdits]);

  const metadataEdits = useMemo(() => {
    return Object.fromEntries(
      Object.entries(tableEdits).map(([idxText, row]) => [
        Number(idxText),
        {
          dateTime: row.dateTime.trim(),
          device: row.device.trim(),
        },
      ])
    );
  }, [tableEdits]);

  const toggleExpanded = (index: number) => {
    setExpandedRows((prev) => (prev.includes(index) ? prev.filter((v) => v !== index) : [...prev, index]));
  };

  const defaultLat = Number(state.bulkDraftLocation?.latitude || 20.5937);
  const defaultLng = Number(state.bulkDraftLocation?.longitude || 78.9629);

  useEffect(() => {
    if (!isMapOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMapOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isMapOpen]);

  const openMapModal = () => {
    const lat = state.bulkDraftLocation?.latitude?.trim() || '';
    const lng = state.bulkDraftLocation?.longitude?.trim() || '';
    if (isValidCoordinate(lat, lng)) {
      setPickedLocation({ latitude: Number(lat), longitude: Number(lng) });
    } else {
      setPickedLocation(null);
    }
    setIsMapOpen(true);
  };

  return (
    <div className="rounded-2xl p-4 md:p-6 bg-card border border-border shadow-sm">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{t('table.title') || 'Instant Matrix Editor'}</h2>
            <p className="text-sm text-muted-foreground">{t('table.subtitle') || 'Top 3 first: Location, Time, Device.'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
            <Button type="button" variant={operation === 'remove' ? 'default' : 'outline'} onClick={() => onModeChange('remove')} className={operation === 'remove' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>
              {t('table.mode.remove') || 'Remove'}
            </Button>
            <Button type="button" variant={operation === 'edit' ? 'default' : 'outline'} onClick={() => onModeChange('edit')} className={operation === 'edit' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}>
              {t('table.mode.edit') || 'Add / Edit'}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="py-2 px-2 text-left"><input type="checkbox" checked={allSelected} onChange={onToggleAllRows} className="h-4 w-4" /></th>
                <th className="py-2 px-2 text-left">{t('table.columns.file') || 'File'}</th>
                <th className="py-2 px-2 text-left">{t('table.columns.location') || 'Location (GPS)'}</th>
                <th className="py-2 px-2 text-left">{t('table.columns.time') || 'Date / Time'}</th>
                <th className="py-2 px-2 text-left">{t('table.columns.device') || 'Device'}</th>
                <th className="py-2 px-2 text-left">{t('table.columns.state') || 'State'}</th>
                <th className="py-2 px-2 text-left">{t('table.columns.more') || 'More'}</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => {
                const row = tableEdits[index] || { latitude: '', longitude: '', dateTime: '', device: '', status: 'analyzing' as const };
                const hasDetectedGps = Boolean(metadata?.[index]?.hasGps);
                const lat = row.latitude.trim();
                const lng = row.longitude.trim();
                const hasInput = lat.length > 0 || lng.length > 0;
                const valid = isValidCoordinate(lat, lng);
                const expanded = expandedRows.includes(index);

                return (
                  <Fragment key={`group-${file.name}-${index}`}>
                    <tr className="border-t border-border/70">
                      <td className="py-2 px-2"><input type="checkbox" checked={selectedRows.includes(index)} onChange={() => onToggleRow(index)} className="h-4 w-4" /></td>
                      <td className="py-2 px-2 max-w-[220px] truncate" title={file.name}>{file.name}</td>
                      <td className="py-2 px-2">
                        <div className="space-y-1">
                          <div>
                            {hasDetectedGps ? (
                              <Badge variant="outline" className="border-orange-300 text-orange-700">{t('table.status.detected') || 'Detected'}</Badge>
                            ) : (
                              <Badge variant="outline">{t('table.status.empty') || 'Empty'}</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <input type="text" value={row.latitude} onChange={(e) => onFieldChange(index, 'latitude', e.target.value)} className="h-8 rounded-md border border-border bg-background px-2 text-xs" placeholder="Lat" />
                            <input type="text" value={row.longitude} onChange={(e) => onFieldChange(index, 'longitude', e.target.value)} className="h-8 rounded-md border border-border bg-background px-2 text-xs" placeholder="Lng" />
                          </div>
                          {!valid && hasInput && <div className="text-[11px] text-red-600">{t('table.status.invalid') || 'Invalid'}</div>}
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <input type="text" value={row.dateTime} onChange={(e) => onFieldChange(index, 'dateTime', e.target.value)} className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs" placeholder="YYYY:MM:DD HH:mm:ss" />
                      </td>
                      <td className="py-2 px-2">
                        <input type="text" value={row.device} onChange={(e) => onFieldChange(index, 'device', e.target.value)} className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs" placeholder="iPhone 15" />
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          {(row.status === 'analyzing' || row.status === 'processing') && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                          {row.status === 'analyzing' && <Badge variant="outline">{t('table.rowState.analyzing') || 'Analyzing'}</Badge>}
                          {row.status === 'ready' && <Badge variant="outline" className="text-green-700 border-green-300">{t('table.rowState.ready') || 'Ready'}</Badge>}
                          {row.status === 'processing' && <Badge variant="outline">{t('table.rowState.processing') || 'Processing'}</Badge>}
                          {row.status === 'done' && <Badge variant="outline" className="text-green-700 border-green-300">{t('table.rowState.done') || 'Done'}</Badge>}
                          {row.status === 'failed' && <Badge variant="outline" className="text-red-700 border-red-300">{t('table.rowState.failed') || 'Failed'}</Badge>}
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <button type="button" onClick={() => toggleExpanded(index)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted/40" aria-label="toggle-row-details">
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="border-t border-border/40 bg-muted/20">
                        <td colSpan={7} className="py-3 px-3">
                          <div className="text-xs text-muted-foreground mb-2">{t('table.details.title') || 'Detailed metadata'}</div>
                          <div className="flex flex-wrap gap-2">
                            {(metadata?.[index]?.metadataFound || []).length > 0 ? (
                              metadata?.[index]?.metadataFound?.map((item) => <Badge key={`${index}-${item}`} variant="secondary">{item}</Badge>)
                            ) : (
                              <Badge variant="outline">{t('table.details.none') || 'No additional metadata'}</Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:justify-between">
          <Button type="button" variant="ghost" onClick={onCancel}>{t('table.actions.reset') || 'Reset'}</Button>
          <Button type="button" onClick={() => onConfirm(files, { operation, gpsEdits: operation === 'edit' ? gpsEdits : undefined, metadataEdits })} className={operation === 'edit' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}>
            {operation === 'edit' ? (t('table.actions.applyEdits') || 'Apply edits') : (t('table.actions.removeAll') || 'Remove metadata')}
          </Button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(960px,calc(100%-1rem))] rounded-2xl border border-border bg-card/95 backdrop-blur shadow-xl p-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline">{t('table.quick.selected', { count: selectedRows.length }) || `Selected ${selectedRows.length}`}</Badge>
            <Button type="button" size="sm" variant="outline" onClick={onRiskCleanup}>
              <Trash2 className="w-4 h-4 mr-1" />
              {t('table.quick.safeMode') || 'Safe mode'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={onClearSelectedGps}>
              {t('table.quick.clearLocation') || 'Clear location'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 mb-2">
            <input type="text" value={state.bulkDraftLocation?.latitude || ''} onChange={(e) => onBulkDraftChange('latitude', e.target.value)} placeholder={t('table.quick.bulkLat') || 'Bulk latitude'} className="h-9 rounded-md border border-border bg-background px-2 text-sm" />
            <input type="text" value={state.bulkDraftLocation?.longitude || ''} onChange={(e) => onBulkDraftChange('longitude', e.target.value)} placeholder={t('table.quick.bulkLng') || 'Bulk longitude'} className="h-9 rounded-md border border-border bg-background px-2 text-sm" />
            <Button type="button" size="sm" variant="outline" onClick={onApplyBulkLocation}>
              <Wand2 className="w-4 h-4 mr-1" />
              {t('table.quick.applyLocation') || 'Apply location'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={openMapModal}>
              {t('table.quick.pickOnMap') || 'Pick on map'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-2 items-center">
            <select value={state.bulkTimeDraft?.mode || 'offset'} onChange={(e) => onBulkTimeDraftChange('mode', e.target.value)} className="h-9 rounded-md border border-border bg-background px-2 text-sm">
              <option value="offset">{t('table.quick.timeOffset') || 'Time offset'}</option>
              <option value="absolute">{t('table.quick.timeAbsolute') || 'Absolute time'}</option>
            </select>
            {state.bulkTimeDraft?.mode === 'absolute' ? (
              <input type="text" value={state.bulkTimeDraft?.absoluteDateTime || ''} onChange={(e) => onBulkTimeDraftChange('absoluteDateTime', e.target.value)} placeholder="YYYY:MM:DD HH:mm:ss" className="h-9 rounded-md border border-border bg-background px-2 text-sm" />
            ) : (
              <input type="number" value={state.bulkTimeDraft?.offsetMinutes || 0} onChange={(e) => onBulkTimeDraftChange('offsetMinutes', Number(e.target.value))} placeholder="minutes" className="h-9 rounded-md border border-border bg-background px-2 text-sm" />
            )}
            <Button type="button" size="sm" variant="outline" onClick={onApplyBulkTime}>
              <Clock3 className="w-4 h-4 mr-1" />
              {t('table.quick.applyTime') || 'Apply time'}
            </Button>
          </div>
        </div>
      )}

      {isMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">{t('table.map.title') || 'Select location on map'}</h3>
                <p className="text-xs text-muted-foreground">{t('table.map.subtitle') || 'Click on map and apply to selected rows.'}</p>
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={() => setIsMapOpen(false)}>
                {t('table.map.close') || 'Close'}
              </Button>
            </div>
            <div className="h-72 rounded-xl overflow-hidden border border-border">
              <StaticMapContainer center={[defaultLat, defaultLng]} zoom={5} className="w-full h-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickCapture onPick={(lat, lng) => setPickedLocation({ latitude: lat, longitude: lng })} />
                {pickedLocation && (
                  <Marker
                    position={[pickedLocation.latitude, pickedLocation.longitude]}
                  />
                )}
              </StaticMapContainer>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {pickedLocation
                  ? `${t('table.map.picked') || 'Picked'}: ${pickedLocation.latitude.toFixed(6)}, ${pickedLocation.longitude.toFixed(6)}`
                  : (t('table.map.noPick') || 'No point selected')}
              </div>
              <Button
                type="button"
                disabled={!pickedLocation}
                onClick={() => {
                  if (!pickedLocation) return;
                  onApplyLocationFromMap(pickedLocation.latitude, pickedLocation.longitude);
                  setIsMapOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('table.map.applySelected') || 'Apply to selected'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
