import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const branchId = args.find(a => a.startsWith('--branch='))?.split('=')[1];
const force = args.includes('--force');
const levelsArg = args.find(a => a.startsWith('--levels='))?.split('=')[1];

if (!branchId) {
  console.error('Uso: npx tsx scripts/scaffold-curriculum.ts --branch=matematicas [--levels=3] [--force]');
  process.exit(1);
}

const CATEGORIES_DATA = [
  { id: 'ciencias_formales', subcategories: [{ id: 'matematicas', name: 'Matemáticas' }, { id: 'logica', name: 'Lógica' }, { id: 'informatica', name: 'Informática teórica' }] },
  { id: 'ciencias_naturales', subcategories: [{ id: 'fisica', name: 'Física' }, { id: 'quimica', name: 'Química' }, { id: 'biologia', name: 'Biología' }, { id: 'geologia', name: 'Geología' }, { id: 'astronomia', name: 'Astronomía' }] },
  { id: 'ciencias_sociales', subcategories: [{ id: 'sociologia', name: 'Sociología' }, { id: 'psicologia', name: 'Psicología' }, { id: 'economia', name: 'Economía' }, { id: 'antropologia', name: 'Antropología' }, { id: 'arqueologia', name: 'Arqueología' }, { id: 'politica', name: 'Ciencia política' }] },
  { id: 'humanidades', subcategories: [{ id: 'filosofia', name: 'Filosofía' }, { id: 'historia', name: 'Historia' }, { id: 'linguistica', name: 'Lingüística' }, { id: 'literatura', name: 'Literatura' }] },
  { id: 'artes', subcategories: [{ id: 'visuales', name: 'Artes visuales' }, { id: 'escenicas', name: 'Artes escénicas' }, { id: 'musica', name: 'Música' }, { id: 'audiovisuales', name: 'Cine y audiovisuales' }, { id: 'diseno', name: 'Diseño' }] },
  { id: 'aplicadas', subcategories: [{ id: 'ingenieria', name: 'Ingeniería' }, { id: 'derecho', name: 'Derecho' }, { id: 'educacion', name: 'Educación' }] },
  { id: 'idiomas', subcategories: [{ id: 'japones', name: 'Japonés' }, { id: 'ingles', name: 'Inglés' }, { id: 'frances', name: 'Francés' }, { id: 'aleman', name: 'Alemán' }] },
];

function findSubcategory(branchId: string) {
  for (const cat of CATEGORIES_DATA) {
    const sub = cat.subcategories.find(s => s.id === branchId);
    if (sub) {
      return { categoryId: cat.id, subcategoryName: sub.name, contentPath: `${cat.id}/${branchId}` };
    }
  }
  return null;
}

const ICONS: Record<string, string> = {
  fisica: '⚛️', matematicas: '📐', quimica: '🧪', biologia: '🧬', geologia: '🪨',
  astronomia: '🌌', logica: '🧠', informatica: '💻', sociologia: '👥', psicologia: '🧠',
  economia: '💰', antropologia: '🗿', arqueologia: '🏺', politica: '🏛️',
  filosofia: '💭', historia: '📜', linguistica: '🗣️', literatura: '📖',
  visuales: '🎨', escenicas: '🎭', musica: '🎵', audiovisuales: '🎬', diseno: '✏️',
  ingenieria: '⚙️', derecho: '⚖️', educacion: '🎓',
  japones: '🇯🇵', ingles: '🇬🇧', frances: '🇫🇷', aleman: '🇩🇪',
};

const sub = findSubcategory(branchId);
const now = new Date().toISOString();
const numLevels = parseInt(levelsArg || '3', 10);

const defaultLevelTemplates = [
  { nivel: 1, titulo: 'Fundamentos', descripcion: 'Conceptos y herramientas básicas.' },
  { nivel: 2, titulo: 'Núcleo', descripcion: 'Desarrollo de los temas centrales.' },
  { nivel: 3, titulo: 'Avanzado', descripcion: 'Temas de profundización y frontera.' },
  { nivel: 4, titulo: 'Especialización', descripcion: 'Aplicaciones y síntesis.' },
];

const levels = defaultLevelTemplates.slice(0, Math.min(numLevels, 4));

const branch = {
  branchId,
  branchName: sub?.subcategoryName || branchId,
  subcategory: branchId,
  categoryId: sub?.categoryId || 'ciencias_naturales',
  profileId: 'bachillerato',
  icon: ICONS[branchId] || '📚',
  status: 'draft' as const,
  description: `Currículum de ${sub?.subcategoryName || branchId}.`,
  contentPath: sub?.contentPath || `ciencias_naturales/${branchId}`,
  levels,
  articles: [],
  createdAt: now,
  updatedAt: now,
};

const curriculumDir = path.join(process.cwd(), 'data', 'curriculum');
const curriculumPath = path.join(curriculumDir, `${branchId}.json`);
const contentDir = path.join(process.cwd(), 'content', 'guias', branch.contentPath);

if (fs.existsSync(curriculumPath) && !force) {
  console.error(`✗ ${curriculumPath} ya existe. Usa --force para sobrescribir.`);
  process.exit(1);
}

if (!fs.existsSync(curriculumDir)) {
  fs.mkdirSync(curriculumDir, { recursive: true });
}

fs.writeFileSync(curriculumPath, JSON.stringify(branch, null, 2), 'utf-8');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

console.log(`✓ Rama creada: ${ICONS[branchId] || '📚'} ${branch.branchName}`);
console.log(`  Curriculum: ${curriculumPath}`);
console.log(`  Contenido:  ${contentDir}/`);
console.log(`  Niveles:    ${levels.map(l => l.titulo).join(' → ')} (${levels.length})`);
console.log(`  Artículos:  0 (pendientes de añadir)`);
console.log('');
console.log('Próximos pasos:');
console.log(`  1. Editar ${curriculumPath} para añadir artículos`);
console.log(`  2. Crear archivos .md en ${contentDir}/`);
console.log(`  3. Validar: npx tsx scripts/scaffold-curriculum.ts --validate=${branchId}`);
