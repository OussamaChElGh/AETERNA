import { getAllArticles } from '@/lib/content';
import { ProfilePageClient } from '@/components/ProfilePageClient';

export default function ProfilePage() {
  const articles = getAllArticles();
  return <ProfilePageClient initialArticles={articles} />;
}
