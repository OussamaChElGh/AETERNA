'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { ArticleAuditor } from '@/components/ArticleAuditor';

const contentDirectories = [
  'content/guias',
];

// Articles will be loaded client-side
const articles: { slug: string; title: string }[] = [];

export default function AdminAuditPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-purple-500/10 to-transparent p-8 border-b border-white/10"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShieldCheck size={32} className="text-purple-400" />
          Auditoría de Contenido
        </h1>
        <p className="text-white/60 mt-2">
          Evalúa la calidad pedagógica de tus artículos con el framework Anektia
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ArticleAuditor articles={articles} />
      </motion.div>
    </div>
  );
}
