export interface PrerequisiteAnalysisResult {
  declaredPrerequisites: string[];
  isValidFormat: boolean;
  warnings: string[];
}

export function analyzePrerequisites(prerequisites: string[], rawFrontmatter: Record<string, any>): PrerequisiteAnalysisResult {
  const warnings: string[] = [];
  let isValidFormat = true;

  if (!prerequisites || prerequisites.length === 0) {
    // If no prerequisites are declared, it's valid (standalone guide) unless high level (nivel >= 3)
    if (rawFrontmatter.nivel && rawFrontmatter.nivel >= 3) {
      warnings.push('El artículo es de Nivel 3 (Avanzado) pero no declara prerrequisitos en su frontmatter.');
    }
  } else {
    // Check if each prerequisite is non-empty string
    prerequisites.forEach(prereq => {
      if (typeof prereq !== 'string' || !prereq.trim()) {
        isValidFormat = false;
        warnings.push(`Prerrequisito mal formado: "${prereq}" no es una cadena válida.`);
      }
    });
  }

  return {
    declaredPrerequisites: prerequisites,
    isValidFormat,
    warnings
  };
}
