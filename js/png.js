// Rasterize SVG text to a PNG Blob: Image (data: URL) -> decode -> Canvas -> toBlob.
// Background fills the whole square first (e.g. white for Teams/Outlook avatars).
// Uses img.decode() and a data: URL. In headless Chrome, load events for SVG images never fired
// and blob: URLs never decoded; decode() on a data: URL works there and in all current browsers.
export async function svgToPngBlob(svgText, size = 1024, background = '#ffffff') {
  const img = new Image();
  img.width = size;
  img.height = size;
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
  }
  ctx.drawImage(img, 0, 0, size, size);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('PNG encoding failed');
  return blob;
}
