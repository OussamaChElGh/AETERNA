// Utility to process images on load and strip fake checkerboard / light grey background pixels, returning a pure PNG Data URL with real 8-bit Alpha Transparency

const processedCache = new Map<string, string>();

export function getCleanAlphaSpriteUrl(src: string): Promise<string> {
  if (processedCache.has(src)) {
    return Promise.resolve(processedCache.get(src)!);
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(src);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample border pixels to detect checkerboard / background shades
      const width = canvas.width;
      const height = canvas.height;

      // Process pixel data: remove light grey/white background pixels & checkerboards
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel is part of fake checkerboard background (light gray / white shades)
        const isWhiteOrLightGrey = r > 185 && g > 185 && b > 185 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15;
        const isMediumGreyGrid = r > 160 && r < 230 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8;

        // If it's a background checkerboard pixel, make it 100% transparent
        if (isWhiteOrLightGrey || isMediumGreyGrid) {
          // Check surrounding context: only remove if it's near the background
          data[i + 3] = 0; // Alpha = 0
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const cleanDataUrl = canvas.toDataURL('image/png');
      processedCache.set(src, cleanDataUrl);
      resolve(cleanDataUrl);
    };

    img.onerror = () => {
      resolve(src);
    };
  });
}
