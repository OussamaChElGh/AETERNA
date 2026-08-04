import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');

const items: Record<string, string> = {
  'anektia_pixel_terminal.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <rect x="35" y="30" width="90" height="65" rx="8" fill="#1E293B" stroke="#B45309" stroke-width="4"/>
    <rect x="44" y="38" width="72" height="48" fill="#022C22" stroke="#10B981" stroke-width="2"/>
    <text x="50" y="56" fill="#34D399" font-family="monospace" font-size="11" font-weight="bold">> ANEKTIA OS</text>
    <text x="50" y="72" fill="#34D399" font-family="monospace" font-size="11">> QUANTUM CORE_</text>
    <rect x="70" y="95" width="20" height="18" fill="#78350F"/>
    <rect x="50" y="113" width="60" height="8" rx="3" fill="#78350F" stroke="#451A03" stroke-width="1.5"/>
    <rect x="40" y="125" width="80" height="15" rx="3" fill="#334155"/>
    <line x1="45" y1="130" x2="115" y2="130" stroke="#64748B" stroke-width="3" stroke-dasharray="4,2"/>
  </svg>`,

  'anektia_pixel_bust.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <rect x="55" y="105" width="50" height="28" rx="3" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>
    <path d="M 52 105 Q 80 92 108 105 L 98 75 Q 80 80 62 75 Z" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2"/>
    <ellipse cx="80" cy="55" rx="20" ry="25" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
    <path d="M 64 45 C 64 32, 96 32, 96 45" stroke="#CBD5E1" stroke-width="4" fill="none"/>
    <path d="M 68 66 Q 80 74 92 66" stroke="#94A3B8" stroke-width="2.5" fill="none"/>
  </svg>`,

  'anektia_pixel_microscope.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <rect x="45" y="125" width="70" height="16" rx="4" fill="#1E293B"/>
    <path d="M 80 125 L 80 60 Q 100 60 100 40" stroke="#D97706" stroke-width="5" fill="none"/>
    <rect x="90" y="25" width="20" height="34" rx="4" fill="#F59E0B" stroke="#78350F" stroke-width="2" transform="rotate(20 100 42)"/>
    <rect x="58" y="88" width="44" height="8" fill="#64748B"/>
    <circle cx="80" cy="74" r="7" fill="#38BDF8"/>
  </svg>`,

  'anektia_pixel_terrarium.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <circle cx="80" cy="82" r="45" fill="#ECFDF5" stroke="#34D399" stroke-width="3" opacity="0.9"/>
    <ellipse cx="80" cy="112" rx="36" ry="14" fill="#064E3B"/>
    <path d="M 64 112 Q 70 85 76 112 M 78 112 Q 83 78 88 112 M 90 112 Q 95 90 100 112" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
    <circle cx="74" cy="88" r="4" fill="#6EE7B7"/>
    <circle cx="85" cy="80" r="4" fill="#6EE7B7"/>
    <rect x="70" y="32" width="20" height="10" rx="3" fill="#78350F"/>
  </svg>`,

  'anektia_pixel_armchair.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <rect x="40" y="50" width="80" height="60" rx="10" fill="#78350F" stroke="#451A03" stroke-width="4"/>
    <rect x="33" y="70" width="16" height="40" rx="5" fill="#B45309" stroke="#451A03" stroke-width="2.5"/>
    <rect x="111" y="70" width="16" height="40" rx="5" fill="#B45309" stroke="#451A03" stroke-width="2.5"/>
    <rect x="47" y="82" width="66" height="30" rx="5" fill="#92400E"/>
    <rect x="47" y="118" width="10" height="20" fill="#451A03"/>
    <rect x="103" y="118" width="10" height="20" fill="#451A03"/>
  </svg>`,

  'anektia_pixel_desk.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 160" width="180" height="160">
    <rect x="25" y="60" width="130" height="24" rx="4" fill="#78350F" stroke="#451A03" stroke-width="4"/>
    <rect x="32" y="84" width="34" height="46" fill="#542407" stroke="#451A03" stroke-width="2.5"/>
    <rect x="114" y="84" width="34" height="46" fill="#542407" stroke="#451A03" stroke-width="2.5"/>
    <circle cx="49" cy="100" r="3.5" fill="#F59E0B"/>
    <circle cx="49" cy="118" r="3.5" fill="#F59E0B"/>
    <circle cx="131" cy="100" r="3.5" fill="#F59E0B"/>
    <circle cx="131" cy="118" r="3.5" fill="#F59E0B"/>
  </svg>`,

  'anektia_pixel_lamp.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <rect x="60" y="125" width="40" height="10" rx="3" fill="#D97706"/>
    <path d="M 80 125 Q 56 95 80 65" stroke="#F59E0B" stroke-width="4.5" fill="none"/>
    <path d="M 60 65 C 60 48, 100 48, 100 65 Z" fill="#047857" stroke="#022C22" stroke-width="2.5"/>
    <circle cx="80" cy="68" r="5" fill="#FEF08A"/>
  </svg>`,

  'anektia_pixel_plant.png': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <polygon points="60,85 100,85 93,130 67,130" fill="#B45309" stroke="#78350F" stroke-width="3"/>
    <path d="M 80 85 Q 53 58 42 68 M 80 85 Q 67 45 73 32 M 80 85 Q 93 45 87 32 M 80 85 Q 107 58 118 68 M 80 85 Q 80 52 80 38" stroke="#15803D" stroke-width="8" stroke-linecap="round"/>
  </svg>`
};

async function main() {
  console.log('Generando imágenes PNG para los 8 objetos del catálogo...');
  for (const [filename, svgContent] of Object.entries(items)) {
    const pngPath = path.join(PUBLIC_IMAGES, filename);
    await sharp(Buffer.from(svgContent)).png().toFile(pngPath);
    console.log(`✅ Creado archivo PNG verdadero: ${filename}`);
  }
}

main();
