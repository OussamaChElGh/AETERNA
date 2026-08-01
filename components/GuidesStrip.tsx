'use client';
import Link from 'next/link';
import { motion } from "motion/react";
import { Globe, Camera, BookOpen, Library, History, Atom, Palette, Brain, Music, Landmark, Sparkles, Lock } from "lucide-react";

/**
 * Estado de ramas para el lanzamiento MVP.
 * 'live'  → tiene contenido, se muestra como enlace activo
 * 'soon'  → visible con badge "Próximamente" (genera expectativa)
 * ocultas → no se muestran aún (se añadirán en futuras fases)
 */
interface BranchEntry {
  name: string;
  path: string;
  icon: any;
  status: 'live' | 'soon';
}

const BRANCHES: BranchEntry[] = [
  { name: "Física", path: "/guias/ciencias_naturales/fisica", icon: Atom, status: 'live' },
  { name: "Matemáticas", path: "/guias/ciencias_formales/matematicas", icon: BookOpen, status: 'soon' },
  { name: "Filosofía", path: "/guias/humanidades/filosofia", icon: Library, status: 'soon' },
  { name: "Química", path: "/guias/ciencias_naturales/quimica", icon: Sparkles, status: 'soon' },
];

export function GuidesStrip() {
  return (
    <div className="w-full bg-brand-ink py-4 overflow-hidden group no-print">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex items-center justify-between gap-12 overflow-x-auto no-scrollbar">
          {BRANCHES.map((guide, i) => (
            <motion.div
              key={guide.name}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="relative"
            >
              <Link
                href={guide.path}
                className="flex items-center gap-4 group/item whitespace-nowrap"
                title={guide.status === 'soon' ? `${guide.name}: próximamente` : guide.name}
              >
                <guide.icon className={`h-3 w-3 ${guide.status === 'live' ? 'text-brand-gold group-hover/item:text-brand-offwhite' : 'text-brand-offwhite/25'} transition-colors`} />
                <span className={`text-[9px] font-bold uppercase tracking-[0.4em] transition-all duration-300 ${guide.status === 'live' ? 'text-brand-offwhite/40 group-hover/item:text-brand-offwhite' : 'text-brand-offwhite/20'}`}>
                  {guide.name}
                </span>
                {guide.status === 'soon' && (
                  <span className="px-1.5 py-0.5 rounded-full border border-brand-gold/30 text-brand-gold/70 text-[7px] font-mono uppercase tracking-widest flex items-center gap-1">
                    <Lock size={8} /> Próximamente
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
