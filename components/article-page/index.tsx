'use client';
import React, { Suspense } from "react";
import { LevelProvider } from "@/context/LevelContext";
import { ArticleContent } from "./ArticleContent";

export function ArticlePageClient(props: any) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-ink flex items-center justify-center text-brand-gold font-mono text-xs">Cargando artículo...</div>}>
      <LevelProvider>
        <ArticleContent {...props} />
      </LevelProvider>
    </Suspense>
  );
}
