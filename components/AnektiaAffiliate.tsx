'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, ExternalLink, Bookmark } from 'lucide-react';

interface AnektiaAffiliateProps {
  content: string;
}

export function AnektiaAffiliate({ content }: AnektiaAffiliateProps) {
  const lines = content.split('\n');
  const metadata: Record<string, string> = {
    TITLE: '',
    AUTHOR: '',
    IMAGE: '',
    LINK: '',
    RATING: '',
    DESCRIPTION: '',
  };

  let currentKey = '';
  let descriptionLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^([A-Z]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      metadata[currentKey] = match[2].trim();
      if (currentKey === 'DESCRIPTION') descriptionLines.push(metadata[currentKey]);
    } else if (currentKey === 'DESCRIPTION') {
      descriptionLines.push(line.trim());
    }
  }

  const title = metadata['TITLE'] || 'Recurso Recomendado';
  const author = metadata['AUTHOR'] || '';
  const image = metadata['IMAGE'] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop';
  const link = metadata['LINK'] || '#';
  const ratingStr = metadata['RATING'] || '5.0';
  const description = descriptionLines.join(' ');

  return (
    <motion.aside
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-32 mx-auto max-w-4xl relative group"
    >
      <div className="absolute -inset-4 bg-[#D4AF37]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative bg-[#0A0A0B] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Image Section */}
        <div className="w-full md:w-2/5 relative h-80 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent md:bg-gradient-to-l" />
          <div className="absolute top-6 left-6">
             <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D4AF37]">
                <Bookmark size={18} />
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
             <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-[#D4AF37] uppercase">ADQUISICIÓN RECOMENDADA</span>
             <div className="h-px flex-1 bg-white/5" />
          </div>

          <h3 className="font-serif text-3xl md:text-4xl text-white mb-2 leading-tight group-hover:text-[#D4AF37] transition-colors duration-500">
            {title}
          </h3>
          {author && <p className="text-[#D4AF37]/60 font-serif italic text-lg mb-8">{author}</p>}

          <p className="text-white/40 font-light leading-relaxed text-sm md:text-base mb-10 border-l border-white/5 pl-6">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mt-auto">
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full">
              <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-xs font-mono font-bold text-white/80">{ratingStr}</span>
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest ml-2">Índice de Calidad</span>
            </div>

            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex items-center gap-4 px-10 py-4 bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-xl overflow-hidden transition-all hover:bg-white"
            >
              <span className="relative z-10 flex items-center gap-3">Explorar Recurso <ExternalLink size={14} /></span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
            </a>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
