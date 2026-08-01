'use client';
import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function GlobalFooter() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return <Footer />;
}
