'use client';
import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ChevronRight, Hash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props {
  content: string;
}

export function AnektiaPracticeProblem({ content }: Props) {
  const titleMatch = content.match(/(?:TITLE|LABEL):\s*(.*)/) || content.match(/###\s*(.*)/);
  const rawTitle = titleMatch ? titleMatch[1].trim() : 'Problema';

  let problemLabel = 'EXÉGESIS PRÁCTICA';
  let mainTitle = rawTitle;
  const cleanTitle = rawTitle.replace(/^[^\w\s\u00C0-\u024F]+/, '').trim();
  const labelMatch = cleanTitle.match(/^(Problema\s*resuelto\s*[\d.]*)(?::|-)?\s*(.*)/i);
  if (labelMatch) mainTitle = labelMatch[2].trim() || rawTitle;

  let remaining = content;
  if (titleMatch) remaining = remaining.replace(titleMatch[0], '').trim();

  let respuesta = '';
  const respuestaSplit = remaining.split(/\*\*Respuesta:\*\*/);
  if (respuestaSplit.length > 1) {
    respuesta = respuestaSplit.pop()!.trim();
    remaining = respuestaSplit.join('**Respuesta:**').trim();
  }

  let enunciado = '';
  let solucion = '';
  const solucionHeaderMatch = remaining.match(/\*\*(?:Solución|Solución paso a paso):\*\*/);
  if (solucionHeaderMatch) {
    const splitIndex = solucionHeaderMatch.index!;
    enunciado = remaining.substring(0, splitIndex).trim();
    solucion = remaining.substring(splitIndex + solucionHeaderMatch[0].length).trim();
  } else {
    enunciado = remaining;
  }

  const markdownComponents = {
    p: ({ children }: any) => <p className="mb-4 text-[#2C2C2C]/70 leading-relaxed font-normal">{children}</p>,
    code: ({ children }: any) => <code className="bg-black/5 text-[#8B6914] px-2 py-0.5 rounded font-mono text-sm">{children}</code>
  };

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="my-24 relative">
      <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#8B6914] via-[#8B6914]/20 to-transparent" />
      
      <div className="pl-8 md:pl-16">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-mono font-bold tracking-[0.5em] text-[#8B6914] uppercase">{problemLabel}</span>
            <div className="h-px w-24 bg-black/5" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4 leading-tight">{mainTitle}</h2>
        </header>

        {enunciado && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 text-black/20">
               <Hash size={14} />
               <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Enunciado del Problema</span>
            </div>
            <div className="prose max-w-none text-xl text-[#2C2C2C]/80 font-light italic leading-relaxed border-l border-black/5 pl-8">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>{enunciado}</ReactMarkdown>
            </div>
          </div>
        )}

        {solucion && (
          <div className="mb-16 space-y-12">
             <div className="flex items-center gap-3 mb-8 text-black/20">
                <ChevronRight size={14} />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Resolución Axiomática</span>
             </div>
             <div className="grid grid-cols-1 gap-8 text-[#2C2C2C]">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>{solucion}</ReactMarkdown>
             </div>
          </div>
        )}

        {respuesta && (
          <motion.div whileHover={{ x: 10 }} className="bg-white border border-black/5 rounded-2xl p-8 md:p-12 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle size={80} className="text-[#8B6914]" /></div>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#8B6914] uppercase block mb-4">Resultado Verificado</span>
            <div className="text-2xl md:text-3xl font-serif text-[#1A1A1A] italic">
               <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>{respuesta}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
