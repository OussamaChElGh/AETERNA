'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Activity, ShieldAlert, Award, RefreshCw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ElementData {
  symbol: string;
  name: string;
  z: number; // protons
  n: number; // neutrons
  electrons: number;
  config: string;
  mass: number;
  description: string;
  facts: string[];
}

const ELEMENTS: Record<string, ElementData> = {
  H: {
    symbol: "H",
    name: "Hidrógeno",
    z: 1,
    n: 0,
    electrons: 1,
    config: "1s¹",
    mass: 1.008,
    description: "El elemento más simple y abundante del universo. Constituye el combustible primordial de las estrellas.",
    facts: ["Su núcleo ordinario no posee neutrones (Protio).", "Representa cerca del 75% de la masa bariónica del cosmos.", "Altamente inflamable, forma agua al combinarse con oxígeno."]
  },
  He: {
    symbol: "He",
    name: "Helio",
    z: 2,
    n: 2,
    electrons: 2,
    config: "1s²",
    mass: 4.003,
    description: "Gas noble incoloro e inerte. Es el segundo elemento más ligero y se crea mediante fusión estelar en las secuencias principales.",
    facts: ["Primer gas noble de la tabla periódica.", "Fue descubierto en el Sol (de ahí Helio, de Helios) antes de hallarse en la Tierra.", "Permanecerá gaseoso incluso a temperaturas cercanas al cero absoluto."]
  },
  Li: {
    symbol: "Li",
    name: "Litio",
    z: 3,
    n: 4,
    electrons: 3,
    config: "[He] 2s¹",
    mass: 6.94,
    description: "El metal sólido más ligero de la tabla periódica. Altamente reactivo, abre la segunda capa de electrones.",
    facts: ["Reacciona vigorosamente con el agua.", "Tiene la menor densidad de todos los elementos sólidos.", "Esencial en tecnologías modernas de almacenamiento energético (baterías)."]
  },
  C: {
    symbol: "C",
    name: "Carbono",
    z: 6,
    n: 6,
    electrons: 6,
    config: "[He] 2s² 2p²",
    mass: 12.011,
    description: "El pilar de la química orgánica y de la vida en la Tierra. Su capacidad de tetravalencia le permite formar largas cadenas moleculares.",
    facts: ["Puede presentarse como grafito blando o como diamante ultraduro.", "El isótopo Carbono-14 es clave para la datación arqueológica.", "Forma la base de la química de todas las formas de vida conocidas."]
  },
  O: {
    symbol: "O",
    name: "Oxígeno",
    z: 8,
    n: 8,
    electrons: 8,
    config: "[He] 2s² 2p⁴",
    mass: 15.999,
    description: "Gas altamente reactivo e indispensable para la respiración aeróbica de los seres vivos y la combustión.",
    facts: ["Constituye aproximadamente el 21% de la atmósfera terrestre.", "Es el tercer elemento más abundante del universo por masa.", "En fase líquida y sólida presenta un característico color azul claro."]
  },
  Ne: {
    symbol: "Ne",
    name: "Neón",
    z: 10,
    n: 10,
    electrons: 10,
    config: "[He] 2s² 2p⁶",
    mass: 20.180,
    description: "Gas noble que brilla con una intensa luminiscencia rojiza-anaranjada al ser excitado eléctricamente en tubos de descarga.",
    facts: ["Tiene el rango de temperatura líquida más estrecho de todos los elementos.", "Inerte, no forma compuestos estables en condiciones estándar.", "Usado masivamente en rótulos y avisos luminosos de alto contraste."]
  }
};

export function AtomicModelSimulator() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("H");
  const [isExcited, setIsExcited] = useState(false);
  const [photonEmitted, setPhotonEmitted] = useState(false);

  const element = ELEMENTS[selectedSymbol] || ELEMENTS.H;

  // Orbit parameters based on electron configuration Bohr Shell model
  // Shell K (n=1) max 2, Shell L (n=2) max 8
  const shell1Count = Math.min(element.electrons, 2);
  const shell2Count = Math.max(0, element.electrons - 2);

  const handleExcitation = () => {
    if (isExcited || photonEmitted) return;
    setIsExcited(true);
    setPhotonEmitted(false);

    // After 2 seconds, the excited electron decays to ground state and emits a photon
    setTimeout(() => {
      setIsExcited(false);
      setPhotonEmitted(true);

      // Reset photon animation after 1.5 seconds
      setTimeout(() => {
        setPhotonEmitted(false);
      }, 1500);
    }, 2500);
  };

  // Generate nucleus nucleons coordinates
  const nucleons = [];
  const totalNucleons = element.z + element.n;
  for (let i = 0; i < totalNucleons; i++) {
    // Generate cluster coordinates using polar coords around center
    const r = i === 0 ? 0 : 5 + Math.random() * 12;
    const angle = Math.random() * Math.PI * 2;
    nucleons.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      type: i < element.z ? "proton" : "neutron"
    });
  }

  return (
    <div className="space-y-12">
      {/* Visual Canvas Card */}
      <div className="bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center gap-12 min-h-[450px]">
        {/* Glowing Nebulous background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,105,20,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Left: 2D Interactive Orbit View */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center shrink-0">
          
          {/* Orbit n=1 */}
          <div className="absolute w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full border border-white/10 flex items-center justify-center">
            {/* Orbit n=1 Electrons */}
            {Array.from({ length: shell1Count }).map((_, idx) => {
              const angle = (idx / shell1Count) * 360;
              // If excited, the electron from outermost shell (which might be n=1 for hydrogen) jumps out!
              const isThisExcited = isExcited && element.electrons === 1;
              return (
                <div
                  key={`electron-n1-${idx}`}
                  className="absolute w-full h-full animate-spin"
                  style={{
                    animationDuration: "5s",
                    transform: `rotate(${angle}deg)`,
                    animationPlayState: isExcited ? "paused" : "running"
                  }}
                >
                  <motion.div
                    animate={{
                      scale: isThisExcited ? 1.6 : 1,
                      x: isThisExcited ? 35 : 0 // moves outward
                    }}
                    className={cn(
                      "absolute w-3 h-3 md:w-4 md:h-4 rounded-full -top-1.5 md:-top-2 left-1/2 -translate-x-1/2",
                      isThisExcited 
                        ? "bg-[#22d3ee] shadow-[0_0_20px_#22d3ee] animate-pulse" 
                        : "bg-brand-gold shadow-[0_0_8px_#D4AF37]"
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Orbit n=2 */}
          {shell2Count > 0 && (
            <div className="absolute w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full border border-white/5 flex items-center justify-center">
              {/* Orbit n=2 Electrons */}
              {Array.from({ length: shell2Count }).map((_, idx) => {
                const angle = (idx / shell2Count) * 360;
                // If excited, we excite one of the shell 2 electrons
                const isThisExcited = isExcited && idx === 0;
                return (
                  <div
                    key={`electron-n2-${idx}`}
                    className="absolute w-full h-full animate-spin"
                    style={{
                      animationDuration: "10s",
                      transform: `rotate(${angle}deg)`,
                      animationPlayState: isExcited ? "paused" : "running"
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: isThisExcited ? 1.6 : 1,
                        y: isThisExcited ? -40 : 0 // push outward
                      }}
                      className={cn(
                        "absolute w-3 h-3 md:w-4 md:h-4 rounded-full -top-1.5 md:-top-2 left-1/2 -translate-x-1/2",
                        isThisExcited 
                          ? "bg-[#22d3ee] shadow-[0_0_20px_#22d3ee] animate-pulse" 
                          : "bg-brand-gold shadow-[0_0_8px_#D4AF37]"
                      )}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Nucleus Cluster representation at Center */}
          <div className="absolute w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
            <div className="relative w-full h-full">
              {nucleons.map((nucleon, i) => (
                <div
                  key={`nucleon-${i}`}
                  className={cn(
                    "absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-[0.5px] border-black/20",
                    nucleon.type === "proton" 
                      ? "bg-brand-gold shadow-[0_0_6px_#D4AF37]" 
                      : "bg-[#22d3ee] shadow-[0_0_6px_#22d3ee]"
                  )}
                  style={{
                    top: `calc(50% + ${nucleon.y}px)`,
                    left: `calc(50% + ${nucleon.x}px)`,
                    transform: "translate(-50%, -50%)"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Photon Emission Animation overlay */}
          <AnimatePresence>
            {photonEmitted && (
              <motion.div
                initial={{ opacity: 1, scale: 0.8 }}
                animate={{ opacity: 0, scale: 3, x: 100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute text-cyan-400 font-mono text-[9px] pointer-events-none select-none"
              >
                {/* squiggly photon ray symbol */}
                <svg className="w-16 h-8 text-[#22d3ee]" fill="none" viewBox="0 0 60 20">
                  <path d="M 0 10 Q 5 0, 10 10 T 20 10 T 30 10 T 40 10 T 50 10" stroke="currentColor" strokeWidth="1.5" />
                  <text x="52" y="14" fill="currentColor">hv (Fotón)</text>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Informational Side Card */}
        <div className="flex-1 space-y-6 w-full">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-mono text-brand-gold font-bold tracking-[0.4em] uppercase block mb-1">
                Ficha del Elemento
              </span>
              <h2 className="font-serif text-4xl text-white font-medium uppercase">
                {element.name}
              </h2>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-serif text-3xl text-brand-gold font-bold shadow-lg">
              {element.symbol}
            </div>
          </div>

          <p className="text-white/60 font-sans font-light leading-relaxed text-sm">
            {element.description}
          </p>

          {/* Nuclear metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center">
            <div>
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Protones (Z)</span>
              <span className="font-mono text-lg text-white font-black">{element.z}</span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Neutrones (N)</span>
              <span className="font-mono text-lg text-white font-black">{element.n}</span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Electrones</span>
              <span className="font-mono text-lg text-white font-black">{element.electrons}</span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Config.</span>
              <span className="font-mono text-xs text-brand-gold font-bold block mt-1">{element.config}</span>
            </div>
          </div>

          {/* Facts list */}
          <div className="space-y-2 border-t border-white/5 pt-6">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-2">Axiomas Clave</span>
            {element.facts.map((fact, idx) => (
              <div key={idx} className="flex gap-3 text-xs text-white/50 leading-relaxed font-sans font-light">
                <span className="text-brand-gold">◆</span>
                <p>{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Controls Card */}
      <div className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4 text-center md:text-left">
          <h3 className="font-serif text-2xl uppercase tracking-tight text-brand-ink dark:text-brand-offwhite">Mesa de Operaciones</h3>
          <p className="text-brand-muted text-sm font-sans font-light leading-relaxed max-w-lg">
            Elige un átomo de la tabla periódica base y aplica radiación electromagnética (Fotónica) para ver los efectos cuánticos de excitación de electrones.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center shrink-0">
          {/* Element Selector Buttons */}
          <div className="flex bg-black/5 dark:bg-black/40 p-1.5 rounded-xl border border-black/5 dark:border-white/5 gap-1">
            {Object.keys(ELEMENTS).map((sym) => (
              <button
                key={sym}
                onClick={() => { setSelectedSymbol(sym); handleExcitation(); }}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all",
                  selectedSymbol === sym 
                    ? "bg-[#0A0A0B] text-brand-gold shadow-md" 
                    : "text-brand-ink/40 dark:text-[#f2f2f2]/40 hover:text-brand-gold"
                )}
              >
                {sym}
              </button>
            ))}
          </div>

          {/* Radiation Action Button */}
          <button
            onClick={handleExcitation}
            disabled={isExcited || photonEmitted}
            className="flex items-center gap-3 bg-[#0A0A0B] text-[#D4AF37] border border-[#D4AF37]/40 px-6 py-4 rounded-xl font-mono font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-30"
          >
            <Zap size={14} className="animate-pulse text-brand-gold" /> Radiar Fotón
          </button>
        </div>
      </div>
    </div>
  );
}
