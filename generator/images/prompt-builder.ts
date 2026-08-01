import { AestheticConfig, ImageGenRequest, ImageStyle } from './types';

const AESTHETIC_BASE: Record<ImageStyle, AestheticConfig> = {
  'vintage-physics': {
    style: 'vintage-physics',
    palette: 'Cream paper (#FAF6EC) background. Dark sepia ink lines. Golden (#D4AF37) accent elements.',
    quality: 'Etching/hand-drawn aesthetic, clean vector-like lines, high detail, professional scientific plate.',
    composition: 'Centered composition, balanced negative space, 3:2 aspect.',
    noTextRule: 'No long text blocks. Only very short math labels if explicitly requested.',
  },
  diagram: {
    style: 'diagram',
    palette: 'White or cream background. Dark ink lines. Blue and gold accent fills for different elements.',
    quality: 'Clean vector diagram, precise labels, modern technical illustration, high clarity.',
    composition: 'Left-to-right flow, clear spatial separation of elements, generous margins, 3:2 aspect.',
    noTextRule: 'Short labels only (single letters or brief terms). No paragraphs.',
  },
  cinematic: {
    style: 'cinematic',
    palette: 'Warm color grading with cream and golden tones. Deep shadows. Cinematic highlights.',
    quality: 'Photorealistic, shallow depth of field, editorial photography quality, professional lighting.',
    composition: 'Rule of thirds, dramatic but tasteful, central subject with atmospheric background, 3:2 aspect.',
    noTextRule: 'No text or labels in the image.',
  },
  conceptual: {
    style: 'conceptual',
    palette: 'Cream and gold on deep dark background. Abstract forms with subtle physics motifs.',
    quality: 'Abstract conceptual art, refined minimalism, high-end editorial style, elegant composition.',
    composition: 'Centered focal point, abstract flowing shapes, 3:2 aspect.',
    noTextRule: 'No text or labels.',
  },
};

export function buildImagePrompt(
  request: ImageGenRequest,
  styleOverride?: ImageStyle
): string {
  const style = styleOverride || request.style;
  const config = AESTHETIC_BASE[style] || AESTHETIC_BASE['vintage-physics'];

  const parts = [
    config.quality,
    config.palette,
    config.composition,
    config.noTextRule,
    `Subject: ${request.description}`,
  ];

  if (request.caption) {
    parts.push(`Optional short caption idea: "${request.caption}" (do not render unless requested).`);
  }

  return parts.join(' ');
}

export { AESTHETIC_BASE };
