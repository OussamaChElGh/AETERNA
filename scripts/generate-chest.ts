import { generateImage } from '../generator/images/gemini-runner';
import fs from 'fs';
import path from 'path';

async function generateChest() {
  try {
    console.log('Generating chest with nanobanana...');
    const result = await generateImage(
      'A highly detailed 3D isometric wooden treasure chest with glowing gold and magical blue energy seeping from the cracks. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.',
      { model: 'gemini-3.1-flash-image' }
    );
    const outputPath = path.join(process.cwd(), 'public', 'images', 'chest-nanobanana.png');
    fs.writeFileSync(outputPath, Buffer.from(result.base64, 'base64'));
    console.log('Image saved to', outputPath);
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}
generateChest();
