import { getAllArticles } from '@/lib/server-content';
import { GuidesIndexClient } from '@/components/GuidesIndexClient';

export default function GuidesPage() {
  const articles = getAllArticles();
  return <GuidesIndexClient initialArticles={articles} />;
}
