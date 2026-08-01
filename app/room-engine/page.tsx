import React from 'react';
import { Metadata } from 'next';
import { AeternaEnvironmentEngine } from '@/components/environment-engine/AeternaEnvironmentEngine';
import { MAIN_STUDY_LAYOUT } from '@/data/environment-engine/layouts/mainStudy.layout';
import { ACADEMIC_LIBRARY_THEME } from '@/data/environment-engine/themes/academicLibrary.theme';
import { DEFAULT_PLACED_ITEMS } from '@/lib/roomEngineStorage';

export const metadata: Metadata = {
  title: 'Aeterna Environment System v1.0 | Motor de Escenarios Isométricos Modulares',
  description: 'Motor de escenarios isométricos modulares 2.5D desacoplado de imágenes gigantes. Ensamblado de baldosas de suelo, paredes, iluminación y física.'
};

export default function RoomEnginePage() {
  return (
    <AeternaEnvironmentEngine
      layout={MAIN_STUDY_LAYOUT}
      theme={ACADEMIC_LIBRARY_THEME}
      initialItems={DEFAULT_PLACED_ITEMS}
    />
  );
}
