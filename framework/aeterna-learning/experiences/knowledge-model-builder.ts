import { ConceptDependency, KnowledgeModel, ReferenceConcept, ReferenceMisconception, ReferenceRelationship, ReferenceRepresentation, ReferenceSource, TopicProfile } from '../types';

export function buildKnowledgeModel(topicProfile: TopicProfile, sources: ReferenceSource[]): KnowledgeModel {
  const topicLower = topicProfile.topic.toLowerCase();

  const concepts: ReferenceConcept[] = [];
  const relationships: ReferenceRelationship[] = [];
  const representations: ReferenceRepresentation[] = [];
  const misconceptions: ReferenceMisconception[] = [];
  const prerequisites: string[] = [];
  const conceptDependencies: ConceptDependency[] = [];
  const recommendedSequence: string[] = [];
  const applications: string[] = [];

  // Physics: Metodología / Medición / Estimación
  if (topicLower.includes('medici') || topicLower.includes('estimaci') || topicLower.includes('físico') || topicLower.includes('método')) {
    concepts.push(
      { 
        id: 'c1', 
        name: 'Medición física', 
        importance: 'CORE', 
        scope: 'IN_SCOPE', 
        definition: 'Proceso de comparar una magnitud desconocida con un patrón estandarizado.', 
        keyAspects: ['Unidades SI', 'Incertidumbre'],
        semanticPhrases: ['medición', 'comparar con un patrón', 'unidades de medida', 'magnitud física']
      },
      { 
        id: 'c2', 
        name: 'Incertidumbre y error', 
        importance: 'CORE', 
        scope: 'IN_SCOPE', 
        definition: 'Diferencia entre el valor medido y el valor real o intervalo de confianza.', 
        keyAspects: ['Error sistemático', 'Error aleatorio'],
        semanticPhrases: ['incertidumbre', 'error de medida', 'margen de error', 'precisión y exactitud']
      },
      { 
        id: 'c3', 
        name: 'Estimación de Fermi', 
        importance: 'IMPORTANT', 
        scope: 'IN_SCOPE', 
        definition: 'Técnica para obtener respuestas de orden de magnitud mediante descomposición.', 
        keyAspects: ['Descomposición', 'Potencias de 10'],
        semanticPhrases: ['estimación de fermi', 'orden de magnitud', 'estimar lo imposible', 'descomponer el problema']
      },
      { 
        id: 'c4', 
        name: 'Construcción de modelos', 
        importance: 'IMPORTANT', 
        scope: 'IN_SCOPE', 
        definition: 'Idealización y simplificación de la realidad para analizar física relevante.', 
        keyAspects: ['Supuestos simplificadores', 'Límites de validez'],
        semanticPhrases: ['simplificar la realidad', 'construir una representación', 'modelo simplificado', 'idealización física', 'supuestos']
      },
      { 
        id: 'c5', 
        name: 'Análisis dimensional', 
        importance: 'SUPPORTING', 
        scope: 'IN_SCOPE', 
        definition: 'Verificación de la consistencia de unidades en ecuaciones físicas.', 
        keyAspects: ['Dimensiones fundamentales', 'Homogeneidad'],
        semanticPhrases: ['análisis dimensional', 'consistencia de unidades', 'dimensiones físicas']
      },
      { 
        id: 'c6', 
        name: 'Cálculo tensorial avanzado', 
        importance: 'OPTIONAL', 
        scope: 'OUT_OF_SCOPE', 
        definition: 'Formalismo diferencial en geometría riemanniana.', 
        keyAspects: ['Tensores', 'Métrica'],
        semanticPhrases: ['tensores', 'geometría riemanniana']
      }
    );

    relationships.push(
      { sourceConcept: 'Medición física', targetConcept: 'Incertidumbre y error', relationType: 'causes', description: 'Toda medición física experimental conlleva una incertidumbre inherente.' },
      { sourceConcept: 'Construcción de modelos', targetConcept: 'Estimación de Fermi', relationType: 'depends_on', description: 'La estimación Fermi requiere construir un modelo simplificado previo.' }
    );

    conceptDependencies.push(
      { concept: 'Incertidumbre y error', prerequisite: 'Medición física', importance: 'CORE' },
      { concept: 'Estimación de Fermi', prerequisite: 'Construcción de modelos', importance: 'IMPORTANT' }
    );

    recommendedSequence.push('Medición física', 'Incertidumbre y error', 'Construcción de modelos', 'Estimación de Fermi');

    representations.push(
      { concept: 'Incertidumbre y error', expectedType: 'formula', importance: 'CORE' },
      { concept: 'Estimación de Fermi', expectedType: 'diagram', importance: 'IMPORTANT' },
      { concept: 'Medición física', expectedType: 'table', importance: 'SUPPORTING' }
    );

    misconceptions.push(
      { id: 'm1', title: 'Error es sinónimo de equivocación humana', erroneousIdea: 'Creer que el error en física se debe a descuido o incompetencia del experimentador.', correctPrinciple: 'El error/incertidumbre es una propiedad inevitable de cualquier instrumento o proceso de medida.', importance: 'CORE' },
      { id: 'm2', title: 'Confundir precisión con exactitud', erroneousIdea: 'Asumir que un instrumento con muchos dígitos da siempre una medición exacta.', correctPrinciple: 'La precisión es repetibilidad; la exactitud es cercanía al valor verdadero.', importance: 'IMPORTANT' }
    );

    prerequisites.push('Álgebra básica', 'Notación científica');
    applications.push('Diseño experimental', 'Resolución de problemas abiertos');
  } 
  // Physics: Movimiento Rectilíneo / Dinámica
  else if (topicLower.includes('movimiento') || topicLower.includes('cinemát') || topicLower.includes('velocidad')) {
    concepts.push(
      { 
        id: 'c1', 
        name: 'Posición y desplazamiento', 
        importance: 'CORE', 
        scope: 'IN_SCOPE', 
        definition: 'Ubicación en un sistema de referencia y cambio neto de posición.', 
        keyAspects: ['Vector desplazamiento', 'Sistema de coordenadas'],
        semanticPhrases: ['posición', 'desplazamiento', 'cambio de ubicación']
      },
      { 
        id: 'c2', 
        name: 'Velocidad', 
        importance: 'CORE', 
        scope: 'IN_SCOPE', 
        definition: 'Tasa de cambio de la posición respecto al tiempo.', 
        keyAspects: ['Velocidad constante', 'Velocidad vectorial vs escalar'],
        semanticPhrases: ['velocidad', 'rapidez', 'cambio de posición en el tiempo']
      },
      { 
        id: 'c3', 
        name: 'Aceleración', 
        importance: 'IMPORTANT', 
        scope: 'IN_SCOPE', 
        definition: 'Tasa de cambio de la velocidad respecto al tiempo.', 
        keyAspects: ['Aceleración constante', 'Cambio de rapidez o dirección'],
        semanticPhrases: ['aceleración', 'cambio de velocidad']
      },
      { 
        id: 'c4', 
        name: 'Relatividad General', 
        importance: 'OPTIONAL', 
        scope: 'OUT_OF_SCOPE', 
        definition: 'Geometrización del espacio-tiempo.', 
        keyAspects: ['Geodésicas'],
        semanticPhrases: ['espacio-tiempo', 'geodésicas']
      }
    );

    conceptDependencies.push(
      { concept: 'Velocidad', prerequisite: 'Posición y desplazamiento', importance: 'CORE' },
      { concept: 'Aceleración', prerequisite: 'Velocidad', importance: 'IMPORTANT' }
    );

    recommendedSequence.push('Posición y desplazamiento', 'Velocidad', 'Aceleración');

    relationships.push(
      { sourceConcept: 'Velocidad', targetConcept: 'Posición y desplazamiento', relationType: 'causes', description: 'La velocidad determina la tasa de cambio de la posición en el tiempo.' }
    );

    representations.push(
      { concept: 'Velocidad', expectedType: 'graph', importance: 'CORE' },
      { concept: 'Posición y desplazamiento', expectedType: 'formula', importance: 'CORE' }
    );

    misconceptions.push(
      { id: 'm1', title: 'Confundir distancia con desplazamiento', erroneousIdea: 'Creer que la distancia recorrida es siempre igual al módulo del desplazamiento.', correctPrinciple: 'El desplazamiento es el vector desde el origen al fin.', importance: 'CORE' }
    );

    prerequisites.push('Vectores básicos', 'Gráficas xy');
    applications.push('Tráfico vehicular', 'Seguridad en transporte');
  } 
  // Generic Fallback Knowledge Model
  else {
    concepts.push(
      { 
        id: 'c1', 
        name: `Fundamentos de ${topicProfile.topic}`, 
        importance: 'CORE', 
        scope: 'IN_SCOPE', 
        definition: `Principios esenciales de ${topicProfile.topic}.`, 
        keyAspects: ['Definición', 'Propiedades'],
        semanticPhrases: [topicProfile.topic.toLowerCase()]
      },
      { 
        id: 'c2', 
        name: `Relaciones de ${topicProfile.topic}`, 
        importance: 'IMPORTANT', 
        scope: 'IN_SCOPE', 
        definition: `Dependencia funcional de ${topicProfile.topic}.`, 
        keyAspects: ['Ecuaciones', 'Variables'],
        semanticPhrases: ['ecuaciones', 'variables']
      }
    );

    conceptDependencies.push(
      { concept: concepts[1].name, prerequisite: concepts[0].name, importance: 'CORE' }
    );

    recommendedSequence.push(concepts[0].name, concepts[1].name);

    relationships.push(
      { sourceConcept: concepts[0].name, targetConcept: concepts[1].name, relationType: 'depends_on', description: 'Las leyes dependen de los fundamentos.' }
    );

    representations.push(
      { concept: concepts[0].name, expectedType: 'diagram', importance: 'CORE' }
    );

    misconceptions.push(
      { id: 'm1', title: `Uso informal de ${topicProfile.topic}`, erroneousIdea: 'Confundir el término cotidiano con el concepto técnico.', correctPrinciple: 'Utilizar el lenguaje técnico estandarizado.', importance: 'IMPORTANT' }
    );

    prerequisites.push('Fundamentos de la disciplina');
    applications.push('Resolución de problemas disciplinares');
  }

  return {
    topicProfile,
    concepts,
    relationships,
    representations,
    misconceptions,
    prerequisites,
    conceptDependencies,
    recommendedSequence,
    applications,
    sources
  };
}
