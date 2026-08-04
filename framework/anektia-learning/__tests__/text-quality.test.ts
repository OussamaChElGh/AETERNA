import { analyzeTextQuality } from '../analyzers/text-quality-analyzer';

let passed = 0;
let failed = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    passed++;
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${msg}`);
  }
}

console.log('\n=== TEXT QUALITY ANALYZER TESTS ===\n');

// 1. Detecta fenced blocks con markdown crudo
{
  const body = `## Tema\n\nTexto normal.\n\n\`\`\`\n## Heading crudo\n**negrita**\n| tabla | col |\n\`\`\`\n`;
  const r = analyzeTextQuality(body);
  assert(r.codeMarkdownIssues.some(i => i.kind === 'fenced_markdown'), '1. Detecta fenced block con markdown crudo');
  assert(r.codeMarkdownScore < 100, '1b. Score markdown-as-code < 100');
}

// 2. No marca bloques interactivos legítimos
{
  const body = `## Tema\n\n\`\`\`aeterna-exercise\nTITLE: Prueba\nHINT: pista\nXP: 30\nPregunta\nSOLUTION: solución\n\`\`\`\n`;
  const r = analyzeTextQuality(body);
  assert(r.codeMarkdownIssues.length === 0, '2. Bloque interactivo legítimo no se marca');
  assert(r.codeMarkdownScore === 100, '2b. Score markdown-as-code = 100');
}

// 3. No marca fórmulas LaTeX
{
  const body = `La entropía es $$ S = k_B \\ln \\Omega $$ y la energía interna.`;
  const r = analyzeTextQuality(body);
  assert(r.codeMarkdownIssues.length === 0, '3. LaTeX no se marca como markdown-as-code');
}

// 4. Detecta frases repetidas en prosa real
{
  const body = `La teoría más precisa de la historia de la ciencia describe tres fuerzas.\nLa teoría más precisa de la historia de la ciencia clasifica las partículas.`;
  const r = analyzeTextQuality(body);
  assert(r.repeatedPhrases.length >= 1, '4. Detecta frase repetida');
  assert(r.repetitionScore < 100, '4b. Score repetición < 100');
}

// 5. No confunde contenido de bloques duplicados por capas
{
  const body = `\`\`\`aeterna-decision\nBadge: X\nTítulo: Pregunta\nPregunta: ¿esto es física?\nNivel: principiante\nXP: 20\nBotón: Comprobar\nRespuesta: Respuesta: porque sí\n\`\`\`\n\n\`\`\`aeterna-decision\nBadge: X\nTítulo: Pregunta\nPregunta: ¿esto es física?\nNivel: principiante\nXP: 20\nBotón: Comprobar\nRespuesta: Respuesta: porque sí\n\`\`\``;
  const r = analyzeTextQuality(body);
  assert(r.repeatedPhrases.length === 0, '5. Contenido de bloques duplicados no cuenta como repetición');
}

// 6. Texto limpio puntúa 100
{
  const body = `La termodinámica estudia el calor y la energía. Cuatro leyes gobiernan el flujo térmico del universo entero.`;
  const r = analyzeTextQuality(body);
  assert(r.repeatedPhrases.length === 0, '6. Texto limpio sin repeticiones');
  assert(r.codeMarkdownIssues.length === 0, '6b. Texto limpio sin markdown-as-code');
}

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} tests.\n`);
if (failed > 0) process.exit(1);
