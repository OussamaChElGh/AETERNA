'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "motion/react";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Sparkles } from "lucide-react";
import { CATEGORIES_DATA } from "@/data/categories";

interface Node {
  id: string;
  name: string;
  icon: any;
  path?: string;
  description?: string;
  children?: Node[];
  topics?: string[];
}

const KNOWLEDGE_TREE: Node[] = CATEGORIES_DATA.map(category => ({
  id: category.id,
  name: category.name,
  icon: category.icon,
  path: category.path,
  description: category.description,
  children: category.subcategories.map(sub => ({
    id: sub.id,
    name: sub.name,
    icon: sub.icon,
    path: category.path,
    topics: sub.topics
  }))
}));

// Fallback icon for Japanese or specific nodes
function CharacterIcon(props: any) {
  return (
    <span className="text-[10px] font-bold" {...props}>あ</span>
  );
}

export function KnowledgeMap() {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [expandedSubNode, setExpandedSubNode] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setExpandedSubNode(null);
  }, [expandedNode]);

  return (
    <div className="w-full relative py-32 bg-brand-offwhite overflow-x-hidden min-h-[900px] flex flex-col items-center justify-start border-y border-brand-border">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 pointer-events-none">
        <div className="text-center mb-16 md:mb-32">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-brand-gold mb-4 block">
            Cartografía Conceptual
          </span>
          <h2 className="font-serif text-5xl md:text-7xl text-brand-ink leading-tight tracking-tight">
            Mapa de <span className="italic">Nivelación</span>
          </h2>
        </div>
      </div>

      <div className="w-full flex-grow relative overflow-hidden flex items-center justify-center -mt-32 pt-32">
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
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%', minHeight: '700px' }} contentStyle={{ width: '100%', height: '100%' }}>
            {/* Unconstrained Map Container */}
            <div className="relative z-10 w-[240vw] h-[900px] flex items-center justify-center overflow-visible">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className={`absolute flex items-center justify-center ${windowWidth < 1024 ? 'inset-[-800px]' : 'inset-[-2500px]'}`}
                >
            {/* Central Hub */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="z-20 w-40 h-40 bg-brand-ink border border-white/20 flex items-center justify-center shadow-3xl"
            >
              <Sparkles className="h-12 w-12 text-brand-offwhite" />
            </motion.div>

            <AnimatePresence>
              {KNOWLEDGE_TREE.map((node, i) => {
              const angle = (i * (360 / KNOWLEDGE_TREE.length) * Math.PI) / 180;
              const radius = 450; 
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              const isExpanded = expandedNode === node.id;

              return (
                <div key={node.id} className="absolute inset-0 flex items-center justify-center">
                  {/* Branch Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: radius }}
                    style={{ rotate: `${(angle * 180) / Math.PI}deg`, originX: "0%" }}
                    className="absolute left-[50%] h-[2px] bg-brand-border z-0"
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
                    className="absolute z-30"
                  >
                    <button
                      onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                      className={`group relative w-28 h-28 flex items-center justify-center border transition-all duration-700 ${
                        isExpanded ? "bg-brand-ink text-brand-offwhite border-brand-ink" : "bg-white border-brand-border text-brand-ink"
                      }`}
                    >
                      <node.icon className={`h-10 w-10 transition-colors ${isExpanded ? "text-brand-offwhite" : "text-brand-ink group-hover:text-brand-gold"}`} />
                      
                      {/* Label */}
                      <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-brand-ink block mb-2">
                          {node.name}
                        </span>
                        {isExpanded && node.description && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center"
                          >
                            <p className="text-[9px] text-brand-muted max-w-[140px] leading-relaxed mb-3 italic">
                              {node.description}
                            </p>
                            <Link href={node.path || "#"}
                              className="text-[8px] font-bold text-brand-gold uppercase tracking-[0.3em] border-b border-brand-gold/20 px-1 py-1 hover:border-brand-gold transition-all"
                            >
                              Ver Canon
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    </button>

                    {/* Sub-nodes / Fan out */}
                    <AnimatePresence>
                      {isExpanded && node.children?.map((child, j) => {
                        const spreadAngle = 140;
                        const subAngleOffset = -(spreadAngle/2) + (j * (spreadAngle / (node.children!.length - 1 || 1)));
                        const subAngle = angle + (subAngleOffset * Math.PI) / 180;
                        const subRadius = 280;
                        const subX = Math.cos(subAngle) * subRadius;
                        const subY = Math.sin(subAngle) * subRadius;

                        return (
                          <motion.div
                            key={child.id}
                            initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                            animate={{ opacity: 1, scale: 1, x: subX, y: subY }}
                            exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
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
                              className="absolute h-[2px] bg-brand-border"
                            />

                            <div className="relative pointer-events-auto group/sub z-40">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setExpandedSubNode(expandedSubNode === child.id ? null : child.id);
                                }}
                                className={`relative w-20 h-20 flex items-center justify-center border transition-all duration-300 ${expandedSubNode === child.id ? 'bg-brand-gold border-brand-gold text-white' : 'bg-white border-brand-border hover:bg-brand-offwhite'}`}
                              >
                                <child.icon className={`h-8 w-8 transition-colors ${expandedSubNode === child.id ? 'text-white' : 'text-brand-ink group-hover/sub:text-brand-gold'}`} />
                              </button>
                              
                              <div className="absolute left-full ml-4 opacity-0 group-hover/sub:opacity-100 transition-opacity bg-brand-ink px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-offwhite whitespace-nowrap z-50 pointer-events-none">
                                <span>{child.name}</span>
                                {child.topics && child.topics.length > 0 && (
                                  <span className="block text-[7px] text-brand-gold/70 mt-1 tracking-[0.2em]">CONSULTAR</span>
                                )}
                              </div>
                            </div>

                            {/* Third level / Topics */}
                            <AnimatePresence>
                              {expandedSubNode === child.id && child.topics && child.topics.map((topic, k) => {
                                const topicTotal = child.topics!.length;
                                const topicSpread = topicTotal > 4 ? 130 : 90;
                                const tOffset = topicTotal === 1 ? 0 : -(topicSpread/2) + (k * (topicSpread / (topicTotal - 1)));
                                const tAngle = subAngle + (tOffset * Math.PI) / 180;
                                const tRadius = 140;
                                const tX = Math.cos(tAngle) * tRadius;
                                const tY = Math.sin(tAngle) * tRadius;

                                return (
                                  <motion.div
                                    key={topic}
                                    initial={{ opacity: 0, x: 0, y: 0 }}
                                    animate={{ opacity: 1, x: tX, y: tY }}
                                    exit={{ opacity: 0, x: 0, y: 0 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                  >
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: tRadius }}
                                      style={{ 
                                        rotate: `${(tAngle * 180 / Math.PI) + 180}deg`,
                                        originX: "0%",
                                        left: "50%",
                                        top: "50%"
                                      }}
                                      className="absolute h-[2px] bg-brand-border"
                                    />
                                    
                                    <div className="relative pointer-events-auto group/topic w-6 h-6 border border-brand-border bg-white flex items-center justify-center hover:bg-brand-gold transition-all cursor-default group-hover:scale-110">
                                      <div className="w-1.5 h-1.5 bg-brand-border group-hover/topic:bg-white" />
                                      <div className="absolute top-full opacity-0 group-hover/topic:opacity-100 transition-opacity bg-brand-ink px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-brand-offwhite whitespace-nowrap z-50 mt-2">
                                        {topic}
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
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
</div>
</div>
);
}
