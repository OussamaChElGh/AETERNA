import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anektia.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/auditor/',
        '/room-engine/',
        '/room-prototype/',
        '/home2/',
        '/cosmic-path/',
        '/usuario/',
        '/notificaciones/',
        '/perfil/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
