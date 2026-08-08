import { NextRequest, NextResponse } from 'next/server';
import { loadBranch } from '@/lib/curriculum/loader';
import { validateBranch, getBranchSummary, BranchLayerId } from '@/lib/curriculum/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ branchId: string }> }
) {
  const { branchId } = await params;
  const branch = await loadBranch(branchId);

  if (!branch) {
    return NextResponse.json({ error: `Rama "${branchId}" no encontrada` }, { status: 404 });
  }

  const summary = getBranchSummary(branch);
  const validation = validateBranch(branch);

  const index = branch.levels.map(level => {
    const levelArticles = branch.articles
      .filter(a => a.nivel === level.nivel)
      .sort((a, b) => a.orden - b.orden)
      .map(article => {
        const layers: Record<string, { sections: number; exercises: number; competencies: string[] }> = {};
        const layerIds: BranchLayerId[] = ['inicio', 'intermedio', 'avanzado'];

        for (const lid of layerIds) {
          const capa = article.capas[lid];
          if (!capa) continue;
          const competencies = new Set<string>();
          let exerciseCount = 0;
          for (const section of capa.sections) {
            for (const comp of section.competencias) competencies.add(comp);
            exerciseCount += section.bloques.filter(b =>
              b === 'aeterna-exercise' || b === 'aeterna-decision'
            ).length;
          }
          layers[lid] = {
            sections: capa.sections.length,
            exercises: exerciseCount,
            competencies: [...competencies],
          };
        }

        return {
          slug: article.slug,
          title: article.title,
          orden: article.orden,
          tipo: article.tipo,
          tags: article.tags,
          prerequisites: article.prerequisites,
          layers,
        };
      });

    return {
      nivel: level.nivel,
      titulo: level.titulo,
      descripcion: level.descripcion,
      totalArticles: levelArticles.length,
      articles: levelArticles,
    };
  });

  return NextResponse.json({
    ...summary,
    validation,
    index,
    contentTypeTree: `content/guias/${branch.contentPath}/`,
  });
}
