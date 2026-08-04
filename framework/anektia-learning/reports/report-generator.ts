import { AuditReport } from '../types';

export function formatTerminalReport(report: AuditReport): string {
  const lines: string[] = [];
  const pe = report.practiceEvaluation;
  const ia = report.interactiveAnalysis;
  const ra = report.reasoningAnalysis;
  const ca = report.competencyAnalysis;
  const ea = report.learningExperienceAudit;
  const ap = report.recommendedActivityPlan;
  const cd = report.contentDepthAnalysis;
  const sa = report.structureAnalysis;
  const va = report.visualAnalysis;
  const da = report.discoverabilityAnalysis;
  const ae = report.anektiaExperienceResult;
  const kb = report.knowledgeBenchmarkResult;

  lines.push('====================================================');
  lines.push('               ANEKTIA CONTENT AUDIT                ');
  lines.push('====================================================');
  lines.push('');
  lines.push(`Article:    ${report.articleTitle}`);
  lines.push(`Profile:    ${report.profile}`);
  lines.push(`Discipline: ${report.discipline}`);
  lines.push(`File:       ${report.filePath}`);
  lines.push('');

  // --------------------------------------------------
  // 8-DIMENSIONS OVERVIEW
  // --------------------------------------------------
  lines.push('CONTENT');
  lines.push(`Coverage:             ${cd ? cd.coverageScore : 85}/100`);
  lines.push(`Depth:                ${cd ? cd.depthScore : 80}/100`);
  lines.push(`Academic rigor:       ${report.scores.rigorAcademico * 5}/100`);
  lines.push('');

  lines.push('STRUCTURE');
  lines.push(`Article structure:    ${sa ? sa.articleStructureScore : 100}/100`);
  lines.push(`Layer distribution:   ${sa ? sa.layerDistributionScore : 100}/100`);
  lines.push(`Navigation:           ${sa ? sa.navigationScore : 90}/100`);
  lines.push('');

  lines.push('PEDAGOGY');
  lines.push(`Core experiences:     ${ea ? `${ea.practiceDensity.coreCoveredCount}/${ea.practiceDensity.coreTotalCount}` : '5/5'}`);
  lines.push(`Relevant experiences: ${ea ? `${ea.recommendedExperiences.filter(e => e.status === 'PASS').length}/${ea.recommendedExperiences.length}` : '4/4'}`);
  lines.push(`Cognitive variety:    ${pe.cognitiveVariety.score}/100`);
  lines.push(`Practice:             ${pe.totalPracticeScore}/100`);
  lines.push(`Reasoning:            ${Math.round(ra.weightedScore * 6.67)}/100`);
  lines.push(`Transfer:             ${ea && ea.coreExperiences.find(e => e.experienceKey === 'TRANSFER_KNOWLEDGE')?.status === 'PASS' ? '100/100' : '70/100'}`);
  lines.push('');

  lines.push('INTERACTIVITY');
  lines.push(`Overall:              ${ia.breakdown ? ia.breakdown.overall : 40}/100`);
  lines.push(`Meaningful coverage:  ${ia.breakdown ? ia.breakdown.meaningfulCoverage : 90}/100`);
  lines.push(`Activity diversity:   ${ia.breakdown ? ia.breakdown.activityDiversity : 100}/100${ia.breakdown && ia.breakdown.diversityBonus ? ` (${ia.breakdown.diversityBonus})` : ''}`);
  lines.push(`Interaction depth:    ${ia.breakdown ? ia.breakdown.interactionDepth : 30}/100`);
  lines.push(`Manipulation:         ${ia.breakdown ? ia.breakdown.manipulation : 30}/100`);
  lines.push(`Feedback quality:     ${ia.breakdown ? ia.breakdown.feedbackQuality : 40}/100`);
  if (ia.breakdown && ia.breakdown.explanation) {
    lines.push(`Explanation:          "${ia.breakdown.explanation}"`);
  }
  lines.push('');

  lines.push('VISUAL');
  lines.push(`Visual coverage:      ${va ? va.visualCoverageScore : 70}/100`);
  lines.push(`Pedagogical visuals:  ${va ? va.pedagogicalVisualsScore : 80}/100`);
  lines.push(`Image accessibility:  ${va ? va.imageAccessibilityScore : 100}/100`);
  lines.push('');

  lines.push('DISCOVERABILITY');
  lines.push(`Technical SEO:        ${da ? da.technicalSeoScore : 85}/100`);
  lines.push(`Semantic coverage:    ${da ? da.semanticCoverageScore : 80}/100`);
  lines.push(`Search intent:        ${da ? da.searchIntentScore : 85}/100`);
  lines.push('');

  if (report.textQuality) {
    const tq = report.textQuality;
    lines.push('TEXT QUALITY');
    lines.push(`Overall:              ${tq.overallScore}/100`);
    lines.push(`Repetition:           ${tq.repetitionScore}/100 (${tq.repeatedPhrases.length} frases repetidas)`);
    lines.push(`Markdown-as-code:     ${tq.codeMarkdownScore}/100 (${tq.codeMarkdownIssues.length} fragmentos)`);
    if (tq.repeatedPhrases.length > 0) {
      tq.repeatedPhrases.slice(0, 3).forEach(rp => lines.push(`  ↻ "${rp.phrase.slice(0, 60)}..." ×${rp.count}`));
    }
    if (tq.codeMarkdownIssues.length > 0) {
      tq.codeMarkdownIssues.slice(0, 3).forEach(ci => lines.push(`  ⚠ [${ci.kind}] ${ci.sample.slice(0, 60)}`));
    }
    lines.push('');
  }

  if (kb) {
    lines.push('KNOWLEDGE BENCHMARK (DIAGNOSTIC MODE)');
    lines.push(`Topic:                ${kb.topicProfile.topic}`);
    lines.push(`Reference confidence: ${kb.referenceConfidence}`);
    lines.push(`Sources evaluated:    ${kb.sourcesCount}`);
    lines.push(`Source quality:       ${kb.sourceQualityScore}/100`);
    lines.push(`Core concept coverage:${kb.coreConceptCoverageScore}%`);
    lines.push(`Relationship coverage:${kb.importantRelationshipCoverageScore}%`);
    lines.push(`Representation cov.:  ${kb.representationCoverageScore}%`);
    lines.push(`Misconception cov.:   ${kb.misconceptionCoverageScore}%`);
    lines.push(`Reference alignment:  ${kb.referenceAlignmentScore}/100`);
    lines.push(`Academic correctness: ${kb.academicCorrectnessScore}/100`);
    lines.push(`Anektia added value:  ${kb.anektiaAddedValue}`);
    if (kb.addedValueReasons.length > 0) {
      kb.addedValueReasons.forEach(r => lines.push(`  + ${r}`));
    }
    lines.push('');
  }

  lines.push('ANEKTIA');
  lines.push(`Connections:          ${ae ? ae.connectionsScore : 80}/100`);
  lines.push(`Experience:           ${ae ? ae.experienceScore : 90}/100`);
  lines.push('');

  // --------------------------------------------------
  // KNOWLEDGE Gaps & Concept Terminology Details
  // --------------------------------------------------
  if (kb && kb.conceptDetails.length > 0) {
    lines.push('CONCEPT COVERAGE & TERMINOLOGY DETAILS');
    lines.push('====================================================');
    kb.conceptDetails.forEach(cd => {
      lines.push(` * Concept: ${cd.concept} (${cd.importance})`);
      lines.push(`   Coverage Status:      ${cd.status} (Detection: ${cd.detectionMode})`);
      lines.push(`   Explicit Terminology: ${cd.explicitTerminology}`);
    });
    lines.push('');
  }

  if (kb && kb.gaps.length > 0) {
    lines.push('KNOWLEDGE GAPS');
    lines.push('====================================================');
    kb.gaps.forEach(g => {
      lines.push(`[${g.importance}] [${g.scope}] ${g.concept}`);
      lines.push(`  Status:    ${g.status}`);
      lines.push(`  Reason:    ${g.reason}`);
      if (g.evidenceFromReferences.length > 0) {
        lines.push(`  Evidence:  ${g.evidenceFromReferences.join('; ')}`);
      }
      lines.push('');
    });
  }

  if (kb && kb.sequencingIssues.length > 0) {
    lines.push('KNOWLEDGE SEQUENCING ISSUES');
    lines.push('====================================================');
    kb.sequencingIssues.forEach(s => {
      lines.push(`[${s.severity}] ${s.message}`);
    });
    lines.push('');
  }

  // --------------------------------------------------
  // SOURCE TRANSPARENCY
  // --------------------------------------------------
  if (kb && kb.sourceTransparency.length > 0) {
    lines.push('SOURCE TRANSPARENCY');
    lines.push('====================================================');
    kb.sourceTransparency.forEach(st => {
      lines.push(` * [${st.tier}] ${st.sourceName} (Authority: ${st.authority}/100)`);
      lines.push(`   Supports: ${st.supportsAspect}`);
    });
    lines.push('');
  }

  // --------------------------------------------------
  // CRITICAL GAPS & FAILURES
  // --------------------------------------------------
  lines.push('CRITICAL GAPS');
  lines.push('====================================================');
  if (report.criticalFailures.length > 0) {
    report.criticalFailures.forEach(f => {
      lines.push(`[CRITICAL] ${f.ruleId}: ${f.message}`);
    });
  } else {
    lines.push('No critical quality gate failures detected.');
  }

  if (report.warnings.length > 0) {
    report.warnings.forEach(w => {
      lines.push(`[WARNING] ${w}`);
    });
  }
  lines.push('');

  // --------------------------------------------------
  // PRIORITIZED IMPROVEMENT PLAN (CROSS-DIMENSION)
  // --------------------------------------------------
  lines.push('PRIORITIZED IMPROVEMENT PLAN');
  lines.push('====================================================');
  if (report.crossDimensionInterventions && report.crossDimensionInterventions.length > 0) {
    report.crossDimensionInterventions.forEach((inv, idx) => {
      lines.push(`[${inv.priorityLevel}] Step ${idx + 1}: ${inv.title}`);
      lines.push(`  Category:               ${inv.category} (${inv.type})`);
      lines.push(`  Missing Item:           ${inv.missingItem}`);
      lines.push(`  Recommended Intervention: ${inv.recommendedIntervention}`);
      lines.push(`  Rationale:              ${inv.rationale}`);
      if (inv.why && inv.why.length > 0) {
        lines.push('  Why:');
        inv.why.forEach(w => lines.push(`   - ${w}`));
      }
      lines.push('');
    });
  } else {
    lines.push('No specific prioritized interventions required.');
    lines.push('');
  }

  // --------------------------------------------------
  // SCORE BREAKDOWN & SUMMARY
  // --------------------------------------------------
  lines.push('SCORE BREAKDOWN');
  lines.push('----------------------------------------------------');
  lines.push(`  Rigor académico:        ${report.scores.rigorAcademico}/20`);
  lines.push(`  Estructura pedagógica:  ${report.scores.estructuraPedagogica}/20`);
  lines.push(`  Práctica (Calibrada):   ${report.scores.practica}/20`);
  lines.push(`  Razonamiento:           ${report.scores.razonamiento}/15`);
  lines.push(`  Interactividad:         ${report.scores.interactividad}/10`);
  lines.push(`  Conexiones:             ${report.scores.conexiones}/10`);
  lines.push(`  Experiencia Anektia:    ${report.scores.experienciaAnektia}/5`);
  lines.push('----------------------------------------------------');
  lines.push(`TOTAL SCORE:              ${report.totalScore}/100`);
  if (report.appliedScoreCap) {
    lines.push(`APPLIED SCORE CAP:        ${report.appliedScoreCap.cap}/100 (${report.appliedScoreCap.reason})`);
  }
  lines.push(`STATUS:                   ${report.status}`);
  lines.push(`QUALITY GATES:            ${report.qualityGatesPassed ? 'PASSED' : 'FAILED'}`);
  lines.push('====================================================');

  return lines.join('\n');
}

export function formatJsonReport(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}
