import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');

const svgs: Record<string, string> = {
  'aeterna_master_gyroscope.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" width="120" height="160">
  <defs>
    <filter id="glow-gyro" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="brass-1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE066"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#8A6D1B"/>
    </linearGradient>
    <linearGradient id="wood-base" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6B3A19"/>
      <stop offset="100%" stop-color="#341A0B"/>
    </linearGradient>
  </defs>
  <ellipse cx="60" cy="138" rx="30" ry="12" fill="#000000" opacity="0.35"/>
  <g filter="url(#glow-gyro)">
    <path d="M 40 135 L 60 125 L 80 135 L 60 140 Z" fill="url(#wood-base)" stroke="#221107" stroke-width="1"/>
    <cylinder x="50" y="115" width="20" height="12" fill="url(#wood-base)"/>
    <rect x="52" y="110" width="16" height="18" rx="3" fill="url(#wood-base)" stroke="#221107"/>
    <line x1="60" y1="110" x2="60" y2="40" stroke="url(#brass-1)" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="60" cy="70" rx="28" ry="14" fill="none" stroke="url(#brass-1)" stroke-width="4.5"/>
    <ellipse cx="60" cy="70" rx="20" ry="24" fill="none" stroke="url(#brass-1)" stroke-width="3.5" transform="rotate(35 60 70)"/>
    <circle cx="60" cy="70" r="10" fill="url(#brass-1)" stroke="#4A3414" stroke-width="1.5"/>
    <ellipse cx="60" cy="70" rx="8" ry="3" fill="#FFE4B5" opacity="0.8"/>
  </g>
</svg>`,

  'aeterna_master_archimedes_fountain.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180" width="160" height="180">
  <defs>
    <filter id="glow-fountain" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="stone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9CA3AF"/>
      <stop offset="100%" stop-color="#4B5563"/>
    </linearGradient>
    <linearGradient id="water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
  </defs>
  <ellipse cx="80" cy="155" rx="45" ry="18" fill="#000000" opacity="0.38"/>
  <g filter="url(#glow-fountain)">
    <ellipse cx="80" cy="140" rx="42" ry="20" fill="url(#stone-grad)" stroke="#1F2937" stroke-width="2"/>
    <ellipse cx="80" cy="138" rx="36" ry="15" fill="url(#water-grad)" opacity="0.9"/>
    <path d="M 80 138 Q 70 110 78 80 T 82 45" stroke="#E0F2FE" stroke-width="3" fill="none" opacity="0.8"/>
    <rect x="72" y="55" width="16" height="75" rx="8" fill="url(#stone-grad)" stroke="#1F2937" stroke-width="1.5"/>
    <path d="M 72 65 Q 88 75 72 85 Q 88 95 72 105 Q 88 115 72 125" stroke="#38BDF8" stroke-width="4" fill="none"/>
    <ellipse cx="80" cy="45" rx="18" ry="8" fill="url(#water-grad)"/>
    <circle cx="80" cy="42" r="4" fill="#FFFFFF" opacity="0.9"/>
  </g>
</svg>`,

  'aeterna_master_tesla_coil.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" width="120" height="160">
  <defs>
    <filter id="plasma-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#A855F7" flood-opacity="0.8"/>
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="copper-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="50%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#9A3412"/>
    </linearGradient>
  </defs>
  <ellipse cx="60" cy="140" rx="28" ry="12" fill="#000000" opacity="0.35"/>
  <g filter="url(#plasma-glow)">
    <rect x="38" y="120" width="44" height="18" rx="4" fill="#3D1E0B" stroke="#1C0D05" stroke-width="1.5"/>
    <rect x="48" y="55" width="24" height="65" rx="3" fill="url(#copper-grad)" stroke="#7C2D12" stroke-width="1.5"/>
    <ellipse cx="60" cy="42" rx="26" ry="12" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
    <ellipse cx="60" cy="40" rx="20" ry="8" fill="#F8FAFC"/>
    <path d="M 60 40 L 45 20 M 60 40 L 75 15 M 60 40 L 30 35 M 60 40 L 85 30" stroke="#C084FC" stroke-width="2" stroke-linecap="round"/>
    <path d="M 60 40 L 68 22 M 60 40 L 50 12" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round"/>
  </g>
</svg>`,

  'aeterna_master_faraday_cage.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" width="120" height="160">
  <defs>
    <filter id="glow-faraday" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="brass-cage" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <ellipse cx="60" cy="138" rx="28" ry="12" fill="#000000" opacity="0.35"/>
  <g filter="url(#glow-faraday)">
    <rect x="40" y="122" width="40" height="16" rx="3" fill="#451A03" stroke="#270F02"/>
    <ellipse cx="60" cy="50" rx="22" ry="10" fill="none" stroke="url(#brass-cage)" stroke-width="3"/>
    <ellipse cx="60" cy="120" rx="22" ry="10" fill="none" stroke="url(#brass-cage)" stroke-width="3"/>
    <line x1="38" y1="50" x2="38" y2="120" stroke="url(#brass-cage)" stroke-width="2"/>
    <line x1="48" y1="50" x2="48" y2="120" stroke="url(#brass-cage)" stroke-width="1.5"/>
    <line x1="60" y1="50" x2="60" y2="120" stroke="url(#brass-cage)" stroke-width="1.5"/>
    <line x1="72" y1="50" x2="72" y2="120" stroke="url(#brass-cage)" stroke-width="1.5"/>
    <line x1="82" y1="50" x2="82" y2="120" stroke="url(#brass-cage)" stroke-width="2"/>
    <circle cx="60" cy="85" r="10" fill="#34D399" opacity="0.7"/>
    <circle cx="60" cy="85" r="5" fill="#A7F3D0"/>
  </g>
</svg>`,

  'aeterna_master_prism_desk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140">
  <defs>
    <filter id="glow-prism" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="20%" stop-color="#F97316"/>
      <stop offset="40%" stop-color="#FACC15"/>
      <stop offset="60%" stop-color="#22C55E"/>
      <stop offset="80%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
  </defs>
  <ellipse cx="70" cy="115" rx="30" ry="12" fill="#000000" opacity="0.3"/>
  <g filter="url(#glow-prism)">
    <rect x="52" y="105" width="36" height="12" rx="3" fill="#78350F" stroke="#451A03"/>
    <polygon points="70,30 35,95 105,95" fill="#E0F2FE" opacity="0.75" stroke="#BAE6FD" stroke-width="2"/>
    <line x1="10" y1="75" x2="50" y2="65" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
    <polygon points="85,67 135,45 135,95 85,80" fill="url(#rainbow)" opacity="0.85"/>
  </g>
</svg>`,

  'aeterna_master_melting_clock.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 150" width="130" height="150">
  <defs>
    <filter id="glow-clock" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="gold-melt" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <ellipse cx="65" cy="130" rx="32" ry="12" fill="#000000" opacity="0.35"/>
  <g filter="url(#glow-clock)">
    <rect x="45" y="100" width="40" height="28" rx="4" fill="#451A03" stroke="#270F02"/>
    <path d="M 35 45 C 35 25, 95 25, 95 45 C 95 75, 75 80, 75 115 C 60 115, 50 100, 50 80 C 35 80, 35 60, 35 45 Z" fill="url(#gold-melt)" stroke="#78350F" stroke-width="2"/>
    <ellipse cx="65" cy="48" rx="22" ry="14" fill="#FEF3C7" stroke="#B45309" stroke-width="1.5"/>
    <path d="M 65 48 L 65 38 M 65 48 L 78 52" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
    <circle cx="65" cy="48" r="2.5" fill="#1F2937"/>
  </g>
</svg>`,

  'aeterna_master_orrery.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <defs>
    <filter id="glow-orrery" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <linearGradient id="brass-base" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <ellipse cx="90" cy="155" rx="45" ry="16" fill="#000000" opacity="0.38"/>
  <g filter="url(#glow-orrery)">
    <polygon points="50,140 90,125 130,140 90,155" fill="#451A03" stroke="#270F02" stroke-width="2"/>
    <rect x="82" y="85" width="16" height="50" rx="3" fill="url(#brass-base)" stroke="#451A03"/>
    <ellipse cx="90" cy="85" rx="55" ry="22" fill="none" stroke="url(#brass-base)" stroke-width="2"/>
    <ellipse cx="90" cy="85" rx="38" ry="15" fill="none" stroke="url(#brass-base)" stroke-width="1.5"/>
    <circle cx="90" cy="85" r="14" fill="url(#sun-grad)"/>
    <circle cx="130" cy="74" r="5" fill="#60A5FA"/>
    <circle cx="58" cy="92" r="4" fill="#EF4444"/>
    <circle cx="110" cy="96" r="3" fill="#E2E8F0"/>
  </g>
</svg>`,

  'aeterna_master_nucleus_lamp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 160" width="130" height="160">
  <defs>
    <filter id="glow-atom" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#38BDF8" flood-opacity="0.75"/>
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <ellipse cx="65" cy="142" rx="28" ry="12" fill="#000000" opacity="0.35"/>
  <g filter="url(#glow-atom)">
    <rect x="45" y="122" width="40" height="18" rx="4" fill="#1F2937" stroke="#111827" stroke-width="1.5"/>
    <line x1="65" y1="122" x2="65" y2="75" stroke="#9CA3AF" stroke-width="3"/>
    <ellipse cx="65" cy="65" rx="36" ry="16" fill="none" stroke="#38BDF8" stroke-width="2" transform="rotate(30 65 65)"/>
    <ellipse cx="65" cy="65" rx="36" ry="16" fill="none" stroke="#818CF8" stroke-width="2" transform="rotate(-30 65 65)"/>
    <ellipse cx="65" cy="65" rx="36" ry="16" fill="none" stroke="#F472B6" stroke-width="2" transform="rotate(90 65 65)"/>
    <circle cx="62" cy="62" r="6" fill="#EF4444"/>
    <circle cx="68" cy="67" r="6" fill="#3B82F6"/>
    <circle cx="67" cy="61" r="5" fill="#F59E0B"/>
    <circle cx="95" cy="50" r="3" fill="#E0F2FE"/>
    <circle cx="35" cy="80" r="3" fill="#E0F2FE"/>
  </g>
</svg>`,

  'aeterna_master_planck_cube.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 150" width="130" height="150">
  <defs>
    <filter id="glow-cube" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#F59E0B" flood-opacity="0.6"/>
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="gold-pedestal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <ellipse cx="65" cy="132" rx="30" ry="12" fill="#000000" opacity="0.35"/>
  <g filter="url(#glow-cube)">
    <rect x="45" y="110" width="40" height="18" rx="3" fill="url(#gold-pedestal)" stroke="#451A03"/>
    <g transform="translate(65, 65)">
      <polygon points="0,-32 28,-16 28,16 0,32 -28,16 -28,-16" fill="#FEF3C7" opacity="0.3" stroke="#F59E0B" stroke-width="2"/>
      <polygon points="0,-32 28,-16 0,0 -28,-16" fill="#FDE68A" opacity="0.85"/>
      <polygon points="0,0 28,-16 28,16 0,32" fill="#F59E0B" opacity="0.75"/>
      <polygon points="-28,-16 0,0 0,32 -28,16" fill="#D97706" opacity="0.8"/>
      <circle cx="0" cy="0" r="4" fill="#FFFFFF"/>
    </g>
  </g>
</svg>`,

  'aeterna_master_silicon_chip.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 160" width="140" height="160">
  <defs>
    <filter id="glow-chip" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="silicon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#065F46"/>
      <stop offset="50%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#022C22"/>
    </linearGradient>
  </defs>
  <g filter="url(#glow-chip)">
    <rect x="20" y="20" width="100" height="120" rx="6" fill="#451A03" stroke="#D97706" stroke-width="3"/>
    <rect x="28" y="28" width="84" height="104" fill="url(#silicon-grad)" stroke="#064E3B" stroke-width="2"/>
    <rect x="45" y="45" width="50" height="50" fill="#065F46" stroke="#F59E0B" stroke-width="1.5"/>
    <path d="M 45 55 H 95 M 45 65 H 95 M 45 75 H 95 M 45 85 H 95" stroke="#10B981" stroke-width="1" opacity="0.7"/>
    <path d="M 55 45 V 95 M 65 45 V 95 M 75 45 V 95 M 85 45 V 95" stroke="#10B981" stroke-width="1" opacity="0.7"/>
    <circle cx="70" cy="70" r="8" fill="#F59E0B"/>
  </g>
</svg>`
};

console.log('Generando archivos SVG e imágenes PNG equivalentes para muebles de la sala...');

for (const [filename, content] of Object.entries(svgs)) {
  const svgPath = path.join(PUBLIC_IMAGES, filename);
  fs.writeFileSync(svgPath, content, 'utf8');
  console.log(`✅ Creado SVG: ${filename}`);

  // También crear versión PNG o mapeo
  const pngName = filename.replace('.svg', '.png');
  const pngPath = path.join(PUBLIC_IMAGES, pngName);
  fs.writeFileSync(pngPath, content, 'utf8');
  console.log(`✅ Creado PNG (vectorial compatible): ${pngName}`);
}

console.log('\n¡Todos los muebles de la sala generados con éxito!');
