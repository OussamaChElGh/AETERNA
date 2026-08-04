import { Metadata } from 'next';
import CosmicConstellationPath from '@/components/learning-path/CosmicConstellationPath';

export const metadata: Metadata = {
  title: 'El Sendero del Sabio | Anektia',
  description: 'Camino de aprendizaje de física — Dark Academia Edition',
};

export default function CosmicPathPage() {
  return <CosmicConstellationPath />;
}
