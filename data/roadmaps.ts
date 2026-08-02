import { CATEGORIES_DATA } from "./categories";
import { getArticlePath } from "@/lib/utils";
import type { ArticleFrontmatter } from "@/types";

export interface Step {
  id: string;
  title: string;
  duration: string;
  description: string;
  type: "theory" | "practice" | "philosophy" | "milestone";
  status: "completed" | "current" | "locked";
  path?: string;
  level?: {
    num: number;
    title: string;
    badge: string;
  };
}

export const ROADMAPS: Record<string, { title: string; subtitle: string; description: string; content?: string; steps: Step[] }> = {
  guias: {
    title: "Guías Maestras",
    subtitle: "El Canon del Autodidacta",
    description: "Rutas sistémicas diseñadas para transformar la curiosidad en maestría técnica e intelectual.",
    content: "Nuestras Guías Maestras representan la culminación de un esfuerzo editorial por sintetizar el conocimiento humano en rutas accionables.",
    steps: []
  }
};

// Generar roadmaps base para cada categoría y subcategoría
CATEGORIES_DATA.forEach(cat => {
  ROADMAPS[cat.id] = {
    title: cat.name,
    subtitle: "Ruta de Aprendizaje",
    description: cat.description,
    content: `Explora el fascinante mundo de ${cat.name}. Esta ruta te guiará a través de sus principales disciplinas y enfoques.`,
    steps: []
  };

  cat.subcategories.forEach(sub => {
    ROADMAPS[sub.id] = {
      title: sub.name,
      subtitle: cat.name,
      description: `Ruta de estudio profundo sobre ${sub.name}.`,
      content: sub.topics.length > 0 
        ? `Aprende los fundamentos de ${sub.name}, incluyendo temas clave como ${sub.topics.join(', ')}.`
        : `Aprende los fundamentos y la práctica avanzada de ${sub.name}.`,
      steps: []
    };
  });
});

export function populateRoadmaps(articles: ArticleFrontmatter[]) {
  if (!articles || articles.length === 0) return ROADMAPS;
  
  const articlesMap: Record<string, ArticleFrontmatter[]> = {};
  
  articles.forEach(article => {
    const sub = article.subcategory;
    const cat = article.category;
    
    let pathCat = '';
    let pathSub = '';
    if (article._path) {
      const normalizedPath = article._path.replace(/\\/g, '/');
      const segs = normalizedPath.replace(/^.*content\/guias\//, "").split("/");
      pathCat = segs[0];
      if (segs.length > 2) pathSub = segs[1];
    }

    const subKey = sub || pathSub;
    const catKey = cat || pathCat;

    if (subKey) {
      if (!articlesMap[subKey]) articlesMap[subKey] = [];
      articlesMap[subKey].push(article);
    }

    if (catKey && catKey !== subKey) {
      if (!articlesMap[catKey]) articlesMap[catKey] = [];
      articlesMap[catKey].push(article);
    }
  });

  Object.keys(ROADMAPS).forEach(key => {
    if (key === 'guias') return;
    const items = articlesMap[key] || [];
    
    // Remove duplicates if any
    const uniqueItemsMap = new Map<string, ArticleFrontmatter>();
    items.forEach(item => uniqueItemsMap.set(item.slug, item));
    const uniqueItems = Array.from(uniqueItemsMap.values());

    uniqueItems.sort((a, b) => {
      const aNivel = a.nivel || 99;
      const bNivel = b.nivel || 99;
      if (aNivel !== bNivel) {
        return aNivel - bNivel;
      }
      const aOrden = a.orden !== undefined ? a.orden : 99;
      const bOrden = b.orden !== undefined ? b.orden : 99;
      if (aOrden !== bOrden) {
        return aOrden - bOrden;
      }
      const typeScoreA = a.tipo === "practice" ? 1 : 0;
      const typeScoreB = b.tipo === "practice" ? 1 : 0;
      return typeScoreA - typeScoreB;
    });

    if (uniqueItems.length > 0) {
      ROADMAPS[key].steps = uniqueItems.map((art, index) => {
        return {
          id: art.slug,
          title: art.title,
          duration: "Lectura/Estudio",
          description: art.description || `Guía completa sobre ${art.title}`,
          type: (art.tipo as any) || "theory",
          status: index === 0 ? "current" : "locked",
          path: getArticlePath(art),
          level: {
            num: art.nivel || (index + 1),
            title: art.nivel_titulo || art.title,
            badge: art.nivel_titulo || art.title
          }
        };
      });
    }
  });

  return ROADMAPS;
}
