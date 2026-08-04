'use client';
import React from 'react';
import { motion } from 'motion/react';

interface AnektiaTableProps {
  children: React.ReactNode;
}

export default function AnektiaTable({ children }: AnektiaTableProps) {
  return (
    <div className="not-prose my-12 mx-auto w-full group">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-[#d4af37]/25 dark:border-white/8 bg-white dark:bg-[#121214] shadow-md hover:shadow-lg transition-all duration-500 group-hover:border-[#8B6914]/40 dark:group-hover:border-[#D4AF37]/20"
      >
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            {children}
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-neutral-50 dark:bg-white/[0.02] border-t border-[#d4af37]/10 dark:border-white/5 py-3 px-6 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-[#8B6914] dark:text-[#D4AF37]/60 uppercase tracking-[0.4em]">Matriz de Datos Verificada</span>
        </div>
      </motion.div>
    </div>
  );
}

export const TableHead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-neutral-50 dark:bg-white/[0.03] border-b border-[#d4af37]/15 dark:border-white/5">
    {children}
  </thead>
);

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 hover:bg-amber-50/30 dark:hover:bg-[#D4AF37]/[0.02] transition-colors duration-200 group/row">
    {children}
  </tr>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className="px-5 py-3.5 text-[10px] font-mono font-black uppercase tracking-[0.35em] text-[#8B6914] dark:text-[#D4AF37]/80 whitespace-nowrap">
    {children}
  </th>
);

export const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-5 py-3.5 text-[14px] md:text-[15px] text-neutral-700 dark:text-neutral-300 font-sans font-normal leading-relaxed group-hover/row:text-neutral-900 dark:group-hover/row:text-neutral-100 transition-colors">
    {children}
  </td>
);
