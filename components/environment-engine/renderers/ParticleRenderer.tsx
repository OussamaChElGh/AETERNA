'use client';
import React from 'react';
import { EnvironmentTheme } from '@/types/environmentEngine';

interface ParticleRendererProps {
  theme: EnvironmentTheme;
}

export function ParticleRenderer({ theme }: ParticleRendererProps) {
  if (!theme.particlePreset || theme.particlePreset === 'none') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
      {/* Floating Dust Motes in Window Light */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-200/10 rounded-full blur-xl animate-pulse duration-1000" />
      <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-amber-100/5 rounded-full blur-2xl animate-pulse duration-700" />
    </div>
  );
}
