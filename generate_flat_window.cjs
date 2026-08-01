const sharp = require('sharp');
const fs = require('fs');

const svgWidth = 320;
const svgHeight = 480;

const svgContent = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 320 480" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer Mahogany Gothic Arch Frame -->
  <path d="M 30,460 L 30,160 Q 30,30 160,10 Q 290,30 290,160 L 290,460 Z" 
        fill="#2A1810" stroke="#150A05" stroke-width="6" />

  <!-- Inner Wood Trim -->
  <path d="M 42,448 L 42,165 Q 42,42 160,24 Q 278,42 278,165 L 278,448 Z" 
        fill="#4A2E1B" stroke="#1F1008" stroke-width="4" />

  <!-- Glass Pane Area Cutout -->
  <path d="M 54,436 L 54,170 Q 54,54 160,38 Q 266,54 266,170 L 266,436 Z" 
        fill="#1B2A38" />

  <!-- Stained Glass Color Panels -->
  <!-- Upper Arch Rosette Wheel Panels -->
  <path d="M 160,38 Q 110,65 160,130 Q 210,65 160,38 Z" fill="#D4AF37" opacity="0.9" />
  <path d="M 160,130 Q 90,110 54,170 Q 110,170 160,130 Z" fill="#1B4965" opacity="0.85" />
  <path d="M 160,130 Q 230,110 266,170 Q 210,170 160,130 Z" fill="#1B4965" opacity="0.85" />

  <!-- Lower Panes Pattern -->
  <g stroke="#0B131F" stroke-width="3.5" opacity="0.95">
    <!-- Vertical Center Divider (Mullion) -->
    <line x1="160" y1="130" x2="160" y2="436" stroke="#1F1008" stroke-width="8" />
    <line x1="107" y1="170" x2="107" y2="436" stroke="#2A1810" stroke-width="4" />
    <line x1="213" y1="170" x2="213" y2="436" stroke="#2A1810" stroke-width="4" />

    <!-- Horizontal Bars -->
    <line x1="54" y1="236" x2="266" y2="236" stroke="#2A1810" stroke-width="5" />
    <line x1="54" y1="336" x2="266" y2="336" stroke="#2A1810" stroke-width="5" />

    <!-- Diamond Grids Left -->
    <line x1="54" y1="190" x2="160" y2="240" />
    <line x1="54" y1="240" x2="160" y2="290" />
    <line x1="54" y1="290" x2="160" y2="340" />
    <line x1="54" y1="340" x2="160" y2="390" />
    <line x1="54" y1="390" x2="160" y2="436" />

    <line x1="160" y1="190" x2="54" y2="240" />
    <line x1="160" y1="240" x2="54" y2="290" />
    <line x1="160" y1="290" x2="54" y2="340" />
    <line x1="160" y1="340" x2="54" y2="390" />
    <line x1="160" y1="390" x2="54" y2="436" />

    <!-- Diamond Grids Right -->
    <line x1="160" y1="190" x2="266" y2="240" />
    <line x1="160" y1="240" x2="266" y2="290" />
    <line x1="160" y1="290" x2="266" y2="340" />
    <line x1="160" y1="340" x2="266" y2="390" />
    <line x1="160" y1="390" x2="266" y2="436" />

    <line x1="266" y1="190" x2="160" y2="240" />
    <line x1="266" y1="240" x2="160" y2="290" />
    <line x1="266" y1="290" x2="160" y2="340" />
    <line x1="266" y1="340" x2="160" y2="390" />
    <line x1="266" y1="390" x2="160" y2="436" />
  </g>

  <!-- Brass Arch Fittings & Base Sill -->
  <rect x="20" y="454" width="280" height="18" rx="4" fill="#3D2314" stroke="#1F1008" stroke-width="4" />
  <circle cx="160" cy="130" r="8" fill="#D4AF37" stroke="#5C4010" stroke-width="3" />
</svg>`;

sharp(Buffer.from(svgContent))
  .png()
  .toFile('c:/Users/Flinix/.gemini/antigravity-ide/scratch/aeterna-next/public/images/aeterna_master_flat_gothic_window.png')
  .then(() => console.log('Vector Flat Gothic Window PNG generated successfully!'))
  .catch(err => console.error(err));
