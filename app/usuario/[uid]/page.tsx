import { Metadata } from 'next';
import { UsuarioClient } from '@/components/UsuarioClient';

type Props = { params: { uid: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const uid = params.uid;
  return {
    title: `Perfil de sabio — ANEKTIA`,
    description: `Perfil del sabio ${uid} en ANEKTIA`,
    openGraph: {
      title: 'Perfil de sabio — ANEKTIA',
      description: 'Descubre los logros, reliquias y progreso de este sabio.',
      siteName: 'ANEKTIA',
      locale: 'es_ES',
      type: 'profile',
    },
  };
}

export default function UsuarioPage({ params }: Props) {
  return <UsuarioClient uid={params.uid} />;
}
