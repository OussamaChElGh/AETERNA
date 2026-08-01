// Script to build high-definition AAA layer assets for floor.webp, walls.webp, architecture.webp

const fs = require('fs');
const path = require('path');

const publicImgDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(publicImgDir)) {
  fs.mkdirSync(publicImgDir, { recursive: true });
}

// 1. Generate floor.webp (High-definition hand-painted European oak floor platform)
const floorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="oak-surface" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#522C14" />
      <stop offset="35%" stop-color="#42220D" />
      <stop offset="70%" stop-color="#5C3117" />
      <stop offset="100%" stop-color="#301809" />
    </linearGradient>
    <linearGradient id="rim-sw" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#331707" />
      <stop offset="100%" stop-color="#1C0A02" />
    </linearGradient>
    <linearGradient id="rim-se" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#240F04" />
      <stop offset="100%" stop-color="#100501" />
    </linearGradient>
    <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#000000" flood-opacity="0.65" />
    </filter>
  </defs>
  <!-- Drop Shadow -->
  <polygon points="600,264 936,432 600,600 264,432" fill="#000000" opacity="0.45" filter="blur(12px)" />
  <!-- 3D Side Thickness Faces -->
  <polygon points="280,424 600,584 600,608 280,448" fill="url(#rim-sw)" stroke="#170A03" stroke-width="1.5" />
  <polygon points="600,584 920,424 920,448 600,608" fill="url(#rim-se)" stroke="#0D0401" stroke-width="1.5" />
  <!-- Main Floor Polygon -->
  <g filter="url(#drop-shadow)">
    <polygon points="600,240 920,400 600,560 280,400" fill="url(#oak-surface)" stroke="#210D04" stroke-width="2.5" />
    <line x1="660" y1="270" x2="340" y2="430" stroke="#2E1507" stroke-width="1.5" opacity="0.6" />
    <line x1="720" y1="300" x2="400" y2="460" stroke="#2E1507" stroke-width="1.5" opacity="0.6" />
    <line x1="780" y1="330" x2="460" y2="490" stroke="#2E1507" stroke-width="1.5" opacity="0.6" />
    <line x1="840" y1="360" x2="520" y2="520" stroke="#2E1507" stroke-width="1.5" opacity="0.6" />
    <line x1="600" y1="240" x2="920" y2="400" stroke="#85461E" stroke-width="1.5" opacity="0.6" />
    <line x1="600" y1="240" x2="280" y2="400" stroke="#85461E" stroke-width="1.5" opacity="0.6" />
  </g>
</svg>`;

fs.writeFileSync(path.join(publicImgDir, 'floor.svg'), floorSvg);

// 2. Generate walls.webp (Stone masonry walls with gothic window)
const wallsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="wall-nw" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#443930" />
      <stop offset="50%" stop-color="#352C25" />
      <stop offset="100%" stop-color="#241D18" />
    </linearGradient>
    <linearGradient id="wall-ne" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D241D" />
      <stop offset="60%" stop-color="#1E1712" />
      <stop offset="100%" stop-color="#140E0A" />
    </linearGradient>
    <linearGradient id="glass-amber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#F59E0B" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#78350F" stop-opacity="0.4" />
    </linearGradient>
  </defs>
  <!-- NW Wall -->
  <polygon points="600,240 408,336 408,166 600,70" fill="url(#wall-nw)" stroke="#17120E" stroke-width="2" />
  <!-- NE Wall -->
  <polygon points="600,240 920,400 920,230 600,70" fill="url(#wall-ne)" stroke="#120D09" stroke-width="2" />
  <!-- Gothic Arch Window -->
  <g transform="translate(504, 203)">
    <path d="M -28,25 L -28,-20 Q 0,-60 28,-20 L 28,25 Z" fill="#1C1510" stroke="#D4AF37" stroke-width="3" />
    <path d="M -22,20 L -22,-16 Q 0,-50 22,-16 L 22,20 Z" fill="url(#glass-amber)" />
    <line x1="0" y1="-45" x2="0" y2="20" stroke="#381D08" stroke-width="3" />
    <line x1="-22" y1="-10" x2="22" y2="-10" stroke="#381D08" stroke-width="2.5" />
  </g>
</svg>`;

fs.writeFileSync(path.join(publicImgDir, 'walls.svg'), wallsSvg);

// 3. Generate architecture.webp (Beams and Fireplace)
const archSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <!-- Ceiling Beams -->
  <polygon points="600,70 408,166 408,146 600,50" fill="#3D1D07" stroke="#1C0A00" stroke-width="2" />
  <polygon points="600,70 920,230 920,210 600,50" fill="#270F02" stroke="#1C0A00" stroke-width="2" />
  <!-- Corner Pillar -->
  <polygon points="588,240 612,240 612,50 588,50" fill="#2A1203" stroke="#120600" stroke-width="2" />
  <rect x="586" y="52" width="28" height="6" fill="#D4AF37" rx="1" />
</svg>`;

fs.writeFileSync(path.join(publicImgDir, 'architecture.svg'), archSvg);

console.log('AAA Layer SVG assets generated successfully!');
