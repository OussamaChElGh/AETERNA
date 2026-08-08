import { Metadata } from 'next';
import { ClasificacionClient } from '@/components/ClasificacionClient';

type Props = { searchParams?: Record<string, string | undefined> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = searchParams || {};
  const hasShare = params.name && params.rank;

  const ogImageUrl = new URL('/api/og/ranking', process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

  if (hasShare) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) ogImageUrl.searchParams.set(k, v);
    });
  }

  const title = hasShare
    ? `${params.name} está en el puesto #${params.rank} del ranking ${params.scope === 'weekly' ? 'semanal' : 'global'}`
    : 'Cuadro de Clasificación — ANEKTIA';

  const description = hasShare
    ? `Nivel ${params.level || '?'} · ${params.xp || '0'} XP · Compite con otros sabios en ANEKTIA`
    : 'Compite con otros sabios de Anektia por el trono del conocimiento. Ranking global y semanal.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://anektia.com/clasificacion',
      siteName: 'ANEKTIA',
      locale: 'es_ES',
      type: 'website',
      images: [{ url: ogImageUrl.toString(), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl.toString()],
    },
  };
}

export default function ClasificacionPage() {
  return <ClasificacionClient />;
}
