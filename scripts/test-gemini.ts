import { generateImage } from '../generator/images/gemini-runner';

async function test() {
  try {
    console.log('Probando gemini-runner con nanobanana (gemini-3.1-flash-image)...');
    const result = await generateImage('Isometric pixel art game asset of a brass compass on solid white background.', { model: 'gemini-3.1-flash-image' });
    console.log('Éxito! Imagen generada:', result.mimeType, 'Tamaño base64:', result.base64.length);
  } catch (e: any) {
    console.error('Error gemini-runner:', e.message);
  }
}

test();
