import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anektia.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/perfil', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
