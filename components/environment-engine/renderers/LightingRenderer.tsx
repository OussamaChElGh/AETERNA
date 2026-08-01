'use client';
import React from 'react';
import { EnvironmentTheme } from '@/types/environmentEngine';

interface LightingRendererProps {
  theme: EnvironmentTheme;
}

export function LightingRenderer({ theme }: LightingRendererProps) {
  // Disabled by user request for clean visualization
  return null;
}
