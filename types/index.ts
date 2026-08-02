export interface ArticleFrontmatter {
  title: string;
  description: string;
  slug: string;
  author: string;
  category: string;
  subcategory?: string;
  tags: string[];
  image: string;
  date: string;
  nivel?: number;
  orden?: number;
  nivel_titulo?: string;
  tipo?: "theory" | "practice" | "philosophy" | "milestone";
  _path?: string;
}

export interface AeternaAction {
  tipo: 'BotonSimplificar' | 'BotonProfundizar' | 'BotonEjemplos' | 'BotonConexiones';
  contenido: string;
}

export interface AeternaSection {
  id: string;
  titulo: string;
  niveles: {
    principiante?: string;
    intermedio?: string;
    avanzado?: string;
  };
  acciones: AeternaAction[];
}

export interface AeternaArticle {
  metadata: ArticleFrontmatter;
  introduccion: string;
  secciones: AeternaSection[];
  conclusion?: string;
  cuaderno?: Record<string, CuadernoEntry[]>;
}

export interface CuadernoEntry {
  titulo: string;
  enunciado: string;
  solucion: string;
  xp?: number;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  synonyms?: string[];
  tags?: string[];
  nivel?: string;
}

export interface Author {
  name: string;
  slug: string;
  bio: string;
  role: string;
  avatar: string;
  thought?: string;
  works: string[];
}

export type Category = "filosofia" | "literatura" | "autores" | "guias";
