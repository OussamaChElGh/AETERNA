'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  ShieldCheck, 
  Terminal,
  ArrowLeft
} from 'lucide-react';
import { ToastProvider } from '@/components/ui/ToastProvider';

interface AdminLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/imagenes', icon: ImageIcon, label: 'Imágenes' },
  { href: '/admin/auditoria', icon: ShieldCheck, label: 'Auditoría' },
  { href: '/admin/scripts', icon: Terminal, label: 'Scripts' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white flex">
        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-64 bg-[#111] border-r border-white/10 flex flex-col fixed h-full"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Volver al sitio</span>
            </Link>
            <h1 className="text-xl font-bold mt-4 text-white">Admin Dashboard</h1>
            <p className="text-xs text-white/40 mt-1">Panel de control</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item, idx) => (
              <NavLink 
                key={item.href} 
                href={item.href} 
                icon={item.icon} 
                label={item.label}
                index={idx}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-white/40">
              <p>Anektia Admin v1.0</p>
              <p className="mt-1">Fase 2: UI/UX</p>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto ml-64">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}

function NavLink({ href, icon: Icon, label, index }: { href: string; icon: any; label: string; index: number }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link
        href={href}
        className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive 
            ? 'text-white bg-white/10' 
            : 'text-white/70 hover:text-white hover:bg-white/5'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-blue-500/20 border border-blue-500/30 rounded-lg"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Icon size={18} className="relative z-10" />
        <span className="text-sm font-medium relative z-10">{label}</span>
      </Link>
    </motion.div>
  );
}
