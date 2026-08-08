'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { ArticleAuditor } from '@/components/ArticleAuditor';

export default function AdminAuditPage() {
  const [articles, setArticles] = useState<{ slug: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/articles')
      .then(res => res.json())
      .then((data: any[]) => {
        setArticles(data.map((a: any) => ({ slug: a.slug, title: a.title })));
      })
      .catch(err => console.error('Failed to load articles:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-purple-400" size={32} />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            No se encontraron artículos para auditar.
          </div>
        ) : (
          <ArticleAuditor articles={articles} />
        )}
      </motion.div>
    </div>
  );
}
