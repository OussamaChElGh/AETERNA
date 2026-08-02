import { BranchCurriculum, PlannedSection, ArticleOutline } from './types';
import { loadLearningProfile } from '../index';

const LAYER_TO_ARTICLE_LEVEL: Record<string, 'principiante' | 'intermedio' | 'avanzado'> = {
  inicio: 'principiante',
  intermedio: 'intermedio',
  avanzado: 'avanzado',
};

const LEVEL_TITLES: Record<string, string> = {
  inicio: 'Fundamentos',
  intermedio: 'Profundización',
  avanzado: 'Frontera',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function blockTemplate(block: string, section: PlannedSection): string {
  switch (block) {
    case 'aeterna-exercise':
      return [
        '```aeterna-exercise',
        `TITLE: Pregunta de reto: ${section.titulo}`,
        'HINT: Pista opcional para orientar sin resolver el problema.',
        'XP: 50',
        `Escribe aquí la pregunta de ${section.titulo} con las opciones o respuesta esperada.`,
        'SOLUTION: Escribe aquí la solución paso a paso que se mostrará al comprobar.',
        '```',
      ].join('\n');
    case 'aeterna-decision':
      return [
        '```aeterna-decision',
        'Badge: Decisión',
        `Título: Tu decisión: ${section.titulo}`,
        'Pregunta: ¿Cuál es la respuesta correcta?',
        'Nivel: xxx',
        'XP: 30',
        'Botón: Comprobar',
        'Respuesta: Escribe aquí la explicación que se mostrará al comprobar.',
        '```',
      ].join('\n');
    case 'aeterna-formula':
      return [
        '```aeterna-formula',
        `title="${section.titulo}"`,
        'formula="$$\\text{escribe la fórmula aquí}$$"',
        'variables={[{"symbol":"x","name":"Variable","unit":"unidades"}]}',
        'note="Explica qué significa cada variable."',
        '```',
      ].join('\n');
    case 'prediction-box':
      return [
        '```prediction-box',
        'TITLE: Predice antes de comprobar',
        'QUESTION: ¿Qué crees que ocurrirá?',
        'XP: 30',
        'OPTION_CORRECT: Opción correcta | Retroalimentación correcta',
        'OPTION_WRONG: Opción incorrecta | Retroalimentación incorrecta',
        'EXPLANATION: Explicación científica de por qué ocurre así.',
        '```',
      ].join('\n');
    case 'parameter-lab':
      return [
        '```parameter-lab',
        `TITLE: Laboratorio: ${section.titulo}`,
        `DESC: Manipula las variables para explorar ${section.titulo}.`,
        'OUTPUT_LABEL: Resultado',
        'OUTPUT_UNIT: unidades',
        'QUESTION: Pregunta de reflexión sobre las variables.',
        'ANSWER: Conclusión esperada al manipular los parámetros.',
        'XP: 40',
        'PARAM: x | Variable X | unidad | 0 | 10 | 1 | 5',
        'PARAM: y | Variable Y | unidad | 0 | 10 | 1 | 5',
        '```',
      ].join('\n');
    case 'graph-lab':
      return [
        '```graph-lab',
        `TITLE: Explora la gráfica: ${section.titulo}`,
        'DESC: Interpreta la relación entre las magnitudes representadas.',
        'X_LABEL: Eje X',
        'Y_LABEL: Eje Y',
        'QUESTION: ¿Qué relación muestra la gráfica?',
        'XP: 40',
        'POINT: 0 | 0 | Inicio',
        'POINT: 5 | 5 | Punto medio',
        'POINT: 10 | 10 | Final',
        'OPTION_CORRECT: Relación correcta | Explicación',
        'OPTION_WRONG: Relación incorrecta | Explicación',
        '```',
      ].join('\n');
    case 'error-hunter':
      return [
        '```error-hunter',
        `TITLE: Caza el error: ${section.titulo}`,
        'CONTEXT: Presenta el razonamiento erróneo del estudiante.',
        'XP: 40',
        'STEP_CORRECT: Paso correcto 1 | Por qué es correcto',
        'STEP_CORRECT: Paso correcto 2 | Por qué es correcto',
        'STEP_CORRECT: Paso correcto 3 | Por qué es correcto',
        '```',
      ].join('\n');
    case 'model-builder':
      return [
        '```model-builder',
        `TITLE: Construye el modelo: ${section.titulo}`,
        `PROBLEM: Plantea el problema a modelizar sobre ${section.titulo}.`,
        'XP: 50',
        'VAR_RELEVANT: Variable relevante | Por qué importa',
        'VAR_RELEVANT: Variable relevante | Por qué importa',
        'VAR_IRRELEVANT: Variable irrelevante | Por qué se descarta',
        '```',
      ].join('\n');
    case 'concept-map':
      return [
        '```concept-map',
        `TITLE: Mapa conceptual: ${section.titulo}`,
        'DESC: Conecta los conceptos fundamentales del tema.',
        'XP: 30',
        'NODE: Concepto A | Definición breve',
        'NODE: Concepto B | Definición breve',
        'NODE: Concepto C | Definición breve',
        '```',
      ].join('\n');
    case 'argument-builder':
      return [
        '```argument-builder',
        `TITLE: Construye el argumento: ${section.titulo}`,
        `QUESTION: Afirmación a defender sobre ${section.titulo}.`,
        'XP: 50',
        'PREMISE: Premisa 1',
        'PREMISE: Premisa 2',
        'CONCLUSION: Conclusión que se desprende de las premisas.',
        '```',
      ].join('\n');
    case 'causal-map':
      return [
        '```causal-map',
        `TITLE: Mapa causal: ${section.titulo}`,
        'DESC: Establece las cadenas de causa y efecto.',
        'XP: 40',
        'CAUSE: Causa 1',
        'EFFECT: Efecto 1',
        'LINK: Causa 1 | Efecto 1 | Describe el mecanismo',
        '```',
      ].join('\n');
    case 'evidence-matcher':
      return [
        '```evidence-matcher',
        `TITLE: Empareja evidencia: ${section.titulo}`,
        'DESC: Relaciona cada afirmación con la evidencia que la respalda.',
        'XP: 40',
        'CLAIM: Afirmación 1',
        'EVIDENCE: Evidencia que la respalda',
        '```',
      ].join('\n');
    case 'counterexample':
      return [
        '```counterexample',
        `TITLE: Busca el contraejemplo: ${section.titulo}`,
        `CLAIM: Afirmación general que se quiere desafiar sobre ${section.titulo}.`,
        'XP: 50',
        'CHALLENGE: Caso límite que invalida la afirmación.',
        '```',
      ].join('\n');
    case 'argument-evaluation':
      return [
        '```argument-evaluation',
        `TITLE: Evalúa el argumento: ${section.titulo}`,
        `TEXT: Argumento con fallos lógicos sobre ${section.titulo}.`,
        'XP: 50',
        'CRITERIA: Criterio de solidez 1',
        'CRITERIA: Criterio de solidez 2',
        '```',
      ].join('\n');
    case 'sequence-builder':
      return [
        '```sequence-builder',
        `TITLE: Ordena los pasos: ${section.titulo}`,
        `DESC: Reconstruye la secuencia del proceso de ${section.titulo}.`,
        'XP: 40',
        'STEP: Paso 1 | Descripción',
        'STEP: Paso 2 | Descripción',
        'STEP: Paso 3 | Descripción',
        'STEP: Paso 4 | Descripción',
        '```',
      ].join('\n');
    case 'aeterna-flowchart':
    case 'flowchart':
      return [
        '```aeterna-flowchart',
        `title="Flujo del proceso: ${section.titulo}"`,
        'steps=[{label="Paso 1"},{label="Paso 2"},{label="Paso 3"}]',
        '```',
      ].join('\n');
    case 'pedagogical-key-insight':
      return [
        '<PedagogicalContentBlock type="key-insight">',
        `**Idea clave de ${section.titulo}:** Resume la esencia del concepto en una frase memorable.`,
        '</PedagogicalContentBlock>',
      ].join('\n');
    case 'pedagogical-misconception':
      return [
        '<PedagogicalContentBlock type="misconception">',
        `**Error común sobre ${section.titulo}:** Describe la creencia errónea y por qué es incorrecta.`,
        '</PedagogicalContentBlock>',
      ].join('\n');
    case 'connect':
      return [
        `<Connect title="Conecta con el tema" sourceConcept="${section.titulo}" targetConcept="Otra rama">`,
        'Describe cómo este concepto se relaciona con otros temas o disciplinas.',
        '</Connect>',
      ].join('\n');
    case 'transfer':
      return [
        '<Transfer targetDomain="Nuevo contexto" title="Transfiere">',
        'Plantea una situación inédita donde aplicar lo aprendido.',
        '</Transfer>',
      ].join('\n');
    case 'hidden-assumption':
      return [
        '<HiddenAssumption assumption="Supuesto implícito a examinar">',
        'Explica qué asume este razonamiento y qué pasaría si el supuesto no se cumpliera.',
        '</HiddenAssumption>',
      ].join('\n');
    default:
      return '';
  }
}

function imagePlaceholder(section: PlannedSection): string {
  return `**[IMAGEN SUGERIDA: Representación visual de "${section.titulo}". Añade una imagen con pie de foto explicativo que refuerce el concepto.]**`;
}

function sectionContent(section: PlannedSection, layerTitle: string, index: number): string {
  const lines: string[] = [];
  lines.push(`#### ${section.titulo}`);
  lines.push('');
  lines.push(
    `[${layerTitle}] Desarrolla aquí el contenido de "${section.titulo}". ` +
      `Cubre las competencias: ${section.competencias.join(', ')}.`
  );
  lines.push('');
  lines.push(`Comienza con la idea central en palabras sencillas, añade un ejemplo cotidiano y, si aplica, una tabla o fórmula.`);
  lines.push('');
  lines.push(`---`);
  lines.push('');

  lines.push(imagePlaceholder(section));
  lines.push('');

  for (const block of section.bloques) {
    const tpl = blockTemplate(block, section);
    if (tpl) {
      lines.push(tpl);
      lines.push('');
    }
  }

  lines.push('');

  const acciones: string[] = [];
  if (index > 0) acciones.push('BotonSimplificar: Explica de nuevo con un ejemplo más sencillo');
  if (index < 2) acciones.push('BotonProfundizar: Profundiza un poco más en este tema');
  acciones.push('BotonEjemplos: Muéstrame otro ejemplo resuelto');
  acciones.push('BotonConexiones: ¿Con qué otros temas se relaciona?');
  lines.push(`<!-- ACCIONES: ${acciones.join(' | ')} -->`);
  lines.push('');

  return lines.join('\n');
}

export function buildOutline(curriculum: BranchCurriculum, slug: string): ArticleOutline {
  const article = curriculum.articles.find(a => a.slug === slug);
  if (!article) {
    throw new Error(`Artículo "${slug}" no está en el curriculum de ${curriculum.branchName}`);
  }

  const profile = loadLearningProfile(curriculum.profileId || 'bachillerato');
  const level = curriculum.levels.find(l => l.nivel === article.nivel);

  const secciones: ArticleOutline['secciones'] = [];
  const layerOrder: Array<'inicio' | 'intermedio' | 'avanzado'> = ['inicio', 'intermedio', 'avanzado'];

  for (const layerId of layerOrder) {
    const layerPlan = article.capas?.[layerId];
    if (!layerPlan || !layerPlan.sections || layerPlan.sections.length === 0) continue;

    const articleLevel = LAYER_TO_ARTICLE_LEVEL[layerId];
    const layerTitle = profile.layers?.[layerId]?.title || LEVEL_TITLES[layerId];

    layerPlan.sections.forEach((section, idx) => {
      const existing = secciones.find(s => s.id === section.id);
      const content = sectionContent(section, layerTitle, idx);
      if (existing) {
        existing.niveles[articleLevel] = content;
      } else {
        secciones.push({
          id: section.id,
          titulo: section.titulo,
          niveles: { [articleLevel]: content },
          acciones: [],
        });
      }
    });
  }

  const subcategoryDir = curriculum.branchId === 'fisica' ? 'fisica' : curriculum.branchId;

  const metadata: ArticleOutline['metadata'] = {
    title: article.title,
    description: `Guía Aeterna sobre ${article.title.toLowerCase()}, nivel ${article.nivel} del mapa curricular de ${curriculum.branchName}.`,
    slug: article.slug,
    author: 'Aeterna',
    category: 'ciencias_naturales',
    subcategory: subcategoryDir,
    tags: article.tags,
    nivel: article.nivel,
    orden: article.orden,
    nivel_titulo: level?.titulo || `Nivel ${article.nivel}`,
    tipo: article.tipo,
  };

  const cuaderno: ArticleOutline['cuaderno'] = {
    principiante: [
      {
        titulo: `Problema base de ${article.title}`,
        enunciado: `Enunciado del ejercicio de fundamentos sobre ${article.title.toLowerCase()}. Incluye datos y la pregunta concreta.`,
        solucion: 'Solución completa paso a paso con la respuesta final.',
        pasos: ['Paso 1: identifica los datos', 'Paso 2: aplica la fórmula o razonamiento', 'Paso 3: obtén y verifica el resultado'],
        xp: 30,
        pistas: ['Pista 1: orienta sobre el método a seguir.', 'Pista 2: da una pista sobre la fórmula o principio clave.'],
      },
      {
        titulo: `Problema de práctica de ${article.title}`,
        enunciado: `Enunciado de un segundo ejercicio de fundamentos con distinto enfoque.`,
        solucion: 'Solución detallada con el resultado.',
        pasos: ['Paso 1: plantea el problema', 'Paso 2: resuelve', 'Paso 3: interpreta el resultado'],
        xp: 35,
        opciones: [
          { label: 'Opción correcta', correcta: true },
          { label: 'Opción incorrecta 1', correcta: false },
          { label: 'Opción incorrecta 2', correcta: false },
        ],
      },
    ],
    intermedio: [
      {
        titulo: `Problema intermedio de ${article.title}`,
        enunciado: `Enunciado de un ejercicio de profundización que exija aplicar varios conceptos de ${article.title.toLowerCase()}.`,
        solucion: 'Solución completa con el desarrollo matemático.',
        pasos: ['Paso 1: analiza las variables', 'Paso 2: plantea las ecuaciones', 'Paso 3: resuelve y comprueba'],
        xp: 45,
        pistas: ['Pista 1: identifica qué ley o principio aplica.', 'Pista 2: sugiere la ecuación a usar.'],
      },
      {
        titulo: `Problema intermedio aplicado de ${article.title}`,
        enunciado: `Enunciado de un ejercicio aplicado a una situación real o técnica.`,
        solucion: 'Solución con interpretación del resultado en el contexto.',
        pasos: ['Paso 1: contexto del problema', 'Paso 2: modelado', 'Paso 3: resolución'],
        xp: 50,
        opciones: [
          { label: 'Opción correcta', correcta: true },
          { label: 'Opción incorrecta', correcta: false },
        ],
      },
    ],
    avanzado: [
      {
        titulo: `Problema avanzado de ${article.title}`,
        enunciado: `Enunciado de un ejercicio de frontera que requiera razonamiento no rutinario sobre ${article.title.toLowerCase()}.`,
        solucion: 'Solución rigurosa con justificación de cada paso.',
        pasos: ['Paso 1: análisis conceptual profundo', 'Paso 2: desarrollo formal', 'Paso 3: discusión de límites y casos'],
        xp: 60,
        pistas: ['Pista 1: piensa en casos límite.', 'Pista 2: considera el principio de conservación o simetría aplicable.'],
      },
      {
        titulo: `Problema de integración de ${article.title}`,
        enunciado: `Enunciado que conecte ${article.title.toLowerCase()} con otras ramas o problemas multidisciplinares.`,
        solucion: 'Solución que muestre la conexión interdisciplinar.',
        pasos: ['Paso 1: conecta con otras áreas', 'Paso 2: formula el modelo integrado', 'Paso 3: resuelve y sintetiza'],
        xp: 70,
        opciones: [
          { label: 'Opción correcta', correcta: true },
          { label: 'Opción incorrecta', correcta: false },
        ],
      },
    ],
  };

  return {
    metadata,
    introduccion: `# ${article.title}\n\nBienvenido/a a la guía de ${article.title.toLowerCase()}. ` +
      `Forma parte del nivel ${article.nivel} (${level?.titulo || 'nivel principal'}) de ${curriculum.branchName}. ` +
      `Sigue las secciones por capas para dominar el tema de forma progresiva.`,
    secciones,
    conclusion: '## Conclusión\n\nResume aquí las ideas clave y conecta con la siguiente parada recomendada.',
    cuaderno,
  };
}

export function outlineToJson(outline: ArticleOutline): string {
  return JSON.stringify(outline, null, 2);
}

export { LAYER_TO_ARTICLE_LEVEL, LEVEL_TITLES };
