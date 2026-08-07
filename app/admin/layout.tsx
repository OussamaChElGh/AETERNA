'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  ShieldCheck, 
  Terminal,
  Package,
  BookOpen,
  RefreshCw,
  BarChart3,
  Brain,
  Code2,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

interface AdminLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/planner', icon: Brain, label: 'Planificador IA' },
  { href: '/admin/stitch', icon: Code2, label: 'Stitch-to-Code' },
  { href: '/admin/imagenes', icon: ImageIcon, label: 'Imágenes' },
  { href: '/admin/assets', icon: Package, label: 'Assets' },
  { href: '/admin/articulos', icon: BookOpen, label: 'Artículos' },
  { href: '/admin/sync', icon: RefreshCw, label: 'Sync' },
  { href: '/admin/auditoria', icon: ShieldCheck, label: 'Auditoría' },
  { href: '/admin/scripts', icon: Terminal, label: 'Scripts' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el menú al cambiar de ruta en móvil
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#111] border-b border-white/10 z-50">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/60 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <span className="font-bold">Admin Dashboard</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out",
            "md:translate-x-0", // Siempre visible en escritorio
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full" // Toggle en móvil
          )}
        >
          {/* Header Desktop */}
          <div className="p-6 border-b border-white/10 hidden md:block">
            <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Volver al sitio</span>
            </Link>
            <h1 className="text-xl font-bold mt-4 text-white">Admin Dashboard</h1>
            <p className="text-xs text-white/40 mt-1">Panel de control</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item, idx) => (
              <NavLink 
                key={item.href} 
                href={item.href} 
                icon={item.icon} 
                label={item.label}
                index={idx}
                isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-white/40">
              <p>Anektia Admin v1.1</p>
              <p className="mt-1">Framework Refactor</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 w-full h-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}

function NavLink({ href, icon: Icon, label, index, isActive }: { href: string; icon: any; label: string; index: number; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={href}
        className={cn(
          "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
          isActive 
            ? 'text-white bg-white/10' 
            : 'text-white/70 hover:text-white hover:bg-white/5'
        )}
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
