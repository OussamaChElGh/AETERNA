import { MetadataRoute } from 'next';
import { getAllArticles, getAllStructuredArticleSlugs } from '@/lib/server-content';
import { CATEGORIES_DATA } from '@/data/categories';
import { getArticlePath } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anektia.com';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/guias`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/interactivos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/autores`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/bitacora`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Category & Subcategory routes
  CATEGORIES_DATA.forEach((cat) => {
    routes.push({
      url: `${baseUrl}/guias/${cat.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    cat.subcategories.forEach((sub) => {
      routes.push({
        url: `${baseUrl}/guias/${cat.id}/${sub.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // Markdown article routes
  const markdownArticles = getAllArticles();
  markdownArticles.forEach((art) => {
    const fullPath = getArticlePath(art);
    routes.push({
      url: `${baseUrl}${fullPath}`,
      lastModified: art.date ? new Date(art.date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // JSON article routes
  const jsonSlugs = getAllStructuredArticleSlugs();
  jsonSlugs.forEach((slug) => {
    routes.push({
      url: `${baseUrl}/articulos/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  return routes;
}
