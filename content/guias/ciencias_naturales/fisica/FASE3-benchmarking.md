# 🔍 FASE 3: INVESTIGACIÓN EXTERNA — Benchmarking de Plataformas de Física

## Objetivo
Comparar cómo las principales plataformas educativas organizan el contenido de física para tomar las mejores decisiones para Aeterna Project.

---

## 1. THE PHYSICS CLASSROOM (physicsclassroom.com)

Estructura observada directamente desde su sitio web. Es la plataforma de física gratuita más antigua y respetada.

### Estructura de su Tutorial Principal (17 secciones):

```
1.  1-D Kinematics
2.  Newton's Laws
3.  Vectors - Motion and Forces in Two Dimensions
4.  Momentum and Its Conservation
5.  Work, Energy, and Power
6.  Circular Motion and Satellite Motion
7.  Balance and Rotation (Static & Rotational Equilibrium)
8.  Fluids
9.  Thermal Physics
10. Static Electricity
11. Electric Circuits
12. Magnetic Fields and Electromagnetism
13. Electromagnetic Induction
14. Vibrations and Waves
15. Sound Waves and Music
16. Light Waves and Color
17. Reflection and the Ray Model of Light / Refraction and Lenses
```

### Observaciones clave:
- **Secuencia pedagógica clásica**: Mecánica → Termo → Electromag → Ondas/Óptica
- **"Balance and Rotation"** aparece como sección separada (momento, torque, equilibrio rotacional)
- **"Momentum"** está separada de "Newton's Laws" (ellos la tratan como tema propio)
- **"Circular Motion and Satellite Motion"** incluye gravedad orbital
- **"Thermal Physics"** (no "Thermodynamics") — usan un nombre más accesible
- **No incluyen**: Relatividad, mecánica cuántica, física nuclear (es contenido avanzado)
- **Enfoque**: Secundaria tardía / universidad temprana

### Formato de sus artículos:
- Cada sección tiene múltiples **sub-lessons** organizadas secuencialmente
- Usan: lecturas + ilustraciones + Check Your Understanding (preguntas)
- Navegación: menú lateral con todas las secciones
- URL pattern: `/class/section-name/`

---

## 2. KHAN ACADEMY (khanacademy.org) — Estructura conocida

### Estructura del curso de Física:

```
Unidad 1: One-dimensional motion
Unidad 2: Two-dimensional motion
Unidad 3: Forces and Newton's laws of motion
Unidad 4: Forces with various angles
Unidad 5: Tension, pulleys, and inclines (part of forces)
Unidad 6: Work and energy
Unidad 7: Momentum and impulse
Unidad 8: Torque and angular momentum
Unidad 9: Oscillations and mechanical waves
Unidad 10: Fluids
Unidad 11: Thermodynamics
```

### Observaciones clave (basado en estructura pública):
- **11 unidades** vs 17 secciones de Physics Classroom
- **Más compacto**: fusionan temas que Physics Classroom separa
- **"One-dimensional motion"** y **"Two-dimensional motion"** son separadas (no las fusionan en "cinemática")
- **Torque y momento angular** son su propia unidad
- **No incluyen**: Óptica (está en otro curso separado), Relatividad, Cuántica
- **Enfoque**: Preparatoria / early college (similar a Physics Classroom)
- **Diferenciador**: Videos cortos + ejercicios interactivos + mastery system

---

## 3. OPENSTAX COLLEGE PHYSICS (openstax.org)

### Estructura del libro (College Physics 2e):

```
Volumen I:
  1. Introduction: The Nature of Science and Physics
  2. Kinematics
  3. Introduction to Two-Dimensional Kinematics
  4. Dynamics: Force and Newton's Laws of Motion
  5. Further Applications of Newton's Laws of Motion
  6. Uniform Circular Motion and Gravitation
  7. Work, Energy, and Energy Resources
  8. Linear Momentum and Collisions
  9. Statics and Torque
  10. Rotational Motion and Angular Momentum
  11. Fluid Statics
  12. Fluid Dynamics and Its Biological and Medical Applications
  13. Temperature, Kinetic Theory, and the Gas Laws
  14. Heat and Heat Transfer Methods
  15. Thermodynamics
  16. Oscillatory Motion and Waves
  17. Physics of Hearing
  18. Electric Charge and Electric Field
  19. Electric Current, Resistance, and Ohm's Law
  20. Circuits and Bioelectrics
  21. Magnetism
  22. Electromagnetic Induction, AC Circuits, and Electrical Technologies
  23. Electromagnetic Waves
  24. Geometric Optics
  25. Vision and Optical Instruments
  26. Wave Optics

Volumen II:
  27. Special Relativity
  28. Introduction to Quantum Physics
  29. Atomic Physics
  30. Nuclear Physics
  31. Radioactivity and Nuclear Physics
  32. Medical Applications of Nuclear Physics
  33. Particle Physics
  34. Frontiers of Physics
```

### Observaciones clave:
- **34 capítulos** en 2 volúmenes — el más exhaustivo
- Separa **Kinematics** → **2D Kinematics** (como Khan Academy)
- Separa **Fluid Statics** y **Fluid Dynamics**
- **Thermodynamics** dividida en capítulos: Gas Laws → Heat Transfer → Termodinámica (2.ª ley)
- **Óptica** dividida en: Geometric Optics + Vision + Wave Optics
- **Tienen Relatividad Especial** (cap. 27) y **Física Moderna completa** (caps. 28-34)
- **Diferenciadores**:
  - Aplicaciones biológicas y médicas (Bio en Physics)
  - Más detallado y riguroso que Physics Classroom
  - Enfoque: Universitario (calculus-based)

---

## 4. MIT OPEN COURSE WARE (MIT OCW 8.01 / 8.02)

### Estructura del curso 8.01 (Classical Mechanics):

```
Part I: Kinematics
  - Position, velocity, acceleration
  - 1D and 2D motion
  - Projectile motion
  - Circular motion

Part II: Newton's Laws
  - Forces, mass, Newton's three laws
  - Applications (inclined planes, pulleys)
  - Friction

Part III: Energy and Momentum
  - Work-energy theorem
  - Conservation of energy
  - Conservation of momentum
  - Collisions

Part IV: Rotational Dynamics
  - Torque
  - Moment of inertia
  - Angular momentum
  - Rolling motion

Part V: Gravity
  - Newton's law of gravitation
  - Kepler's laws
  - Gravitational potential energy

Part VI: Oscillations and Waves
  - Simple harmonic motion
  - Pendulums
  - Wave motion
  - Sound

8.02 (Electricity and Magnetism):
  - Electric fields and forces
  - Electric potential
  - Capacitors
  - Magnetic fields
  - Electromagnetic induction
  - Maxwell's equations
  - Electromagnetic waves
```

### Observaciones clave:
- **Muy riguroso** y matemático (calculus-based)
- **8.01 y 8.02** son cursos separados (mecánica y electromagnetismo)
- **"Gravity"** es una sección separada (no mezclada con dinámica)
- **Oscillations and Waves** al final de mecánica
- **Diferenciador**: Incluye problem sets con soluciones y exámenes

---

## 5. ANÁLISIS COMPARATIVO

### Tabla de comparación de estructuras

| Tema | Physics Classroom | Khan Academy | OpenStax | MIT OCW | Aeterna (actual) |
|:-----|:-----------------:|:------------:|:--------:|:-------:|:-----------------:|
| **Fundamentos / Introducción** | ❌ | ❌ | ✅ Cap. 1 | ❌ | ✅ |
| **Método científico** | ❌ | ❌ | ✅ (Cap. 1) | ❌ | ✅ |
| **Cinemática 1D** | ✅ S1 | ✅ Ud1 | ✅ Cap. 2 | ✅ | ❌ (Falta) |
| **Cinemática 2D** | ✅ S1+S3 | ✅ Ud2 | ✅ Cap. 3 | ✅ | ✅ Cinemática |
| **Leyes de Newton** | ✅ S2 | ✅ Ud3 | ✅ Cap. 4 | ✅ | ✅ |
| **Aplicaciones de Newton** | ✅ S3 (Vectores) | ✅ Ud4 | ✅ Cap. 5 | ✅ | ✅ Fuerzas |
| **Momento y torque** | ✅ S7 | ✅ Ud8 | ✅ Cap. 9-10 | ✅ | ❌ (Falta) |
| **Momentum/Colisiones** | ✅ S4 | ✅ Ud7 | ✅ Cap. 8 | ✅ | ❌ (Falta) |
| **Trabajo y energía** | ✅ S5 | ✅ Ud6 | ✅ Cap. 7 | ✅ | ⚠️ Solo en compendio |
| **Movimiento circular** | ✅ S6 | ⚠️ Parcial | ✅ Cap. 6 | ✅ | ❌ (Falta) |
| **Gravitación** | ✅ S6 (parcial) | ⚠️ Parcial | ✅ Cap. 6 | ✅ Sep. | ❌ (Falta) |
| **Fluidos** | ✅ S8 | ✅ Ud10 | ✅ Cap. 11-12 | ⚠️ Parcial | ✅ |
| **Termodinámica** | ✅ S9 | ✅ Ud11 | ✅ Cap. 13-15 | ❌ | ✅ |
| **Electricidad estática** | ✅ S10 | ❌ | ✅ Cap. 18 | ❌ | ⚠️ Solo intro |
| **Circuitos eléctricos** | ✅ S11 | ❌ | ✅ Cap. 19-20 | ❌ | ❌ |
| **Magnetismo** | ✅ S12 | ❌ | ✅ Cap. 21-22 | ❌ | ⚠️ Solo intro |
| **Ondas y sonido** | ✅ S14-15 | ✅ Ud9 | ✅ Cap. 16-17 | ✅ S6 | ✅ |
| **Óptica geométrica** | ✅ S16-17 | ❌ | ✅ Cap. 24-25 | ❌ | ⚠️ Solo en compendio |
| **Óptica ondulatoria** | ❌ | ❌ | ✅ Cap. 26 | ❌ | ❌ |
| **Relatividad especial** | ❌ | ❌ | ✅ Cap. 27 | ✅ | ✅ |
| **Relatividad general** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Mecánica cuántica** | ❌ | ❌ | ✅ Cap. 28 | ❌ | ✅ |
| **Física atómica/nuclear** | ❌ | ❌ | ✅ Cap. 29-32 | ❌ | ✅ |
| **Física de partículas** | ❌ | ❌ | ✅ Cap. 33 | ❌ | ✅ |
| **Fronteras de la física** | ❌ | ❌ | ✅ Cap. 34 | ❌ | ⚠️ Solo 4 mini-artículos |

### Insights principales:
1. **Physics Classroom** es la referencia para **estructura de navegación** (simple, clara, lineal)
2. **OpenStax** es la referencia para **cobertura y profundidad** (34 capítulos)
3. **MIT OCW** es la referencia para **rigor matemático y ejercicios**
4. **Khan Academy** es la referencia para **gamificación y progreso**

---

## 6. MEJORES PRÁCTICAS IDENTIFICADAS

### 🏗️ Estructura de navegación (de Physics Classroom)
- **Menú lateral fijo** con todas las secciones
- Nivel 1: Sección principal (ej: "Vectors")
- Nivel 2: Sub-lessons dentro de cada sección
- Nivel 3: Preguntas de comprensión al final
- **Barra de progreso** visible

### 📊 Sistema de progreso (de Khan Academy)
- **Unidades → Lecciones → Práctica**
- Puntos y badges por completar
- Mastery system (principiante → familiarizado → maestro)
- **Ruta de aprendizaje personalizada** basada en rendimiento

### 📝 Formato de contenido (de OpenStax)
- Cada capítulo tiene:
  - Objetivos de aprendizaje
  - Resumen de sección
  - Conceptos clave
  - Ejercicios con soluciones
  - Problemas de pensamiento crítico
  - Glosario de términos

### 🎯 Gamificación (de Khan Academy)
- Sistema de puntos y energía
- Insignias por completar secciones
- Streaks (rachas de estudio diario)
- Mapa de progreso visual

---

## 7. RECOMENDACIONES PARA AETERNA

### Nivel de profundidad recomendado:
Para tu audiencia (secundaria + universitarios + curiosos):
- **Alcanzar** el nivel de Physics Classroom (claro y accesible)
- **No exceder** la complejidad de OpenStax (muy técnico para muchos)
- **Complementar** con la gamificación de Khan Academy

### Estructura de navegación recomendada:

```
📊 MAPA DE CONTENIDO (Página principal)
├── 📘 Fundamentos (Nivel 1)
│   ├── Guía maestra
│   ├── Método científico
│   ├── Materia y energía
│   ├── Leyes de Newton
│   └── Vectores
├── 📗 El Reino de lo Clásico (Nivel 2)
│   ├── Mecánica clásica
│   ├── Termodinámica
│   ├── Electromagnetismo
│   ├── Ondas y óptica
│   ├── Cinemática ✨ NUEVO
│   └── Fluidos ✨ NUEVO
├── 📕 Las Fronteras de la Realidad (Nivel 3)
│   ├── Relatividad especial
│   ├── Relatividad general ✨ NUEVO
│   ├── Mecánica cuántica
│   └── Física atómica y nuclear
└── 📙 La Síntesis y el Futuro (Nivel 4)
    ├── Cosmología
    ├── Física de partículas
    ├── Teoría del todo
    └── Física y tecnología
```

### Features por implementar:
1. ✅ Sidebar con estructura jerárquica (como Physics Classroom)
2. ✅ Barra de progreso por nivel (como Khan Academy)
3. ✅ Breadcrumbs en cada artículo
4. ✅ Artículos con prerequisitos (ya definidos)
5. ⏳ Sistema de insignias (ya tienes el campo `insignia`)
6. ⏳ Preguntas interactivas con verificación (ya tienes el componente `AeternaDecisionBox`)
7. ⏳ Búsqueda por tags y categorías
8. ⏳ Página de "Próxima parada" automática (ya la tienes en cada artículo)

---

## 8. ACCIONES DERIVADAS

| Prioridad | Acción | Estado |
|:---------:|--------|:-----:|
| 🟢 Alta | Añadir artículos faltantes detectados | Pendiente |
| 🟢 Alta | Añadir `prerequisites` a artículos originales | Pendiente |
| 🟡 Media | Crear índice/próxima parada cruzado entre artículos | Pendiente |
| 🟡 Media | Añadir ejercicios a artículos que solo tienen preguntas | Pendiente |
| 🟢 Baja | Implementar sidebar jerárquico en React | Técnica |
| 🟢 Baja | Implementar sistema de progreso visual | Técnica |
| 🟢 Baja | Crear página de búsqueda de artículos | Técnica |

---

*Documento generado: Mayo 2026*
*Fuentes: The Physics Classroom (analizado directamente), Khan Academy (estructura pública conocida), OpenStax College Physics 2e (estructura pública conocida), MIT OCW 8.01/8.02 (estructura pública conocida)*