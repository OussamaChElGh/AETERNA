'use client';
import { 
  Atom, Brain, Languages, Cpu, Landmark, 
  Palette, Library, Globe, Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface NexusNode3DProps {
  id: string;
  active: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  ciencias_formales: Atom,
  ciencias_naturales: Globe,
  ciencias_sociales: Landmark,
  humanidades: Library,
  artes: Palette,
  aplicadas: Cpu,
  idiomas: Languages,
  core: Sparkles,
};

export function NexusNode3D({ id, active }: NexusNode3DProps) {
  const Icon = ICON_MAP[id] || Brain;
  
  return (
    <div className="w-full h-full flex items-center justify-center relative perspective-[1000px]">
      <motion.div 
        animate={{ 
          rotateY: [0, 360],
          scale: active ? 1.1 : 1
        }}
        transition={{ 
          rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.3 }
        }}
        className="w-[80%] h-[80%] relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
         <div 
           className={cn(
             "absolute inset-0 bg-brand-gold rounded-sm border-2 border-brand-gold/60 flex items-center justify-center",
             active ? "shadow-[0_0_40px_rgba(212,175,55,0.8)]" : "shadow-[0_0_20px_rgba(212,175,55,0.4)]"
           )}
           style={{ transform: 'translateZ(1px)', backfaceVisibility: 'hidden' }}
         >
            <Icon size={32} strokeWidth={1.5} className="text-brand-ink pointer-events-none" />
         </div>
         <div 
           className="absolute inset-0 bg-brand-ink border-2 border-brand-gold/40 rounded-sm flex items-center justify-center"
           style={{ transform: 'translateZ(-1px) rotateY(180deg)' }}
         >
            <Icon size={32} strokeWidth={1.5} className="text-brand-gold pointer-events-none" />
         </div>
      </motion.div>
    </div>
  );
}
