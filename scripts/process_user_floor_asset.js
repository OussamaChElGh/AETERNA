const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function processUserFloor() {
  const sourcePath = 'C:\\Users\\Flinix\\.gemini\\antigravity-ide\\brain\\21eeec4b-1d31-4ea1-a7ed-e61cbbc40574\\media__1785332580219.jpg';
  const targetPath = path.join(process.cwd(), 'public', 'images', 'master_floor_asset.png');

  console.log('Loading image from:', sourcePath);
  const img = await loadImage(sourcePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;

  // Process chroma-key / checkerboard removal to create true 8-bit alpha (alpha = 0)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Detect light gray/white checkerboard pixels (high brightness, low saturation)
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;

    // Check if pixel is gray/white checkerboard background
    if (r > 190 && g > 190 && b > 190 && diff < 20) {
      data[i + 3] = 0; // Set Alpha = 0 (100% Transparent)
    } else if (r > 170 && g > 170 && b > 170 && diff < 15) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const outBuffer = canvas.toBuffer('image/png');
  fs.writeFileSync(targetPath, outBuffer);
  console.log('Successfully saved transparent master floor asset to:', targetPath);
}

processUserFloor().catch(err => {
  console.error('Error processing floor asset:', err);
});
