'use client';
import React from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';

interface ArchitectureRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
}

export function ArchitectureRenderer({ layout, theme }: ArchitectureRendererProps) {
  // Disabled ceiling beams & roof overhead elements by user request
  return null;
}
