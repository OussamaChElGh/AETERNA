import { Metadata } from 'next';
import { CosmicConstellationPath } from '@/components/learning-path/CosmicConstellationPath';

export const metadata: Metadata = {
  title: 'Cosmic Constellation Path | Anektia',
  description: 'Vista cósmica del Sendero del Sabio - Variante 2',
};

export default function CosmicPathPage() {
  return <CosmicConstellationPath />;
}
