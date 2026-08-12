'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  Trash2,
  Copy,
  Check,
  BookOpen,
  Plus,
  ExternalLink,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface ArticleSummary {
  slug: string;
  title: string;
}

interface ArticleImageItem {
  name: string;
  url: string;
  size: number;
  ext: string;
}

interface ArticleState {
  slug: string;
  title: string;
  images: ArticleImageItem[];
  loading: boolean;
  open: boolean;
  uploading: boolean;
}

export default function ArticleImagesManager() {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [states, setStates] = useState<Record<string, ArticleState>>({});
  const [loadingList, setLoadingList] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoadingList(true);
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      const list = (data || []).map((a: any) => ({ slug: a.slug, title: a.title }));
      setArticles(list);
      const init: Record<string, ArticleState> = {};
      for (const a of list) {
        init[a.slug] = { slug: a.slug, title: a.title, images: [], loading: false, open: false, uploading: false };
      }
      setStates(init);
    } catch (e) {
      showToast('error', 'Error al cargar artículos');
    } finally {
      setLoadingList(false);
    }
  }

  async function toggleArticle(slug: string) {
    setStates(prev => {
      const s = prev[slug];
      const nowOpen = !s.open;
      if (nowOpen && s.images.length === 0) {
        loadImages(slug);
      }
      return { ...prev, [slug]: { ...s, open: nowOpen } };
    });
  }

  async function loadImages(slug: string) {
    setStates(prev => ({ ...prev, [slug]: { ...prev[slug], loading: true } }));
    try {
      const res = await fetch(`/api/admin/articles/images?slug=${slug}`);
      const data = await res.json();
      setStates(prev => ({ ...prev, [slug]: { ...prev[slug], images: data.images || [], loading: false } }));
    } catch (e) {
      showToast('error', 'Error al cargar imágenes');
      setStates(prev => ({ ...prev, [slug]: { ...prev[slug], loading: false } }));
    }
  }

  async function uploadToArticle(slug: string, files: FileList | File[]) {
    setStates(prev => ({ ...prev, [slug]: { ...prev[slug], uploading: true } }));
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('slug', slug);
        const res = await fetch('/api/admin/articles/images', { method: 'POST', body: fd });
        const data = await res.json();
        if (!data.success) showToast('error', data.error || 'Error al subir');
      }
      showToast('success', 'Imágenes subidas');
      loadImages(slug);
    } catch (e) {
      showToast('error', 'Error al subir imágenes');
    } finally {
      setStates(prev => ({ ...prev, [slug]: { ...prev[slug], uploading: false } }));
    }
  }

  async function deleteImage(slug: string, name: string) {
    try {
      await fetch(`/api/admin/articles/images?slug=${slug}&file=${encodeURIComponent(name)}`, { method: 'DELETE' });
      showToast('success', 'Imagen eliminada');
      loadImages(slug);
    } catch (e) {
      showToast('error', 'Error al eliminar');
    }
  }

  async function copyMarkdown(url: string) {
    try {
      const alt = url.split('/').pop()?.replace(/\.[^.]+$/, '') || 'imagen';
      await navigator.clipboard.writeText(`![${alt}](${url})`);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
      showToast('success', 'Markdown copiado');
    } catch (e) {
      showToast('error', 'Error al copiar');
    }
  }

  const totalImages = Object.values(states).reduce((s, a) => s + a.images.length, 0);
  const articlesWithImages = Object.values(states).filter(a => a.images.length > 0).length;

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ImageIcon size={28} className="text-indigo-400" />
          Imágenes de Artículos
        </h1>
        <p className="text-white/60 mt-2">
          Gestiona las imágenes de cada artículo: súbelas, cópialas como markdown o elimínalas.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-sm">Artículos</p>
          <p className="text-2xl font-bold text-white mt-1">{articles.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-sm">Con imágenes</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{articlesWithImages}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-sm">Total imágenes</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{totalImages}</p>
        </div>
      </div>

      {loadingList ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-400" size={32} />
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <BookOpen size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No hay artículos</h3>
          <p className="text-white/40">Crea artículos primero para gestionar sus imágenes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article, idx) => {
            const st = states[article.slug];
            if (!st) return null;
            return (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Header row */}
                <div
                  onClick={() => toggleArticle(article.slug)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-white/40" />
                    <div>
                      <h3 className="text-white font-semibold">{article.title}</h3>
                      <p className="text-xs text-white/40 font-mono">{article.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${
                      st.images.length > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/40'
                    }`}>
                      {st.images.length} {st.images.length === 1 ? 'imagen' : 'imágenes'}
                    </span>
                    <span className="text-white/40 text-sm">{st.open ? '−' : '+'}</span>
                  </div>
                </div>

                {/* Expanded body */}
                {st.open && (
                  <div className="border-t border-white/10 p-4">
                    {/* Upload */}
                    <div className="flex items-center gap-3 mb-4">
                      <label className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm`}>
                        {st.uploading ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                        Subir imágenes
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={st.uploading}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length) uploadToArticle(article.slug, e.target.files);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <Link
                        href={`/admin/articulos/${article.slug}`}
                        className="flex items-center gap-1.5 text-white/50 hover:text-indigo-400 text-sm transition-colors"
                      >
                        <ExternalLink size={14} />
                        Abrir editor
                      </Link>
                    </div>

                    {st.loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-indigo-400" size={24} />
                      </div>
                    ) : st.images.length === 0 ? (
                      <p className="text-white/40 text-sm text-center py-6">Sin imágenes todavía.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {st.images.map(img => (
                          <div key={img.name} className="bg-black/20 border border-white/10 rounded-lg overflow-hidden group">
                            <div className="relative aspect-video bg-black/40">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img.url} alt={img.name} className="w-full h-full object-contain" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => copyMarkdown(img.url)}
                                  className="p-1.5 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
                                  title="Copiar markdown"
                                >
                                  {copied === img.url ? <Check size={13} /> : <Copy size={13} />}
                                </button>
                                <button
                                  onClick={() => deleteImage(article.slug, img.name)}
                                  className="p-1.5 bg-red-600 hover:bg-red-700 rounded transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <p className="text-[9px] font-mono text-white/40 truncate px-1.5 py-1" title={img.name}>{img.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
