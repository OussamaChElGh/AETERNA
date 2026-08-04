import { Metadata } from 'next';
import { CATEGORIES_DATA } from '@/data/categories';
import { BranchPageClient } from '@/components/BranchPageClient';
import { getAllArticles } from '@/lib/server-content';

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
        title: `${catData.name} | Anektia`,
        description: catData.description,
      },
    };
  }

  return {
    title: 'Guía de Aprendizaje | Anektia',
  };
}

export default async function CategoryGuidePage({ params }: Props) {
  const { category } = await params;
  const articles = getAllArticles();
  return <BranchPageClient overrideCategory={category} initialArticles={articles} />;
}
