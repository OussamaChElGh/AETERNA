'use client';
import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, CheckCircle2, Award, Shield, Compass } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface SystemStep {
  title: string;
  content: string;
}

interface AnektiaSystemProps {
  content: string;
}

export function AnektiaSystem({ content }: AnektiaSystemProps) {
  // Parsing robusto: Buscamos los patrones de pasos sin depender de asteriscos o formato exacto
  const steps: SystemStep[] = [];
  
  // Dividimos por el marcador de paso, permitiendo variaciones en emojis y espacios
  const pattern = /(?:🧠\s*)?Sistema\s*Anektia,\s*paso\s*\d+:\s*(.*?)(?=\n|$)/gi;
  const rawParts = content.split(/(?:🧠\s*)?Sistema\s*Anektia,\s*paso\s*\d+:/gi);
  
  // Extraemos los títulos usando matchAll para tener la lista de encabezados
  const titles = Array.from(content.matchAll(pattern), m => m[1].trim());
  
  // El fragmento 0 es basura o intro, el resto son los contenidos de cada paso
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    const stepContent = rawParts[i + 1]?.trim();
    if (title && stepContent) {
      steps.push({ title, content: stepContent });
    }
  }

  const icons = [Compass, BrainCircuit, Award];

  // Si el parser falla, intentamos un fallback simple por si el texto no sigue el patrón exacto
  if (steps.length === 0) {
     return (
       <div className="not-prose my-16 bg-rose-50 border border-rose-100 p-10 rounded-2xl text-rose-900 text-sm italic">
          [Error de Sincronización: El formato del Sistema Anektia no pudo ser procesado. Verifica la estructura del archivo.]
       </div>
     );
  }

  return (
    <div className="not-prose my-48 mx-auto max-w-5xl px-4">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        {/* Decorative Frame */}
        <div className="absolute -inset-8 border-[0.5px] border-[#8B6914]/20 rounded-[4rem] pointer-events-none" />
        <div className="absolute -inset-4 border border-[#8B6914]/10 rounded-[3.5rem] pointer-events-none" />

        <div className="bg-[#FDFBF7] rounded-[3rem] p-12 md:p-24 shadow-[0_40px_100px_-20px_rgba(139,105,20,0.1)] border border-[#8B6914]/15 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

          <header className="relative z-10 flex flex-col items-center text-center mb-24">
             <div className="w-20 h-20 rounded-full bg-white border border-[#8B6914]/30 flex items-center justify-center mb-10 shadow-xl group">
                <Shield className="text-[#8B6914] w-10 h-10 group-hover:scale-110 transition-transform duration-700" />
             </div>

             <span className="text-[10px] font-mono font-black tracking-[0.8em] text-[#8B6914] uppercase mb-6">Protocolo de Cierre</span>
             <h2 className="font-serif text-4xl md:text-6xl text-[#1A1A1A] tracking-tighter uppercase mb-4 leading-tight max-w-2xl">
                Sistema Anektia: <span className="text-[#D4AF37] block mt-2 text-3xl md:text-4xl italic normal-case tracking-normal">¿Qué acabas de aprender?</span>
             </h2>
             <div className="mt-8 flex items-center gap-6 w-full">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8B6914]/20" />
                <p className="text-[#8B6914] font-mono text-[9px] uppercase tracking-[0.4em] font-bold opacity-40">Sincronización de Integridad</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8B6914]/20" />
             </div>
          </header>


          <div className="relative z-10 grid grid-cols-1 gap-20">
            {steps.map((step, idx) => {
              const Icon = icons[idx] || BrainCircuit;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative pl-12 md:pl-20 border-l border-[#8B6914]/10"
                >
                  <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-white border border-[#8B6914]/30 flex items-center justify-center shadow-md">
                     <span className="text-[10px] font-mono font-black text-[#8B6914]">0{idx + 1}</span>
                  </div>

                  <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-4">
                        <Icon className="text-[#8B6914]/40 w-5 h-5" strokeWidth={1.5} />
                        <h3 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] uppercase tracking-tight">
                           {step.title}
                        </h3>
                     </div>
                     <div className="text-[18px] md:text-[20px] leading-relaxed text-[#2C2C2C]/80 font-normal font-sans italic max-w-3xl">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.content}</ReactMarkdown>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <footer className="mt-32 pt-12 border-t border-[#8B6914]/10 flex flex-col items-center gap-8 relative z-10">
             <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 bg-[#8B6914]/5 px-6 py-2 rounded-full border border-[#8B6914]/10">
                   <CheckCircle2 className="w-4 h-4 text-[#8B6914]" />
                   <span className="text-[10px] font-mono text-[#8B6914] font-black uppercase tracking-[0.3em]">Sincronización Completada</span>
                </div>
                <p className="text-[#1A1A1A]/30 text-[9px] font-mono uppercase tracking-[0.2em]">Los datos han sido grabados permanentemente en tu mapa de constelaciones</p>
             </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
