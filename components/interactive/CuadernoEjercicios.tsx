'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Target, Lightbulb, CheckCircle2, MessageCircle, ArrowRight, ArrowLeft, Sparkles, Trophy, Eye, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CuadernoEntry {
  titulo: string;
  enunciado: string;
  solucion: string;
  pasos?: string[];
  xp?: number;
  pistas?: string[];
  opciones?: { label: string; correcta: boolean }[];
}

interface CuadernoEjerciciosProps {
  cuaderno: Record<string, CuadernoEntry[]>;
  activeLayer: string;
  titulo?: string;
}

export function CuadernoEjercicios({ cuaderno = {}, activeLayer, titulo = 'Cuaderno de Problemas' }: CuadernoEjerciciosProps) {
  const [openLayer, setOpenLayer] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [rev, setRev] = useState<Record<string, number[]>>({});
  const [hints, setHints] = useState<Record<string, number>>({});
  const [sel, setSel] = useState<Record<string, number | null>>({});
  const [txt, setTxt] = useState<Record<string, string>>({});
  const [chk, setChk] = useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  const layers = Object.keys(cuaderno).filter(k => cuaderno[k]?.length > 0);
  if (layers.length === 0) return null;

  const L = openLayer;
  const D = L ? cuaderno[L] : null;
  const C = D?.[idx];
  const K = L ? `${L}-${idx}` : '';
  const isRev = L ? (rev[L] || []).includes(idx) : false;
  const comp = (l: string) => (rev[l] || []).length;
  const allDone = L ? comp(L) === (D?.length || 0) : false;
  const showCeleb = L ? allDone && !dismissed[L] : false;

  const open = (l: string) => { setOpenLayer(l); setIdx(0); setDismissed(p => ({...p, [l]: false})); window.scrollTo({top:0,behavior:'smooth'}); };
  const close = () => setOpenLayer(null);
  const nav = (d: number) => { if (!D) return; setIdx(p => Math.max(0, Math.min(D.length - 1, p + d))); };
  const hint = () => setHints(p => ({ ...p, [K]: (p[K] || 0) + 1 }));
  const check = () => { setChk(p => ({...p, [K]: true})); setRev(p => { const a = p[L!] || []; if (a.includes(idx)) return p; return {...p, [L!]: [...a, idx]}; }); };
  const dismiss = () => setDismissed(p => ({...p, [L!]: true}));

  const nH = C?.pistas?.length || 0;
  const rH = hints[K] || 0;
  const sOpt = sel[K];
  const canCheck = (sOpt !== null && sOpt !== undefined) || (txt[K]?.trim()?.length > 0);

  const tabColor = (l: string) => l === 'principiante' ? 'bg-emerald-500' : l === 'intermedio' ? 'bg-amber-500' : 'bg-violet-600';
  const tabLabel = (l: string) => l === 'principiante' ? 'FUND.' : l === 'intermedio' ? 'PROF.' : 'FRONT.';
  const headerColor = (l: string) => l === 'principiante' ? 'bg-emerald-500' : l === 'intermedio' ? 'bg-amber-500' : 'bg-violet-600';
  const hLabel = (l: string) => l === 'principiante' ? 'Fundamentos' : l === 'intermedio' ? 'Profundización' : 'Frontera';

  return (
    <>
      {/* TABS - left edge */}
      <div className="fixed left-0 top-[4%] z-[55] flex flex-col gap-1">
        {layers.map(l => (
          <motion.button
            key={l}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: layers.indexOf(l) * 0.06 }}
            onClick={() => openLayer === l ? close() : open(l)}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 px-2 border-2 border-l-0 border-black rounded-r-lg shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] transition-all cursor-pointer",
              tabColor(l),
              openLayer === l && "translate-x-1 shadow-none opacity-30 pointer-events-none"
            )}
            style={{ minWidth: 46 }}
          >
            <BookOpen size={18} className="text-black" />
            <span className="text-black font-mono font-black text-[8px] [writing-mode:vertical-lr] tracking-widest">{tabLabel(l)}</span>
            <div className={cn("w-4 h-4 rounded-full border-2 border-black text-[8px] font-black flex items-center justify-center", allDone && openLayer === l ? "bg-emerald-400" : "bg-white text-black")}>
              {comp(l) === cuaderno[l]?.length ? '✓' : cuaderno[l]?.length}
            </div>
            {comp(l) > 0 && comp(l) < (cuaderno[l]?.length || 1) && (
              <div className="h-1 w-4 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-black rounded-full" style={{ width: `${(comp(l) / cuaderno[l].length) * 100}%` }} /></div>
            )}
          </motion.button>
        ))}
      </div>

      {/* SIDEBAR PANEL - left, full height */}
      <AnimatePresence>
        {L && C && D && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[65] backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 24, stiffness: 170 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
            >
              <div className="w-full max-w-4xl h-full md:h-[88vh] bg-[#FAF6EC] dark:bg-[#1A1712] border-4 border-[#D4AF37] shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_rgba(212,175,55,0.5)] rounded-sm flex flex-col relative">
              {/* HEADER */}
              <div className={cn("p-4 md:p-5 border-b-4 border-black shrink-0", headerColor(L))}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]"><BookOpen size={22} /></div>
                    <div>
                      <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-black/60 block">{hLabel(L)}</span>
                      <h2 className="font-serif text-lg md:text-xl font-black text-black leading-tight">{titulo}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-black text-white font-mono font-black text-xs px-2.5 py-1 rounded-full">{comp(L)}/{D.length}</span>
                    <button onClick={close} className="w-8 h-8 rounded-full bg-black text-white border-2 border-black flex items-center justify-center hover:bg-red-600"><X size={16} /></button>
                  </div>
                </div>
                <div className="flex gap-1 mt-3">
                  {D.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)} className={cn("h-2 flex-1 rounded-full border border-black/30 transition-all", i === idx ? "bg-black scale-y-150 border-black" : (rev[L] || []).includes(i) ? "bg-emerald-500 border-emerald-700" : "bg-white/60")} />
                  ))}
                </div>
              </div>

              {/* SCROLL CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(139,105,20,0.05) 31px,rgba(139,105,20,0.05) 32px)', backgroundSize: '100% 32px' }}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-black font-mono font-black text-sm shadow-[2px_2px_0px_0px_#000] shrink-0", headerColor(L))}>{idx + 1}</div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">PROBLEMA {idx+1}/{D.length}</span>
                    <h3 className="font-serif text-base md:text-lg font-bold text-brand-ink dark:text-white">{C.titulo}</h3>
                  </div>
                  {isRev && <span className="ml-auto px-2 py-0.5 bg-emerald-500 text-black font-mono font-black text-[10px] uppercase border border-black rounded shrink-0">+{C.xp||30}XP</span>}
                </div>
                <div className="bg-white/80 dark:bg-[#12100C]/80 border-2 border-gray-300 dark:border-gray-700 p-4 md:p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]">
                  <p className="font-sans text-base md:text-lg leading-relaxed text-brand-ink dark:text-amber-100">{C.enunciado}</p>
                </div>

                {C.opciones?.length && !isRev ? (
                  <div className="space-y-2">
                    {C.opciones.map((o, oi) => {
                      const s = sOpt === oi; const ok = chk[K] && o.correcta; const wr = chk[K] && s && !o.correcta;
                      return <button key={oi} onClick={() => setSel(p => ({...p, [K]: oi}))} disabled={!!chk[K]} className={cn("w-full text-left p-3.5 md:p-4 border-2 font-mono font-bold text-sm md:text-base flex items-center gap-3", ok ? "bg-emerald-500 text-black border-black" : wr ? "bg-rose-500 text-white border-rose-700" : s ? "bg-amber-100 border-[#D4AF37] dark:bg-amber-900/40" : "bg-white dark:bg-[#12100C] border-gray-300 dark:border-gray-700 hover:border-[#D4AF37]")}>
                        <span className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center font-black text-xs shrink-0", s ? "bg-[#D4AF37] text-black border-black" : "border-gray-400 text-gray-500")}>{String.fromCharCode(65+oi)}</span>
                        <span className="text-brand-ink dark:text-amber-100">{o.label}</span>{ok && <CheckCircle2 size={18} className="ml-auto" />}
                      </button>;
                    })}
                    {canCheck && !chk[K] && <button onClick={check} className="w-full py-3 bg-[#D4AF37] text-black font-mono font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-400 flex items-center justify-center gap-1.5 mt-2"><Eye size={15} />COMPROBAR</button>}
                  </div>
                ) : null}

                {!C.opciones && !isRev && !chk[K] ? (
                  <div className="space-y-2">
                    <textarea value={txt[K]||''} onChange={e=>setTxt(p=>({...p,[K]:e.target.value}))} placeholder="Escribe tu respuesta..." rows={3} className="w-full p-3.5 rounded-none bg-white dark:bg-[#12100C] border-2 border-gray-300 dark:border-gray-700 focus:border-[#D4AF37] text-brand-ink dark:text-slate-100 text-base resize-none" />
                    <button onClick={check} disabled={!txt[K]?.trim()} className={cn("w-full py-3 font-mono font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5", txt[K]?.trim()?"bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer":"bg-gray-300 text-gray-500 cursor-not-allowed")}><Target size={15} />VERIFICAR</button>
                  </div>
                ) : null}

                {nH > 0 && !isRev ? (
                  <div className="space-y-2">
                    {Array.from({length: Math.min(rH+1,nH)}).map((_,hi) => (
                      <motion.div key={hi} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="p-3 bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500"><div className="flex items-center gap-1.5 mb-1"><Lightbulb size={13} className="text-amber-600"/><span className="text-[10px] font-mono font-black text-amber-700 dark:text-amber-300 uppercase">Pista {hi+1}</span></div><p className="font-sans text-sm md:text-base text-brand-ink dark:text-amber-100">{C.pistas?.[hi]}</p></motion.div>
                    ))}
                    {rH < nH && <button onClick={hint} className="w-full py-2 text-xs font-mono font-bold text-amber-700 dark:text-amber-300 border border-dashed border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"><Lightbulb size={12} className="inline mr-1"/>{rH===0?'¿Pista?':`Pista ${rH+1}/${nH}`}</button>}
                  </div>
                ) : null}

                {isRev ? (
                  <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-4">
                    <div className="p-4 md:p-5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30 border-2 border-[#D4AF37] shadow-[3px_3px_0px_0px_rgba(212,175,55,0.25)] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs uppercase"><MessageCircle size={15}/>¿Te acercaste?</div>
                      <p className="font-sans text-base leading-relaxed text-brand-ink dark:text-amber-100">{C.solucion}</p>
                    </div>
                    {C.pasos?.length ? (
                      <div className="relative pl-8">
                        <div className="absolute left-[11px] top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-emerald-500 to-emerald-300"/>
                        <div className="flex items-center gap-1.5 mb-2 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs uppercase"><Sparkles size={13}/>Paso a paso</div>
                        {C.pasos.map((p,pi) => (
                          <motion.div key={pi} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:pi*0.08}} className="relative mb-2.5">
                            <div className="absolute -left-[22px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1A1712] shadow-[0_0_0_1.5px_#000] flex items-center justify-center font-mono font-black text-[9px] text-black z-10">{pi+1}</div>
                            <div className="p-3 bg-white dark:bg-[#12100C] border border-emerald-500/20 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.04)]"><p className="font-sans text-sm md:text-base text-brand-ink dark:text-amber-100 leading-relaxed">{p}</p></div>
                          </motion.div>
                        ))}
                      </div>
                    ):null}
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs"><CheckCircle2 size={14}/>+{C.xp||30} XP</div>
                  </motion.div>
                ) : null}
              </div>

              {/* NAV */}
              <div className="p-3 md:p-4 bg-black border-t-4 border-[#D4AF37] flex items-center justify-between shrink-0">
                <button onClick={()=>nav(-1)} disabled={idx===0} className={cn("px-3.5 py-2 font-mono font-bold text-xs uppercase border-2 border-white flex items-center gap-1", idx===0?"text-gray-600 border-gray-600 cursor-not-allowed":"text-white hover:bg-white hover:text-black")}><ArrowLeft size={14}/></button>
                <span className="text-white font-mono text-sm">{idx+1}/{D.length}</span>
                <button onClick={()=>nav(1)} disabled={idx===D.length-1} className={cn("px-3.5 py-2 font-mono font-bold text-xs uppercase border-2 border-[#D4AF37] flex items-center gap-1", idx===D.length-1?"text-gray-600 border-gray-600 cursor-not-allowed":"bg-[#D4AF37] text-black hover:bg-yellow-400")}><ArrowRight size={14}/></button>
              </div>

              {/* CELEBRATION */}
              <AnimatePresence>
                {showCeleb && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/95 z-[80] flex flex-col items-center justify-center gap-4 p-5 text-center">
                    <motion.div animate={{rotate:[0,-8,8,-8,0]}} transition={{repeat:Infinity,duration:2}}><Trophy size={56} className="text-[#D4AF37]"/></motion.div>
                    <div className="space-y-1">
                      <h2 className="font-serif text-xl font-black text-[#D4AF37]">¡CUADERNO COMPLETO!</h2>
                      <p className="font-mono text-[10px] text-white/60">{D.length} problemas de {hLabel(L)}</p>
                      <div className="flex items-center gap-1.5 justify-center mt-2"><Sparkles size={14} className="text-amber-400"/><span className="font-mono font-black text-sm text-white">+{D.reduce((s,e)=>s+(e.xp||30),0)} XP</span><Sparkles size={14} className="text-amber-400"/></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={close} className="px-4 py-2 bg-[#D4AF37] text-black font-mono font-black text-[10px] uppercase tracking-wider border-2 border-white hover:bg-yellow-400">Cerrar</button>
                      <button onClick={dismiss} className="px-4 py-2 bg-white/10 text-white font-mono font-bold text-[10px] uppercase tracking-wider border-2 border-white/40 hover:bg-white/20 flex items-center gap-1"><RotateCcw size={11}/> Revisar</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
