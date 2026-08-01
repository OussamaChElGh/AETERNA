'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Brain, Cpu, Sparkles, BookOpen, Gamepad2, 
  Atom, HelpCircle, Compass, Zap, Layers, Scale 
} from "lucide-react";
import { KanaTool } from "@/components/interactive/KanaTool";
import { KanaGameV2 } from "@/components/interactive/KanaGameV2";
import { AeternaInteractiveQuestion } from "@/components/interactive/AeternaInteractiveQuestion";
import { PhysicsSimulator } from "@/components/interactive/PhysicsSimulator";
import { AtomicModelSimulator } from "@/components/interactive/AtomicModelSimulator";

// Quizzes de física extraídos de las guías
const PHYSICS_QUESTIONS = [
  {
    id: "phys-q1",
    title: "Cinemática: Punto de Inflexión",
    description: "Analiza el comportamiento de un proyectil en el punto más alto de su trayectoria.",
    content: `Pregunta: Según la cinemática, si lanzas una pelota hacia arriba, en el punto más alto de su trayectoria justo antes de empezar a caer, su velocidad es...
Opciones:
- Máxima, porque se prepara para caer
- Cero, pero su aceleración sigue siendo la de la gravedad
- Cero y su aceleración también es cero
- Igual que cuando salió de tu mano
RespuestaCorrecta: Cero, pero su aceleración sigue siendo la de la gravedad
XP: 50
Tipo: 🌌 CINEMÁTICA`
  },
  {
    id: "phys-q2",
    title: "Dinámica: Inercia y Fuerza",
    description: "Compara la aceleración de dos masas distintas bajo la misma fuerza neta.",
    content: `Pregunta: Si empujas a la vez un coche pequeño (poco masivo) y un camión grande (muy masivo) con la misma fuerza neta, ¿cuál acelerará más según la segunda ley de Newton?
Opciones:
- El camión, porque tiene más masa
- Ambos acelerarán igual
- El coche pequeño, porque su masa es menor
- Depende de la velocidad a la que ya iban
RespuestaCorrecta: El coche pequeño, porque su masa es menor
XP: 50
Tipo: ⚙️ DINÁMICA`
  },
  {
    id: "phys-q3",
    title: "Energía: Trabajo y Desplazamiento",
    description: "Determina el trabajo mecánico realizado al sostener una masa estática.",
    content: `Pregunta: Estás sosteniendo una pesada caja de 50 kg sobre tu cabeza mientras esperas el autobús durante 10 minutos. ¿Cuánto trabajo (W) mecanico estás realizando sobre la caja durante ese tiempo?
Opciones:
- Muchísimo, depende del peso
- Cero, porque no hay desplazamiento
- Depende del esfuerzo muscular invertido
- Igual a la fuerza gravitatoria
RespuestaCorrecta: Cero, porque no hay desplazamiento
XP: 50
Tipo: ⚡ TRABAJO Y ENERGÍA`
  },
  {
    id: "phys-q4",
    title: "Física Atómica: Fuerza Nuclear Fuerte",
    description: "Explora la cohesión de los protones dentro del núcleo atómico.",
    content: `Pregunta: ¿Qué fuerza evita que el núcleo del átomo se desintegre por la repulsión de sus protones?
Opciones:
- Gravedad
- Magnetismo
- Fuerza Nuclear Fuerte
- Fuerza Nuclear Débil
RespuestaCorrecta: Fuerza Nuclear Fuerte
XP: 50
Tipo: ⚛️ FÍSICA ATÓMICA`
  }
];

export default function InteractivePage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: "kana-tool",
      title: "Explorador de Kana",
      subtitle: "JAPONÉS PRÁCTICO",
      icon: BookOpen,
      color: "from-brand-gold/25 to-transparent",
      badge: "Herramienta",
      description: "Aprende y repasa los silabarios Hiragana y Katakana de forma dinámica. Alterna Romaji y escucha audios de pronunciación oficial.",
    },
    {
      id: "kana-game",
      title: "Reto del Kana V2",
      subtitle: "EXAMEN DE VELOCIDAD",
      icon: Gamepad2,
      color: "from-brand-cosmic/25 to-transparent",
      badge: "Juego",
      description: "Pon a prueba tu lectura rápida y clasificación de kana con temporizadores, rachas y asimilación de vocabulario nativo vs extranjero.",
    },
    {
      id: "physics-simulator",
      title: "Simulador de Proyectiles",
      subtitle: "FÍSICA PARABÓLICA",
      icon: Scale,
      color: "from-cyan-500/20 to-transparent",
      badge: "Simulador",
      description: "Experimenta con las variables de velocidad, ángulo de tiro, altura inicial y gravedad para predecir y observar trayectorias en tiempo real.",
    },
    {
      id: "atomic-model",
      title: "Modelo Atómico de Bohr",
      subtitle: "FÍSICA CUÁNTICA",
      icon: Zap,
      color: "from-purple-500/20 to-transparent",
      badge: "Simulador",
      description: "Visualiza órbitas atómicas, electrones y nucleones. Excita electrones mediante radiación fotónica y observa la emisión de energía.",
    },
    {
      id: "physics-quizzes",
      title: "Cuestionarios de Física",
      subtitle: "CIENCIAS NATURALES",
      icon: Atom,
      color: "from-emerald-500/20 to-transparent",
      badge: "Laboratorio",
      description: "Colección de quizzes interactivos y validaciones conceptuales extraídas de la rama de Física Mecánica y Física Atómica.",
    }
  ];

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-ink dark:bg-[#09090B] dark:text-[#f2f2f2] relative overflow-hidden transition-colors duration-500">
      {/* Background Decorator */}
      <div className="absolute inset-0 bg-engraving opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,transparent_80%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <AnimatePresence mode="wait">
          {!selectedTool ? (
            <motion.div
              key="directory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20"
            >
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-5 py-2 rounded-full border border-brand-gold/20 shadow-sm">
                  <Sparkles size={14} className="text-brand-gold animate-pulse" />
                  <span className="text-[10px] font-mono text-brand-gold font-bold uppercase tracking-[0.4em]">Cámara de Recursos</span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl leading-tight tracking-tighter uppercase">
                  Laboratorio <span className="text-brand-gold italic font-normal normal-case">Interactivo</span>
                </h1>
                <p className="text-brand-muted text-base md:text-lg font-sans font-light leading-relaxed max-w-xl mx-auto">
                  Accede de forma directa a todas las herramientas interactivas, desafíos de velocidad y simuladores desarrollados para el ecosistema Aeterna.
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent w-full mt-10" />
              </div>

              {/* Tools Directory Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {tools.map((tool, idx) => {
                  const Icon = tool.icon;
                  return (
                    <motion.button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group flex flex-col justify-between text-left p-10 bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative min-h-[380px]"
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                      
                      <div className="relative z-10 space-y-8 w-full">
                        {/* Top info and Icon */}
                        <div className="flex justify-between items-start w-full">
                          <span className="text-[9px] font-mono font-black text-brand-gold tracking-[0.2em] uppercase bg-brand-gold/5 border border-brand-gold/20 px-3 py-1 rounded-md">
                            {tool.badge}
                          </span>
                          <div className="w-14 h-14 rounded-2xl bg-brand-offwhite dark:bg-[#1E1E22] border border-black/5 dark:border-white/5 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform duration-500 shadow-inner">
                            <Icon size={24} />
                          </div>
                        </div>

                        {/* Title and descriptions */}
                        <div className="space-y-4">
                          <span className="text-[9px] font-mono font-bold tracking-[0.4em] text-brand-muted uppercase block">
                            {tool.subtitle}
                          </span>
                          <h3 className="font-serif text-3xl text-brand-ink dark:text-brand-offwhite group-hover:text-brand-gold transition-colors duration-500">
                            {tool.title}
                          </h3>
                          <p className="text-brand-muted text-sm font-light leading-relaxed font-sans line-clamp-3">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer element */}
                      <div className="relative z-10 pt-8 border-t border-black/5 dark:border-white/5 flex items-center gap-4 text-[10px] font-mono font-black text-brand-muted group-hover:text-brand-gold transition-colors tracking-[0.3em] uppercase">
                        Invocar Recurso <Zap size={14} className="animate-pulse" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-12"
            >
              {/* Back Button and Workspace Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-brand-border pb-10">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="flex items-center gap-4 text-[10px] font-mono font-black uppercase tracking-[0.5em] text-brand-muted hover:text-brand-gold transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center group-hover:border-brand-gold/30 transition-all shadow-sm">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                  Volver al Directorio
                </button>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-brand-gold animate-ping" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-brand-gold">
                    Espacio de Trabajo Activo
                  </span>
                </div>
              </div>

              {/* Render Selected Tool */}
              <div className="py-8">
                {selectedTool === "kana-tool" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 p-10 md:p-16 rounded-[3rem] shadow-xl"
                  >
                    <div className="text-center mb-16 space-y-4">
                      <span className="text-[9px] font-mono font-bold tracking-[0.4em] text-brand-gold uppercase block">MÉTODO DE ASIMILACIÓN</span>
                      <h2 className="font-serif text-4xl md:text-5xl uppercase">Explorador de Silabario Japonés</h2>
                      <p className="text-brand-muted max-w-xl mx-auto font-sans font-light leading-relaxed text-sm">
                        Domina el Hiragana y el Katakana. Haz clic en las celdas para reproducir el audio de pronunciación o prueba a arrastrar en los ejercicios.
                      </p>
                    </div>
                    <KanaTool />
                  </motion.div>
                )}

                {selectedTool === "kana-game" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-brand-ink text-brand-offwhite border border-brand-border p-10 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-brand-gold/[0.02] pointer-events-none" />
                    <KanaGameV2 />
                  </motion.div>
                )}

                {selectedTool === "physics-simulator" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 p-10 md:p-16 rounded-[3rem] shadow-xl"
                  >
                    <div className="text-center mb-16 space-y-4">
                      <span className="text-[9px] font-mono font-bold tracking-[0.4em] text-brand-gold uppercase block">SIMULADOR FÍSICO</span>
                      <h2 className="font-serif text-4xl md:text-5xl uppercase">Cinemática y Dinámica de Proyectiles</h2>
                      <p className="text-brand-muted max-w-xl mx-auto font-sans font-light leading-relaxed text-sm">
                        Calcula trayectorias parabólicas en diferentes planetas y campos gravitacionales. Observa el vector de velocidad horizontal y vertical.
                      </p>
                    </div>
                    <PhysicsSimulator />
                  </motion.div>
                )}

                {selectedTool === "atomic-model" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 p-10 md:p-16 rounded-[3rem] shadow-xl"
                  >
                    <div className="text-center mb-16 space-y-4">
                      <span className="text-[9px] font-mono font-bold tracking-[0.4em] text-brand-gold uppercase block">INTERACTIVO CUÁNTICO</span>
                      <h2 className="font-serif text-4xl md:text-5xl uppercase">Modelo Atómico de Bohr</h2>
                      <p className="text-brand-muted max-w-xl mx-auto font-sans font-light leading-relaxed text-sm">
                        Visualiza los orbitales y la estructura interna del núcleo. Provoca la absorción fotónica y la emisión de energía cuántica hv.
                      </p>
                    </div>
                    <AtomicModelSimulator />
                  </motion.div>
                )}

                {selectedTool === "physics-quizzes" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-16"
                  >
                    <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
                      <span className="text-[9px] font-mono font-bold tracking-[0.4em] text-brand-gold uppercase block">SISTEMA AETERNA</span>
                      <h2 className="font-serif text-4xl md:text-5xl uppercase">Cuestionarios de Física</h2>
                      <p className="text-brand-muted font-sans font-light leading-relaxed text-sm">
                        Colección de retos conceptuales síncronos. Responde correctamente para asimilar los principios axiomáticos y ganar XP para tu perfil.
                      </p>
                    </div>
                    
                    <div className="space-y-24 max-w-5xl mx-auto">
                      {PHYSICS_QUESTIONS.map((q, idx) => (
                        <div key={q.id} className="relative">
                          {/* Section Title Decorator */}
                          <div className="flex items-center gap-6 mb-8 px-6">
                            <span className="font-mono text-[10px] font-bold text-brand-gold/60">0{idx + 1}.</span>
                            <span className="text-[11px] font-mono font-black uppercase tracking-[0.4em] text-brand-ink/80 dark:text-brand-offwhite/80">{q.title}</span>
                            <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                          </div>
                          <AeternaInteractiveQuestion content={q.content} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
