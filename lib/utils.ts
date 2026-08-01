import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

export function getArticlePath(art: { slug: string; _path?: string }) {
  if (!art._path) return `/articulos/${art.slug}`;
  
  const pathPrefix = "content/guias/";
  const normalizedPath = art._path.replace(/\\/g, '/');
  
  if (!normalizedPath.includes(pathPrefix)) return `/articulos/${art.slug}`;
  
  const relativePath = normalizedPath.slice(normalizedPath.indexOf(pathPrefix) + pathPrefix.length);
  const parts = relativePath.split("/");
  
  if (parts.length >= 2) {
    const categoryPart = parts[0];
    const subcategoryPart = parts.length > 2 ? parts[1] : null;
    const slugPart = art.slug;
    
    if (subcategoryPart) {
      return `/guias/${categoryPart}/${subcategoryPart}/${slugPart}`;
    } else {
      return `/guias/${categoryPart}/${slugPart}`;
    }
  }
  return `/articulos/${art.slug}`;
}
