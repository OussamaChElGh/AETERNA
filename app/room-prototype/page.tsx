import React from 'react';
import { Metadata } from 'next';
import { KnowledgeRoom } from '@/components/room-prototype/KnowledgeRoom';

export const metadata: Metadata = {
  title: 'Prototipo de Habitación 2D | Anektia',
  description: 'Demostración aislada del editor interactivo 2D de la Habitación del Conocimiento con snap-to-grid y persistencia local.',
  robots: { index: false, follow: false }
};

export default function RoomPrototypePage() {
  return <KnowledgeRoom />;
}
