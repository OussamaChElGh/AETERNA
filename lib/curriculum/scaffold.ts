import fs from 'fs';
import path from 'path';
import { BranchCurriculum, BranchStatus } from './schema';

export interface ScaffoldOptions {
  branchId: string;
  profileId?: string;
  levels?: { nivel: number; titulo: string; descripcion: string }[];
  icon?: string;
  status?: BranchStatus;
}

export interface SubcategoryInfo {
  categoryId: string;
  subcategoryName: string;
  contentPath: string;
  icon: string;
}

function pickIcon(branchId: string): string {
  const icons: Record<string, string> = {
    fisica: '⚛️',
    matematicas: '📐',
    quimica: '🧪',
    biologia: '🧬',
    geologia: '🪨',
    astronomia: '🌌',
    logica: '🧠',
    informatica: '💻',
    sociologia: '👥',
    psicologia: '🧠',
    economia: '💰',
    antropologia: '🗿',
    arqueologia: '🏺',
    politica: '🏛️',
    filosofia: '💭',
    historia: '📜',
    linguistica: '🗣️',
    literatura: '📖',
    visuales: '🎨',
    escenicas: '🎭',
    musica: '🎵',
    audiovisuales: '🎬',
    diseno: '✏️',
    ingenieria: '⚙️',
    derecho: '⚖️',
    educacion: '🎓',
    japones: '🇯🇵',
    ingles: '🇬🇧',
    frances: '🇫🇷',
    aleman: '🇩🇪',
  };
  return icons[branchId] || '📚';
}

export function createBranchTemplate(options: ScaffoldOptions, sub?: SubcategoryInfo): BranchCurriculum {
  const now = new Date().toISOString();
  const defaultLevels = options.levels || [
    { nivel: 1, titulo: 'Fundamentos', descripcion: 'Conceptos y herramientas básicas.' },
    { nivel: 2, titulo: 'Núcleo', descripcion: 'Desarrollo de los temas centrales.' },
    { nivel: 3, titulo: 'Avanzado', descripcion: 'Temas de profundización y frontera.' },
  ];

  return {
    branchId: options.branchId,
    branchName: sub?.subcategoryName || options.branchId,
    subcategory: options.branchId,
    categoryId: sub?.categoryId || 'ciencias_naturales',
    profileId: options.profileId || 'bachillerato',
    icon: options.icon || pickIcon(options.branchId),
    status: options.status || 'draft',
    description: `Currículum de ${sub?.subcategoryName || options.branchId}.`,
    contentPath: sub?.contentPath || `ciencias_naturales/${options.branchId}`,
    levels: defaultLevels,
    articles: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function scaffoldBranch(options: ScaffoldOptions, sub?: SubcategoryInfo): { curriculumPath: string; contentDir: string; branch: BranchCurriculum } {
  const branch = createBranchTemplate(options, sub);
  const curriculumDir = path.join(process.cwd(), 'data', 'curriculum');
  const contentDir = path.join(process.cwd(), 'content', 'guias', branch.contentPath);

  if (!fs.existsSync(curriculumDir)) {
    fs.mkdirSync(curriculumDir, { recursive: true });
  }

  const curriculumPath = path.join(curriculumDir, `${options.branchId}.json`);

  if (fs.existsSync(curriculumPath)) {
    throw new Error(`El archivo ${curriculumPath} ya existe. Usa --force para sobrescribir.`);
  }

  fs.writeFileSync(curriculumPath, JSON.stringify(branch, null, 2), 'utf-8');

  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  return { curriculumPath, contentDir, branch };
}
