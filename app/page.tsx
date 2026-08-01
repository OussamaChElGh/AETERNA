import { Home2Client } from "@/components/Home2Client";
import type { LearningPathArticle, LearningPathLevel } from "@/components/LearningPath";

interface CurriculumFile {
  levels?: { nivel: number; titulo: string; descripcion: string }[];
  articles?: { slug: string; title: string; insignia: string; nivel: number; orden: number }[];
}

export default function HomePage() {
  const levels: LearningPathLevel[] = [];
  const articles: LearningPathArticle[] = [];
  const articleContent: Record<string, { introduccion?: string; secciones?: { titulo: string; niveles?: Record<string, string> }[] }> = {};

  let curriculum: CurriculumFile = {};
  try {
    curriculum = require("@/data/curriculum/fisica.json");
  } catch {
    curriculum = {};
  }

  for (const l of curriculum.levels || []) {
    levels.push({ nivel: l.nivel, titulo: l.titulo, descripcion: l.descripcion, icon: "", color: "" });
  }

  for (const a of curriculum.articles || []) {
    articles.push({ slug: a.slug, title: a.title, insignia: a.insignia, nivel: a.nivel, orden: a.orden });
  }

  for (const a of articles) {
    try {
      const data = require(`@/data/articles/${a.slug}.json`);
      articleContent[a.slug] = {
        introduccion: data.introduccion,
        secciones: data.secciones,
      };
    } catch {
      // artículo sin contenido
    }
  }

  return (
    <Home2Client
      levels={levels}
      articles={articles}
      articleContent={articleContent}
    />
  );
}
