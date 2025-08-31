// Lazy-loaded ZIP functionality
let JSZip: any = null;

export async function loadJSZip() {
  if (!JSZip) {
    // Dynamically import JSZip to reduce initial bundle size
    const module = await import('jszip');
    JSZip = module.default;
  }
  return JSZip;
}

export async function createZipFile(files: { blob: Blob; filename: string }[]): Promise<Blob> {
  const JSZipClass = await loadJSZip();
  const zip = new JSZipClass();
  
  // Add each file to the ZIP
  files.forEach(({ blob, filename }) => {
    zip.file(filename, blob);
  });
  
  // Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' });
}
