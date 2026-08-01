import React from 'react';
import { Compass, Hash } from 'lucide-react';

export interface IndiceNivelProps {
  titulo: string;
  children: React.ReactNode;
}

export function IndiceNivel({ titulo, children }: IndiceNivelProps) {
  const cleanTitle = titulo.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();

  return (
    <div className="bg-[#F5F2EC] dark:bg-white/5 border border-brand-gold/40 rounded-2xl p-6 md:p-8 my-8 shadow-md backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
        <Compass size={120} className="text-brand-gold" />
      </div>

      <div className="flex items-center gap-3 mb-5 border-b border-brand-gold/30 pb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-[#8B6914] dark:text-brand-gold">
          <Hash size={16} />
        </div>
        <h3 className="text-lg md:text-xl font-bold font-serif uppercase tracking-wider text-[#8B6914] dark:text-brand-gold m-0">
          {cleanTitle}
        </h3>
      </div>

      <div className="text-[#1A1A1A] dark:text-brand-offwhite space-y-3 text-sm md:text-base font-sans leading-relaxed prose-a:text-[#8B6914] dark:prose-a:text-brand-gold prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
        {children}
      </div>
    </div>
  );
}
