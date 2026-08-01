import { ConfidenceLevel, ReferenceSource, SourceTier } from '../types';

export function classifySourceTier(domain: string, title: string = ''): { tier: SourceTier; authorityScore: number } {
  const dom = domain.toLowerCase();
  const t = title.toLowerCase();

  // Tier 1: Academic / Primary Authority
  if (dom.endsWith('.edu') || dom.includes('mit.edu') || dom.includes('stanford.edu') || dom.includes('arxiv.org') || dom.includes('nature.com') || dom.includes('iop.org') || dom.includes('openstax.org') || t.includes('university physics') || t.includes('feynman lectures')) {
    return { tier: 'TIER_1_ACADEMIC', authorityScore: 95 };
  }

  // Tier 2: Specialized Educational
  if (dom.includes('khanacademy.org') || dom.includes('coursera.org') || dom.includes('edx.org') || dom.includes('hyperphysics') || dom.includes('libretexts.org') || dom.includes('nagwa.com')) {
    return { tier: 'TIER_2_SPECIALIZED_EDU', authorityScore: 85 };
  }

  // Tier 3: High Quality Educational Web
  if (dom.includes('physicsclassroom.com') || dom.includes('thoughtco.com') || dom.includes('britannica.com') || dom.includes('sciencedirect.com') || dom.includes('miguelfisica')) {
    return { tier: 'TIER_3_HIGH_QUALITY_WEB', authorityScore: 75 };
  }

  // Tier 4: General Web
  return { tier: 'TIER_4_GENERAL_WEB', authorityScore: 55 };
}

export function rankSources(rawSources: Partial<ReferenceSource>[]): ReferenceSource[] {
  return rawSources.map((s, idx) => {
    const domain = s.domain || (s.url ? new URL(s.url).hostname : 'academic.org');
    const { tier, authorityScore } = classifySourceTier(domain, s.name);
    
    return {
      id: s.id || `src_${idx + 1}`,
      name: s.name || `Reference Source ${idx + 1}`,
      url: s.url,
      tier: s.tier || tier,
      authorityScore: s.authorityScore || authorityScore,
      relevanceScore: s.relevanceScore || 90,
      domain,
      confidence: (s.confidence || (tier === 'TIER_1_ACADEMIC' ? 'HIGH' : 'MEDIUM')) as ConfidenceLevel,
      supports: s.supports || ['core_concepts', 'misconceptions']
    };
  }).sort((a, b) => b.authorityScore - a.authorityScore);
}
