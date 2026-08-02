'use client';
import { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search, ChevronDown, Trophy, Sparkles, Flame, Award, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGamification, ACHIEVEMENTS, AVATARS, formatXP } from "../context/GamificationContext";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { LoginModal } from "./LoginModal";

interface NavItem {
  name: string;
  path: string;
  categories?: { name: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { name: "Archivo", path: "/" },
  { name: "Guías", path: "/guias" },
  { name: "Física", path: "/guias/ciencias_naturales/fisica" },
  { name: "Filosofía", path: "/guias/humanidades/filosofia" },
  { name: "Interactivos", path: "/interactivos" },
  { name: "Autores", path: "/autores" },
  { name: "Bitácora", path: "/bitacora" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const pathname = usePathname();
  const { progress } = useGamification();
  const { user, signInWithGoogle, signOut } = useAuth();
  
  const currentAvatar = AVATARS.find(a => a.id === progress.selectedAvatarId) || AVATARS[0];
  const AvatarIcon = currentAvatar.icon;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-offwhite/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="relative w-12 h-12 rounded-full border border-brand-gold/30 bg-brand-ink flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-brand-gold group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <img src="/mascot.png" alt="Aeterna" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=200&auto=format&fit=crop"; }} 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl tracking-tighter leading-none transition-all group-hover:italic text-brand-ink dark:text-brand-offwhite">
                  AE<span className="text-brand-gold group-hover:text-brand-cosmic transition-colors duration-500">TER</span>NA
                </span>
                <span className="text-[6px] uppercase font-bold tracking-[0.8em] text-brand-muted mt-2">Archivo Universal • 2026</span>
              </div>
              <motion.div 
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-1 left-0 w-full h-[1px] bg-brand-cosmic/50 origin-left shadow-[0_0_8px_rgba(14,165,233,0.8)] dark:shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-10">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path}
                  href={item.path}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.4em] font-bold transition-all py-2 border-b-2 border-transparent",
                    pathname === item.path
                      ? "text-brand-cosmic border-brand-cosmic drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]"
                      : "text-brand-ink/40 dark:text-brand-offwhite/40 hover:text-brand-cosmic hover:border-brand-cosmic/30"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <ThemeToggle />
            
            <div className="h-4 w-[1px] bg-brand-border hidden lg:block"></div>

            {!user ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden lg:flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] text-brand-ink px-6 py-2 border border-brand-ink hover:bg-brand-ink hover:text-brand-offwhite transition-all"
              >
                Acceso
              </button>
            ) : (
              <div className="hidden lg:flex items-center gap-8">
                <Link href="/clasificacion"
                  className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-brand-muted hover:text-brand-ink transition-all"
                >
                  <Trophy size={14} />
                  Clasificación
                </Link>
                <Link href="/perfil"
                  className="flex items-center gap-4 group"
                >
                  <div className="text-right">
                    <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-brand-gold block">Nivel {progress.level}</span>
                    <span className="text-[10px] font-sans text-brand-ink font-bold tracking-tight">{formatXP(progress.xp)} XP</span>
                  </div>
                  <div className="w-10 h-10 bg-brand-ink text-brand-offwhite flex items-center justify-center transition-all group-hover:bg-brand-gold group-hover:scale-105 overflow-hidden">
                    {(currentAvatar as any).image ? (
                      <img src={(currentAvatar as any).image} alt={(currentAvatar as any).name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                    ) : (
                      <AvatarIcon className="w-5 h-5" />
                    )}
                  </div>
                </Link>
                <button
                  onClick={signOut}
                  className="text-brand-muted hover:text-brand-ink transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-brand-ink"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-brand-offwhite border-b border-brand-border px-4 py-8"
          >
            <div className="flex flex-col gap-6">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.3em] font-sans",
                    pathname === item.path
                      ? "text-brand-gold"
                      : "text-brand-ink/40"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="h-[1px] w-full bg-brand-border my-2"></div>
              
              {!user ? (
                <button
                  onClick={() => { setIsLoginModalOpen(true); setIsOpen(false); }}
                  className="text-[10px] uppercase tracking-[0.3em] font-sans text-left"
                >
                  Iniciar Sesión
                </button>
              ) : (
                <div className="flex flex-col gap-6">
                  <Link href="/clasificacion" onClick={() => setIsOpen(false)} className="text-[10px] uppercase tracking-[0.3em] font-sans">
                    Clasificación
                  </Link>
                  <Link href="/perfil" onClick={() => setIsOpen(false)} className="text-[10px] uppercase tracking-[0.3em] font-sans">
                    Perfil ({formatXP(progress.xp)} XP)
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="text-[10px] uppercase tracking-[0.3em] font-sans text-left text-red-500"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
