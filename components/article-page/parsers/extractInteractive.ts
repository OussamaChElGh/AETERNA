const INTERACTIVE_LANGS = 'prediction-box|parameter-lab|graph-lab|error-hunter|model-builder|concept-map|argument-builder|causal-map|evidence-matcher|counterexample|argument-evaluation|sequence-builder|aeterna-exercise|aeterna-ejercicio|aeterna-decision|aeterna-decision-box|aeterna-flowchart|flowchart';
const INTERACTIVE_TAGS = 'PredictionBox|ParameterLab|GraphLab|ErrorHunter|ModelBuilder|ConceptMap|ArgumentBuilder|CausalMap|EvidenceMatcher|Counterexample|ArgumentEvaluation|SequenceBuilder|AeternaDecisionBox|AeternaExercise|AeternaFlowchart|Flowchart';

export function extractInteractiveFromContent(content: string): {
  hasInteractive: boolean;
  textContent: string;
  interactiveBlocks: string[];
} {
  if (!content) {
    return { hasInteractive: false, textContent: "", interactiveBlocks: [] };
  }

  const codeBlockRegex = new RegExp(`\`\`\`(${INTERACTIVE_LANGS})[\\s\\S]*?\`\`\``, 'gi');
  const jsxTagRegex = new RegExp(`<(${INTERACTIVE_TAGS})\\s*[\\s\\S]*?\\/>`, 'gi');

  const matches: { index: number; block: string }[] = [];

  for (const re of [codeBlockRegex, jsxTagRegex]) {
    let match: RegExpExecArray | null;
    while ((match = re.exec(content)) !== null) {
      matches.push({ index: match.index, block: match[0] });
    }
  }

  if (matches.length === 0) {
    return { hasInteractive: false, textContent: content, interactiveBlocks: [] };
  }

  matches.sort((a, b) => a.index - b.index);

  const interactiveBlocks = matches.map(m => m.block);
  let textContent = content;
  for (let i = matches.length - 1; i >= 0; i--) {
    textContent = textContent.substring(0, matches[i].index) + textContent.substring(matches[i].index + matches[i].block.length);
  }

  return {
    hasInteractive: true,
    textContent: textContent.trim(),
    interactiveBlocks
  };
}

export function extractImageFromContent(content: string): {
  hasImage: boolean;
  textContent: string;
  imageContent: string;
} {
  if (!content) {
    return { hasImage: false, textContent: "", imageContent: "" };
  }

  const lineRegex = /(^|\n)\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*(?=\n|$)/g;
  const match = lineRegex.exec(content);

  if (match) {
    const imageContent = match[0].trim();
    const textContent = content.replace(match[0], "").trim();
    return { hasImage: true, textContent, imageContent };
  }

  return {
    hasImage: false,
    textContent: content,
    imageContent: ""
  };
}
