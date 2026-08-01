'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Plus, Minus, Sparkles, Hash, Search, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItemData {
  question: React.ReactNode;
  answer: React.ReactNode;
}

interface AeternaFaqProps {
  title?: React.ReactNode;
  items: FaqItemData[];
}

export default function AeternaFaq({ title = "EXÉGESIS DE CONSULTA", items }: AeternaFaqProps) {
  return (
    <div className="not-prose my-48 mx-auto max-w-5xl px-6">
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative group"
      >
        {/* Layered Shadow Effect */}
        <div className="absolute inset-0 bg-[#8B6914]/5 blur-[120px] rounded-full -z-10 group-hover:bg-[#8B6914]/10 transition-colors duration-1000" />
        
        <div className="bg-[#FDFBF7] rounded-[4rem] p-12 md:p-24 relative overflow-hidden border border-[#d4af37]/20 shadow-2xl shadow-black/10">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
          
          <header className="relative z-10 flex flex-col items-center text-center mb-24">
             <div className="w-24 h-24 rounded-full bg-white border border-[#d4af37]/30 flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform duration-1000 relative">
                <div className="absolute inset-2 rounded-full border border-dashed border-[#d4af37]/20 animate-[spin_20s_linear_infinite]" />
                <HelpCircle className="text-[#8B6914] w-12 h-12" />
             </div>
             <span className="text-[11px] font-mono font-black tracking-[1em] text-[#8B6914] uppercase mb-8 ml-[1em]">Resolución de Incógnitas</span>
             <h2 className="font-serif text-4xl md:text-7xl text-[#1A1A1A] tracking-tighter uppercase mb-6 leading-none italic">{title}</h2>
             
             <div className="flex items-center gap-10 w-full max-w-xl mt-12">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]/30" />
                <div className="flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                   <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/40" />
                   <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/10" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]/30" />
             </div>
          </header>

          <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
            {items.map((item, idx) => (
              <FaqItem key={idx} question={item.question} answer={item.answer} index={idx} />
            ))}
          </div>

          <footer className="mt-32 pt-16 border-t border-[#d4af37]/10 flex flex-col items-center gap-10 relative z-10">
             <div className="flex items-center gap-6 bg-white px-10 py-4 rounded-full border border-[#d4af37]/20 shadow-sm group-hover:shadow-md transition-shadow">
                <Sparkles size={14} className="text-[#8B6914] animate-pulse" />
                <span className="text-[10px] font-mono text-black font-black uppercase tracking-[0.5em]">Protocolo de Respuesta Universal Sincronizado</span>
             </div>
             <p className="text-[#1A1A1A]/20 font-mono text-[9px] uppercase tracking-[0.3em]">Acceso de Nivel Superior Permitido</p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}

function FaqItem({ question, answer, index }: FaqItemData & { index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "rounded-[2.5rem] transition-all duration-700 border relative overflow-hidden",
      isOpen ? "bg-white border-[#d4af37]/40 shadow-xl" : "bg-transparent border-transparent hover:bg-white/50 hover:border-black/5"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left p-10 md:p-14 outline-none group/item"
      >
        <div className="flex items-center gap-10">
           <div className={cn(
             "w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-lg font-black transition-all duration-1000 border relative shadow-inner",
             isOpen ? "bg-[#1A1A1A] text-[#D4AF37] border-black" : "bg-white text-black/10 border-black/5 group-hover/item:text-black/30 group-hover/item:border-black/10"
           )}>
             {String(index + 1).padStart(2, '0')}
             {isOpen && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] rounded-full animate-ping" />}
           </div>
           <h3 className={cn(
             "font-serif text-2xl md:text-4xl tracking-tight transition-all duration-700 leading-tight",
             isOpen ? "text-[#1A1A1A] font-bold" : "text-[#1A1A1A]/50 group-hover/item:text-[#1A1A1A]"
           )}>
             {question}
           </h3>
        </div>
        <div className={cn(
          "shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 border",
          isOpen ? "bg-[#D4AF37] text-black border-[#D4AF37] rotate-180" : "bg-white text-black/20 border-black/5"
        )}>
           {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-14 md:px-24 pb-14 md:pb-20">
               <div className="flex gap-12">
                  <div className="w-1.5 h-auto bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/20 to-transparent rounded-full" />
                  <div className="text-[20px] md:text-[24px] leading-relaxed text-[#3E2C23]/90 font-serif font-light italic py-2">
                    {answer}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
