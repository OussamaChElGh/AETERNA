const sharp = require('sharp');

async function removeWhiteBg(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Remove near-white background pixels
    if (r > 230 && g > 230 && b > 230) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .trim()
    .png()
    .toFile(outputPath);

  console.log(`Processed: ${outputPath}`);
}

async function main() {
  const base = 'C:/Users/Flinix/.gemini/antigravity-ide/brain/21eeec4b-1d31-4ea1-a7ed-e61cbbc40574';
  const out = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images';

  await removeWhiteBg(`${base}/media__1785360203277.png`, `${out}/aeterna_baroque_chair_front.png`);
  await removeWhiteBg(`${base}/media__1785360221645.png`, `${out}/aeterna_baroque_chair_back.png`);

  console.log('Done!');
}

main().catch(console.error);
