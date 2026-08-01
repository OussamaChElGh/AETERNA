const sharp = require('sharp');
const fs = require('fs');

async function generateOption3WallDoor() {
  const wallNWPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/master_wall_iso_nw.png';
  const doorPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/aeterna_master_gothic_door.png';
  const outputNWPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/master_wall_iso_nw_door.png';
  const outputNEPath = 'c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/master_wall_iso_ne_door.png';

  const wallMetadata = await sharp(wallNWPath).metadata();
  const wallW = wallMetadata.width;
  const wallH = wallMetadata.height;

  // Resize door frame to fit cleanly into the wall masonry
  const resizedDoor = await sharp(doorPath)
    .resize({ height: Math.round(wallH * 0.7) })
    .toBuffer();

  const doorMeta = await sharp(resizedDoor).metadata();

  // Composite stone door archway into NW wall at x = 50px, bottom aligned
  await sharp(wallNWPath)
    .composite([{
      input: resizedDoor,
      top: wallH - doorMeta.height - 10,
      left: 60
    }])
    .toFile(outputNWPath);

  // Mirror composite for NE wall
  await sharp(outputNWPath)
    .flop()
    .toFile(outputNEPath);

  console.log('Option 3 Master Wall textures with integrated Gothic Arch generated successfully!');
}

generateOption3WallDoor().catch(console.error);
