'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, AlertTriangle, CheckCircle, Clock, Plus, ExternalLink, ChevronRight } from 'lucide-react';
import type { BranchSummary } from '@/lib/curriculum/schema';

export default function CurriculumDashboard() {
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/curriculum/branches');
        const data = await res.json();
        setBranches(data.branches || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Activo' };
      case 'draft': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Borrador' };
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Planificado' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Currículum Multi-Rama</h1>
          <p className="text-white/40 mt-1">Gestión de ramas de aprendizaje y su contenido</p>
        </div>
        <Link
          href="/admin/planner"
          className="px-4 py-2 bg-brand-gold text-brand-ink rounded-xl font-bold text-sm hover:bg-brand-gold/80 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nueva rama
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : branches.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <BookOpen className="mx-auto text-white/20 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No hay ramas definidas</h3>
          <p className="text-white/40 mb-4">Crea tu primera rama de currículum con el scaffolding CLI.</p>
          <code className="bg-black/30 px-4 py-2 rounded-lg text-sm text-brand-gold font-mono">
            npm run curriculum:scaffold -- --branch=matematicas
          </code>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map(branch => {
            const badge = statusBadge(branch.status);
            return (
              <motion.div
                key={branch.branchId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-gold/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{branch.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{branch.branchName}</h3>
                      <p className="text-xs text-white/40">{branch.branchId}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{branch.totalArticles}</div>
                    <div className="text-[10px] text-white/40 uppercase">Artículos</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{branch.levels}</div>
                    <div className="text-[10px] text-white/40 uppercase">Niveles</div>
                  </div>
                </div>

                {branch.totalArticles > 0 && (
                  <div className="mb-4 space-y-1">
                    {Object.entries(branch.articlesByLevel).sort(([a], [b]) => Number(a) - Number(b)).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Nivel {level}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-gold rounded-full"
                              style={{ width: `${Math.min(100, (count / Math.max(...Object.values(branch.articlesByLevel))) * 100)}%` }}
                            />
                          </div>
                          <span className="text-white/40 font-mono">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {branch.totalArticles > 0 && Object.keys(branch.typesDistribution).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {Object.entries(branch.typesDistribution).map(([type, count]) => (
                      <span key={type} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 font-mono">
                        {type}: {count}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-[10px] text-white/40 font-mono uppercase">{branch.categoryId}</span>
                  <Link
                    href={`/admin/articulos?branch=${branch.branchId}`}
                    className="text-xs text-brand-gold hover:text-brand-gold/80 flex items-center gap-1 transition-colors"
                  >
                    Ver artículos <ChevronRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Terminal size={18} className="text-brand-gold" />
          Comandos CLI
        </h3>
        <div className="space-y-3">
          <div>
            <code className="text-sm text-brand-gold font-mono bg-black/30 px-3 py-1.5 rounded-lg block">
              npx tsx scripts/scaffold-curriculum.ts --branch=matematicas
            </code>
            <p className="text-xs text-white/40 mt-1">Crear nueva rama con template vacío</p>
          </div>
          <div>
            <code className="text-sm text-brand-gold font-mono bg-black/30 px-3 py-1.5 rounded-lg block">
              npx tsx scripts/scaffold-curriculum.ts --branch=quimica --levels=4
            </code>
            <p className="text-xs text-white/40 mt-1">Crear rama con 4 niveles</p>
          </div>
          <div>
            <code className="text-sm text-brand-gold font-mono bg-black/30 px-3 py-1.5 rounded-lg block">
              npx tsx scripts/scaffold-curriculum.ts --branch=matematicas --force
            </code>
            <p className="text-xs text-white/40 mt-1">Sobrescribir rama existente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Terminal({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}
