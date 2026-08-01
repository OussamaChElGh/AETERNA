'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  Map as MapIcon, Sparkles, Star, BookOpen, Library, Atom, Brain, 
  Landmark, Globe, Palette, History, Languages, Camera, Music, CheckCircle2,
  Compass, Zap, Lightbulb, Rocket, Telescope, Shapes, X, Edit2,
  Scale, Microscope, Feather, Leaf, Pencil, Activity, Scroll, Quote,
  Calculator, Cpu, Users, FileText, List, ChevronRight, ChevronDown, Folder
} from 'lucide-react';
import Link from 'next/link';
import { getArticlePath } from '@/lib/utils';
import type { ArticleFrontmatter } from '@/types';
import { CATEGORIES_DATA } from "@/data/categories";
import { NexusNode3D } from './NexusNode3D';

interface ConstellationMapProps {
  articles: ArticleFrontmatter[];
  articleProgress: Record<string, number>;
}

const ALL_ICONS: Record<string, any> = {
  MapIcon, Sparkles, Star, BookOpen, Library, Atom, Brain, 
  Landmark, Globe, Palette, History, Languages, Camera, Music, 
  Compass, Zap, Lightbulb, Rocket, Telescope, Shapes,
  Scale, Microscope, Feather, Leaf, Pencil, Activity, Scroll, Quote,
  Calculator, Cpu, Users, FileText
};

const CATEGORY_ICONS: Record<string, any> = {
  filosofia: 'BookOpen',
  ciencia: 'Atom',
  ciencias: 'Atom',
  historia: 'History',
  literatura: 'Library',
  psicologia: 'Brain',
  arquitectura: 'Landmark',
  arte: 'Palette',
  musica: 'Music',
  fotografia: 'Camera',
  idiomas: 'Languages',
  guias: 'MapIcon',
  general: 'Sparkles',
  
  // Sub-ramas (basadas en tags)
  'existencialismo': 'Brain',
  'estoicismo': 'Scale',
  'literatura clásica': 'Scroll',
  'poesía': 'Feather',
  'biología': 'Leaf',
  'física': 'Atom',
  'química': 'Microscope',
  'análisis': 'Pencil',
  'japonés': 'Languages',
  'japones': 'Languages',
  'inglés': 'Languages',
  'ingles': 'Languages',
  'hiragana': 'Languages',
  'katakana': 'Languages',
  'filosofía de la ciencia': 'Lightbulb',
  'método científico': 'Microscope',
  'ramas de la ciencia': 'Shapes',
  'divulgación científica': 'Compass',
  'sartre': 'Quote',
  'camus': 'Quote',
  'vida moderna': 'Activity',
  'ética': 'Scale',
  'español': 'Languages',
  'espanol': 'Languages',
  'aprendizaje': 'BookOpen'
};

export function ConstellationMap({ articles, articleProgress, children }: ConstellationMapProps & { children?: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<'constellation' | 'tree'>('constellation');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [expandedSubNode, setExpandedSubNode] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Reset subnode when main node changes
  useEffect(() => {
    setExpandedSubNode(null);
  }, [expandedNode]);
  const [selectedSubBranch, setSelectedSubBranch] = useState<any | null>(null);
  const [editingIconFor, setEditingIconFor] = useState<string | null>(null);
  const [iconOverrides, setIconOverrides] = useState<Record<string, string>>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('branch-icons') : null;
    return saved ? JSON.parse(saved) : {};
  });

  const saveIconOverride = (branchId: string, iconName: string) => {
    const newOverrides = { ...iconOverrides, [branchId]: iconName };
    setIconOverrides(newOverrides);
    if (typeof window !== 'undefined') {
      localStorage.setItem('branch-icons', JSON.stringify(newOverrides));
    }
    setEditingIconFor(null);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const constellations = useMemo(() => {
    return CATEGORIES_DATA.map(category => {
      const overrideIconName = iconOverrides[category.id];
      const Icon = overrideIconName && ALL_ICONS[overrideIconName] ? ALL_ICONS[overrideIconName] : category.icon;

      const subBranches = category.subcategories.map(sub => {
        // Collect articles for this subcategory
        const items = articles.filter(a => {
          const aCat = a.category?.toLowerCase() || '';
          const aSub = a.subcategory?.toLowerCase() || '';
          const aTags = (a.tags || []).map(t => t.toLowerCase());

          // Check if article belongs to this subcategory
          const matchesCategory = aCat === category.id.toLowerCase() || aCat === category.name.toLowerCase() || (aCat === 'guias' && aSub === category.id.toLowerCase());
          const matchesSub = aSub === sub.id.toLowerCase() || aSub === sub.name.toLowerCase() || aTags.includes(sub.id.toLowerCase()) || aTags.includes(sub.name.toLowerCase());
          
          if (matchesCategory && matchesSub) return true;
          // Loose matching if category directly matches subcategory
          if (aCat === sub.id.toLowerCase() || aCat === sub.name.toLowerCase()) return true;
          // Loose matching for guias that directly point to a subcategory
          if (aCat === 'guias' && (aSub === sub.id.toLowerCase() || aSub === sub.name.toLowerCase())) return true;

          return false;
        });

        const completed = items.filter(a => (articleProgress[a.slug] || 0) === 100).length;

        const topics = (sub.topics || []).map(topic => {
          const topicItems = items.filter(a => {
            const t = topic.toLowerCase();
            const aTags = (a.tags || []).map(tag => tag.toLowerCase());
            return aTags.includes(t) || a.title.toLowerCase().includes(t);
          });
          const tCompleted = topicItems.filter(a => (articleProgress[a.slug] || 0) === 100).length;
          return {
            id: topic,
            name: topic,
            articles: topicItems,
            completedCount: tCompleted,
            totalCount: topicItems.length
          };
        });

        return {
          id: sub.id,
          name: sub.name,
          articles: items,
          completedCount: completed,
          totalCount: items.length,
          parentId: category.id,
          icon: sub.icon,
          topics
        };
      });

      const completedCount = subBranches.reduce((acc, sub) => acc + sub.completedCount, 0);
      const totalCount = subBranches.reduce((acc, sub) => acc + sub.totalCount, 0);

      return {
        id: category.id,
        name: category.name,
        icon: Icon,
        subBranches,
        completedCount,
        totalCount
      };
    });
  }, [articles, articleProgress, iconOverrides]);

  return (
    <div className="w-full h-full min-h-[600px] relative overflow-hidden bg-brand-offwhite border border-brand-border">
      {/* View Mode Toggle */}
      <div className="absolute top-4 left-4 z-50 flex bg-white border border-brand-border shadow-sm">
        <button
          onClick={() => setViewMode('constellation')}
          className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${
            viewMode === 'constellation' ? 'bg-brand-ink text-brand-offwhite' : 'text-brand-muted hover:text-brand-ink'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Constelación
        </button>
        <button
          onClick={() => setViewMode('tree')}
          className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${
            viewMode === 'tree' ? 'bg-brand-ink text-brand-offwhite' : 'text-brand-muted hover:text-brand-ink'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          Jerarquía
        </button>
      </div>

      {viewMode === 'constellation' ? (
        <TransformWrapper
          initialScale={1}
          minScale={0.3}
          maxScale={4}
          centerOnInit
          smooth={true}
          wheel={{ step: 0.001 }}
          panning={{ velocityDisabled: false }}
          zoomAnimation={{ animationTime: 100, animationType: "linear" }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%', minHeight: '600px' }} contentStyle={{ width: '100%', height: '100%' }}>
            <div className="w-full h-full min-h-[600px] relative overflow-visible">
              {/* Subtle grid background */}
              <div className="absolute inset-[-200vw] opacity-[0.03] pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:50px_50px]"></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-10 lg:static lg:h-full">
                  <motion.div
                    className={`absolute flex items-center justify-center ${windowWidth < 1024 ? 'inset-[-800px]' : 'inset-[-2500px]'}`}
                  >
              {/* Central Hub */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="z-20 w-32 h-32 bg-brand-ink text-brand-offwhite flex flex-col items-center justify-center border border-white/20 shadow-3xl"
              >
                <Sparkles className="h-10 w-10" />
              </motion.div>

              <AnimatePresence>
                {constellations.map((node, i) => {
                const angle = (i * (360 / Math.max(constellations.length, 1)) * Math.PI) / 180;
                const radius = windowWidth < 768 ? 250 : windowWidth < 1024 ? 400 : 500;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                const isExpanded = expandedNode === node.id;
                const isFullyCompleted = node.completedCount === node.totalCount && node.totalCount > 0;
                const hasProgress = node.completedCount > 0;

                return (
                  <div key={node.id} className="absolute inset-0 flex items-center justify-center">
                    {/* Branch Line */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: radius }}
                      style={{ rotate: `${(angle * 180) / Math.PI}deg`, originX: "0%" }}
                      className={`absolute left-[50%] h-[2px] ${isFullyCompleted ? 'bg-brand-gold' : hasProgress ? 'bg-brand-gold/50' : 'bg-brand-border'} z-0`}
                    />

                    {/* Main Node */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        x,
                        y 
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="absolute z-30 flex flex-col items-center"
                    >
                      <div
                        onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                        className={`group relative w-24 h-24 flex items-center justify-center transition-all duration-700 cursor-pointer rounded-full ${
                          isExpanded ? "bg-brand-ink/10 text-brand-offwhite border-2 border-brand-ink" : 
                          isFullyCompleted ? "bg-white border-4 border-brand-gold text-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]" : 
                          hasProgress ? "bg-white border-2 border-brand-gold/30 text-brand-gold/70" : 
                          "bg-white border-2 border-brand-border text-brand-muted grayscale"
                        }`}
                      >
                        <div className="w-20 h-20">
                           <NexusNode3D id={node.id} active={isExpanded} />
                        </div>
                        
                        {/* Label */}
                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center whitespace-nowrap group-hover:z-50">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`text-[12px] font-sans font-bold uppercase tracking-[0.3em] ${isFullyCompleted ? 'text-brand-gold' : 'text-brand-ink'} block`}>
                              {node.name}
                            </span>
                            {/* Edit Icon Button */}
                            <div 
                              onClick={(e) => { e.stopPropagation(); setEditingIconFor(node.id); }}
                              className="text-brand-muted hover:text-brand-gold transition-colors opacity-0 group-hover:opacity-100 p-px cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </div>
                          </div>
                          
                          {(isExpanded || isFullyCompleted || hasProgress) && (
                            <div className={`font-mono text-[9px] mt-1 ${isFullyCompleted ? 'text-brand-gold/80' : 'text-brand-muted'}`}>
                              {node.completedCount}/{node.totalCount}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sub-nodes / Fan out */}
                      <AnimatePresence>
                        {isExpanded && node.subBranches.map((sub, j) => {
                          const totalChildren = node.subBranches.length;
                          const spreadAngle = totalChildren > 4 ? 180 : 140;
                          const subAngleOffset = totalChildren === 1 ? 0 : -(spreadAngle/2) + (j * (spreadAngle / (totalChildren - 1)));
                          const subAngle = angle + (subAngleOffset * Math.PI) / 180;
                          const subRadius = windowWidth < 768 ? 200 : 300;
                          const subX = Math.cos(subAngle) * subRadius;
                          const subY = Math.sin(subAngle) * subRadius;
                          const isCompleted = sub.completedCount === sub.totalCount && sub.totalCount > 0;
                          const hasProgress = sub.completedCount > 0;
                          
                          const overrideSubIconName = iconOverrides[`sub-${node.id}-${sub.id}`];
                          let SubIcon = overrideSubIconName && ALL_ICONS[overrideSubIconName] ? ALL_ICONS[overrideSubIconName] : sub.icon || Star;
                          
                          return (
                            <motion.div
                              key={sub.id}
                              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                              animate={{ opacity: 1, scale: 1, x: subX, y: subY }}
                              exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                              className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                              {/* Connector Line to Parent */}
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: subRadius }}
                                style={{ 
                                  rotate: `${subAngleOffset}deg`,
                                  originX: "0%",
                                  left: "50%",
                                  top: "50%"
                                }}
                                className={`absolute h-[2px] ${isCompleted ? 'bg-brand-gold/60' : 'bg-brand-border'}`}
                              />

                              <div className="relative pointer-events-auto group/sub">
                                <motion.button
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if (sub.topics && sub.topics.length > 0) {
                                      setExpandedSubNode(expandedSubNode === sub.id ? null : sub.id);
                                    } else {
                                      setSelectedSubBranch(sub); 
                                    }
                                  }}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  animate={expandedSubNode === sub.id ? { 
                                    scale: 1.15,
                                    boxShadow: "0 0 20px rgba(212,175,55,0.4)"
                                  } : { 
                                    scale: 1,
                                    boxShadow: "0 0 0px rgba(212,175,55,0)"
                                  }}
                                  className={`relative w-16 h-16 flex items-center justify-center transition-all duration-300 rounded-full ${
                                    isCompleted 
                                      ? 'bg-gradient-to-br from-brand-gold/20 to-brand-gold/10 border-4 border-brand-gold text-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                                      : hasProgress
                                        ? 'bg-white border-2 border-brand-gold/50 text-brand-gold/70'
                                        : 'bg-white border-2 border-brand-border text-brand-muted hover:border-brand-gold/50 grayscale opacity-80'
                                  } ${expandedSubNode === sub.id ? 'ring-4 ring-brand-gold/30 ring-offset-2 ring-offset-[#fdfdfc]' : ''}`}
                                >
                                  {/* Pulse effect for active sub-node */}
                                  {expandedSubNode === sub.id && (
                                    <motion.div 
                                      layoutId={`pulse-${sub.id}`}
                                      className="absolute inset-0 border-2 border-brand-gold rounded-full"
                                      initial={{ scale: 1, opacity: 1 }}
                                      animate={{ scale: 1.4, opacity: 0 }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                  )}

                                  {isCompleted ? (
                                    <SubIcon className="h-6 w-6 text-brand-ink" />
                                  ) : (
                                    <div className={expandedSubNode === sub.id ? 'text-brand-gold' : hasProgress ? 'text-brand-gold/70' : 'text-brand-muted group-hover/sub:text-brand-gold'}>
                                      <SubIcon className="h-6 w-6 transition-colors" />
                                    </div>
                                  )}

                                  {/* Indicator for topics */}
                                  {sub.topics && sub.topics.length > 0 && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-gold text-brand-ink flex items-center justify-center text-[10px] font-bold">
                                      {expandedSubNode === sub.id ? '-' : '+'}
                                    </div>
                                  )}
                                </motion.button>
                                
                                {/* Edit Sub Icon Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setEditingIconFor(`sub-${node.id}-${sub.id}`); }}
                                  className="absolute -top-3 -right-3 text-brand-muted bg-white border border-brand-border rounded-none p-1 hover:text-brand-gold hover:border-brand-gold transition-colors opacity-0 group-hover/sub:opacity-100 z-50 pointer-events-auto shadow-md"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>

                                {/* View Articles Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSelectedSubBranch(sub); }}
                                  className="absolute top-1/2 -right-8 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors opacity-0 group-hover/sub:opacity-100 p-1 pointer-events-auto"
                                >
                                  <List className="w-4 h-4" />
                                </button>

                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover/sub:opacity-100 transition-opacity bg-brand-ink px-3 py-2 text-center z-50 w-32 md:w-48 pointer-events-none">
                                  <span className="text-[10px] md:text-sm font-bold text-brand-offwhite leading-tight block mb-1">
                                    {sub.name}
                                  </span>
                                  {isCompleted ? (
                                    <span className="text-[8px] md:text-[9px] text-brand-gold uppercase tracking-[0.2em] font-bold">Completado</span>
                                  ) : (
                                    <span className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">{sub.completedCount}/{sub.totalCount} Aprendidos</span>
                                  )}
                                </div>

                                {/* Topics / Third Level */}
                                <AnimatePresence>
                                  {expandedSubNode === sub.id && sub.topics && sub.topics.map((topic: any, k: number) => {
                                    const topicTotal = sub.topics.length;
                                    const topicSpread = topicTotal > 4 ? 130 : 90;
                                    const tOffset = topicTotal === 1 ? 0 : -(topicSpread/2) + (k * (topicSpread / (topicTotal - 1)));
                                    
                                    const tAngle = subAngle + (tOffset * Math.PI) / 180;
                                    const tRadius = 140;
                                    
                                    const tX = Math.cos(tAngle) * tRadius;
                                    const tY = Math.sin(tAngle) * tRadius;
                                    
                                    const tCompleted = topic.completedCount === topic.totalCount && topic.totalCount > 0;
                                    const tProgress = topic.completedCount > 0;

                                    return (
                                      <motion.div
                                        key={topic.id}
                                        initial={{ opacity: 0, x: 0, y: 0 }}
                                        animate={{ opacity: 1, x: tX, y: tY }}
                                        exit={{ opacity: 0, x: 0, y: 0 }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                      >
                                        {/* Connector Line to Sub */}
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: tRadius }}
                                          style={{ 
                                            rotate: `${(tAngle * 180 / Math.PI) + 180}deg`,
                                            originX: "0%",
                                            left: "50%",
                                            top: "50%"
                                          }}
                                          className={`absolute h-[2px] ${tCompleted ? 'bg-brand-gold/40' : tProgress ? 'bg-brand-gold/20' : 'bg-brand-border/30'}`}
                                        />

                                        <div className="relative pointer-events-auto group/topic">
                                            <motion.button
                                              onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setSelectedSubBranch({
                                                  ...sub,
                                                  name: topic.name,
                                                  parentId: sub.parentId,
                                                  icon: sub.icon,
                                                  articles: topic.articles,
                                                  completedCount: topic.completedCount,
                                                  totalCount: topic.totalCount,
                                                  isTopic: true,
                                                  parentName: sub.name
                                                }); 
                                              }}
                                              whileHover={{ scale: 1.2 }}
                                              whileTap={{ scale: 0.8 }}
                                              className={`relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center transition-all duration-300 rounded-full ${
                                                tCompleted 
                                                  ? 'bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border-2 border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                                                  : tProgress
                                                    ? 'bg-white border-2 border-brand-gold/50'
                                                    : 'bg-white border-2 border-brand-border hover:border-brand-gold/40 grayscale opacity-70'
                                              }`}
                                            >
                                              <div className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full ${tCompleted ? 'bg-brand-gold' : tProgress ? 'bg-brand-gold/70' : 'bg-brand-border group-hover/topic:bg-brand-gold/50'}`} />
                                            </motion.button>
                                          
                                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/topic:opacity-100 transition-opacity bg-brand-ink px-2 py-1 text-center z-50 w-24 md:w-32 pointer-events-none">
                                            <span className="text-[9px] md:text-[10px] font-bold text-brand-offwhite leading-tight block">
                                              {topic.name}
                                            </span>
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
            </motion.div>
          </div>
          </div>
          </TransformComponent>
        </TransformWrapper>
      ) : (
        <div className="w-full h-full p-8 pt-20 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-12">
              <h2 className="text-4xl font-serif text-brand-ink mb-2">Jerarquía de Sabiduría</h2>
              <p className="text-brand-muted text-sm italic">Explora la estructura del canon a través de su árbol genealógico.</p>
            </div>
            
            {constellations.map(category => (
              <div key={category.id} className="border border-brand-border bg-white overflow-hidden">
                <button
                  onClick={() => toggleNode(category.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-brand-offwhite transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-brand-ink text-brand-offwhite flex items-center justify-center border border-white/20">
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-serif text-brand-ink">{category.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">{category.completedCount}/{category.totalCount} Conceptos</span>
                        <div className="h-1 w-24 bg-brand-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-gold transition-all duration-1000" 
                            style={{ width: `${category.totalCount > 0 ? (category.completedCount / category.totalCount) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedNodes[category.id] ? <ChevronDown className="w-5 h-5 text-brand-muted" /> : <ChevronRight className="w-5 h-5 text-brand-muted" />}
                </button>

                <AnimatePresence>
                  {expandedNodes[category.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-brand-border overflow-hidden"
                    >
                      <div className="p-4 space-y-3 bg-brand-offwhite/30">
                        {category.subBranches.map(sub => (
                          <div key={sub.id} className="ml-12">
                            <div className="flex items-center justify-between py-3 border-b border-brand-border/30 group">
                              <button
                                onClick={() => toggleNode(`${category.id}-${sub.id}`)}
                                className="flex items-center gap-4 hover:text-brand-gold transition-colors text-left"
                              >
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                                  sub.completedCount === sub.totalCount && sub.totalCount > 0 
                                    ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' 
                                    : 'bg-white border-brand-border text-brand-muted'
                                }`}>
                                  {sub.icon ? <sub.icon className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-brand-ink group-hover:text-brand-gold transition-colors">{sub.name}</span>
                                  <span className="text-[10px] text-brand-muted ml-3">{sub.completedCount}/{sub.totalCount}</span>
                                </div>
                              </button>
                              
                              <button
                                onClick={() => setSelectedSubBranch(sub)}
                                className="px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] border border-brand-border hover:bg-brand-ink hover:text-brand-offwhite transition-all"
                              >
                                Ver Artículos
                              </button>
                            </div>

                            <AnimatePresence>
                              {expandedNodes[`${category.id}-${sub.id}`] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="ml-8 mt-2 space-y-1 mb-4"
                                >
                                  {/* Render Topics or Articles */}
                                  {sub.topics && sub.topics.length > 0 ? (
                                    sub.topics.map((topic: any) => (
                                      <button
                                        key={topic.id}
                                        onClick={() => setSelectedSubBranch({
                                          ...sub,
                                          name: topic.name,
                                          articles: topic.articles,
                                          completedCount: topic.completedCount,
                                          totalCount: topic.totalCount,
                                          isTopic: true,
                                          parentName: sub.name
                                        })}
                                        className="w-full flex items-center justify-between p-3 hover:bg-white transition-colors border-l-2 border-transparent hover:border-brand-gold group"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-1.5 h-1.5 rounded-full ${topic.completedCount === topic.totalCount && topic.totalCount > 0 ? 'bg-brand-gold' : 'bg-brand-border'}`} />
                                          <span className="text-[11px] font-sans text-brand-muted group-hover:text-brand-ink transition-colors">{topic.name}</span>
                                        </div>
                                        <span className="text-[9px] text-brand-muted font-mono">{topic.completedCount}/{topic.totalCount}</span>
                                      </button>
                                    ))
                                  ) : (
                                    sub.articles.map((article: any) => (
                                      <Link
                                        key={article.slug}
                                        href={getArticlePath(article)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-white transition-colors border-l-2 border-transparent hover:border-brand-gold group"
                                      >
                                        <div className="flex items-center gap-3">
                                          {(articleProgress[article.slug] || 0) === 100 ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                                          ) : (
                                            <FileText className="w-3.5 h-3.5 text-brand-muted" />
                                          )}
                                          <span className="text-[11px] font-sans text-brand-muted group-hover:text-brand-ink transition-colors line-clamp-1">{article.title}</span>
                                        </div>
                                        {(articleProgress[article.slug] || 0) > 0 && (
                                          <span className="text-[9px] font-bold text-brand-gold">{articleProgress[article.slug]}%</span>
                                        )}
                                      </Link>
                                    ))
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedSubBranch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/80 backdrop-blur-sm"
            onClick={() => setSelectedSubBranch(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-offwhite border border-brand-border p-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-3xl relative"
            >
              <button 
                onClick={() => setSelectedSubBranch(null)}
                className="absolute top-8 right-8 text-brand-muted hover:text-brand-ink transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-start gap-8 mb-12 border-b border-brand-border pb-8">
                {selectedSubBranch && (() => {
                  const overrideModalSubIcon = iconOverrides[`sub-${selectedSubBranch.parentId}-${selectedSubBranch.id}`];
                  let ModalSubIcon = overrideModalSubIcon && ALL_ICONS[overrideModalSubIcon] ? ALL_ICONS[overrideModalSubIcon] : selectedSubBranch.icon || Star;
                  
                  return (
                    <div className="hidden sm:flex w-16 h-16 bg-brand-ink text-brand-offwhite items-center justify-center shrink-0">
                      <ModalSubIcon className="w-8 h-8" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-4xl font-serif text-brand-ink mb-2 tracking-tight">{selectedSubBranch.name}</h3>
                  <p className="text-brand-blue font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Conceptos Registrados: {selectedSubBranch.completedCount} / {selectedSubBranch.totalCount}</p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedSubBranch.articles.map((article: any) => {
                  const progress = articleProgress[article.slug] || 0;
                  const isCompleted = progress === 100;
                  return (
                    <Link key={article.slug}
                      href={getArticlePath(article)}
                      className="block p-6 border border-brand-border bg-white hover:border-brand-blue transition-all group relative"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-brand-blue shrink-0" />
                          ) : (
                            <div className="h-5 w-5 border border-brand-border group-hover:border-brand-blue shrink-0" />
                          )}
                          <div>
                            <h4 className="text-brand-ink font-serif text-xl group-hover:text-brand-blue transition-colors">{article.title}</h4>
                            {article.description && <p className="text-brand-muted text-xs mt-2 italic line-clamp-1">{article.description}</p>}
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-brand-blue tracking-widest shrink-0 ml-4">
                          {progress > 0 && progress < 100 ? `${progress}%` : ''}
                          {isCompleted ? 'COMPLETADO' : ''}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editingIconFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-ink/90"
            onClick={() => setEditingIconFor(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-offwhite border border-brand-border p-12 w-full max-w-xl shadow-3xl"
            >
              <div className="flex justify-between items-center mb-10 border-b border-brand-border pb-6">
                <h3 className="text-2xl font-serif text-brand-ink">Aura Simbólica</h3>
                <button onClick={() => setEditingIconFor(null)} className="text-brand-muted hover:text-brand-ink transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {Object.entries(ALL_ICONS).map(([iconName, IconComponent]) => (
                  <button
                    key={iconName}
                    title={iconName}
                    onClick={() => saveIconOverride(editingIconFor, iconName)}
                    className={`flex items-center justify-center p-5 border transition-all duration-300 hover:border-brand-blue hover:text-brand-blue ${
                      (iconOverrides[editingIconFor] || CATEGORY_ICONS[editingIconFor] || 'Sparkles') === iconName
                        ? 'bg-brand-ink text-brand-offwhite border-brand-ink'
                        : 'bg-white border-brand-border text-brand-muted'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
