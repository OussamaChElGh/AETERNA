import { CognitiveLevel, ExtractedExercise } from '../types';
import { LayerExtraction } from './layer-analyzer';

export function detectCognitiveLevels(text: string): CognitiveLevel[] {
  const levels: CognitiveLevel[] = [];
  const lower = text.toLowerCase();

  if (lower.includes('estimación') || lower.includes('estime') || lower.includes('fermi') || lower.includes('orden de magnitud')) {
    levels.push('reasoning_estimate');
  }
  if (lower.includes('modelo') || lower.includes('vaca esférica') || lower.includes('hipótesis') || lower.includes('simplificar')) {
    levels.push('reasoning_model');
  }
  if (lower.includes('justifique') || lower.includes('por qué') || lower.includes('explique el motivo') || lower.includes('razone')) {
    levels.push('reasoning_justify');
  }
  if (lower.includes('error') || lower.includes('precisión vs exactitud') || lower.includes('sesgo') || lower.includes('incertidumbre')) {
    levels.push('reasoning_detect_errors');
  }
  if (lower.includes('diferencia entre') || lower.includes('compare') || lower.includes('distinga') || lower.includes('versus')) {
    levels.push('conceptual_compare');
  }
  if (lower.includes('qué es') || lower.includes('defina') || lower.includes('concepto')) {
    levels.push('conceptual_explain');
  }
  if (lower.includes('calcule') || lower.includes('convierta') || lower.includes('resuelva') || lower.includes('sustituya')) {
    levels.push('procedural_apply');
  }
  if (lower.includes('contexto cotidiano') || lower.includes('vida real') || lower.includes('ejemplo real') || lower.includes('aplicación real')) {
    levels.push('transfer_new_context');
  }

  if (levels.length === 0) {
    levels.push('conceptual_explain');
  }

  return Array.from(new Set(levels));
}

export function analyzeExercises(
  rawBody: string,
  layers: LayerExtraction[]
): ExtractedExercise[] {
  const exercises: ExtractedExercise[] = [];

  function getLayerForLine(lineNum: number): 'inicio' | 'intermedio' | 'avanzado' | 'general' {
    for (const layer of layers) {
      if (layer.found && lineNum >= layer.startLine && lineNum <= layer.endLine) {
        return layer.id;
      }
    }
    return 'general';
  }

  // 1. Extract ```aeterna-exercise code blocks
  const anektiaExerciseRegex = /```aeterna-exercise([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = anektiaExerciseRegex.exec(rawBody)) !== null) {
    const blockContent = match[1] || '';
    const matchIndex = match.index;
    const lineNumber = rawBody.substring(0, matchIndex).split('\n').length;
    const layerId = getLayerForLine(lineNumber);

    let title = 'Ejercicio de Aplicación';
    let hasHint = false;
    let hasXP = false;
    let xpValue = 50;
    let hasSolution = false;
    let questionText = '';

    const blockLines = blockContent.split('\n');
    blockLines.forEach(l => {
      const trimmed = l.trim();
      if (trimmed.startsWith('TITLE:')) {
        title = trimmed.replace('TITLE:', '').trim();
      } else if (trimmed.startsWith('HINT:')) {
        hasHint = true;
      } else if (trimmed.startsWith('XP:')) {
        hasXP = true;
        xpValue = parseInt(trimmed.replace('XP:', '').trim(), 10) || 50;
      } else if (trimmed.startsWith('SOLUTION:')) {
        hasSolution = true;
      } else if (trimmed && !trimmed.startsWith('TITLE:') && !trimmed.startsWith('HINT:') && !trimmed.startsWith('XP:') && !trimmed.startsWith('SOLUTION:')) {
        questionText += trimmed + ' ';
      }
    });

    const fullText = `${title} ${questionText}`;
    const detectedCognitiveLevels = detectCognitiveLevels(fullText);
    hasSolution = hasSolution || fullText.toLowerCase().includes('solución') || fullText.toLowerCase().includes('resultado');

    exercises.push({
      id: `ex_code_${exercises.length + 1}`,
      type: 'AnektiaExercise',
      layerId,
      title,
      hasHint,
      hasXP,
      xpValue,
      hasSolution,
      questionText: questionText.trim(),
      detectedCognitiveLevels
    });
  }

  // 2. Extract ```aeterna-decision code blocks
  const anektiaDecisionRegex = /```aeterna-decision([\s\S]*?)```/g;
  while ((match = anektiaDecisionRegex.exec(rawBody)) !== null) {
    const blockContent = match[1] || '';
    const matchIndex = match.index;
    const lineNumber = rawBody.substring(0, matchIndex).split('\n').length;
    const layerId = getLayerForLine(lineNumber);

    let title = 'Decisión';
    let questionText = '';
    let hasSolution = false;
    let xpValue = 30;
    const blockLines = blockContent.split('\n');
    blockLines.forEach(l => {
      const trimmed = l.trim();
      if (trimmed.startsWith('Título:')) {
        title = trimmed.replace('Título:', '').trim();
      } else if (trimmed.startsWith('Pregunta:')) {
        questionText = trimmed.replace('Pregunta:', '').trim();
      } else if (trimmed.startsWith('XP:')) {
        xpValue = parseInt(trimmed.replace('XP:', '').trim(), 10) || 30;
      } else if (trimmed.startsWith('Respuesta:')) {
        hasSolution = true;
      }
    });

    const detectedCognitiveLevels = detectCognitiveLevels(`${title} ${questionText}`);

    exercises.push({
      id: `ex_decision_code_${exercises.length + 1}`,
      type: 'AnektiaDecisionBox',
      layerId,
      title,
      hasHint: false,
      hasXP: true,
      xpValue,
      hasSolution,
      questionText: questionText || title,
      detectedCognitiveLevels
    });
  }

  // 2.5 Extract other fenced interactive blocks (prediction-box, parameter-lab, etc.)
  const fencedInteractiveRegex = /```(prediction-box|parameter-lab|graph-lab|error-hunter|model-builder|concept-map|argument-builder|causal-map|evidence-matcher|counterexample|argument-evaluation|sequence-builder|aeterna-flowchart|flowchart|aeterna-formula)([\s\S]*?)```/g;
  while ((match = fencedInteractiveRegex.exec(rawBody)) !== null) {
    const compType = match[1];
    const blockContent = match[2] || '';
    const matchIndex = match.index;
    const lineNumber = rawBody.substring(0, matchIndex).split('\n').length;
    const layerId = getLayerForLine(lineNumber);

    const titleMatch = blockContent.match(/TITLE:\s*(.+)/i) || blockContent.match(/title=["']([^"']+)["']/i);
    const title = titleMatch ? titleMatch[1].trim() : `${compType} Activo`;

    let cognitiveLevels: CognitiveLevel[] = [];
    if (compType === 'prediction-box') cognitiveLevels = ['reasoning_predict', 'conceptual_explain'];
    else if (compType === 'parameter-lab') cognitiveLevels = ['reasoning_experiment', 'reasoning_predict', 'procedural_apply'];
    else if (compType === 'graph-lab') cognitiveLevels = ['reasoning_interpret_graph', 'conceptual_compare'];
    else if (compType === 'error-hunter') cognitiveLevels = ['reasoning_detect_errors', 'reasoning_justify'];
    else if (compType === 'model-builder') cognitiveLevels = ['reasoning_model', 'reasoning_justify'];
    else if (compType === 'concept-map') cognitiveLevels = ['conceptual_compare', 'reasoning_model'];
    else if (compType === 'sequence-builder') cognitiveLevels = ['procedural_apply', 'reasoning_model'];
    else if (compType === 'counterexample') cognitiveLevels = ['transfer_new_context', 'reasoning_detect_errors'];
    else if (compType === 'evidence-matcher') cognitiveLevels = ['reasoning_justify', 'conceptual_compare'];
    else if (compType === 'argument-evaluation') cognitiveLevels = ['reasoning_detect_errors', 'reasoning_justify'];
    else if (compType === 'aeterna-formula') cognitiveLevels = ['conceptual_explain', 'procedural_apply'];
    else cognitiveLevels = ['reasoning_justify', 'conceptual_explain'];

    const hasSolution = /SOLUTION:|Respuesta:|STEP_CORRECT:|ANSWER:|OPTION_CORRECT:|EXPLANATION:/i.test(blockContent);

    exercises.push({
      id: `ex_fenced_${compType.toLowerCase()}_${exercises.length + 1}`,
      type: compType === 'aeterna-formula' ? 'AnektiaFormula' : compType === 'prediction-box' ? 'PredictionBox' : compType === 'parameter-lab' ? 'ParameterLab' : compType === 'graph-lab' ? 'GraphLab' : compType === 'error-hunter' ? 'ErrorHunter' : compType === 'model-builder' ? 'ModelBuilder' : compType === 'concept-map' ? 'ConceptMap' : compType === 'sequence-builder' ? 'SequenceBuilder' : compType,
      layerId,
      title,
      hasHint: false,
      hasXP: true,
      xpValue: 40,
      hasSolution,
      questionText: title,
      detectedCognitiveLevels: Array.from(new Set(cognitiveLevels))
    });
  }

  // 3. Extract <AnektiaDecisionBox ... /> components
  const decisionBoxRegex = /<AnektiaDecisionBox[\s\S]*?\/>/g;
  while ((match = decisionBoxRegex.exec(rawBody)) !== null) {
    const boxContent = match[0] || '';
    const matchIndex = match.index;
    const lineNumber = rawBody.substring(0, matchIndex).split('\n').length;
    const layerId = getLayerForLine(lineNumber);

    const questionMatch = boxContent.match(/question=["']([^"']+)["']/);
    const optionsMatch = boxContent.match(/options=\{\[([\s\S]*?)\]\}/);
    const correctIndexMatch = boxContent.match(/correctIndex=\{?(\d+)\}?/);

    const questionText = questionMatch ? questionMatch[1] : 'Pregunta de Decisión';
    let optionsCount = 0;
    if (optionsMatch) {
      const optionsStr = optionsMatch[1];
      const optionItems = optionsStr.split('{').length - 1;
      optionsCount = Math.max(2, optionItems);
    }

    const detectedCognitiveLevels = detectCognitiveLevels(questionText);
    const hasSolution = correctIndexMatch !== null;

    exercises.push({
      id: `ex_decision_${exercises.length + 1}`,
      type: 'AnektiaDecisionBox',
      layerId,
      title: questionText,
      hasHint: false,
      hasXP: true,
      xpValue: 30,
      hasSolution,
      questionText,
      optionsCount,
      detectedCognitiveLevels
    });
  }

  // 3. Extract FASE 1 & FASE 2 interactive components
  const newComponentsRegex = /<(PredictionBox|ParameterLab|GraphLab|ErrorHunter|ModelBuilder|ConceptMap|ArgumentBuilder|CausalMap|EvidenceMatcher|Counterexample|ArgumentEvaluation|SequenceBuilder)\b[\s\S]*?(\/>|>[\s\S]*?<\/\1>)/g;
  while ((match = newComponentsRegex.exec(rawBody)) !== null) {
    const compType = match[1];
    const compContent = match[0] || '';
    const matchIndex = match.index;
    const lineNumber = rawBody.substring(0, matchIndex).split('\n').length;
    const layerId = getLayerForLine(lineNumber);

    const titleMatch = compContent.match(/title=["']([^"']+)["']/);
    const questionMatch = compContent.match(/(question|description|problemDescription|context|claimOrConclusion|generalStatement|argumentText)=["']([^"']+)["']/);
    const titleText = titleMatch ? titleMatch[1] : `${compType} Activo`;
    const qText = questionMatch ? questionMatch[2] : titleText;

    let cognitiveLevels: CognitiveLevel[] = [];
    if (compType === 'PredictionBox') cognitiveLevels = ['reasoning_predict', 'conceptual_explain', 'reasoning_justify'];
    else if (compType === 'ParameterLab') cognitiveLevels = ['reasoning_experiment', 'reasoning_predict', 'procedural_apply'];
    else if (compType === 'GraphLab') cognitiveLevels = ['reasoning_interpret_graph', 'conceptual_compare', 'reasoning_justify'];
    else if (compType === 'ErrorHunter') cognitiveLevels = ['reasoning_detect_errors', 'reasoning_justify', 'conceptual_explain'];
    else if (compType === 'ModelBuilder') cognitiveLevels = ['reasoning_model', 'reasoning_justify', 'transfer_new_context'];
    else if (compType === 'ConceptMap') cognitiveLevels = ['conceptual_compare', 'reasoning_model', 'conceptual_explain'];
    else if (compType === 'ArgumentBuilder') cognitiveLevels = ['reasoning_justify', 'conceptual_explain', 'reasoning_model'];
    else if (compType === 'CausalMap') cognitiveLevels = ['reasoning_model', 'reasoning_justify', 'conceptual_explain'];
    else if (compType === 'EvidenceMatcher') cognitiveLevels = ['reasoning_justify', 'conceptual_compare', 'reasoning_detect_errors'];
    else if (compType === 'Counterexample') cognitiveLevels = ['transfer_new_context', 'reasoning_detect_errors', 'reasoning_justify'];
    else if (compType === 'ArgumentEvaluation') cognitiveLevels = ['reasoning_detect_errors', 'reasoning_justify', 'conceptual_explain'];
    else if (compType === 'SequenceBuilder') cognitiveLevels = ['procedural_apply', 'reasoning_model', 'conceptual_explain'];

    exercises.push({
      id: `ex_${compType.toLowerCase()}_${exercises.length + 1}`,
      type: compType,
      layerId,
      title: titleText,
      hasHint: true,
      hasXP: true,
      xpValue: 50,
      hasSolution: true,
      questionText: `${titleText} - ${qText}`,
      detectedCognitiveLevels: Array.from(new Set([...cognitiveLevels, ...detectCognitiveLevels(qText)]))
    });
  }

  // 3. Fallback: Check for standard practice problem headers/blocks
  const standardExerciseHeaderRegex = /^#{3,4}\s+(Ejercicio|Problema|Cuestión)\b/gim;
  while ((match = standardExerciseHeaderRegex.exec(rawBody)) !== null) {
    const matchIndex = match.index;
    const lineNumber = rawBody.substring(0, matchIndex).split('\n').length;
    const layerId = getLayerForLine(lineNumber);
    const headerLine = match[0];

    const alreadyExtracted = exercises.some(ex => ex.questionText.includes(headerLine));
    if (!alreadyExtracted) {
      const titleText = headerLine.replace(/^#{3,4}\s+/, '');
      exercises.push({
        id: `ex_standard_${exercises.length + 1}`,
        type: 'StandardCodeBlock',
        layerId,
        title: titleText,
        hasHint: false,
        hasXP: false,
        hasSolution: true,
        questionText: headerLine,
        detectedCognitiveLevels: detectCognitiveLevels(headerLine)
      });
    }
  }

  return exercises;
}
