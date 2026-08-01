import path from 'path';
import fs from 'fs';
import { parseFrontmatter } from '@/lib/server-content';
import { ArticleAuditor } from '@/components/ArticleAuditor';

const contentDirectories = [
  path.join(process.cwd(), 'content', 'guias'),
  path.join(process.cwd(), '..', 'AETERNA-main', 'src', 'content', 'guias'),
];

function getFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else if (file.endsWith('.md') || file.endsWith('.txt')) {
      results.push(fullPath);
    }
  });
  return results;
}

function getAllMarkdownSlugs(): { slug: string; title: string }[] {
  const seen = new Map<string, { slug: string; title: string; mtime: number }>();
  for (const dir of contentDirectories) {
    if (!fs.existsSync(dir)) continue;
    const files = getFilesRecursively(dir);
    for (const filePath of files) {
      try {
        const stat = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = parseFrontmatter(content, filePath);
        const key = data.slug || path.basename(filePath, path.extname(filePath));
        const existing = seen.get(key);
        if (!existing || stat.mtimeMs > existing.mtime) {
          seen.set(key, { slug: key, title: data.title || key, mtime: stat.mtimeMs });
        }
      } catch {}
    }
  }
  return Array.from(seen.values())
    .sort((a, b) => a.title.localeCompare(b.title));
}

export default function AuditorPage() {
  const articles = getAllMarkdownSlugs();

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0F0F12]">
      <ArticleAuditor articles={articles} />
    </div>
  );
}
