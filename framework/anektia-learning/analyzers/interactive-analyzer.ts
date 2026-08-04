import { ExtractedInteractive, InteractiveValueResult } from '../types';

const ALL_INTERACTIVE_TYPES = [
  'aeterna-exercise', 'aeterna-decision', 'aeterna-formula', 'aeterna-flowchart', 'flowchart',
  'prediction-box', 'parameter-lab', 'graph-lab', 'error-hunter', 'model-builder',
  'concept-map', 'argument-builder', 'causal-map', 'evidence-matcher', 'counterexample',
  'argument-evaluation', 'sequence-builder'
];

export function analyzeInteractives(rawBody: string): {
  interactives: ExtractedInteractive[];
  totalScore: number;
  recommendation: string;
  typesDetected: string[];
  typeDiversityCount: number;
} {
  const interactives: ExtractedInteractive[] = [];
  const typesDetectedSet = new Set<string>();
  const lines = rawBody.split('\n');

  // 1. Fenced code blocks (modern format): ```aeterna-exercise, ```prediction-box, etc.
  const fencedRegex = /```(aeterna-exercise|aeterna-decision|aeterna-formula|aeterna-flowchart|flowchart|prediction-box|parameter-lab|graph-lab|error-hunter|model-builder|concept-map|argument-builder|causal-map|evidence-matcher|counterexample|argument-evaluation|sequence-builder)\b/g;
  let match: RegExpExecArray | null;

  while ((match = fencedRegex.exec(rawBody)) !== null) {
    const compType = match[1];
    const matchIndex = match.index;
    const lineNumber = rawBody.substring(0, matchIndex).split('\n').length;

    const evalResult = evaluateInteractiveCriteria(compType, rawBody);
    interactives.push({
      type: compType,
      name: compType,
      line: lineNumber,
      interactiveValue: evalResult
    });
    typesDetectedSet.add(compType);
  }

  // 2. Legacy JSX components: <AnektiaDecisionBox>, <Interactive*>, etc.
  const interactiveRegex = /<(AnektiaDecisionBox|Interactive[A-Za-z0-9_]+|NexusNode3D|ProgresionArticulo|Simulacion[A-Za-z0-9_]+)/g;

  while ((match = interactiveRegex.exec(rawBody)) !== null) {
    const compType = match[1];
    const matchIndex = match.index;
    const lineNumber = rawBody.substring(0, matchIndex).split('\n').length;

    const evalResult = evaluateInteractiveCriteria(compType, rawBody);
    interactives.push({
      type: compType,
      name: compType,
      line: lineNumber,
      interactiveValue: evalResult
    });
    typesDetectedSet.add(compType);
  }

  // Calculate highest / aggregate Interactive Value Score (0..5)
  let maxScore = 0;
  interactives.forEach(item => {
    if (item.interactiveValue.score > maxScore) {
      maxScore = item.interactiveValue.score;
    }
  });

  const recommendationMap: Record<number, string> = {
    0: '0/5 - No recomendado (el contenido no requiere interactivo o falta desarrollo)',
    1: '1/5 - No recomendado (interactivo trivial)',
    2: '2/5 - Normalmente innecesario (aporta poco valor pedagógico sobre el texto)',
    3: '3/5 - Opcional (aporta dinamismo pero no es indispensable)',
    4: '4/5 - Recomendado (mejora sensiblemente la comprensión del modelo)',
    5: '5/5 - Altamente recomendado (visualiza conceptos complejos con feedback inmediato y experimentación)'
  };

  const recommendation = recommendationMap[maxScore] || recommendationMap[0];

  return {
    interactives,
    totalScore: maxScore,
    recommendation,
    typesDetected: Array.from(typesDetectedSet),
    typeDiversityCount: typesDetectedSet.size
  };
}

function evaluateInteractiveCriteria(compType: string, bodyText: string): InteractiveValueResult {
  const criteria = {
    manipulateVariables: false,
    observeDynamicChanges: false,
    experiment: false,
    immediateFeedback: false,
    visualizeHardConcept: false
  };

  if (compType === 'AnektiaDecisionBox' || compType === 'aeterna-decision') {
    criteria.manipulateVariables = true;   // Select options
    criteria.immediateFeedback = true;     // Shows correct/incorrect & XP
    criteria.experiment = true;            // Retries permitted
    criteria.visualizeHardConcept = true;  // Tests concept understanding
    criteria.observeDynamicChanges = true; // State highlights selection
  } else if (compType === 'aeterna-exercise') {
    criteria.manipulateVariables = true;
    criteria.immediateFeedback = true;
    criteria.visualizeHardConcept = true;
    criteria.observeDynamicChanges = true;
    criteria.experiment = false;
  } else if (compType === 'aeterna-formula') {
    criteria.visualizeHardConcept = true;
    criteria.observeDynamicChanges = true;
    criteria.immediateFeedback = true;
    criteria.manipulateVariables = false;
    criteria.experiment = false;
  } else if (compType === 'prediction-box') {
    criteria.manipulateVariables = true;
    criteria.immediateFeedback = true;
    criteria.visualizeHardConcept = true;
    criteria.observeDynamicChanges = true;
    criteria.experiment = true;
  } else if (compType === 'parameter-lab' || compType === 'aeterna-flowchart' || compType === 'flowchart') {
    criteria.manipulateVariables = true;
    criteria.observeDynamicChanges = true;
    criteria.experiment = true;
    criteria.immediateFeedback = true;
    criteria.visualizeHardConcept = true;
  } else if (compType === 'graph-lab') {
    criteria.observeDynamicChanges = true;
    criteria.visualizeHardConcept = true;
    criteria.immediateFeedback = true;
    criteria.manipulateVariables = false;
    criteria.experiment = false;
  } else if (compType === 'error-hunter' || compType === 'evidence-matcher' || compType === 'counterexample' || compType === 'argument-evaluation') {
    criteria.manipulateVariables = true;
    criteria.immediateFeedback = true;
    criteria.visualizeHardConcept = true;
    criteria.observeDynamicChanges = true;
    criteria.experiment = false;
  } else if (compType === 'model-builder' || compType === 'concept-map' || compType === 'argument-builder' || compType === 'causal-map' || compType === 'sequence-builder') {
    criteria.manipulateVariables = true;
    criteria.visualizeHardConcept = true;
    criteria.observeDynamicChanges = true;
    criteria.experiment = true;
    criteria.immediateFeedback = false;
  } else if (compType.startsWith('Interactive') || compType.startsWith('Simulacion')) {
    criteria.manipulateVariables = true;
    criteria.observeDynamicChanges = true;
    criteria.experiment = true;
    criteria.immediateFeedback = true;
    criteria.visualizeHardConcept = true;
  } else if (compType === 'ProgresionArticulo') {
    criteria.observeDynamicChanges = true;
    criteria.visualizeHardConcept = true;
    criteria.immediateFeedback = false;
    criteria.manipulateVariables = false;
    criteria.experiment = false;
  } else if (compType === 'NexusNode3D') {
    criteria.manipulateVariables = true;
    criteria.observeDynamicChanges = true;
    criteria.visualizeHardConcept = true;
    criteria.experiment = true;
    criteria.immediateFeedback = false;
  }

  let score = 0;
  if (criteria.manipulateVariables) score++;
  if (criteria.observeDynamicChanges) score++;
  if (criteria.experiment) score++;
  if (criteria.immediateFeedback) score++;
  if (criteria.visualizeHardConcept) score++;

  const interpretationMap: Record<number, InteractiveValueResult['interpretation']> = {
    0: 'no recomendado',
    1: 'no recomendado',
    2: 'normalmente innecesario',
    3: 'opcional',
    4: 'recomendado',
    5: 'altamente recomendado'
  };

  return {
    score,
    criteria,
    interpretation: interpretationMap[score] || 'no recomendado'
  };
}
