const sharp = require('sharp');

async function processCleanWallTexture() {
  const inputPath = 'C:/Users/Flinix/.gemini/antigravity-ide/brain/21eeec4b-1d31-4ea1-a7ed-e61cbbc40574/media__1785352478674.jpg';
  const outputPathNW = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/master_wall_iso_nw.png';
  const outputPathNE = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/master_wall_iso_ne.png';

  // Process raw pixels: ensure transparent alpha for black outer padding background
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Set pure black pixels (r < 15, g < 15, b < 15) outside the wall frame to transparent alpha 0
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r < 18 && g < 18 && b < 18) {
      data[i + 3] = 0; // Alpha transparent
    }
  }

  // Create clean PNG buffer trimmed to the wooden frame boundaries
  const cleanWallBuffer = await sharp(data, {
    raw: { width, height, channels }
  })
    .trim()
    .png()
    .toBuffer();

  // Save regular orientation for NW Wall
  await sharp(cleanWallBuffer)
    .resize(900, 500, { fit: 'fill' })
    .png()
    .toFile(outputPathNW);

  // Save specular mirrored orientation for NE Wall
  await sharp(cleanWallBuffer)
    .flop() // Horizontal mirror flip
    .resize(900, 500, { fit: 'fill' })
    .png()
    .toFile(outputPathNE);

  console.log('Processed transparent wall texture into NW and NE wall assets successfully!');
}

processCleanWallTexture().catch(console.error);
