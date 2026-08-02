import { Metadata } from 'next';
import { UsuarioClient } from '@/components/UsuarioClient';

type Props = { params: { uid: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const uid = params.uid;
  return {
    title: `Perfil de sabio — AETERNA`,
    description: `Perfil del sabio ${uid} en AETERNA`,
    openGraph: {
      title: 'Perfil de sabio — AETERNA',
      description: 'Descubre los logros, reliquias y progreso de este sabio.',
      siteName: 'AETERNA',
      locale: 'es_ES',
      type: 'profile',
    },
  };
}

export default function UsuarioPage({ params }: Props) {
  return <UsuarioClient uid={params.uid} />;
}
