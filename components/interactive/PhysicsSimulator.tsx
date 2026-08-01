'use client';
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Target, Scale, Zap, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Presets {
  name: string;
  angle: number;
  velocity: number;
  gravity: number;
  height: number;
  label: string;
}

const PRESETS: Presets[] = [
  { name: "Tierra (Estándar)", angle: 45, velocity: 20, gravity: 9.81, height: 0, label: "Lanzamiento típico en la Tierra." },
  { name: "Gravedad de la Luna", angle: 45, velocity: 15, gravity: 1.62, height: 0, label: "El proyectil vuela muchísimo más alto y lejos." },
  { name: "Disparo desde Torre", angle: 0, velocity: 25, gravity: 9.81, height: 8, label: "Lanzamiento horizontal desde una altura de 8 metros." },
  { name: "Fuerte Gravedad (Júpiter)", angle: 60, velocity: 30, gravity: 24.79, height: 1, label: "La caída es abrupta debido a la inmensa gravedad." }
];

export function PhysicsSimulator() {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(20);
  const [gravity, setGravity] = useState(9.81);
  const [height, setHeight] = useState(0);
  
  const [isFiring, setIsFiring] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showEquations, setShowEquations] = useState(false);

  // Trajectory Calculations
  const rad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(rad);
  const vy = velocity * Math.sin(rad);

  // Time of flight (quadratic formula: h0 + vy*t - 0.5*g*t^2 = 0)
  // -0.5*g*t^2 + vy*t + h0 = 0  => a = -0.5*g, b = vy, c = h0
  const a = -0.5 * gravity;
  const b = vy;
  const c = height;
  const disc = b * b - 4 * a * c;
  const tFlight = disc >= 0 ? (-b - Math.sqrt(disc)) / (2 * a) : 0;

  // Max range
  const maxRange = vx * tFlight;

  // Max height (peak is at t = vy / g)
  const tPeak = vy / gravity;
  const maxHeight = tPeak > 0 && tPeak < tFlight 
    ? height + vy * tPeak - 0.5 * gravity * tPeak * tPeak 
    : height;

  // Generate path coordinates for SVG
  const numPoints = 100;
  const pathPoints: [number, number][] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const t = (tFlight * i) / numPoints;
    const x = vx * t;
    const y = height + vy * t - 0.5 * gravity * t * t;
    pathPoints.push([x, y]);
  }

  // Scale coordinates to fit SVG canvas (Width: 600, Height: 350)
  const padding = 40;
  const svgWidth = 600;
  const svgHeight = 350;

  // Dynamically calculate scales based on max values to keep trajectory inside viewbox
  const scaleX = maxRange > 0 ? (svgWidth - 2 * padding) / maxRange : 1;
  const scaleY = maxHeight > 0 ? (svgHeight - 2 * padding) / (maxHeight + 2) : 1;
  
  // Choose the lower scale to keep aspect ratio 1:1, or limit it to avoid warping
  const scale = Math.min(scaleX, scaleY, 15); 

  const getSvgCoords = (x: number, y: number): [number, number] => {
    const svgX = padding + x * scale;
    const svgY = svgHeight - padding - y * scale;
    return [svgX, svgY];
  };

  // Trajectory Path String
  let pathD = "";
  if (pathPoints.length > 0) {
    const [startX, startY] = getSvgCoords(pathPoints[0][0], pathPoints[0][1]);
    pathD = `M ${startX} ${startY}`;
    for (let i = 1; i < pathPoints.length; i++) {
      const [px, py] = getSvgCoords(pathPoints[i][0], pathPoints[i][1]);
      pathD += ` L ${px} ${py}`;
    }
  }

  // Animation logic
  useEffect(() => {
    let animFrame: number;
    if (isFiring) {
      const startTime = performance.now();
      const duration = tFlight * 800; // speed of animation depends on flight time

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimationProgress(progress);
        
        if (progress < 1) {
          animFrame = requestAnimationFrame(tick);
        } else {
          setIsFiring(false);
        }
      };
      animFrame = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isFiring, tFlight]);

  const handleLaunch = () => {
    setAnimationProgress(0);
    setIsFiring(true);
  };

  const handleReset = () => {
    setIsFiring(false);
    setAnimationProgress(0);
  };

  const applyPreset = (preset: Presets) => {
    setAngle(preset.angle);
    setVelocity(preset.velocity);
    setGravity(preset.gravity);
    setHeight(preset.height);
    handleReset();
  };

  // Get current position of projectile for rendering
  const currentT = tFlight * animationProgress;
  const currentX = vx * currentT;
  const currentY = height + vy * currentT - 0.5 * gravity * currentT * currentT;
  const [projSvgX, projSvgY] = getSvgCoords(currentX, currentY);

  return (
    <div className="space-y-12">
      {/* Visual Canvas Card */}
      <div className="bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_80%)] pointer-events-none" />
        
        {/* Render Trajectory Graph */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[500px] h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {Array.from({ length: 11 }).map((_, i) => {
              const xVal = (maxRange / 10) * i;
              const [coordsX] = getSvgCoords(xVal, 0);
              return (
                <g key={`grid-x-${i}`} className="opacity-20">
                  <line x1={coordsX} y1={padding} x2={coordsX} y2={svgHeight - padding} stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x={coordsX} y={svgHeight - padding + 18} fill="#ffffff" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    {xVal.toFixed(1)}m
                  </text>
                </g>
              );
            })}

            {Array.from({ length: 6 }).map((_, i) => {
              const yVal = (maxHeight / 5) * i;
              const [, coordsY] = getSvgCoords(0, yVal);
              return (
                <g key={`grid-y-${i}`} className="opacity-20">
                  <line x1={padding} y1={coordsY} x2={svgWidth - padding} y2={coordsY} stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x={padding - 10} y={coordsY + 3} fill="#ffffff" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {yVal.toFixed(1)}m
                  </text>
                </g>
              );
            })}

            {/* Base Line (Ground) */}
            <line 
              x1={padding} 
              y1={svgHeight - padding} 
              x2={svgWidth - padding} 
              y2={svgHeight - padding} 
              stroke="rgba(212, 175, 55, 0.4)" 
              strokeWidth="1.5" 
            />

            {/* Trajectory Curve Path */}
            {pathD && (
              <path 
                d={pathD} 
                fill="none" 
                stroke="#D4AF37" 
                strokeWidth="2.5" 
                strokeDasharray={isFiring ? "none" : "none"} 
                className="opacity-80"
              />
            )}

            {/* Fired Projectile Ball */}
            {animationProgress > 0 && (
              <circle 
                cx={projSvgX} 
                cy={projSvgY} 
                r="7" 
                fill="#22d3ee" 
                className="shadow-[0_0_15px_#22d3ee]"
                filter="drop-shadow(0px 0px 8px #22d3ee)"
              />
            )}

            {/* Launchpad tower representer */}
            {height > 0 && (
              <rect 
                x={padding - 4} 
                y={svgHeight - padding - height * scale} 
                width="8" 
                height={height * scale} 
                fill="rgba(255, 255, 255, 0.15)"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
              />
            )}
          </svg>
        </div>

        {/* Dashboard Realtime Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-white/5">
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Alcance Máximo (R)</span>
            <span className="font-serif text-2xl text-white font-medium">{maxRange.toFixed(2)} <span className="text-xs font-sans text-brand-gold">metros</span></span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Altura Máxima (H)</span>
            <span className="font-serif text-2xl text-white font-medium">{maxHeight.toFixed(2)} <span className="text-xs font-sans text-brand-gold">metros</span></span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Tiempo de Vuelo (t)</span>
            <span className="font-serif text-2xl text-white font-medium">{tFlight.toFixed(2)} <span className="text-xs font-sans text-brand-gold">segundos</span></span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Cota de Impacto</span>
            <span className="font-serif text-2xl text-[#22d3ee] font-medium">{vy.toFixed(1)} <span className="text-xs font-sans text-[#22d3ee]/60">m/s vertical</span></span>
          </div>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sliders Control Panel */}
        <div className="lg:col-span-2 space-y-8 bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 p-8 md:p-10 rounded-[2.5rem]">
          <h3 className="font-serif text-2xl uppercase tracking-tight text-brand-ink dark:text-brand-offwhite">Variables Dinámicas</h3>
          
          <div className="space-y-6">
            {/* Angle slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-brand-muted">
                <span>Ángulo de Tiro (θ)</span>
                <span className="text-brand-gold">{angle}°</span>
              </div>
              <input 
                type="range" min="0" max="90" step="1" 
                value={angle} 
                onChange={(e) => { setAngle(Number(e.target.value)); handleReset(); }} 
                className="w-full accent-brand-gold cursor-pointer"
              />
            </div>

            {/* Velocity slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-brand-muted">
                <span>Velocidad Inicial (v₀)</span>
                <span className="text-brand-gold">{velocity} m/s</span>
              </div>
              <input 
                type="range" min="5" max="40" step="1" 
                value={velocity} 
                onChange={(e) => { setVelocity(Number(e.target.value)); handleReset(); }} 
                className="w-full accent-brand-gold cursor-pointer"
              />
            </div>

            {/* Gravity slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-brand-muted">
                <span>Aceleración de Gravedad (g)</span>
                <span className="text-brand-gold">{gravity.toFixed(2)} m/s²</span>
              </div>
              <input 
                type="range" min="1" max="25" step="0.05" 
                value={gravity} 
                onChange={(e) => { setGravity(Number(e.target.value)); handleReset(); }} 
                className="w-full accent-brand-gold cursor-pointer"
              />
            </div>

            {/* Height slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-brand-muted">
                <span>Altura Inicial (h₀)</span>
                <span className="text-brand-gold">{height} m</span>
              </div>
              <input 
                type="range" min="0" max="15" step="0.5" 
                value={height} 
                onChange={(e) => { setHeight(Number(e.target.value)); handleReset(); }} 
                className="w-full accent-brand-gold cursor-pointer"
              />
            </div>
          </div>

          {/* Firing and Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-black/5 dark:border-white/5">
            <button
              onClick={handleLaunch}
              disabled={isFiring}
              className="flex items-center gap-3 bg-brand-ink text-brand-offwhite dark:bg-brand-gold dark:text-brand-ink px-8 py-4 rounded-xl font-mono font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              <Play size={14} fill="currentColor" /> Fuego / Lanzar
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-3 border border-black/10 dark:border-white/10 hover:border-brand-gold px-6 py-4 rounded-xl font-mono font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              <RotateCcw size={14} /> Reiniciar
            </button>
            <button
              onClick={() => setShowEquations(!showEquations)}
              className="flex items-center gap-3 border border-black/5 dark:border-white/5 hover:bg-black/5 px-6 py-4 rounded-xl font-mono font-black text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              <Info size={14} /> {showEquations ? "Ocultar Fórmulas" : "Ver Fórmulas"}
            </button>
          </div>
        </div>

        {/* Presets and Info Section */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <h4 className="font-serif text-xl uppercase tracking-tight text-brand-ink dark:text-brand-offwhite">Ajustes Preestablecidos</h4>
            
            <div className="grid grid-cols-1 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="w-full text-left p-4 rounded-xl bg-brand-offwhite dark:bg-[#1E1E22] border border-black/5 dark:border-white/5 hover:border-brand-gold hover:translate-x-2 transition-all group"
                >
                  <span className="text-[10px] font-mono font-bold text-brand-gold uppercase block mb-1">
                    Preset
                  </span>
                  <span className="font-serif text-sm font-semibold text-brand-ink dark:text-brand-offwhite block mb-1">
                    {preset.name}
                  </span>
                  <span className="text-xs text-brand-muted font-sans font-light leading-relaxed block">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Equations Overlay Panel */}
      <AnimatePresence>
        {showEquations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#FDFBF7] dark:bg-[#18181B] border border-brand-gold/25 p-8 rounded-[2rem]"
          >
            <h4 className="font-serif text-xl uppercase tracking-tight text-brand-gold mb-6 flex items-center gap-3">
              <Scale size={20} /> Formulación Teórica del Movimiento Parabólico
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-sans font-light leading-relaxed text-brand-muted">
              <div className="space-y-4">
                <p>
                  El movimiento se divide en dos componentes ortogonales independientes (Ecuación de Galileo):
                </p>
                <ul className="list-disc pl-6 space-y-2 font-mono text-xs text-brand-gold">
                  <li>Horizontal (M.R.U.): x(t) = v₀ · cos(θ) · t</li>
                  <li>Vertical (M.R.U.A.): y(t) = h₀ + v₀ · sin(θ) · t - ½ · g · t²</li>
                </ul>
              </div>
              <div className="space-y-4">
                <p>
                  Trayectoria cartesiana libre del tiempo:
                </p>
                <div className="bg-brand-ink/5 dark:bg-black/20 p-4 rounded-xl text-center font-mono text-brand-gold font-bold text-xs">
                  y(x) = x · tan(θ) - [ g · x² ] / [ 2 · v₀² · cos²(θ) ] + h₀
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
