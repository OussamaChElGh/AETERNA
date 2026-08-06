'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Loader2,
  FileText,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface ArticleInfo {
  slug: string;
  title: string;
  nivel: number;
  orden: number;
  lastModified: number;
}

interface SyncResult {
  slug: string;
  success: boolean;
  mdPath?: string;
  error?: string;
}

export default function AdminSyncPage() {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<ArticleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [results, setResults] = useState<SyncResult[]>([]);
  const [branchId, setBranchId] = useState('fisica');

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

  async function syncArticle(slug: string) {
    setSyncing(slug);
    try {
      const res = await fetch('/api/admin/articles/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, branchId }),
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('success', 'Artículo sincronizado', `${slug} → ${data.mdPath}`);
        setResults(prev => [...prev, { slug, success: true, mdPath: data.mdPath }]);
      } else {
        showToast('error', 'Error al sincronizar', data.error);
        setResults(prev => [...prev, { slug, success: false, error: data.error }]);
      }
    } catch (error) {
      showToast('error', 'Error al sincronizar');
      setResults(prev => [...prev, { slug, success: false, error: 'Error de red' }]);
    } finally {
      setSyncing(null);
    }
  }

  async function syncAll() {
    setSyncingAll(true);
    setResults([]);
    try {
      const res = await fetch('/api/admin/articles/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: '__all__', branchId }),
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('success', 'Sincronización completada', 
          `${data.synced}/${data.total} artículos sincronizados`);
        setResults(data.results);
      } else {
        showToast('error', 'Error al sincronizar', data.error);
      }
    } catch (error) {
      showToast('error', 'Error al sincronizar todos');
    } finally {
      setSyncingAll(false);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  const getResultForSlug = (slug: string) => results.find(r => r.slug === slug);

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <RefreshCw size={32} className="text-cyan-400" />
          Sincronizador JSON ↔ Markdown
        </h1>
        <p className="text-white/60 mt-2">
          Regenera archivos Markdown desde los artículos JSON
        </p>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-sm text-white/80">
            <p className="font-medium text-cyan-400 mb-1">¿Qué hace el sincronizador?</p>
            <p>
              Convierte los artículos JSON de <code className="bg-white/10 px-1 rounded">data/articles/</code> a 
              archivos Markdown en <code className="bg-white/10 px-1 rounded">content/guias/</code>. 
              El contenido de las secciones se mantiene, pero el formato se adapta al sistema de capas 
              (<code className="bg-white/10 px-1 rounded">&lt;NivelActivo&gt;</code>) del renderizador.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-1">Branch/Curriculum</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="fisica">Física</option>
                <option value="matematicas">Matemáticas</option>
                <option value="programacion">Programación</option>
              </select>
            </div>
            <div className="text-sm text-white/40">
              <p>{articles.length} artículos JSON disponibles</p>
              {results.length > 0 && (
                <p className="text-cyan-400">
                  {results.filter(r => r.success).length} sincronizados
                </p>
              )}
            </div>
          </div>
          <button
            onClick={syncAll}
            disabled={syncingAll || articles.length === 0}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {syncingAll ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Sincronizar Todos
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Results Summary */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3">Resultados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-white/80">
                    Exitosos: <span className="font-bold text-green-400">{results.filter(r => r.success).length}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-400" />
                  <span className="text-white/80">
                    Fallidos: <span className="font-bold text-red-400">{results.filter(r => !r.success).length}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-cyan-400" />
                  <span className="text-white/80">
                    Total: <span className="font-bold text-white">{results.length}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-white" />
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((article, idx) => {
            const result = getResultForSlug(article.slug);
            const isSyncing = syncing === article.slug;
            
            return (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                className={`bg-white/5 border rounded-xl p-4 flex items-center justify-between ${
                  result?.success ? 'border-green-500/30' : 
                  result?.error ? 'border-red-500/30' : 
                  'border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    result?.success ? 'bg-green-500/20' : 
                    result?.error ? 'bg-red-500/20' : 
                    'bg-white/5'
                  }`}>
                    {isSyncing ? (
                      <Loader2 className="animate-spin text-cyan-400" size={18} />
                    ) : result?.success ? (
                      <CheckCircle className="text-green-400" size={18} />
                    ) : result?.error ? (
                      <XCircle className="text-red-400" size={18} />
                    ) : (
                      <FileText className="text-white/40" size={18} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{article.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/40">
                      <code className="font-mono">{article.slug}</code>
                      <span>•</span>
                      <span>Nivel {article.nivel}</span>
                      {result?.mdPath && (
                        <>
                          <ArrowRight size={12} />
                          <code className="font-mono text-cyan-400/60 truncate max-w-xs">{result.mdPath}</code>
                        </>
                      )}
                      {result?.error && (
                        <span className="text-red-400">{result.error}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => syncArticle(article.slug)}
                  disabled={isSyncing || syncingAll}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {isSyncing ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Sync
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
