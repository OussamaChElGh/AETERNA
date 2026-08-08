import { NextRequest, NextResponse } from 'next/server';
import { loadBranch } from '@/lib/curriculum/loader';
import { BranchLayerId, PlannedBlockType } from '@/lib/curriculum/schema';

interface ExerciseEntry {
  id: string;
  type: string;
  articleSlug: string;
  articleTitle: string;
  sectionId: string;
  sectionTitle: string;
  layer: string;
  layerLabel: string;
  nivel: number;
  competencies: string[];
}

const EXERCISE_BLOCKS: PlannedBlockType[] = [
  'aeterna-exercise',
  'aeterna-decision',
  'prediction-box',
  'error-hunter',
  'parameter-lab',
  'graph-lab',
  'model-builder',
  'sequence-builder',
  'evidence-matcher',
  'counterexample',
  'argument-evaluation',
  'transfer',
  'hidden-assumption',
];

const LAYER_LABELS: Record<string, string> = {
  inicio: 'Fundamentos',
  intermedio: 'Profundización',
  avanzado: 'Frontera',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ branchId: string }> }
) {
  const { branchId } = await params;
  const { searchParams } = new URL(request.url);

  const branch = await loadBranch(branchId);
  if (!branch) {
    return NextResponse.json({ error: `Rama "${branchId}" no encontrada` }, { status: 404 });
  }

  const nivelStr = searchParams.get('nivel');
  const layer = searchParams.get('layer') as BranchLayerId | null;
  const competencia = searchParams.get('competencia');
  const type = searchParams.get('type');

  const nivel = nivelStr ? parseInt(nivelStr) : undefined;

  const exercises: ExerciseEntry[] = [];
  const layerIds: BranchLayerId[] = layer ? [layer] : ['inicio', 'intermedio', 'avanzado'];

  for (const article of branch.articles) {
    if (nivel !== undefined && article.nivel !== nivel) continue;

    for (const lid of layerIds) {
      const capa = article.capas[lid];
      if (!capa) continue;

      for (const section of capa.sections) {
        if (competencia && !section.competencias.includes(competencia as any)) continue;

        for (const block of section.bloques) {
          if (!EXERCISE_BLOCKS.includes(block)) continue;
          if (type && block !== type) continue;

          exercises.push({
            id: `${article.slug}_${section.id}_${block}`,
            type: block,
            articleSlug: article.slug,
            articleTitle: article.title,
            sectionId: section.id,
            sectionTitle: section.titulo,
            layer: lid,
            layerLabel: LAYER_LABELS[lid] || lid,
            nivel: article.nivel,
            competencies: section.competencias,
          });
        }
      }
    }
  }

  const typeCounts: Record<string, number> = {};
  for (const ex of exercises) {
    typeCounts[ex.type] = (typeCounts[ex.type] || 0) + 1;
  }

  return NextResponse.json({
    branchId,
    total: exercises.length,
    typeCounts,
    filters: { nivel, layer, competencia, type },
    exercises,
  });
}
