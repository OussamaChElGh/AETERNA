import { getAllArticles } from '@/lib/content';
import { ProfilePageClient } from '@/components/ProfilePageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function ProfilePage() {
  const articles = getAllArticles();
  return <ProfilePageClient initialArticles={articles} />;
}
