import { ReferenceSource, TopicProfile } from '../types';
import { rankSources } from '../analyzers/source-ranker';

export interface ReferenceProvider {
  name: string;
  getReferences(topicProfile: TopicProfile): Promise<ReferenceSource[]> | ReferenceSource[];
}

export class LocalReferenceProvider implements ReferenceProvider {
  name = 'LocalReferenceProvider';

  getReferences(topicProfile: TopicProfile): ReferenceSource[] {
    const rawSources = [
      { name: 'MIT OpenCourseWare Physics', domain: 'ocw.mit.edu', supports: ['Medición física', 'Incertidumbre', 'Fermi'] },
      { name: 'OpenStax University Physics Vol 1', domain: 'openstax.org', supports: ['Modelos físicos', 'Fórmulas', 'Unidades SI'] },
      { name: 'Physics Classroom Educational Resources', domain: 'physicsclassroom.com', supports: ['Errores comunes', 'Gráficas'] },
      { name: 'HyperPhysics Georgia State', domain: 'hyperphysics.phy-astr.gsu.edu', supports: ['Conceptos clave'] }
    ];
    return rankSources(rawSources);
  }
}

export class AcademicProvider implements ReferenceProvider {
  name = 'AcademicProvider';
  getReferences(topicProfile: TopicProfile): ReferenceSource[] {
    return new LocalReferenceProvider().getReferences(topicProfile);
  }
}

export class BookProvider implements ReferenceProvider {
  name = 'BookProvider';
  getReferences(topicProfile: TopicProfile): ReferenceSource[] {
    return new LocalReferenceProvider().getReferences(topicProfile);
  }
}

export class WebSearchProvider implements ReferenceProvider {
  name = 'WebSearchProvider';
  getReferences(topicProfile: TopicProfile): ReferenceSource[] {
    return new LocalReferenceProvider().getReferences(topicProfile);
  }
}
