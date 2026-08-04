import { Metadata } from 'next';
import { getArticleBySlug, getAllArticles, getArticleForRender } from '@/lib/server-content';
import { getArticlePath } from '@/lib/utils';
import { ArticlePageClient } from '@/components/article-page';

interface Props {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((art) => ({
    category: art.category || 'ciencias_naturales',
    subcategory: art.subcategory || 'fisica',
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (article) {
    return {
      title: `${article.data.title} | Anektia`,
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

  return { title: 'Artículo | Anektia' };
}

export default async function NestedArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleForRender(slug);

  let nextArticle: { title: string; href: string } | null = null;
  if (article?.metadata) {
    const sameRoute = getAllArticles()
      .filter(a =>
        (a.subcategory || '').toLowerCase() === (article.metadata.subcategory || '').toLowerCase() &&
        (a.category || '').toLowerCase() === (article.metadata.category || '').toLowerCase()
      )
      .sort((a, b) =>
        ((a.nivel || 99) - (b.nivel || 99)) ||
        ((a.orden || 999) - (b.orden || 999)) ||
        (new Date(a.date).getTime() - new Date(b.date).getTime())
      );
    const idx = sameRoute.findIndex(a => a.slug === slug);
    if (idx !== -1 && sameRoute.length > 1) {
      const next = sameRoute[(idx + 1) % sameRoute.length];
      nextArticle = { title: next.title, href: getArticlePath(next) };
    }
  }

  return <ArticlePageClient initialArticle={article} overrideSlug={slug} nextArticle={nextArticle} />;
}
