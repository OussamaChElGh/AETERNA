import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllStructuredArticleSlugs, getStructuredArticleBySlug, getArticleBySlug, getArticleForRender } from '@/lib/server-content';
import { ArticlePageClient } from '@/components/article-page';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllStructuredArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const structured = getStructuredArticleBySlug(slug);
  if (structured) {
    return {
      title: `${structured.metadata.title} | Anektia`,
      description: structured.metadata.description,
      keywords: structured.metadata.tags || [],
      openGraph: {
        title: structured.metadata.title,
        description: structured.metadata.description,
        images: [structured.metadata.image],
        type: 'article',
      },
    };
  }

  const markdown = getArticleBySlug(slug);
  if (markdown) {
    return {
      title: `${markdown.data.title} | Anektia`,
      description: markdown.data.description,
      keywords: markdown.data.tags || [],
      openGraph: {
        title: markdown.data.title,
        description: markdown.data.description,
        images: [markdown.data.image],
        type: 'article',
      },
    };
  }

  return { title: 'Artículo | Anektia' };
}

export default async function ArticleRoute({ params }: Props) {
  const { slug } = await params;
  const structured = getStructuredArticleBySlug(slug);
  const markdown = getArticleBySlug(slug);

  if (!structured && !markdown) {
    notFound();
  }

  const article = getArticleForRender(slug);

  return <ArticlePageClient initialArticle={article} overrideSlug={slug} />;
}
