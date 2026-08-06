'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Loader2,
  Tag,
  Layers
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  nivel: number;
  orden: number;
  tipo: string;
  tags: string[];
  image: string;
  date: string;
  author: string;
  seccionesCount: number;
  hasCuaderno: boolean;
  fileSize: number;
  lastModified: number;
}

const NIVEL_NAMES = ['', 'Fundamentos', 'Mecánica', 'Moderna', 'Fronteras'];
const TIPO_LABELS: Record<string, string> = {
  theory: 'Teoría',
  practice: 'Práctica',
  philosophy: 'Filosofía',
  milestone: 'Hito',
  demo: 'Demo',
  hub: 'Hub',
};

export default function AdminArticlesPage() {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterNivel, setFilterNivel] = useState<number | null>(null);
  const [filterTipo, setFilterTipo] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function fetchArticles() {
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      showToast('error', 'Error al cargar artículos');
    } finally {
      setLoading(false);
    }
  }

  async function deleteArticle(slug: string) {
    try {
      const res = await fetch(`/api/admin/articles/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Artículo eliminado');
        fetchArticles();
      } else {
        showToast('error', 'Error al eliminar');
      }
    } catch {
      showToast('error', 'Error al eliminar');
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  const filtered = articles.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && 
        !a.slug.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (filterNivel !== null && a.nivel !== filterNivel) return false;
    if (filterTipo !== null && a.tipo !== filterTipo) return false;
    return true;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen size={32} className="text-indigo-400" />
            Editor de Artículos
          </h1>
          <p className="text-white/60 mt-2">
            Gestiona los {articles.length} artículos JSON del proyecto
          </p>
        </div>
        <Link
          href="/admin/articulos/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nuevo Artículo
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Buscar por título o slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-white/40" />
            <select
              value={filterNivel ?? ''}
              onChange={(e) => setFilterNivel(e.target.value ? parseInt(e.target.value) : null)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">Todos los niveles</option>
              <option value="1">Nivel 1 - Fundamentos</option>
              <option value="2">Nivel 2 - Mecánica</option>
              <option value="3">Nivel 3 - Moderna</option>
              <option value="4">Nivel 4 - Fronteras</option>
            </select>
            <select
              value={filterTipo ?? ''}
              onChange={(e) => setFilterTipo(e.target.value || null)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">Todos los tipos</option>
              {Object.entries(TIPO_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Articles Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-white" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <BookOpen size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No se encontraron artículos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article, idx) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors group"
            >
              {article.image && (
                <div className="h-32 overflow-hidden bg-black/20">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-medium line-clamp-2">{article.title}</h3>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs ${
                    article.nivel === 1 ? 'bg-blue-500/20 text-blue-400' :
                    article.nivel === 2 ? 'bg-green-500/20 text-green-400' :
                    article.nivel === 3 ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    N{article.nivel}
                  </span>
                </div>
                <p className="text-white/40 text-sm line-clamp-2 mb-3">{article.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-white/40">+{article.tags.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Layers size={12} />
                      {article.seccionesCount} secciones
                    </span>
                    {article.hasCuaderno && (
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        Ejercicios
                      </span>
                    )}
                  </div>
                  <span>{TIPO_LABELS[article.tipo] || article.tipo}</span>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                  <Link
                    href={`/admin/articulos/${article.slug}`}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit2 size={14} />
                    Editar
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(article.slug)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteArticle(deleteConfirm)}
        title="Eliminar Artículo"
        message={`¿Estás seguro de eliminar este artículo? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
