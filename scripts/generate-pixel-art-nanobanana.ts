import { generateImage } from '../generator/images/gemini-runner';
import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');

const items: Record<string, string> = {
  'anektia_pixel_terminal.png': 'A highly detailed 3D isometric retro-futuristic steampunk computer terminal with glowing green screens and gold accents. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.',
  'anektia_pixel_bust.png': 'A highly detailed 3D isometric marble philosopher bust on a wooden pedestal with glowing gold accents. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.',
  'anektia_pixel_microscope.png': 'A highly detailed 3D isometric vintage brass microscope with glowing blue lenses and gold accents. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.',
  'anektia_pixel_terrarium.png': 'A highly detailed 3D isometric glass botanical terrarium filled with glowing magical plants and gold accents. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.',
  'anektia_pixel_armchair.png': 'A highly detailed 3D isometric luxurious dark leather armchair with wooden carved armrests and gold accents. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.',
  'anektia_pixel_desk.png': 'A highly detailed 3D isometric scholar wooden writing desk with scattered glowing scrolls and gold accents. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.',
  'anektia_pixel_lamp.png': 'A highly detailed 3D isometric ornate brass desk lamp emitting a warm golden glow. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.',
  'anektia_pixel_plant.png': 'A highly detailed 3D isometric potted magical plant with glowing leaves in an ornate ceramic pot. Dark academia, fantasy RPG style, metallic gold borders, isolated on a clean solid black background.'
};

async function main() {
  console.log('Generating images with nanobanana (Gemini)...');
  
  for (const [filename, prompt] of Object.entries(items)) {
    try {
      console.log(`Generating ${filename}...`);
      const result = await generateImage(prompt, { model: 'gemini-3.1-flash-image', aspectRatio: '1:1' });
      
      const outputPath = path.join(PUBLIC_IMAGES, filename);
      fs.writeFileSync(outputPath, Buffer.from(result.base64, 'base64'));
      console.log(`✅ Saved to ${outputPath}`);
      
      // Esperar un poco para evitar 429
      await new Promise(r => setTimeout(r, 2000));
    } catch (e: any) {
      console.error(`Error generating ${filename}:`, e.message);
    }
  }
}

main();
