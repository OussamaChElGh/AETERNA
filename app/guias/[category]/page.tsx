import { Metadata } from 'next';
import { CATEGORIES_DATA } from '@/data/categories';
import { GuidePageClient } from '@/components/GuidePageClient';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES_DATA.map((cat) => ({ category: cat.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const catData = CATEGORIES_DATA.find((c) => c.id === category);

  if (catData) {
    return {
      title: `${catData.name} — Rutas de Aprendizaje`,
      description: catData.description,
      openGraph: {
        title: `${catData.name} | Aeterna`,
        description: catData.description,
      },
    };
  }

  return {
    title: 'Guía de Aprendizaje | Aeterna',
  };
}

import { getAllArticles } from '@/lib/server-content';

export default async function CategoryGuidePage({ params }: Props) {
  const { category } = await params;
  const articles = getAllArticles();
  return <GuidePageClient overrideCategory={category} initialArticles={articles} />;
}
