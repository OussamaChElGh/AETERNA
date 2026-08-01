'use client';
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useScroll } from "motion/react";
import { useGamification } from "@/context/GamificationContext";
import { FocusStepViewer } from "./FocusStepViewer";
import { ScrollMode } from "./ScrollMode";
import type { AeternaArticle } from "@/types";
import { CuadernoEjercicios } from "@/components/interactive/CuadernoEjercicios";

export function ArticleContent({ overrideSlug, initialArticle, nextArticle }: { overrideSlug?: string; initialArticle?: AeternaArticle | null; nextArticle?: { title: string; href: string } | null }) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = overrideSlug || paramSlug;
  const searchParams = useSearchParams();
  const [article] = useState<AeternaArticle | null>(initialArticle || null);
  const [loading] = useState(!initialArticle);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [transitioning, setTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<'focus' | 'scroll'>('focus');

  const currentLevel = (searchParams.get("nivel") || "principiante").toLowerCase();
  const { scrollYProgress } = useScroll();
  const { completePath } = useGamification();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const liveProgress = useMemo(() => Math.round(scrollYProgress.get() * 100), [scrollYProgress.get()]);

  const router = useRouter();
  const pathname = usePathname();

  const changeLevel = (newLevel: string) => {
    setTransitioning(true);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("nivel", newLevel);
      router.push(`${pathname}?${params.toString()}`);
      window.scrollTo(0, 0);
      setTransitioning(false);
    }, 800);
  };

  const secciones = article?.secciones || [];
  const availableLevels = useMemo(() => {
    const found: string[] = [];
    if (secciones.some(s => !!(s as any).niveles?.principiante || (s as any).capa === 'principiante')) found.push('principiante');
    if (secciones.some(s => !!(s as any).niveles?.intermedio || (s as any).capa === 'intermedio')) found.push('intermedio');
    if (secciones.some(s => !!(s as any).niveles?.avanzado || (s as any).capa === 'avanzado')) found.push('avanzado');
    if (found.length === 0) return ['principiante', 'intermedio', 'avanzado'];
    return found;
  }, [secciones]);

  useEffect(() => {
    if (!loading && article && secciones.length > 0) {
      const hasCurrentLevel = secciones.some(s => !!(s as any).niveles?.[currentLevel as keyof typeof s.niveles] || (s as any).capa === currentLevel);
      if (!hasCurrentLevel) {
        const fallback = availableLevels.includes('intermedio') ? 'intermedio' : availableLevels[0];
        if (fallback && fallback !== currentLevel) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("nivel", fallback);
          router.push(`${pathname}?${params.toString()}`);
        }
      }
    }
  }, [loading, article, currentLevel, availableLevels, secciones, router, pathname, searchParams]);

  const displaySecciones = useMemo(() => {
    if (!article) return [];

    let baseSecciones = (secciones && secciones.length > 0) ? secciones : [];

    const hasLayers = baseSecciones.some(s => !!(s as any).capa);
    if (hasLayers) {
      const layerMatches = baseSecciones.filter(s => (s as any).capa === currentLevel);
      if (layerMatches.length > 0) {
        baseSecciones = layerMatches;
      }
    }

    if (baseSecciones.length === 0 && (article.introduccion || (article as any).content)) {
      const rawText = article.introduccion || (article as any).content || "";
      const blocks = rawText.split(/\n\n+/).filter((b: string) => b.trim().length > 0);
      baseSecciones = blocks.map((block: string, idx: number) => ({
        id: `hito-${idx + 1}`,
        titulo: `Hito ${idx + 1}`,
        niveles: {
          principiante: block,
          intermedio: block,
          avanzado: block
        },
        acciones: []
      }));
    }

    return baseSecciones
      .map(s => {
        const sectionTitle = s.titulo && typeof s.titulo === 'object'
          ? ((s.titulo as any)[currentLevel] || (s.titulo as any)['principiante'] || (s.titulo as any)['intermedio'] || s.id)
          : (s.titulo || s.id);

        const activeContent = (s.niveles && (s.niveles[currentLevel as keyof typeof s.niveles] || s.niveles.principiante || s.niveles.intermedio || s.niveles.avanzado)) ||
                              (s as any).content ||
                              (s as any).contenido ||
                              "";

        return {
          ...s,
          activeTitle: sectionTitle,
          activeContent: activeContent
        };
      })
      .filter(s => !!s.activeContent && s.activeContent.trim().length > 0);
  }, [secciones, currentLevel, article]);

  useEffect(() => {
    if (!article) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveHeadingId(e.target.id); });
    }, { rootMargin: "-150px 0px -50% 0px" });
    displaySecciones.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [article, loading, currentLevel, displaySecciones]);

  if (loading) return <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0F0F12] flex items-center justify-center"><div className="w-24 h-px bg-[#D4AF37] animate-pulse" /></div>;
  if (!article) return <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0F0F12] text-[#1A1A1A] flex items-center justify-center font-serif text-3xl uppercase tracking-widest italic opacity-20">Señal Perdida</div>;

  if (viewMode === 'focus') {
    return (
      <>
        <FocusStepViewer
          article={article}
          displaySecciones={displaySecciones}
          currentLevel={currentLevel}
          changeLevel={changeLevel}
          availableLevels={availableLevels}
          transitioning={transitioning}
          nextArticle={nextArticle}
          onComplete={() => {
            if (slug) completePath(slug);
          }}
          onSwitchToScroll={() => setViewMode('scroll')}
        />
        {article.cuaderno && (
          <CuadernoEjercicios
            cuaderno={article.cuaderno}
            activeLayer={currentLevel}
            titulo={`Cuaderno: ${article.metadata.insignia || article.metadata.title}`}
          />
        )}
      </>
    );
  }

  return (
    <>
      <ScrollMode
        article={article}
        displaySecciones={displaySecciones}
        currentLevel={currentLevel}
        changeLevel={changeLevel}
        availableLevels={availableLevels}
        onSwitchToFocus={() => setViewMode('focus')}
        transitioning={transitioning}
        activeHeadingId={activeHeadingId}
        liveProgress={liveProgress}
      />
      {article.cuaderno && (
        <CuadernoEjercicios
          cuaderno={article.cuaderno}
          activeLayer={currentLevel}
          titulo={`Cuaderno: ${article.metadata.insignia || article.metadata.title}`}
        />
      )}
    </>
  );
}
