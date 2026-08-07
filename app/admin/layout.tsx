import { ReactNode } from 'react';
import { Metadata } from 'next';
import { AdminLayoutClient } from './client-layout';

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
