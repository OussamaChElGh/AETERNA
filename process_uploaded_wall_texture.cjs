const sharp = require('sharp');

async function processUploadedWallTexture() {
  const inputPath = 'C:/Users/Flinix/.gemini/antigravity-ide/brain/21eeec4b-1d31-4ea1-a7ed-e61cbbc40574/media__1785352208602.jpg';
  const outputPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/master_wall_iso_nw.png';
  const outputPathBackup = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/aeterna_master_wall_ashlar_stone.png';

  // Process image to high-resolution PNG for GPU matrix projection
  await sharp(inputPath)
    .resize(900, 500, { fit: 'fill' })
    .png()
    .toFile(outputPath);

  await sharp(inputPath)
    .resize(900, 500, { fit: 'fill' })
    .png()
    .toFile(outputPathBackup);

  console.log('Processed uploaded wall texture into master_wall_iso_nw.png successfully!');
}

processUploadedWallTexture().catch(console.error);
