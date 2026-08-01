const sharp = require('sharp');
const path = require('path');

async function processUploadedWindow() {
  const inputPath = 'C:/Users/Flinix/.gemini/antigravity-ide/brain/21eeec4b-1d31-4ea1-a7ed-e61cbbc40574/media__1785351926837.jpg';
  const outputPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/aeterna_master_stone_gothic_window.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Process raw pixels: replace grey/white checkerboard pattern with transparent alpha
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Detect checkerboard tiles: white (#FFF/#DDD) or light grey (#CCC-#FFF) where r,g,b are equal and bright
    const isNeutral = Math.abs(r - g) < 15 && Math.abs(g - b) < 15;
    const isLightBackground = r > 180 && g > 180 && b > 180;

    if (isNeutral && isLightBackground) {
      data[i + 3] = 0; // Set Alpha to 0 (Transparent)
    }
  }

  // Create clean PNG image from processed buffer and trim transparent margins
  await sharp(data, {
    raw: {
      width,
      height,
      channels
    }
  })
    .trim()
    .png()
    .toFile(outputPath);

  console.log('Processed uploaded stone gothic window image successfully!');
}

processUploadedWindow().catch(console.error);
