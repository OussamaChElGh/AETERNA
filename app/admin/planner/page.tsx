'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Target, 
  Lightbulb,
  Clock,
  TrendingUp,
  ChevronRight,
  GraduationCap,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

type PlannerMode = 'plan' | 'curriculum' | 'recommend';

interface ArticleSummary {
  slug: string;
  title: string;
  nivel: number;
  orden: number;
  tipo: string;
  category: string;
  subcategory: string;
}

interface PlanResult {
  title?: string;
  description?: string;
  duration?: string;
  difficulty?: string;
  goals?: string[];
  modules?: {
    title: string;
    articles?: string[];
    estimatedTime?: string;
    objectives?: string[];
  }[];
  recommendations?: string[];
  analysis?: string;
  gaps?: string[];
  suggestions?: {
    type: string;
    description: string;
    priority: string;
  }[];
  nextTopics?: string[];
  recommendedArticles?: {
    slug: string;
    reason: string;
    priority: number;
  }[];
  nextSteps?: string[];
  encouragement?: string;
  raw?: string;
}

const MODE_CONFIG = {
  plan: {
    label: 'Plan de Estudio',
    icon: GraduationCap,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    description: 'Genera un plan de estudio personalizado basado en artículos disponibles',
  },
  curriculum: {
    label: 'Análisis Curricular',
    icon: BookOpen,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Analiza el currículo actual y sugiere mejoras',
  },
  recommend: {
    label: 'Recomendaciones',
    icon: Lightbulb,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Recomienda próximos artículos basado en progreso',
  },
};

export default function AdminPlannerPage() {
  const { showToast } = useToast();
  const [mode, setMode] = useState<PlannerMode>('plan');
  const [prompt, setPrompt] = useState('');
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    fetchArticles();
  }, []);

  function toggleArticle(slug: string) {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedArticles(newSelected);
  }

  function selectAll() {
    setSelectedArticles(new Set(articles.map(a => a.slug)));
  }

  function selectByNivel(nivel: number) {
    setSelectedArticles(new Set(articles.filter(a => a.nivel === nivel).map(a => a.slug)));
  }

  function clearSelection() {
    setSelectedArticles(new Set());
  }

  async function generate() {
    if (!prompt.trim() && selectedArticles.size === 0) {
      showToast('error', 'Escribe una solicitud o selecciona artículos');
      return;
    }

    setGenerating(true);
    setResult(null);

    const context = {
      availableArticles: articles
        .filter(a => selectedArticles.size === 0 || selectedArticles.has(a.slug))
        .map(a => ({
          slug: a.slug,
          title: a.title,
          nivel: a.nivel,
          tipo: a.tipo,
          category: a.category,
        })),
      totalArticles: articles.length,
      selectedCount: selectedArticles.size,
    };

    try {
      const res = await fetch('/api/admin/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || `Genera un ${mode === 'plan' ? 'plan de estudio' : mode === 'curriculum' ? 'análisis curricular' : 'recomendaciones'} basado en los artículos seleccionados.`,
          context,
          mode,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast('error', data.error);
      } else {
        setResult(data.result);
        showToast('success', 'Plan generado con IA');
      }
    } catch (error) {
      showToast('error', 'Error al generar');
    } finally {
      setGenerating(false);
    }
  }

  const modeConfig = MODE_CONFIG[mode];
  const ModeIcon = modeConfig.icon;

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Brain size={32} className="text-indigo-400" />
          Planificador con IA
        </h1>
        <p className="text-white/60 mt-2">
          Genera planes de estudio y recomendaciones con Gemini AI
        </p>
      </motion.div>

      {/* Mode Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {(Object.entries(MODE_CONFIG) as [PlannerMode, typeof MODE_CONFIG.plan][]).map(([key, config], idx) => {
          const Icon = config.icon;
          const isActive = mode === key;
          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setMode(key)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive 
                  ? `${config.bgColor} ${config.borderColor}` 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={20} className={isActive ? config.color : 'text-white/40'} />
                <span className={`font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {config.label}
                </span>
              </div>
              <p className="text-sm text-white/40">{config.description}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <label className="block text-white/60 text-sm mb-2">
              Solicitud para la IA
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={
                mode === 'plan' 
                  ? 'Ej: Crea un plan de estudio de 4 semanas para dominar vectores y cinemática...'
                  : mode === 'curriculum'
                  ? 'Ej: Analiza el currículo de nivel 1 y sugiere artículos faltantes...'
                  : 'Ej: Recomienda los próximos 3 artículos para un estudiante que completó vectores...'
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-white/40 text-sm">
                {selectedArticles.size > 0 
                  ? `${selectedArticles.size} artículos seleccionados`
                  : 'Todos los artículos incluidos'
                }
              </span>
              <button
                onClick={generate}
                disabled={generating}
                className={`${modeConfig.bgColor} ${modeConfig.borderColor} border hover:opacity-80 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all`}
              >
                {generating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generar
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Article Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Artículos (contexto para IA)</h3>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-indigo-400 hover:text-indigo-300 text-sm">Todos</button>
                <button onClick={() => selectByNivel(1)} className="text-blue-400 hover:text-blue-300 text-sm">N1</button>
                <button onClick={() => selectByNivel(2)} className="text-green-400 hover:text-green-300 text-sm">N2</button>
                <button onClick={() => selectByNivel(3)} className="text-purple-400 hover:text-purple-300 text-sm">N3</button>
                <button onClick={() => selectByNivel(4)} className="text-orange-400 hover:text-orange-300 text-sm">N4</button>
                <button onClick={clearSelection} className="text-white/40 hover:text-white/60 text-sm">Limpiar</button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-white/40" />
                </div>
              ) : articles.map(article => (
                <label
                  key={article.slug}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedArticles.has(article.slug) ? 'bg-indigo-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedArticles.has(article.slug)}
                    onChange={() => toggleArticle(article.slug)}
                    className="w-4 h-4"
                  />
                  <span className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                    article.nivel === 1 ? 'bg-blue-500/20 text-blue-400' :
                    article.nivel === 2 ? 'bg-green-500/20 text-green-400' :
                    article.nivel === 3 ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {article.nivel}
                  </span>
                  <span className="text-white/80 text-sm truncate">{article.title}</span>
                </label>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Panel: Result */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`bg-white/5 border rounded-xl p-6 sticky top-8 ${modeConfig.borderColor}`}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className={modeConfig.color} />
              Resultado
            </h3>
            
            {generating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-indigo-500/30 rounded-full animate-pulse" />
                  <Brain size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 animate-pulse" />
                </div>
                <p className="text-white/40 text-sm mt-4">La IA está pensando...</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {result.title && (
                  <h4 className="text-white font-bold">{result.title}</h4>
                )}
                {result.description && (
                  <p className="text-white/60 text-sm">{result.description}</p>
                )}
                {result.difficulty && (
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.difficulty === 'principiante' ? 'bg-green-500/20 text-green-400' :
                    result.difficulty === 'intermedio' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {result.difficulty}
                  </span>
                )}
                {result.duration && (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Clock size={14} />
                    {result.duration}
                  </div>
                )}
                {result.goals && result.goals.length > 0 && (
                  <div>
                    <h5 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-1">
                      <Target size={14} /> Objetivos
                    </h5>
                    <ul className="space-y-1">
                      {result.goals.map((g, i) => (
                        <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                          <ChevronRight size={12} className="mt-1 shrink-0" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.modules && result.modules.length > 0 && (
                  <div>
                    <h5 className="text-white/80 text-sm font-medium mb-2">Módulos</h5>
                    <div className="space-y-2">
                      {result.modules.map((m, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-3">
                          <p className="text-white text-sm font-medium">{m.title}</p>
                          {m.estimatedTime && (
                            <p className="text-white/40 text-xs">{m.estimatedTime}</p>
                          )}
                          {m.articles && m.articles.length > 0 && (
                            <p className="text-indigo-400/60 text-xs mt-1">
                              {m.articles.length} artículos
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div>
                    <h5 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-1">
                      <Lightbulb size={14} /> Recomendaciones
                    </h5>
                    <ul className="space-y-1">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                          <span className="text-amber-400">•</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.analysis && (
                  <div>
                    <h5 className="text-white/80 text-sm font-medium mb-2">Análisis</h5>
                    <p className="text-white/60 text-sm">{result.analysis}</p>
                  </div>
                )}
                {result.gaps && result.gaps.length > 0 && (
                  <div>
                    <h5 className="text-white/80 text-sm font-medium mb-2">Lagunas Detectadas</h5>
                    <ul className="space-y-1">
                      {result.gaps.map((g, i) => (
                        <li key={i} className="text-red-400/80 text-sm flex items-start gap-2">
                          <span>⚠</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.recommendedArticles && result.recommendedArticles.length > 0 && (
                  <div>
                    <h5 className="text-white/80 text-sm font-medium mb-2">Artículos Recomendados</h5>
                    <div className="space-y-2">
                      {result.recommendedArticles.map((a, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-3">
                          <p className="text-white text-sm font-mono">{a.slug}</p>
                          <p className="text-white/40 text-xs mt-1">{a.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.encouragement && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400/80 text-sm italic">{result.encouragement}</p>
                  </div>
                )}
                {result.raw && !result.title && (
                  <pre className="text-white/60 text-xs whitespace-pre-wrap font-mono bg-black/20 rounded-lg p-3 max-h-96 overflow-y-auto">
                    {result.raw}
                  </pre>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles size={32} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">
                  Escribe una solicitud y presiona Generar
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
