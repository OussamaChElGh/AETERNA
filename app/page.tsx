import { getAllArticles } from "@/lib/content";
import { HomeClient } from "@/components/HomeClient";

export default function HomePage() {
  const articles = getAllArticles();
  return <HomeClient initialArticles={articles} />;
}
