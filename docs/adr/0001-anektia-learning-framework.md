# ADR 0001: Anektia Learning Framework v1.0 (Content Auditor)

- **Estado**: Aprobado
- **Fecha**: 2026-07-30
- **Autores**: Equipo de Arquitectura Pedagógica Anektia

---

## 1. Contexto

Anektia publica contenido educativo estructurado en Markdown/MDX organizado en tres capas de profundización (*Inicio / Fundamentos*, *Intermedio / Profundización*, *Avanzado / Frontera*) acompañado de ejercicios (`AnektiaExercise`, `AnektiaDecisionBox`) y componentes interactivos.

Para garantizar la máxima calidad pedagógica y consistencia en el catálogo de guías de Bachillerato, se requiere un **Content Auditor determinista (sin IA en esta fase)** que evalúe la estructura, el volumen de ejercicios, el valor interactivo y el rigor estructural según reglas parametrizables e independientes del código ejecutable.

---

## 2. Decisión de Arquitectura

Se implementa **Anektia Learning Framework v1.0** como un módulo interno independiente ubicado en `/framework/aeterna-learning/` con CLI en `/scripts/audit-content.ts`.

### Principios Fundamentales:
1. **Desacoplamiento Total**: Las reglas pedagógicas se definen en ficheros JSON estáticos (`config/`) validados por esquemas JSON (`schemas/`). Los analizadores (`analyzers/`) leen estas reglas de forma dinámica sin hardcodear umbrales.
2. **Reutilización de Infraestructura Existente**:
   - Reutilización de `gray-matter` (instalado en el proyecto) y patrones de parseo de `lib/server-content.ts` para extraer Frontmatter y Body.
   - Parseo estructural robusto de bloques MDX (`<NivelActivo>`, `<IndiceNivel>`, ````aeterna-exercise`, `<AnektiaDecisionBox>`, `<BotonTransicion>`).
3. **Impacto Cero en el Producto Final**:
   - 0 modificación en la UI pública.
   - 0 modificación en `room-engine` o `Firebase`.
   - 0 modificación en la gamificación del usuario.
   - Compatible 100% con los metadatos y etiquetas frontmatter existentes en `content/guias/`.

---

## 3. Estructura de Componentes del Framework

```text
/framework/aeterna-learning/
  ├── config/
  │   ├── learning-profile.bachillerato.json  # Definición del estudiante modelo Bachillerato
  │   ├── layer-rules.json                    # Reglas para capas Inicio/Intermedio/Avanzado
  │   ├── exercise-rules.json                 # Reglas de ejercicios por capa
  │   ├── interactive-rules.json              # Sistema de puntuación Interactive Value Score (0-5)
  │   └── scoring-rules.json                  # Ponderaciones (100 pts max) y Quality Gates
  ├── schemas/
  │   ├── learning-profile.schema.json
  │   ├── article-metadata.schema.json
  │   └── audit-report.schema.json
  ├── analyzers/
  │   ├── structure-analyzer.ts      # Verificación de H2, frontmatter y bloques
  │   ├── layer-analyzer.ts          # Detección y contraste de capas (Inicio/Intermedio/Avanzado)
  │   ├── exercise-analyzer.ts       # Conteo y extracción de AnektiaExercise / AnektiaDecisionBox
  │   ├── interactive-analyzer.ts    # Evaluación del Interactive Value Score (0-5)
  │   ├── prerequisite-analyzer.ts   # Validación de prerrequisitos y referencias
  │   └── content-analyzer.ts        # Orquestador general de análisis
  ├── scoring/
  │   └── scoring-engine.ts          # Cálculo del score final y Quality Gates de aprobación
  ├── reports/
  │   └── report-generator.ts        # Formateador de salida a consola (CLI) y JSON
  ├── types/
  │   └── index.ts                   # Tipos e interfaces estricta TypeScript
  └── index.ts                       # Entrypoint programmatic API
```

---

## 4. Reutilización de Infraestructura Existente

- **Parser de Frontmatter**: Utiliza `gray-matter` y los fallbacks de `lib/server-content.ts`.
- **Estructura de Componentes JSX/MDX**: Reconoce la sintaxis nativa utilizada en las guías de física (`<NivelActivo id="...">`, `<AnektiaDecisionBox ...>`, ````aeterna-exercise`, `<BotonTransicion>`).

---

## 5. Cambios Mínimos de Contenido

No se requiere modificar los artículos existentes. Si un artículo no declara explícitamente prerrequisitos o perfil en su frontmatter, el auditor infiere valores por defecto seguros (`perfil: bachillerato`) sin romper el renderizado existente.

---

## 6. Riesgos y Mitigación

- **Riesgo**: Parseo frágil por expresiones regulares en estructuras complejas de Markdown.
- **Mitigación**: Los analizadores operan por bloques demarcados (`<NivelActivo>`, cercados de código triple comilla ````aeterna-exercise`, encabezados `#`/`##`) combinando manipulación de strings y expresiones regulares ancladas a etiquetas de cierre explícitas.
- **Riesgo**: Evaluación de exactitud científica con reglas deterministas.
- **Mitigación**: La comprobación científica se excluye explícitamente de la Fase 1 y se delega a la futura capa de análisis con IA.

---

## 7. Próximos Pasos (Fase 1)

1. Implementar esquemas, configuraciones y tipos de `/framework/aeterna-learning/`.
2. Implementar analizadores deterministas y motor de scoring.
3. Registrar script `audit:content` en `package.json`.
4. Ejecutar auditoría sobre las guías maestras de física y presentar el informe.
