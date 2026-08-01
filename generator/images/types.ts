export type ImageStyle =
  | 'vintage-physics'
  | 'diagram'
  | 'cinematic'
  | 'conceptual';

export interface ImageGenResult {
  base64: string;
  mimeType: string;
}

export interface AestheticConfig {
  style: ImageStyle;
  palette: string;
  quality: string;
  composition: string;
  noTextRule: string;
}

export interface ImageGenRequest {
  description: string;
  caption: string;
  sectionId: string;
  layerId: string;
  style: ImageStyle;
}

export interface GeneratedImageInfo {
  id: string;
  prompt: string;
  description: string;
  caption: string;
  sectionId: string;
  layerId: string;
  file: string;
  generatedAt: string;
  provider?: string;
}

export interface ImageManifest {
  slug: string;
  aestheticBase: string;
  generatedAt: string;
  images: GeneratedImageInfo[];
  totalGenerated: number;
}

export interface GemImagePart {
  inlineData?: { data: string; mimeType: string };
}

export interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: GemImagePart[];
    };
  }[];
}

export interface ExtractPlaceholderResult {
  description: string;
  caption: string;
  sectionId: string;
  layerId: string;
  raw: string;
}
