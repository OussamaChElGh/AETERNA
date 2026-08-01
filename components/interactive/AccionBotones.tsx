'use client';
import React, { useState } from 'react';
import { ChevronDown, Lightbulb, Zap, BookOpen, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AccionBotones({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 my-10 max-w-3xl mx-auto">
      {children}
    </div>
  );
}

interface BotonProps {
  children: React.ReactNode;
  titulo: string;
  icon: React.ReactNode;
  colorClass: string;
  bodyClass: string;
}

function BaseBoton({ children, titulo, icon, colorClass, bodyClass }: BotonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-4 rounded-lg w-full text-left font-sans transition-all duration-300 border ${colorClass} ${isOpen ? 'shadow-inner' : 'hover:shadow-md hover:-translate-y-0.5'}`}
      >
        <div className="flex-shrink-0">
          {icon}
        </div>
        <span className="flex-1 font-bold text-sm tracking-wide">{titulo}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <div className={`p-6 md:p-8 border-l border-r border-b rounded-b-lg mt-0 ${bodyClass}`}>
              <div className="prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BotonSimplificar({ children }: { children: React.ReactNode }) {
  return (
    <BaseBoton 
      titulo="Ver versión simplificada (Analogía)" 
      icon={<Lightbulb className="w-5 h-5" />}
      colorClass="bg-[#F0F7F4]/80 text-[#2C5F43] border-[#A8D0B8] hover:bg-[#E2F0EA]"
      bodyClass="bg-[#F9FCFA] border-[#A8D0B8]"
    >
      {children}
    </BaseBoton>
  );
}

export function BotonProfundizar({ children }: { children: React.ReactNode }) {
  return (
    <BaseBoton 
      titulo="Profundizar (Avanzado)" 
      icon={<Zap className="w-5 h-5 text-[#8B3A3A]" />}
      colorClass="bg-[#FDF6F6] text-[#8B3A3A] border-[#E8C5C5] hover:bg-[#FAEFEF]"
      bodyClass="bg-white border-[#E8C5C5]"
    >
      {children}
    </BaseBoton>
  );
}

export function BotonEjemplos({ children }: { children: React.ReactNode }) {
  return (
    <BaseBoton 
      titulo="Casos Prácticos y Ejemplos" 
      icon={<BookOpen className="w-5 h-5" />}
      colorClass="bg-[#F5F8FA]/80 text-[#325A73] border-[#B8D4E3] hover:bg-[#EBF2F7]"
      bodyClass="bg-white border-[#B8D4E3]"
    >
      {children}
    </BaseBoton>
  );
}

export function BotonConexiones({ children }: { children: React.ReactNode }) {
  return (
    <BaseBoton 
      titulo="Conexiones Inesperadas" 
      icon={<LinkIcon className="w-5 h-5 text-[#8B5A3C]" />}
      colorClass="bg-[#FDF8F0] text-[#8B5A3C] border-[#D6C5B3] hover:bg-[#F5EEDB]"
      bodyClass="bg-[#FFFEFC] border-[#D6C5B3]"
    >
      {children}
    </BaseBoton>
  );
}
