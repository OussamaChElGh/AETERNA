const sharp = require('sharp');

async function processUploadedRug() {
  const inputPath = 'C:/Users/Flinix/.gemini/antigravity-ide/brain/21eeec4b-1d31-4ea1-a7ed-e61cbbc40574/media__1785357941092.jpg';
  const outputPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/aeterna_master_persian_rug.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Convert black background pixels (r < 18, g < 18, b < 18) to transparent alpha 0
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r < 18 && g < 18 && b < 18) {
      data[i + 3] = 0; // Set Alpha to 0
    }
  }

  // Create clean PNG image trimmed to the rug fringe boundary
  await sharp(data, {
    raw: { width, height, channels }
  })
    .trim()
    .png()
    .toFile(outputPath);

  console.log('Processed uploaded Persian rug image successfully!');
}

processUploadedRug().catch(console.error);
