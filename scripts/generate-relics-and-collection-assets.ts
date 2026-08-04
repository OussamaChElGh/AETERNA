import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');
const RELIQUIAS_DIR = path.join(PUBLIC_IMAGES, 'reliquias');

if (!fs.existsSync(RELIQUIAS_DIR)) {
  fs.mkdirSync(RELIQUIAS_DIR, { recursive: true });
}

// 1. Reliquias (Muro de Reliquias - Colección de Conocimientos)
const relicSvgs: Record<string, string> = {
  'reliquia_n1_fundamentos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="relic1-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="60%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </radialGradient>
    <linearGradient id="gold-ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
    <filter id="relic-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <g filter="url(#relic-shadow)">
    <circle cx="60" cy="60" r="50" fill="url(#gold-ring)" stroke="#451A03" stroke-width="3"/>
    <circle cx="60" cy="60" r="42" fill="#0F172A"/>
    <circle cx="60" cy="60" r="34" fill="url(#relic1-glow)"/>
    <ellipse cx="60" cy="60" rx="34" ry="12" fill="none" stroke="#FDE047" stroke-width="2.5" transform="rotate(-25 60 60)"/>
    <ellipse cx="60" cy="60" rx="34" ry="12" fill="none" stroke="#60A5FA" stroke-width="2" transform="rotate(35 60 60)"/>
    <circle cx="60" cy="60" r="8" fill="#FFFFFF"/>
  </g>
</svg>`,

  'reliquia_n2_mecanica.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="gear-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="50%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#451A03"/>
    </linearGradient>
    <radialGradient id="gear-center" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </radialGradient>
    <filter id="relic-shadow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <g filter="url(#relic-shadow2)">
    <circle cx="60" cy="60" r="50" fill="url(#gear-gold)" stroke="#270F02" stroke-width="3"/>
    <!-- Gear teeth -->
    <path d="M 60 10 L 66 22 L 54 22 Z M 60 110 L 66 98 L 54 98 Z M 10 60 L 22 66 L 22 54 Z M 110 60 L 98 66 L 98 54 Z M 25 25 L 36 34 L 27 43 Z M 95 95 L 84 86 L 93 77 Z M 25 95 L 34 84 L 43 93 Z M 95 25 L 86 36 L 77 27 Z" fill="url(#gear-gold)"/>
    <circle cx="60" cy="60" r="38" fill="#1E293B"/>
    <circle cx="60" cy="60" r="28" fill="url(#gear-center)"/>
    <path d="M 40 60 Q 50 45 60 60 T 80 60" stroke="#E0F2FE" stroke-width="3" fill="none"/>
    <circle cx="60" cy="60" r="6" fill="#FDE047"/>
  </g>
</svg>`,

  'reliquia_n3_moderna.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="atom-core" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="60%" stop-color="#BE123C"/>
      <stop offset="100%" stop-color="#4C0519"/>
    </radialGradient>
    <linearGradient id="relic-frame3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="50%" stop-color="#64748B"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <filter id="relic-shadow3" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <g filter="url(#relic-shadow3)">
    <circle cx="60" cy="60" r="50" fill="url(#relic-frame3)" stroke="#0F172A" stroke-width="3"/>
    <circle cx="60" cy="60" r="42" fill="#090D16"/>
    <ellipse cx="60" cy="60" rx="36" ry="12" fill="none" stroke="#38BDF8" stroke-width="2.5" transform="rotate(0 60 60)"/>
    <ellipse cx="60" cy="60" rx="36" ry="12" fill="none" stroke="#A855F7" stroke-width="2.5" transform="rotate(60 60 60)"/>
    <ellipse cx="60" cy="60" rx="36" ry="12" fill="none" stroke="#F43F5E" stroke-width="2.5" transform="rotate(120 60 60)"/>
    <circle cx="60" cy="60" r="12" fill="url(#atom-core)"/>
    <circle cx="60" cy="60" r="5" fill="#FFF1F2"/>
    <circle cx="96" cy="60" r="3.5" fill="#38BDF8"/>
    <circle cx="42" cy="29" r="3.5" fill="#A855F7"/>
    <circle cx="42" cy="91" r="3.5" fill="#F43F5E"/>
  </g>
</svg>`,

  'reliquia_n4_fronteras.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="singularity-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="30%" stop-color="#F59E0B"/>
      <stop offset="70%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="gold-cosmic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#312E81"/>
    </linearGradient>
    <filter id="relic-shadow4" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <g filter="url(#relic-shadow4)">
    <circle cx="60" cy="60" r="50" fill="url(#gold-cosmic)" stroke="#1E1B4B" stroke-width="3"/>
    <circle cx="60" cy="60" r="42" fill="#030712"/>
    <ellipse cx="60" cy="60" rx="38" ry="14" fill="none" stroke="#F59E0B" stroke-width="3" transform="rotate(-15 60 60)"/>
    <circle cx="60" cy="60" r="22" fill="url(#singularity-glow)"/>
    <circle cx="60" cy="60" r="12" fill="#000000"/>
    <circle cx="60" cy="60" r="10" stroke="#F59E0B" stroke-width="1.5" fill="none"/>
  </g>
</svg>`
};

console.log('Generando imágenes de reliquias (colección de nivel 1-4)...');
for (const [filename, content] of Object.entries(relicSvgs)) {
  const svgPath = path.join(RELIQUIAS_DIR, filename);
  const pngPath = path.join(RELIQUIAS_DIR, filename.replace('.svg', '.png'));
  fs.writeFileSync(svgPath, content, 'utf8');
  fs.writeFileSync(pngPath, content, 'utf8');
  console.log(`✅ Reliquia guardada: ${filename} y PNG`);
}

// 2. Objetos / Muebles de la Colección
const collectionSvgs: Record<string, string> = {
  'anektia_pixel_schrodinger.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <filter id="cat-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#A855F7" flood-opacity="0.6"/>
    </filter>
  </defs>
  <g filter="url(#cat-glow)">
    <rect x="25" y="30" width="70" height="65" rx="8" fill="#451A03" stroke="#D97706" stroke-width="3"/>
    <rect x="35" y="40" width="50" height="45" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
    <path d="M 50 65 Q 60 48 70 65" stroke="#C084FC" stroke-width="3" fill="none"/>
    <circle cx="52" cy="58" r="3" fill="#F43F5E"/>
    <circle cx="68" cy="58" r="3" fill="#F43F5E"/>
    <text x="60" y="80" text-anchor="middle" fill="#38BDF8" font-family="sans-serif" font-size="10" font-weight="bold">Ψ |Ψ⟩</text>
  </g>
</svg>`,

  'anektia_pixel_abacus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect x="20" y="35" width="80" height="50" rx="4" fill="#78350F" stroke="#451A03" stroke-width="3"/>
  <line x1="32" y1="35" x2="32" y2="85" stroke="#D97706" stroke-width="2"/>
  <line x1="48" y1="35" x2="48" y2="85" stroke="#D97706" stroke-width="2"/>
  <line x1="64" y1="35" x2="64" y2="85" stroke="#D97706" stroke-width="2"/>
  <line x1="80" y1="35" x2="80" y2="85" stroke="#D97706" stroke-width="2"/>
  <line x1="20" y1="50" x2="100" y2="50" stroke="#451A03" stroke-width="3"/>
  <circle cx="32" cy="42" r="4" fill="#F59E0B"/>
  <circle cx="48" cy="42" r="4" fill="#F59E0B"/>
  <circle cx="64" cy="42" r="4" fill="#F59E0B"/>
  <circle cx="80" cy="42" r="4" fill="#F59E0B"/>
  <circle cx="32" cy="62" r="4" fill="#F59E0B"/>
  <circle cx="32" cy="72" r="4" fill="#F59E0B"/>
  <circle cx="48" cy="72" r="4" fill="#F59E0B"/>
  <circle cx="64" cy="62" r="4" fill="#F59E0B"/>
  <circle cx="80" cy="72" r="4" fill="#F59E0B"/>
</svg>`,

  'anektia_pixel_terminal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect x="25" y="25" width="70" height="50" rx="5" fill="#1E293B" stroke="#B45309" stroke-width="3"/>
  <rect x="32" y="32" width="56" height="36" fill="#022C22" stroke="#10B981" stroke-width="1.5"/>
  <text x="36" y="46" fill="#34D399" font-family="monospace" font-size="8">> ANEKTIA OS</text>
  <text x="36" y="58" fill="#34D399" font-family="monospace" font-size="8">> READY_</text>
  <rect x="52" y="75" width="16" height="12" fill="#78350F"/>
  <rect x="40" y="87" width="40" height="6" rx="2" fill="#78350F"/>
</svg>`,

  'anektia_pixel_bust.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect x="42" y="80" width="36" height="20" rx="2" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <path d="M 40 80 Q 60 70 80 80 L 72 58 Q 60 62 48 58 Z" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5"/>
  <ellipse cx="60" cy="42" rx="14" ry="18" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5"/>
  <path d="M 48 35 C 48 26, 72 26, 72 35" stroke="#CBD5E1" stroke-width="3" fill="none"/>
  <path d="M 52 50 Q 60 56 68 50" stroke="#94A3B8" stroke-width="2" fill="none"/>
</svg>`,

  'anektia_pixel_microscope.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect x="35" y="92" width="50" height="12" rx="3" fill="#1E293B"/>
  <path d="M 60 92 L 60 45 Q 75 45 75 30" stroke="#D97706" stroke-width="4" fill="none"/>
  <rect x="68" y="20" width="14" height="25" rx="3" fill="#F59E0B" stroke="#78350F" transform="rotate(20 75 32)"/>
  <rect x="45" y="65" width="30" height="6" fill="#64748B"/>
  <circle cx="60" cy="55" r="5" fill="#38BDF8"/>
</svg>`,

  'anektia_pixel_terrarium.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="62" r="34" fill="#ECFDF5" stroke="#34D399" stroke-width="2.5" opacity="0.9"/>
  <ellipse cx="60" cy="84" rx="26" ry="10" fill="#064E3B"/>
  <path d="M 48 84 Q 52 65 56 84 M 58 84 Q 62 60 66 84 M 68 84 Q 72 68 76 84" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
  <circle cx="56" cy="65" r="3" fill="#6EE7B7"/>
  <circle cx="64" cy="60" r="3" fill="#6EE7B7"/>
  <rect x="52" y="24" width="16" height="8" rx="2" fill="#78350F"/>
</svg>`,

  'anektia_pixel_armchair.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect x="30" y="40" width="60" height="45" rx="8" fill="#78350F" stroke="#451A03" stroke-width="3"/>
  <rect x="25" y="55" width="12" height="30" rx="4" fill="#B45309" stroke="#451A03" stroke-width="2"/>
  <rect x="83" y="55" width="12" height="30" rx="4" fill="#B45309" stroke="#451A03" stroke-width="2"/>
  <rect x="35" y="65" width="50" height="22" rx="4" fill="#92400E"/>
  <rect x="35" y="90" width="8" height="15" fill="#451A03"/>
  <rect x="77" y="90" width="8" height="15" fill="#451A03"/>
</svg>`,

  'anektia_pixel_desk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 120" width="140" height="120">
  <rect x="20" y="45" width="100" height="18" rx="3" fill="#78350F" stroke="#451A03" stroke-width="3"/>
  <rect x="25" y="63" width="25" height="35" fill="#542407" stroke="#451A03" stroke-width="2"/>
  <rect x="90" y="63" width="25" height="35" fill="#542407" stroke="#451A03" stroke-width="2"/>
  <circle cx="37.5" cy="75" r="2.5" fill="#F59E0B"/>
  <circle cx="37.5" cy="88" r="2.5" fill="#F59E0B"/>
  <circle cx="102.5" cy="75" r="2.5" fill="#F59E0B"/>
  <circle cx="102.5" cy="88" r="2.5" fill="#F59E0B"/>
</svg>`,

  'anektia_pixel_lamp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect x="45" y="92" width="30" height="8" rx="2" fill="#D97706"/>
  <path d="M 60 92 Q 42 70 60 48" stroke="#F59E0B" stroke-width="3.5" fill="none"/>
  <path d="M 45 48 C 45 35, 75 35, 75 48 Z" fill="#047857" stroke="#022C22" stroke-width="2"/>
  <circle cx="60" cy="50" r="4" fill="#FEF08A"/>
</svg>`,

  'anektia_pixel_plant.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <polygon points="45,65 75,65 70,98 50,98" fill="#B45309" stroke="#78350F" stroke-width="2.5"/>
  <path d="M 60 65 Q 40 45 32 52 M 60 65 Q 50 35 55 25 M 60 65 Q 70 35 65 25 M 60 65 Q 80 45 88 52 M 60 65 Q 60 40 60 30" stroke="#15803D" stroke-width="6" stroke-linecap="round"/>
</svg>`
};

console.log('Generando imágenes para la colección del conocimiento...');
for (const [filename, content] of Object.entries(collectionSvgs)) {
  const svgPath = path.join(PUBLIC_IMAGES, filename);
  const pngPath = path.join(PUBLIC_IMAGES, filename.replace('.svg', '.png'));
  fs.writeFileSync(svgPath, content, 'utf8');
  fs.writeFileSync(pngPath, content, 'utf8');
  console.log(`✅ Colección guardada: ${filename} y PNG`);
}

console.log('\n¡Todas las reliquias y objetos de la colección han sido generados!');
