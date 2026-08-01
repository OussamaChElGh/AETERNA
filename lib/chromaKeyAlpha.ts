// Pure Client-Side Dynamic Chroma Keyer for 100% True PNG Alpha Transparency
// Strips fake checkerboards, white borders, or green screen backgrounds on sprite load

const alphaCache = new Map<string, string>();

export function getChromaKeyAlphaSprite(src: string): Promise<string> {
  if (alphaCache.has(src)) {
    return Promise.resolve(alphaCache.get(src)!);
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

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // 1. Detect Bright Green Studio Background (#00FF00 / chroma green)
        const isChromaGreen = g > 140 && g > r * 1.3 && g > b * 1.3;

        // 2. Detect Fake Printed Checkerboards & Light Grey/White borders
        const isLightGreyOrWhite = r > 180 && g > 180 && b > 180 && Math.abs(r - g) < 12 && Math.abs(g - b) < 12;

        if (isChromaGreen || isLightGreyOrWhite) {
          data[i + 3] = 0; // Set Alpha Channel to 0 (100% True Transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const cleanDataUrl = canvas.toDataURL('image/png');
      alphaCache.set(src, cleanDataUrl);
      resolve(cleanDataUrl);
    };

    img.onerror = () => {
      resolve(src);
    };
  });
}
