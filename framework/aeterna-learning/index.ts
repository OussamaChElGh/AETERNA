import fs from 'fs';
import path from 'path';
import { AuditReport, LearningProfileConfig } from './types';
import { analyzeArticleContent } from './analyzers/content-analyzer';
import { evaluateScoring } from './scoring/scoring-engine';
import { formatTerminalReport, formatJsonReport } from './reports/report-generator';

export * from './types';
export { formatTerminalReport, formatJsonReport };
export * from './planning';
export * from './rigor';
export * from './serializers';
export { auditStructuredArticle, buildParsedFromJson } from './auditors/structured-auditor';

export function loadLearningProfile(profileId: string = 'bachillerato'): LearningProfileConfig {
  const profilePath = path.join(process.cwd(), 'framework', 'aeterna-learning', 'config', `learning-profile.${profileId}.json`);
  if (!fs.existsSync(profilePath)) {
    throw new Error(`Learning profile file not found: ${profilePath}`);
  }
  const fileData = fs.readFileSync(profilePath, 'utf8');
  return JSON.parse(fileData) as LearningProfileConfig;
}

export function auditArticle(filePath: string, profileId: string = 'bachillerato'): AuditReport {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Target article file not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const profile = loadLearningProfile(profileId);
  
  const { parsedStructure } = analyzeArticleContent(fileContent, filePath);
  const report = evaluateScoring(parsedStructure, profile);

  return report;
}
