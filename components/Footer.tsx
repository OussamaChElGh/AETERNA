'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Sparkles, Mail, Globe, Code } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const QUOTES = [
  { text: "Sólo sé que no sé nada.", author: "Sócrates" },
  { text: "Pienso, luego existo.", author: "Descartes" },
  { text: "La vida no examinada no vale la pena ser vivida.", author: "Sócrates" },
  { text: "Lo que no te mata, me hace más fuerte.", author: "Nietzsche" },
  { text: "La mayor sabiduría que existe es conocerse a uno mismo.", author: "Galileo Galilei" },
  { text: "El hombre es la medida de todas las cosas.", author: "Protágoras" },
  { text: "El conocimiento es poder.", author: "Francis Bacon" }
];

export function Footer() {
  const [activeQuote, setActiveQuote] = useState<{ text: string; author: string } | null>(null);

  const triggerEasterEgg = () => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setActiveQuote(randomQuote);
  };

  useEffect(() => {
    if (activeQuote) {
      const timer = setTimeout(() => setActiveQuote(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeQuote]);

  return (
    <footer className="w-full border-t border-brand-border px-8 py-32 bg-brand-offwhite relative">
      <AnimatePresence>
        {activeQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-1/2 -top-12 -translate-x-1/2 bg-brand-ink text-brand-offwhite px-8 py-4 shadow-2xl z-50 text-center min-w-[300px] border border-brand-gold/30"
          >
            <p className="font-serif italic text-lg mb-2">"{activeQuote.text}"</p>
            <p className="text-[9px] uppercase tracking-[0.4em] text-brand-gold font-bold">— {activeQuote.author}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 items-start pb-20 border-b border-brand-border">
          <div className="flex flex-col gap-8 col-span-1 md:col-span-2">
            <Link href="/" className="flex flex-col group" id="footer-logo">
              <span className="font-serif text-3xl tracking-tighter leading-none transition-all group-hover:italic text-brand-ink">
                LA <span className="text-brand-gold">BIBLIOTECA</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.6em] text-brand-muted mt-2">Archivo del Conocimiento Universal</span>
            </Link>
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] leading-relaxed text-brand-muted max-w-xs">
              Una plataforma dedicada a la exégesis de las ideas, el canon literario y el desarrollo intelectual del autodidacta contemporáneo.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-ink">Exploración</span>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-[11px] uppercase tracking-[0.2em] text-brand-muted hover:text-brand-gold transition-colors">Archivo</Link>
              <Link href="/filosofia" className="text-[11px] uppercase tracking-[0.2em] text-brand-muted hover:text-brand-gold transition-colors">Filosofía</Link>
              <Link href="/literatura" className="text-[11px] uppercase tracking-[0.2em] text-brand-muted hover:text-brand-gold transition-colors">Literatura</Link>
              <Link href="/guias" className="text-[11px] uppercase tracking-[0.2em] text-brand-muted hover:text-brand-gold transition-colors">Guías de Estudio</Link>
              <Link href="/bitacora" className="text-[11px] uppercase tracking-[0.2em] text-brand-muted hover:text-brand-gold transition-colors">Bitácora</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-ink">Legalitas</span>
            <div className="flex flex-col gap-3">
              <Link href="/privacidad" className="text-[11px] uppercase tracking-[0.2em] text-brand-muted hover:text-brand-gold transition-colors">Privacidad</Link>
              <span className="text-[11px] uppercase tracking-[0.2em] text-brand-muted/60">© {new Date().getFullYear()} LA BIBLIOTECA</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-4 group cursor-default">
             <div 
               className="w-2 h-2 bg-brand-gold hover:scale-125 transition-transform cursor-pointer" 
               id="footer-ornament"
               onDoubleClick={triggerEasterEgg}
               title="Doble clic para la revelación"
             ></div>
             <span className="text-[11px] uppercase tracking-[0.6em] font-bold text-brand-ink">ANEKTIA DIGITAL ARCHIVE — MMXXVI</span>
           </div>
           <div className="flex items-center gap-8">
             <a href="#" className="text-brand-muted hover:text-brand-ink transition-colors"><Globe className="h-4 w-4" /></a>
             <a href="#" className="text-brand-muted hover:text-brand-ink transition-colors"><Mail className="h-4 w-4" /></a>
             <a href="#" className="text-brand-muted hover:text-brand-ink transition-colors"><Code className="h-4 w-4" /></a>
           </div>
        </div>
      </div>
    </footer>
  );
}
