const sharp = require('sharp');

async function processPreangledIsoDoor() {
  const inputPath = 'C:/Users/Flinix/.gemini/antigravity-ide/brain/21eeec4b-1d31-4ea1-a7ed-e61cbbc40574/media__1785359214432.jpg';
  const outputPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/aeterna_master_gothic_door.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Convert checkerboard background pixels (r > 185, g > 185, b > 185) to transparent alpha 0
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r > 185 && g > 185 && b > 185 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
      data[i + 3] = 0; // Set Alpha to 0
    }
  }

  // Create clean PNG image trimmed to the isometric door boundary
  await sharp(data, {
    raw: { width, height, channels }
  })
    .trim()
    .png()
    .toFile(outputPath);

  console.log('Processed pre-angled 2.5D Isometric Gothic Door image successfully!');
}

processPreangledIsoDoor().catch(console.error);
