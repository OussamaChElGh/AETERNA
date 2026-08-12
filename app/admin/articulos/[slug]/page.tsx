'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Eye,
  Code,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface ArticleMetadata {
  title: string;
  description: string;
  slug: string;
  author: string;
  category: string;
  subcategory: string;
  tags: string[];
  image: string;
  date: string;
  nivel: number;
  orden: number;
  tipo: string;
  prerequisites?: string[];
}

interface Section {
  id: string;
  titulo: string;
  niveles: {
    principiante?: string;
    intermedio?: string;
    avanzado?: string;
  };
  acciones: any[];
}

interface CuadernoEntry {
  titulo: string;
  enunciado: string;
  solucion: string;
  xp: number;
  pistas?: string[];
  opciones?: { label: string; correcta: boolean }[];
}

interface Article {
  metadata: ArticleMetadata;
  introduccion: string;
  secciones: Section[];
  conclusion?: string;
  cuaderno?: Record<string, CuadernoEntry[]>;
}

type EditMode = 'visual' | 'json' | 'images';

export default function ArticleEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [slug, setSlug] = useState<string>('');
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<EditMode>('visual');
  const [jsonText, setJsonText] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeLevel, setActiveLevel] = useState<'principiante' | 'intermedio' | 'avanzado'>('principiante');

  useEffect(() => {
    params.then(p => {
      setSlug(p.slug);
      if (p.slug !== 'new') {
        fetchArticle(p.slug);
      } else {
        setArticle({
          metadata: {
            title: '',
            description: '',
            slug: '',
            author: 'Anektia',
            category: 'ciencias_naturales',
            subcategory: 'fisica',
            tags: [],
            image: '',
            date: new Date().toISOString().split('T')[0],
            nivel: 1,
            orden: 1,
            tipo: 'theory',
          },
          introduccion: '',
          secciones: [],
          conclusion: '',
        });
        setLoading(false);
      }
    });
  }, [params]);

  async function fetchArticle(articleSlug: string) {
    try {
      const res = await fetch(`/api/admin/articles/${articleSlug}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setArticle(data);
      setJsonText(JSON.stringify(data, null, 2));
    } catch (error) {
      showToast('error', 'Error al cargar artículo');
      router.push('/admin/articulos');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!article) return;
    setSaving(true);
    
    try {
      const dataToSave = mode === 'json' ? JSON.parse(jsonText) : article;
      
      const isNew = slug === 'new';
      const url = isNew ? '/api/admin/articles' : `/api/admin/articles/${slug}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al guardar');
      }

      showToast('success', 'Artículo guardado');
      if (isNew) {
        router.push(`/admin/articulos/${dataToSave.metadata.slug}`);
      }
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  function updateMetadata(field: keyof ArticleMetadata, value: any) {
    if (!article) return;
    setArticle({
      ...article,
      metadata: { ...article.metadata, [field]: value },
    });
  }

  function addSection() {
    if (!article) return;
    const newSection: Section = {
      id: `seccion-${Date.now()}`,
      titulo: 'Nueva sección',
      niveles: { principiante: '', intermedio: '', avanzado: '' },
      acciones: [],
    };
    setArticle({
      ...article,
      secciones: [...article.secciones, newSection],
    });
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  }

  function updateSection(sectionId: string, field: keyof Section, value: any) {
    if (!article) return;
    setArticle({
      ...article,
      secciones: article.secciones.map(s => 
        s.id === sectionId ? { ...s, [field]: value } : s
      ),
    });
  }

  function updateSectionLevel(sectionId: string, level: 'principiante' | 'intermedio' | 'avanzado', content: string) {
    if (!article) return;
    setArticle({
      ...article,
      secciones: article.secciones.map(s => 
        s.id === sectionId 
          ? { ...s, niveles: { ...s.niveles, [level]: content } }
          : s
      ),
    });
  }

  function deleteSection(sectionId: string) {
    if (!article) return;
    setArticle({
      ...article,
      secciones: article.secciones.filter(s => s.id !== sectionId),
    });
  }

  function toggleSection(sectionId: string) {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-white" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">Artículo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-[#111] border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/articulos')}
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-white">
              {slug === 'new' ? 'Nuevo Artículo' : article.metadata.title || 'Sin título'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setMode('visual')}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                  mode === 'visual' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Eye size={14} />
                Visual
              </button>
              <button
                onClick={() => {
                  setMode('json');
                  setJsonText(JSON.stringify(article, null, 2));
                }}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                  mode === 'json' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Code size={14} />
                JSON
              </button>
              <button
                onClick={() => setMode('images')}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                  mode === 'images' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <ImageIcon size={14} />
                Imágenes
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {mode === 'images' ? (
          <ArticleImagesPanel slug={slug === 'new' ? '' : slug} showToast={showToast} />
        ) : mode === 'json' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
          >
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-[calc(100vh-200px)] bg-transparent text-white font-mono text-sm p-4 focus:outline-none resize-none"
              spellCheck={false}
            />
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Metadata */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-4">Metadata</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1">Título</label>
                  <input
                    type="text"
                    value={article.metadata.title}
                    onChange={(e) => updateMetadata('title', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Slug</label>
                  <input
                    type="text"
                    value={article.metadata.slug}
                    onChange={(e) => updateMetadata('slug', e.target.value)}
                    disabled={slug !== 'new'}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/60 text-sm mb-1">Descripción</label>
                  <textarea
                    value={article.metadata.description}
                    onChange={(e) => updateMetadata('description', e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Categoría</label>
                  <select
                    value={article.metadata.category}
                    onChange={(e) => updateMetadata('category', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="ciencias_naturales">Ciencias Naturales</option>
                    <option value="ciencias_formales">Ciencias Formales</option>
                    <option value="ciencias_sociales">Ciencias Sociales</option>
                    <option value="humanidades">Humanidades</option>
                    <option value="artes">Artes</option>
                    <option value="filosofia">Filosofía</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Subcategoría</label>
                  <input
                    type="text"
                    value={article.metadata.subcategory}
                    onChange={(e) => updateMetadata('subcategory', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Nivel</label>
                  <select
                    value={article.metadata.nivel}
                    onChange={(e) => updateMetadata('nivel', parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value={1}>1 - Fundamentos</option>
                    <option value={2}>2 - Mecánica</option>
                    <option value={3}>3 - Moderna</option>
                    <option value={4}>4 - Fronteras</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Orden</label>
                  <input
                    type="number"
                    value={article.metadata.orden}
                    onChange={(e) => updateMetadata('orden', parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Tipo</label>
                  <select
                    value={article.metadata.tipo}
                    onChange={(e) => updateMetadata('tipo', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="theory">Teoría</option>
                    <option value="practice">Práctica</option>
                    <option value="philosophy">Filosofía</option>
                    <option value="milestone">Hito</option>
                    <option value="demo">Demo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">URL Imagen</label>
                  <input
                    type="text"
                    value={article.metadata.image}
                    onChange={(e) => updateMetadata('image', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Tags (separados por coma)</label>
                  <input
                    type="text"
                    value={article.metadata.tags.join(', ')}
                    onChange={(e) => updateMetadata('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
            </motion.section>

            {/* Introducción */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-4">Introducción</h2>
              <textarea
                value={article.introduccion}
                onChange={(e) => setArticle({ ...article, introduccion: e.target.value })}
                rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 resize-y"
                placeholder="Contenido de introducción (Markdown con componentes especiales)..."
              />
            </motion.section>

            {/* Secciones */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Secciones ({article.secciones.length})</h2>
                <button
                  onClick={addSection}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} />
                  Añadir sección
                </button>
              </div>

              <div className="space-y-3">
                {article.secciones.map((section, idx) => (
                  <div
                    key={section.id}
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5" onClick={() => toggleSection(section.id)}>
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 text-sm">#{idx + 1}</span>
                        <input
                          type="text"
                          value={section.titulo}
                          onChange={(e) => updateSection(section.id, 'titulo', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-transparent text-white font-medium focus:outline-none focus:bg-white/5 px-2 py-1 rounded"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedSections.has(section.id) ? (
                          <ChevronUp size={18} className="text-white/40" />
                        ) : (
                          <ChevronDown size={18} className="text-white/40" />
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {expandedSections.has(section.id) && (
                      <div className="border-t border-white/10 p-4">
                        {/* Level Tabs */}
                        <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1">
                          {(['principiante', 'intermedio', 'avanzado'] as const).map(level => (
                            <button
                              key={level}
                              onClick={() => setActiveLevel(level)}
                              className={`flex-1 px-3 py-1 rounded text-sm capitalize transition-colors ${
                                activeLevel === level
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-white/60 hover:text-white'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={section.niveles[activeLevel] || ''}
                          onChange={(e) => updateSectionLevel(section.id, activeLevel, e.target.value)}
                          rows={12}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 resize-y"
                          placeholder={`Contenido para nivel ${activeLevel} (Markdown)...`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Conclusión */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-4">Conclusión</h2>
              <textarea
                value={article.conclusion || ''}
                onChange={(e) => setArticle({ ...article, conclusion: e.target.value })}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 resize-y"
                placeholder="Contenido de conclusión (Markdown)..."
              />
            </motion.section>
          </div>
        )}
      </div>
    </div>
  );
}

interface ArticleImageItem {
  name: string;
  url: string;
  size: number;
  ext: string;
}

function ArticleImagesPanel({
  slug,
  showToast,
}: {
  slug: string;
  showToast: (type: 'success' | 'error', title: string, message?: string) => void;
}) {
  const [images, setImages] = useState<ArticleImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (slug) loadImages();
  }, [slug]);

  async function loadImages() {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/articles/images?slug=${slug}`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (e) {
      showToast('error', 'Error al cargar imágenes');
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(file: File) {
    if (!slug) {
      showToast('error', 'Guarda el artículo primero', 'El artículo debe existir para asociar imágenes');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug);
      const res = await fetch('/api/admin/articles/images', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Imagen subida', data.url);
        loadImages();
      } else {
        showToast('error', data.error || 'Error al subir');
      }
    } catch (e) {
      showToast('error', 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      for (const f of Array.from(files)) {
        await uploadFile(f);
      }
    }
    e.target.value = '';
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      for (const f of Array.from(files)) {
        await uploadFile(f);
      }
    }
  }

  async function handleDelete(name: string) {
    if (!slug) return;
    try {
      await fetch(`/api/admin/articles/images?slug=${slug}&file=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      showToast('success', 'Imagen eliminada');
      loadImages();
    } catch (e) {
      showToast('error', 'Error al eliminar imagen');
    }
  }

  async function copyMarkdown(url: string) {
    try {
      const alt = url.split('/').pop()?.replace(/\.[^.]+$/, '') || 'imagen';
      await navigator.clipboard.writeText(`![${alt}](${url})`);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
      showToast('success', 'Markdown copiado', `![${alt}](${url})`);
    } catch (e) {
      showToast('error', 'Error al copiar');
    }
  }

  if (!slug) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
        <ImageIcon size={48} className="mx-auto text-white/20 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Guarda el artículo primero</h3>
        <p className="text-white/40">El artículo debe existir para gestionar sus imágenes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Upload size={18} className="text-indigo-400" />
          Subir imágenes
        </h2>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/20 hover:border-white/40'
          }`}
        >
          <Upload size={32} className="mx-auto text-white/40 mb-2" />
          <p className="text-white/60 text-sm mb-2">
            Arrastra imágenes aquí o selecciona desde tu directorio
          </p>
          <p className="text-white/30 text-xs mb-4">
            PNG/JPG se convierten automáticamente a WebP · Guardadas en /images/articles/{slug}/
          </p>
          <label className="inline-block bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
            {uploading ? <Loader2 className="animate-spin inline mr-1" size={14} /> : <Plus size={14} className="inline mr-1" />}
            Seleccionar archivos
            <input type="file" accept="image/*" multiple onChange={handleFileInput} className="hidden" disabled={uploading} />
          </label>
        </div>
      </motion.section>

      {/* Gallery */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ImageIcon size={18} className="text-indigo-400" />
          Galería de imágenes
          <span className="text-xs text-white/40 font-mono ml-1">({images.length})</span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-indigo-400" size={28} />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            No hay imágenes subidas para este artículo todavía.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.name} className="bg-black/20 border border-white/10 rounded-xl overflow-hidden group">
                <div className="relative aspect-video bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.name} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => copyMarkdown(img.url)}
                      className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                      title="Copiar markdown"
                    >
                      {copied === img.url ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(img.name)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[10px] font-mono text-white/50 truncate" title={img.name}>{img.name}</p>
                  <p className="text-[10px] text-white/30">{img.ext} · {(img.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
