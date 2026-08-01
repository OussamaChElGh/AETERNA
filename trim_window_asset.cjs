const sharp = require('sharp');

async function processWindowAsset() {
  const inputPath = 'C:/Users/Flinix/.gemini/antigravity-ide/brain/21eeec4b-1d31-4ea1-a7ed-e61cbbc40574/aeterna_master_gothic_window_1785347350759.png';
  const outputPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/aeterna_master_gothic_window_tight.png';

  // Load image, trim outer white border tightly, and ensure clean crisp alpha
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  await image
    .trim({ background: '#FFFFFF', threshold: 10 })
    .png()
    .toFile(outputPath);

  console.log('Tight trimmed master gothic window asset generated successfully!');
}

processWindowAsset().catch(console.error);
