'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Table2 } from 'lucide-react';

export interface ComparativeTableProps {
  id?: string;
  title?: string;
  headers?: string[];
  rows?: string[][];
}

export function ComparativeTable({
  id,
  title = 'Cuadro Comparativo',
  headers = [],
  rows = []
}: ComparativeTableProps) {
  if (!rows || rows.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      id={id}
      className="my-12 rounded-none bg-[#FAF8FF] dark:bg-[#0F0B1E] border-4 border-amber-600 dark:border-amber-400 p-5 md:p-8 shadow-[8px_8px_0px_0px_#D97706] dark:shadow-[8px_8px_0px_0px_#FBBF24] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      <div className="relative flex items-center gap-3 border-b-4 border-amber-600/30 dark:border-amber-400/30 pb-5 mb-6">
        <div className="w-10 h-10 rounded-none bg-amber-600 text-white dark:bg-amber-400 dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] shrink-0">
          <Table2 size={20} />
        </div>
        <h3 className="font-mono text-xl md:text-2xl font-black uppercase text-brand-ink dark:text-white leading-tight">
          {title}
        </h3>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full border-collapse font-sans text-sm md:text-base">
          {headers && headers.length > 0 && (
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="border-3 border-amber-700 dark:border-amber-500 bg-amber-100 dark:bg-amber-950/60 p-3 md:p-4 text-left font-mono font-bold text-xs md:text-sm uppercase tracking-wider text-amber-900 dark:text-amber-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="even:bg-amber-50/50 dark:even:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 transition-colors"
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="border-2 border-amber-300 dark:border-amber-800 p-3 md:p-4 text-slate-800 dark:text-slate-200 leading-relaxed"
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {cell}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
