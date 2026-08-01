import { 
  Atom, BookOpen, Brain, Landmark, Palette, History, Languages, Music,
  Calculator, Cpu, Microscope, Globe, Users, Scale, FileText, Camera
} from 'lucide-react';

export const CATEGORIES_DATA = [
  {
    id: "ciencias_formales",
    name: "Ciencias Formales",
    description: "Estudian sistemas abstractos y relaciones lógicas",
    icon: Calculator,
    path: "/guias/ciencias_formales",
    subcategories: [
      { id: "matematicas", name: "Matemáticas", icon: Calculator, topics: ["Álgebra", "Geometría", "Cálculo", "Estadística", "Teoría de números", "Matemática aplicada"] },
      { id: "logica", name: "Lógica", icon: Brain, topics: ["Lógica proposicional", "Lógica matemática", "Lógica simbólica", "Lógica filosófica"] },
      { id: "informatica", name: "Informática teórica", icon: Cpu, topics: ["Algoritmos", "Teoría de la computación", "Inteligencia artificial", "Ciencia de datos"] }
    ]
  },
  {
    id: "ciencias_naturales",
    name: "Ciencias Naturales",
    description: "Estudian el mundo físico y biológico",
    icon: Atom,
    path: "/guias/ciencias_naturales",
    subcategories: [
      { id: "fisica", name: "Física", icon: Atom, topics: ["Mecánica", "Termodinámica", "Electromagnetismo", "Física cuántica", "Relatividad", "Astrofísica"] },
      { id: "quimica", name: "Química", icon: Microscope, topics: ["Química orgánica", "Química inorgánica", "Bioquímica", "Química analítica", "Química física"] },
      { id: "biologia", name: "Biología", icon: Globe, topics: ["Biología celular", "Genética", "Microbiología", "Zoología", "Botánica", "Ecología"] },
      { id: "geologia", name: "Geología", icon: Landmark, topics: ["Mineralogía", "Paleontología", "Geodinámica", "Estratigrafía"] },
      { id: "astronomia", name: "Astronomía", icon: Globe, topics: ["Cosmología", "Astrofísica", "Planetología"] }
    ]
  },
  {
    id: "ciencias_sociales",
    name: "Ciencias Sociales",
    description: "Estudian el comportamiento humano y las sociedades",
    icon: Users,
    path: "/guias/ciencias_sociales",
    subcategories: [
      { id: "sociologia", name: "Sociología", icon: Users, topics: ["Sociología urbana", "Sociología cultural", "Sociología del trabajo"] },
      { id: "psicologia", name: "Psicología", icon: Brain, topics: ["Psicología cognitiva", "Psicología clínica", "Neuropsicología", "Psicología social"] },
      { id: "economia", name: "Economía", icon: Calculator, topics: ["Microeconomía", "Macroeconomía", "Economía conductual", "Finanzas"] },
      { id: "antropologia", name: "Antropología", icon: Globe, topics: ["Antropología cultural", "Antropología biológica"] },
      { id: "arqueologia", name: "Arqueología", icon: History, topics: [] },
      { id: "politica", name: "Ciencia política", icon: Landmark, topics: ["Teoría política", "Relaciones internacionales", "Sistemas políticos"] }
    ]
  },
  {
    id: "humanidades",
    name: "Humanidades",
    description: "Estudian la cultura, el pensamiento y la expresión humana",
    icon: BookOpen,
    path: "/guias/humanidades",
    subcategories: [
      { id: "filosofia", name: "Filosofía", icon: Brain, topics: ["Metafísica", "Epistemología", "Ética", "Estética", "Filosofía política"] },
      { id: "historia", name: "Historia", icon: History, topics: ["Historia antigua", "Historia medieval", "Historia moderna", "Historia contemporánea"] },
      { id: "linguistica", name: "Lingüística", icon: Languages, topics: ["Fonética", "Sintaxis", "Semántica", "Pragmática"] },
      { id: "literatura", name: "Literatura", icon: FileText, topics: ["Narrativa", "Poesía", "Ensayo", "Crítica literaria"] }
    ]
  },
  {
    id: "artes",
    name: "Artes",
    description: "Expresión estética y creativa",
    icon: Palette,
    path: "/guias/artes",
    subcategories: [
      { id: "visuales", name: "Artes visuales", icon: Palette, topics: ["Pintura", "Escultura", "Fotografía", "Ilustración"] },
      { id: "escenicas", name: "Artes escénicas", icon: Users, topics: ["Teatro", "Danza", "Performance"] },
      { id: "musica", name: "Música", icon: Music, topics: ["Composición", "Producción musical", "Teoría musical"] },
      { id: "audiovisuales", name: "Cine y audiovisuales", icon: Camera, topics: ["Dirección", "Guion", "Edición", "Fotografía"] },
      { id: "diseno", name: "Diseño", icon: Palette, topics: ["Diseño gráfico", "Diseño industrial", "UX/UI"] }
    ]
  },
  {
    id: "aplicadas",
    name: "Ciencias Aplicadas / Profesionales",
    description: "Uso práctico del conocimiento",
    icon: Landmark,
    path: "/guias/aplicadas",
    subcategories: [
      { id: "ingenieria", name: "Ingeniería", icon: Cpu, topics: ["Ingeniería informática", "Ingeniería industrial", "Ingeniería civil", "Ingeniería eléctrica"] },
      { id: "derecho", name: "Derecho", icon: Scale, topics: ["Derecho civil", "Derecho penal", "Derecho internacional"] },
      { id: "educacion", name: "Educación", icon: BookOpen, topics: ["Pedagogía", "Didáctica", "Tecnología educativa"] }
    ]
  },
  {
    id: "idiomas",
    name: "Idiomas",
    description: "Estudio de las lenguas del mundo",
    icon: Languages,
    path: "/guias/idiomas",
    subcategories: [
      { id: "japones", name: "Japonés", icon: Languages, topics: ["Hiragana", "Katakana", "Kanji", "Gramática", "Vocabulario"] },
      { id: "ingles", name: "Inglés", icon: Languages, topics: ["Gramática", "Vocabulario", "Pronunciación", "Phrasal Verbs"] },
      { id: "frances", name: "Francés", icon: Languages, topics: ["Gramática", "Vocabulario", "Pronunciación"] },
      { id: "aleman", name: "Alemán", icon: Languages, topics: ["Gramática", "Vocabulario", "Declinaciones"] }
    ]
  }
];
