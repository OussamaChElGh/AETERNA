export type CompetencyType = 
  | 'recognition' 
  | 'understanding' 
  | 'basic_application'
  | 'application'
  | 'interpretation'
  | 'standard_problem_solving'
  | 'reasoning'
  | 'non_routine_problem_solving'
  | 'transfer';

export type CognitiveLevel = 
  | 'conceptual_explain'
  | 'conceptual_identify'
  | 'conceptual_compare'
  | 'procedural_execute'
  | 'procedural_apply'
  | 'reasoning_justify'
  | 'reasoning_model'
  | 'reasoning_estimate'
  | 'reasoning_detect_errors'
  | 'reasoning_predict'
  | 'reasoning_experiment'
  | 'reasoning_interpret_graph'
  | 'transfer_new_context';

export type ArticleType = 
  | 'conceptual'
  | 'methodological'
  | 'procedural'
  | 'problem_solving'
  | 'experimental'
  | 'simulation'
  | 'synthesis';

export type TypeSource = 'declared' | 'inferred';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type InteractiveRequirement = 'optional' | 'recommended' | 'highly_recommended';

export type EvidenceState = 'PASS' | 'PARTIAL' | 'INSUFFICIENT' | 'NOT_EVALUATED';

export interface EvidenceTraceItem {
  dimension: string;
  score: number;
  maxScore: number;
  evidence: string[];
  rule: string;
}

export interface TypeAlternative {
  type: ArticleType;
  confidence: number;
}

export interface ArticleTypeDetectionResult {
  detectedType: ArticleType;
  declaredType: ArticleType | null;
  typeSource: TypeSource;
  confidence: number; // 0.0 .. 1.0
  confidenceLevel: ConfidenceLevel;
  alternatives: TypeAlternative[];
  signals: string[];
}

export interface TypeLayerExpectation {
  min: number;
  max: number;
}

export interface ArticleTypeRuleConfig {
  type: ArticleType;
  description: string;
  layers: {
    inicio: TypeLayerExpectation;
    intermedio: TypeLayerExpectation;
    avanzado: TypeLayerExpectation;
  };
  totalRecommended: {
    min: number;
    max: number;
  };
  interactiveRequirement: InteractiveRequirement;
  priorities: string[];
}

export interface LayerRequirement {
  id: 'inicio' | 'intermedio' | 'avanzado';
  title: string;
  objective: 'comprender' | 'aplicar' | 'dominar / razonar / transferir';
  minExercises: number;
  maxExercises: number;
  masteryThreshold: number;
  competencies: CompetencyType[];
}

export interface LearningProfileConfig {
  profileId: string;
  name: string;
  targetAudience: string;
  description: string;
  layers: Record<'inicio' | 'intermedio' | 'avanzado', LayerRequirement>;
  recommendedTotalExercises: {
    min: number;
    max: number;
  };
}

export interface InteractiveCriteriaEval {
  manipulateVariables: boolean;
  observeDynamicChanges: boolean;
  experiment: boolean;
  immediateFeedback: boolean;
  visualizeHardConcept: boolean;
}

export interface InteractiveValueResult {
  score: number; // 0..5
  criteria: InteractiveCriteriaEval;
  interpretation: 'no recomendado' | 'normalmente innecesario' | 'opcional' | 'recomendado' | 'altamente recomendado';
}

export interface SubDimensionEval {
  status: EvidenceState;
  message: string;
  score: number; // 0..100
}

export interface PracticeEvaluation {
  quantity: {
    actual: number;
    recommended: [number, number];
    status: EvidenceState;
    message: string;
    score: number;
  };
  layerDistribution: SubDimensionEval;
  difficultyProgression: SubDimensionEval;
  cognitiveVariety: {
    status: EvidenceState;
    cognitiveLevelsDetected: CognitiveLevel[];
    message: string;
    score: number;
  };
  competencyCoverage: {
    status: EvidenceState;
    reason: string;
    score: number;
  };
  totalPracticeScore: number; // 0..100
  confidence: ConfidenceLevel;
  confidenceReason: string;
}

export interface InteractivityBreakdown {
  overall: number; // 0..100
  meaningfulCoverage: number; // 0..100
  activityDiversity: number; // 0..100
  diversityBonus?: string;
  interactionDepth: number; // 0..100
  manipulation: number; // 0..100
  feedbackQuality: number; // 0..100
  stateChange: number; // 0..100
  explanation: string;
}

export interface InteractiveAnalysis {
  potential: number; // 0..5
  requirement: InteractiveRequirement;
  presence: boolean;
  relevance: EvidenceState;
  manipulation: boolean;
  feedback: boolean;
  exploration: boolean;
  learningAlignment: EvidenceState;
  qualityScore: number; // 0..5
  scoreCategory: number; // 0..10
  status: EvidenceState;
  message: string;
  breakdown: InteractivityBreakdown;
  typesDetected: string[];
  typeDiversityCount: number;
}

export interface ReasoningAnalysis {
  contentScore: number; // 0..100 (40% weight)
  practiceScore: number; // 0..100 (60% weight)
  weightedScore: number; // 0..15 category score
  status: EvidenceState;
  evidenceContent: string[];
  evidencePractice: string[];
  competenciesDetected: string[];
  missingCompetencies: string[];
  ruleExplanation: string;
}

// ======================================================
// AUDIT DIMENSIONS TYPES
// ======================================================

export type VisualCategory =
  | 'DECORATIVE'
  | 'EXPLANATORY'
  | 'CONCEPTUAL'
  | 'DATA_VISUALIZATION'
  | 'PROCESS'
  | 'COMPARISON'
  | 'HISTORICAL_CONTEXT'
  | 'EXAMPLE';

export interface ExtractedVisual {
  id: string;
  url: string;
  altText: string;
  caption?: string;
  category: VisualCategory;
  layerId: 'inicio' | 'intermedio' | 'avanzado' | 'general';
  isPedagogical: boolean;
  hasAccessibility: boolean;
  sectionHeader?: string;
  width?: number;
  height?: number;
}

export interface VisualOpportunity {
  concept: string;
  reason: string;
  suggestedType: VisualCategory | string;
  section: string;
}

export interface VisualAnalysisResult {
  visualCoverageScore: number; // 0..100
  pedagogicalVisualsScore: number; // 0..100
  imageAccessibilityScore: number; // 0..100
  totalVisuals: number;
  pedagogicalCount: number;
  decorativeCount: number;
  categoriesDetected: Record<VisualCategory, number>;
  layerDistribution: Record<'inicio' | 'intermedio' | 'avanzado' | 'general', number>;
  visualOpportunities: VisualOpportunity[];
  extractedVisuals: ExtractedVisual[];
}

export interface SearchIntentAspect {
  aspect: string;
  status: 'PASS' | 'PARTIAL' | 'MISSING';
  detail: string;
}

export interface TechnicalSeoMetrics {
  hasTitle: boolean;
  titleLength: number;
  hasMetaDescription: boolean;
  descriptionLength: number;
  hasValidSlug: boolean;
  headingHierarchyValid: boolean;
  internalLinksCount: number;
  externalLinksCount: number;
  score: number; // 0..100
}

export interface DiscoverabilityAnalysisResult {
  technicalSeoScore: number; // 0..100
  semanticCoverageScore: number; // 0..100
  searchIntentScore: number; // 0..100
  overallScore: number; // 0..100
  technicalMetrics: TechnicalSeoMetrics;
  searchIntentAspects: SearchIntentAspect[];
  keyEntitiesDetected: string[];
  missingSearchAspects: string[];
  aiDiscoverabilitySignals: {
    clearDefinitionsCount: number;
    structuredSectionsCount: number;
    hasExplicitKeyTakeaways: boolean;
    hasReferencesOrSources: boolean;
  };
}

export interface ContentDepthAnalysis {
  coverageScore: number; // 0..100
  depthScore: number; // 0..100
  academicRigorScore: number; // 0..100
  overallScore: number; // 0..100
  conceptsDetected: string[];
  missingConcepts: string[];
  redundantConcepts: string[];
  shallowSections: string[];
  wordCount: number;
  readabilityScore: number; // 0..100
}

export interface TextQualityResult {
  repetitionScore: number; // 0..100
  repeatedPhrases: { phrase: string; count: number; locations: number[] }[];
  codeMarkdownScore: number; // 0..100
  codeMarkdownIssues: {
    kind: 'fenced_markdown' | 'raw_markdown' | 'escaped_markdown';
    sample: string;
    location: number;
  }[];
  overallScore: number; // 0..100
  status: 'PASS' | 'PARTIAL' | 'FAIL';
  message: string;
}

export interface StructureAnalysisResult {
  articleStructureScore: number; // 0..100
  layerDistributionScore: number; // 0..100
  navigationScore: number; // 0..100
  overallScore: number; // 0..100
  headingHierarchyValid: boolean;
  layerBalanceMessage: string;
  poorSections: string[];
  overlyLongSections: string[];
}

export interface AnektiaExperienceResult {
  connectionsScore: number; // 0..100
  experienceScore: number; // 0..100
  overallScore: number; // 0..100
  pedagogicalBlocksCount: number;
  meaningfulIntegrationScore: number; // 0..100
  reflectionMomentsCount: number;
}

// ======================================================
// KNOWLEDGE BENCHMARK / REFERENCE INTELLIGENCE TYPES
// ======================================================

export type SourceTier = 
  | 'TIER_1_ACADEMIC'
  | 'TIER_2_SPECIALIZED_EDU'
  | 'TIER_3_HIGH_QUALITY_WEB'
  | 'TIER_4_GENERAL_WEB';

export interface ReferenceSource {
  id: string;
  name: string;
  url?: string;
  tier: SourceTier;
  authorityScore: number; // 0..100
  relevanceScore: number; // 0..100
  domain: string;
  confidence: ConfidenceLevel;
  supports: string[];
}

export type ConceptImportance = 'CORE' | 'IMPORTANT' | 'SUPPORTING' | 'OPTIONAL';
export type ConceptScope = 'IN_SCOPE' | 'OUT_OF_SCOPE' | 'OPTIONAL_EXPANSION';
export type ConceptDetectionMode = 'EXPLICIT' | 'SEMANTIC' | 'IMPLICIT' | 'PARTIAL' | 'MISSING';

export interface ConceptCoverageDetail {
  concept: string;
  importance: ConceptImportance;
  status: 'PASS' | 'PARTIAL' | 'MISSING';
  detectionMode: ConceptDetectionMode;
  explicitTerminology: 'PASS' | 'PARTIAL' | 'MISSING';
  confidence: ConfidenceLevel;
}

export interface ReferenceConcept {
  id: string;
  name: string;
  importance: ConceptImportance;
  scope: ConceptScope;
  definition: string;
  keyAspects: string[];
  semanticPhrases?: string[];
}

export interface ReferenceRelationship {
  sourceConcept: string;
  targetConcept: string;
  relationType: 'causes' | 'depends_on' | 'proportional_to' | 'inversely_proportional_to' | 'component_of' | 'derives_from';
  description: string;
}

export interface ReferenceRepresentation {
  concept: string;
  expectedType: 'formula' | 'graph' | 'diagram' | 'table' | 'example';
  importance: ConceptImportance;
}

export interface ReferenceMisconception {
  id: string;
  title: string;
  erroneousIdea: string;
  correctPrinciple: string;
  importance: ConceptImportance;
}

export interface TopicProfile {
  topic: string;
  discipline: string;
  level: string;
  articleType: ArticleType;
  primaryEntities: string[];
  relatedTopics: string[];
  confidence: ConfidenceLevel;
}

export interface ConceptDependency {
  concept: string;
  prerequisite: string;
  importance: ConceptImportance;
}

export interface KnowledgeModel {
  topicProfile: TopicProfile;
  concepts: ReferenceConcept[];
  relationships: ReferenceRelationship[];
  representations: ReferenceRepresentation[];
  misconceptions: ReferenceMisconception[];
  prerequisites: string[];
  conceptDependencies: ConceptDependency[];
  recommendedSequence: string[];
  applications: string[];
  sources: ReferenceSource[];
}

export interface KnowledgeGap {
  concept: string;
  importance: ConceptImportance;
  scope: ConceptScope;
  status: 'MISSING' | 'PARTIAL' | 'UNCLEAR' | 'CONTRADICTORY';
  reason: string;
  evidenceFromReferences: string[];
  suggestedIntervention?: string;
}

export interface SequencingIssue {
  concept: string;
  prerequisite: string;
  message: string;
  severity: 'WARNING' | 'INFO';
}

export interface SourceTransparencyItem {
  sourceName: string;
  tier: SourceTier;
  authority: number;
  supportsAspect: string;
  confidence: ConfidenceLevel;
}

export interface KnowledgeBenchmarkResult {
  topicProfile: TopicProfile;
  referenceConfidence: ConfidenceLevel;
  sourcesCount: number;
  sourceQualityScore: number; // 0..100
  coreConceptCoverageScore: number; // 0..100
  importantRelationshipCoverageScore: number; // 0..100
  representationCoverageScore: number; // 0..100
  applicationCoverageScore: number; // 0..100
  misconceptionCoverageScore: number; // 0..100
  prerequisiteCoverageScore: number; // 0..100
  referenceAlignmentScore: number; // 0..100
  academicCorrectnessScore: number; // 0..100
  aeternaAddedValue: 'HIGH' | 'MODERATE' | 'STANDARD';
  addedValueReasons: string[];
  conceptDetails: ConceptCoverageDetail[];
  gaps: KnowledgeGap[];
  sequencingIssues: SequencingIssue[];
  sourceTransparency: SourceTransparencyItem[];
  contradictionsDetected: string[];
  isDiagnosticOnly: boolean;
}

export type InterventionCategory = 'PEDAGOGY' | 'VISUAL' | 'CONTENT' | 'DISCOVERABILITY' | 'ANEKTIA' | 'KNOWLEDGE_BENCHMARK';
export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationType = 'CRITICAL_GAP' | 'IMPORTANT_GAP' | 'IMPROVEMENT_OPPORTUNITY' | 'OPTIONAL_ENHANCEMENT';

export interface CrossDimensionIntervention {
  category: InterventionCategory;
  title: string;
  missingItem: string;
  recommendedIntervention: string;
  rationale: string;
  priorityLevel: RecommendationPriority;
  type: RecommendationType;
  why: string[];
}

export interface PracticeSubWeights {
  quantity: number;            // 0.20
  layerDistribution: number;   // 0.15
  difficultyProgression: number;// 0.20
  cognitiveVariety: number;     // 0.15
  competencyCoverage: number;  // 0.30
}

export interface ScoreCapsConfig {
  practiceUnder50Cap: number; // 74
  practiceUnder60Cap: number; // 79
  rigorUnder50Cap: number;    // 74
  reasoningUnder50Cap: number;// 79
}

export interface ScoringWeights {
  rigorAcademico: number;       // 20
  estructuraPedagogica: number;  // 20
  practica: number;              // 20
  razonamiento: number;          // 15
  interactividad: number;        // 10
  conexiones: number;            // 10
  experienciaAnektia: number;    // 5
}

export type AuditStatus = 'EXCELENTE' | 'BUENO' | 'NECESITA_REVISION' | 'DEBIL' | 'NO_APROBADO';

export interface QualityGateFailure {
  ruleId: string;
  critical: boolean;
  message: string;
}

export interface ExtractedExercise {
  id: string;
  type: string;
  layerId: 'inicio' | 'intermedio' | 'avanzado' | 'general';
  title?: string;
  hasHint: boolean;
  hasXP: boolean;
  xpValue?: number;
  hasSolution: boolean;
  questionText: string;
  optionsCount?: number;
  detectedCognitiveLevels?: CognitiveLevel[];
}

export interface ExtractedInteractive {
  type: string;
  name: string;
  line: number;
  interactiveValue: InteractiveValueResult;
}
export interface ParsedArticleStructure {
  filePath: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  subcategory?: string;
  tags: string[];
  nivel?: number;
  prerequisites: string[];
  rawFrontmatter: Record<string, any>;
  rawBody: string;
  // Cuerpo con el contenido de cada sección una sola vez (sin duplicar por capas),
  // usado por el analyzer de calidad de texto para evitar inflar repeticiones.
  rawBodyUnique?: string;
  
  // Layer breakdown
  layers: {
    id: 'inicio' | 'intermedio' | 'avanzado';
    title: string;
    found: boolean;
    startLine: number;
    endLine: number;
    content: string;
  }[];

  // Component breakdown
  exercises: ExtractedExercise[];
  interactives: ExtractedInteractive[];
  visuals?: ExtractedVisual[];
  
  // Structure & Math counts
  h2Headings: string[];
  h3Headings: string[];
  mathFormulasCount: number;
  hasTransitionButtons: boolean;
  hasProgressHeader: boolean;

  // Modern Anektia fields
  imagesSuggested?: number;
  hasCuaderno?: boolean;
  cuadernoProblemsCount?: number;

  // Article Type Detection
  articleTypeResult: ArticleTypeDetectionResult;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  synonyms?: string[];
  tags?: string[];
  nivel?: string;
}

export interface GlossaryCoverageResult {
  totalTerms: number;
  termsCovered: number;
  coverageScore: number;
  glossaryHasTerms: boolean;
  termsFound: string[];
  termsMissing: string[];
  recommendedTerms: GlossaryEntry[];
}

export interface AuditReport {
  timestamp: string;
  filePath: string;
  articleTitle: string;
  profile: string;
  discipline: string;
  
  // Article Type Info
  articleTypeInfo: ArticleTypeDetectionResult;
  typeRuleConfig: ArticleTypeRuleConfig;

  structurePass: boolean;
  layerStatus: {
    inicio: boolean;
    intermedio: boolean;
    avanzado: boolean;
  };

  // Expanded 8 Dimensions Analysis
  contentDepthAnalysis: ContentDepthAnalysis;
  structureAnalysis: StructureAnalysisResult;
  practiceEvaluation: PracticeEvaluation;
  interactiveAnalysis: InteractiveAnalysis;
  reasoningAnalysis: ReasoningAnalysis;
  visualAnalysis: VisualAnalysisResult;
  discoverabilityAnalysis: DiscoverabilityAnalysisResult;
  aeternaExperienceResult: AnektiaExperienceResult;
  knowledgeBenchmarkResult?: KnowledgeBenchmarkResult;
  glossaryCoverage?: GlossaryCoverageResult;
  textQuality?: TextQualityResult;

  // Legacy & Specific Audits
  evidenceTraces: EvidenceTraceItem[];
  competencyAnalysis?: import('../competencies/taxonomy').CompetencyAnalysisResult;
  learningExperienceAudit?: import('../experiences/taxonomy').LearningExperienceAuditResult;
  recommendedActivityPlan?: import('../experiences/activity-plan-generator').ProposedActivityItem[];
  
  // Cross Dimension Interventions
  crossDimensionInterventions: CrossDimensionIntervention[];

  exercisesPerLayer: {
    inicio: number;
    intermedio: number;
    avanzado: number;
    general: number;
  };
  totalExercises: number;
  
  interactiveDetected: boolean;
  interactiveDetails: ExtractedInteractive[];
  interactiveValueScore: number; // 0..5
  interactiveRecommendation: string;
  interactiveRequirement: InteractiveRequirement;
  
  scores: {
    rigorAcademico: number;
    estructuraPedagogica: number;
    practica: number;
    razonamiento: number;
    interactividad: number;
    conexiones: number;
    experienciaAnektia: number;
    // Granular Scores
    contentCoverageScore: number;
    contentDepthScore: number;
    articleStructureScore: number;
    layerDistributionScore: number;
    navigationScore: number;
    coreExperiencesScore: number;
    cognitiveVarietyScore: number;
    interactiveQualityScore: number;
    meaningfulCoverageScore: number;
    activityDiversityScore: number;
    visualCoverageScore: number;
    pedagogicalVisualsScore: number;
    imageAccessibilityScore: number;
    technicalSeoScore: number;
    semanticCoverageScore: number;
    searchIntentScore: number;
    // Benchmark Scores
    knowledgeCoverageScore?: number;
    referenceAlignmentScore?: number;
    // Text Quality
    textQualityScore?: number;
    repetitionScore?: number;
    codeMarkdownScore?: number;
  };
  totalScore: number; // 0..100
  appliedScoreCap?: {
    cap: number;
    reason: string;
  };
  status: AuditStatus;
  
  qualityGatesPassed: boolean;
  criticalFailures: QualityGateFailure[];
  warnings: string[];
  recommendations: string[];
}
