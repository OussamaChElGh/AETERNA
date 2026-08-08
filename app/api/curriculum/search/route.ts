import { NextRequest, NextResponse } from 'next/server';
import { loadAllBranches } from '@/lib/curriculum/loader';
import { BranchCurriculum, PlannedArticle, PlannedSection, BranchLayerId } from '@/lib/curriculum/schema';

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

interface SearchHit {
  branchId: string;
  branchName: string;
  branchIcon: string;
  article: {
    slug: string;
    title: string;
    nivel: number;
    orden: number;
    tipo: string;
    tags: string[];
  };
  matches: {
    field: string;
    snippet: string;
    layer?: string;
  }[];
  score: number;
}

const LAYER_LABELS: Record<string, string> = {
  inicio: 'Fundamentos',
  intermedio: 'Profundización',
  avanzado: 'Frontera',
};

function highlightTerm(text: string, term: string): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(term.toLowerCase());
  if (idx === -1) return text.slice(0, 100);
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + term.length + 60);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  const snippet = text.slice(start, end);
  return `${prefix}${snippet}${suffix}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const branchId = searchParams.get('branch');
  const nivelStr = searchParams.get('nivel');
  const tipo = searchParams.get('tipo');
  const competencia = searchParams.get('competencia');
  const layer = searchParams.get('layer') as BranchLayerId | null;
  const tag = searchParams.get('tag');

  if (!q) {
    return NextResponse.json({ error: 'Parámetro q requerido' }, { status: 400 });
  }

  const terms = q.toLowerCase().split(/\s+/).map(normalize);
  const nivel = nivelStr ? parseInt(nivelStr) : undefined;
  const branches = await loadAllBranches();
  const filtered = branchId
    ? branches.filter(b => b.branchId === branchId)
    : branches;

  const hits: SearchHit[] = [];

  for (const branch of filtered) {
    for (const article of branch.articles) {
      if (nivel !== undefined && article.nivel !== nivel) continue;
      if (tipo && article.tipo !== tipo) continue;
      if (tag && !article.tags.some(t => normalize(t) === normalize(tag))) continue;

      const matches: SearchHit['matches'] = [];
      let score = 0;

      for (const term of terms) {
        if (normalize(article.title).includes(term)) {
          matches.push({ field: 'title', snippet: article.title });
          score += 10;
        }
        if (normalize(article.slug).includes(term)) {
          score += 3;
        }
        for (const t of article.tags) {
          if (normalize(t).includes(term)) {
            matches.push({ field: 'tag', snippet: t });
            score += 5;
          }
        }

        const layerIds: BranchLayerId[] = ['inicio', 'intermedio', 'avanzado'];
        for (const lid of layerIds) {
          if (layer && lid !== layer) continue;
          const capa = article.capas[lid];
          if (!capa) continue;

          for (const section of capa.sections) {
            if (competencia && !section.competencias.includes(competencia as any)) continue;

            if (normalize(section.titulo).includes(term)) {
              matches.push({ field: 'section', snippet: section.titulo, layer: lid });
              score += 8;
            }

            for (const comp of section.competencias) {
              if (normalize(comp).includes(term)) {
                score += 4;
              }
            }

            for (const block of section.bloques) {
              if (normalize(block).includes(term)) {
                matches.push({ field: 'block', snippet: block, layer: lid });
                score += 6;
              }
            }
          }
        }
      }

      if (matches.length > 0) {
        hits.push({
          branchId: branch.branchId,
          branchName: branch.branchName,
          branchIcon: branch.icon,
          article: {
            slug: article.slug,
            title: article.title,
            nivel: article.nivel,
            orden: article.orden,
            tipo: article.tipo,
            tags: article.tags,
          },
          matches: matches.slice(0, 8),
          score,
        });
      }
    }
  }

  hits.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    query: q,
    total: hits.length,
    hits: hits.slice(0, 50),
    filters: { branch: branchId, nivel, tipo, competencia, layer, tag },
  });
}
