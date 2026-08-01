import { Metadata } from 'next';
import { CATEGORIES_DATA } from '@/data/categories';
import { getArticleBySlug, getAllArticles, getArticleForRender } from '@/lib/server-content';
import { GuidePageClient } from '@/components/GuidePageClient';
import { ArticlePageClient } from '@/components/article-page';

interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];
  const articles = getAllArticles();

  CATEGORIES_DATA.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      params.push({ category: cat.id, subcategory: sub.id });
    });
  });

  articles.forEach((art) => {
    params.push({ category: art.category || 'ciencias_naturales', subcategory: art.slug });
  });

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params;
  
  const isSubcategory = CATEGORIES_DATA.some(c => 
    c.id === category?.replace(/-/g, '_') && 
    c.subcategories.some(s => s.id === subcategory?.replace(/-/g, '_'))
  );

  if (isSubcategory) {
    const subName = subcategory.replace(/-/g, ' ');
    return {
      title: `${subName.toUpperCase()} — Guía Maestra | Aeterna`,
      description: `Ruta de estudio profundo sobre ${subName}.`,
    };
  }

  const article = getArticleBySlug(subcategory);
  if (article) {
    return {
      title: `${article.data.title} | Aeterna`,
      description: article.data.description,
      keywords: article.data.tags || [],
      openGraph: {
        title: article.data.title,
        description: article.data.description,
        images: [article.data.image],
        type: 'article',
      },
    };
  }

  return { title: 'Guía | Aeterna' };
}

export default async function GuiasResolverPage({ params }: Props) {
  const { category, subcategory } = await params;
  
  const isSubcategory = CATEGORIES_DATA.some(c => 
    c.id === category?.replace(/-/g, '_') && 
    c.subcategories.some(s => s.id === subcategory?.replace(/-/g, '_'))
  );

  if (isSubcategory) {
    const articles = getAllArticles();
    return <GuidePageClient overrideSubcategory={subcategory} overrideCategory={category} initialArticles={articles} />;
  } else {
    const article = getArticleForRender(subcategory);
    return <ArticlePageClient initialArticle={article} overrideSlug={subcategory} />;
  }
}
