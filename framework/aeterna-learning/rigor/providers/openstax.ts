import { CorpusEntry } from '../types';

const OST_BASE = 'https://openstax.org/books/university-physics-volume-1/pages';
const OST_BASE_2 = 'https://openstax.org/books/university-physics-volume-2/pages';
const DELAY_MS = 300;

const TOPIC_URL_MAP: Record<string, { url: string; title: string }> = {
  'scientific method': {
    url: `${OST_BASE}/1-1-the-scope-and-scale-of-physics`,
    title: 'OpenStax UP1: Scope and Scale of Physics',
  },
  'metodo cientifico': {
    url: `${OST_BASE}/1-1-the-scope-and-scale-of-physics`,
    title: 'OpenStax UP1: Scope and Scale of Physics',
  },
  'método científico': {
    url: `${OST_BASE}/1-1-the-scope-and-scale-of-physics`,
    title: 'OpenStax UP1: Scope and Scale of Physics',
  },
  'measurement': {
    url: `${OST_BASE}/1-2-units-and-standards`,
    title: 'OpenStax UP1: Units and Standards',
  },
  'vectors': {
    url: `${OST_BASE}/2-0-introduction`,
    title: 'OpenStax UP1: Vectors',
  },
  'cinematics': {
    url: `${OST_BASE}/3-1-position-displacement-and-average-velocity`,
    title: 'OpenStax UP1: Position, Displacement, and Velocity',
  },
  'cinematica': {
    url: `${OST_BASE}/3-1-position-displacement-and-average-velocity`,
    title: 'OpenStax UP1: Posición, Desplazamiento y Velocidad',
  },
  'cinemática': {
    url: `${OST_BASE}/3-1-position-displacement-and-average-velocity`,
    title: 'OpenStax UP1: Cinemática',
  },
  'acceleration': {
    url: `${OST_BASE}/3-3-average-and-instantaneous-acceleration`,
    title: 'OpenStax UP1: Acceleration',
  },
  'newton laws': {
    url: `${OST_BASE}/5-1-forces`,
    title: 'OpenStax UP1: Forces and Newton\'s Laws',
  },
  'leyes de newton': {
    url: `${OST_BASE}/5-1-forces`,
    title: 'OpenStax UP1: Leyes de Newton',
  },
  'newton': {
    url: `${OST_BASE}/5-1-forces`,
    title: 'OpenStax UP1: Newton\'s Laws',
  },
  'friction': {
    url: `${OST_BASE}/6-2-friction`,
    title: 'OpenStax UP1: Friction',
  },
  'work energy': {
    url: `${OST_BASE}/7-1-work`,
    title: 'OpenStax UP1: Work and Energy',
  },
  'trabajo energia': {
    url: `${OST_BASE}/7-1-work`,
    title: 'OpenStax UP1: Trabajo y Energía',
  },
  'trabajo energía': {
    url: `${OST_BASE}/7-1-work`,
    title: 'OpenStax UP1: Trabajo y Energía',
  },
  'trabajo y energia': {
    url: `${OST_BASE}/7-1-work`,
    title: 'OpenStax UP1: Trabajo y Energía',
  },
  'momentum': {
    url: `${OST_BASE}/9-1-linear-momentum`,
    title: 'OpenStax UP1: Linear Momentum',
  },
  'rotational motion': {
    url: `${OST_BASE}/10-1-rotational-variables`,
    title: 'OpenStax UP1: Rotational Motion',
  },
  'angular momentum': {
    url: `${OST_BASE}/11-1-rolling-motion`,
    title: 'OpenStax UP1: Angular Momentum',
  },
  'equilibrium': {
    url: `${OST_BASE}/12-1-conditions-for-static-equilibrium`,
    title: 'OpenStax UP1: Static Equilibrium',
  },
  'gravitation': {
    url: `${OST_BASE}/13-1-newtons-law-of-universal-gravitation`,
    title: 'OpenStax UP1: Gravitation',
  },
  'fluids': {
    url: `${OST_BASE}/14-1-fluids-density-and-pressure`,
    title: 'OpenStax UP1: Fluids',
  },
  'oscilations': {
    url: `${OST_BASE}/15-1-simple-harmonic-motion`,
    title: 'OpenStax UP1: Oscillations',
  },
  'waves': {
    url: `${OST_BASE}/16-1-traveling-waves`,
    title: 'OpenStax UP1: Waves',
  },
  'thermodynamics': {
    url: `${OST_BASE_2}/1-1-temperature-and-thermal-equilibrium`,
    title: 'OpenStax UP2: Thermodynamics',
  },
  'termodinamica': {
    url: `${OST_BASE_2}/1-1-temperature-and-thermal-equilibrium`,
    title: 'OpenStax UP2: Termodinámica',
  },
  'termodinámica': {
    url: `${OST_BASE_2}/1-1-temperature-and-thermal-equilibrium`,
    title: 'OpenStax UP2: Termodinámica',
  },
  'electricity': {
    url: `${OST_BASE_2}/5-1-electric-charge`,
    title: 'OpenStax UP2: Electric Charge',
  },
  'electromagnetism': {
    url: `${OST_BASE_2}/11-1-magnetism-and-its-historical-discoveries`,
    title: 'OpenStax UP2: Magnetism',
  },
  'electromagnetismo': {
    url: `${OST_BASE_2}/11-1-magnetism-and-its-historical-discoveries`,
    title: 'OpenStax UP2: Electromagnetismo',
  },
  'optics': {
    url: `${OST_BASE_2}/1-3-refraction`,
    title: 'OpenStax UP3: Optics',
  },
  'relativity': {
    url: `${OST_BASE_2}/5-1-invariance-of-physical-laws`,
    title: 'OpenStax UP3: Relativity',
  },
  'quantum': {
    url: `${OST_BASE_2}/6-1-blackbody-radiation`,
    title: 'OpenStax UP3: Quantum Physics',
  },
};

function normalizeLaTeX(raw: string): string {
  return raw
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\left\|/g, '')
    .replace(/\\right\|/g, '')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\displaystyle/g, '')
    .replace(/\\,/g, '')
    .replace(/\\;/g, '')
    .replace(/\\!/g, '')
    .replace(/\\qquad/g, '')
    .replace(/\\quad/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFormulasFromHtml(html: string): string[] {
  const formulas: string[] = [];
  
  const dataMathRegex = /data-math="([^"]+)"/gi;
  let match;
  while ((match = dataMathRegex.exec(html)) !== null) {
    const latex = match[1];
    if (latex.length > 3 && latex.length < 200) {
      formulas.push(latex);
    }
  }

  const mathSpanRegex = /<span[^>]*class="[^"]*math[^"]*"[^>]*>([\s\S]*?)<\/span>/gi;
  while ((match = mathSpanRegex.exec(html)) !== null) {
    const inner = match[1].replace(/<[^>]+>/g, '').trim();
    if (inner.length > 3 && inner.length < 200 && /[\\=+\-*]/.test(inner)) {
      formulas.push(inner);
    }
  }

  return [...new Set(formulas)].slice(0, 5);
}

function cleanText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const NOISE_PATTERNS = [
  /\bcopyright\b/i, /©/, /\bcc by\b/i, /\blicense\b/i, /\blicensed\b/i,
  /\bgtag\b/, /\bdataLayer\b/, /\bgoogle\b/i, /\bcookie\b/i, /\bconsent\b/i,
  /\bprivacy\b/i, /\bterms of\b/i, /\baccessibility\b/i, /\bmedia object\b/i,
  /\bpdf\b/i, /\bdownload\b/i, /\bprint\b/i, /\bcitation\b/i, /\battribution\b/i,
  /\bpowered by\b/i, /\bopenstax\s+logo\b/i, /\brice university\b/i,
  /\ball rights reserved\b/i, /^\s*\(\s*[a-z]+\s*\)/i,
];

function isNoise(text: string): boolean {
  return NOISE_PATTERNS.some(p => p.test(text));
}

function extractDefinitionsFromHtml(rawHtml: string): string[] {
  const html = rawHtml
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '');

  const defs: string[] = [];
  const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  for (const p of paragraphs) {
    const text = cleanText(p);
    if (text.length < 50 || text.length > 500) continue;
    if (isNoise(text)) continue;
    const lower = text.toLowerCase();
    if (
      (lower.includes(' is ') || lower.includes(' are ')) &&
      /^[A-Z]/.test(text)
    ) {
      defs.push(text);
    }
  }

  const liTags = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  for (const li of liTags) {
    const text = cleanText(li);
    if (text.length < 20 || text.length > 300) continue;
    if (isNoise(text)) continue;
    if (
      /^(describe|calculate|explain|define|identify|compare|apply|analyze|determine|distinguish)/i.test(text)
    ) {
      defs.push(text);
    }
  }

  return [...new Set(defs)].slice(0, 6);
}

function findTopicMapping(topic: string): { url: string; title: string } | null {
  const normalized = topic.toLowerCase().trim();
  if (TOPIC_URL_MAP[normalized]) return TOPIC_URL_MAP[normalized];
  for (const [key, value] of Object.entries(TOPIC_URL_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) return value;
  }
  return null;
}

export class OpenStaxProvider {
  name = 'OpenStax';

  async search(topic: string): Promise<CorpusEntry[]> {
    const entries: CorpusEntry[] = [];
    let counter = 0;

    const mapping = findTopicMapping(topic);
    if (!mapping) {
      return entries;
    }

    try {
      const res = await fetch(mapping.url, {
        headers: { 'User-Agent': 'AeternaLearning/1.0 (rigor; contact@aeterna.dev)' }
      });
      if (!res.ok) return entries;
      const html = await res.text();
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));

      const definitions = extractDefinitionsFromHtml(html);
      for (const def of definitions) {
        entries.push({
          id: `ost-d${counter++}`,
          type: 'definition',
          text: def,
          source: 'openstax',
          sourceUrl: mapping.url,
          sourceTitle: mapping.title,
          tier: 'TIER_1_ACADEMIC',
          authorityScore: 95,
          relevanceScore: 90,
        });
      }

      const formulas = extractFormulasFromHtml(html);
      for (const latex of formulas) {
        entries.push({
          id: `ost-f${counter++}`,
          type: 'formula',
          text: latex,
          laTeX: `$$${latex}$$`,
          laTeXNormalized: normalizeLaTeX(latex),
          source: 'openstax',
          sourceUrl: mapping.url,
          sourceTitle: mapping.title,
          tier: 'TIER_1_ACADEMIC',
          authorityScore: 95,
          relevanceScore: 85,
        });
      }
    } catch (e: any) {
      console.error(`[OpenStaxProvider] Error: ${e.message}`);
    }

    return entries;
  }
}
