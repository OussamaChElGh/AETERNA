'use client';
import { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Trophy, Zap, Award, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGamification, AVATARS, formatXP } from "../context/GamificationContext";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { LoginModal } from "./LoginModal";
import { NotificationBell } from "./NotificationBell";

interface NavItem {
  name: string;
  path: string;
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
  const pathname = usePathname();
  const { progress } = useGamification();
  const { user, signOut } = useAuth();
  
  const currentAvatar = AVATARS.find(a => a.id === progress.selectedAvatarId) || AVATARS[0];
  const AvatarIcon = currentAvatar.icon;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#D4AF37]/20 bg-black/80 backdrop-blur-md text-white font-sans shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-widest leading-none text-white transition-all group-hover:italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  AN<span className="text-[#D4AF37] group-hover:text-[#FFD700] transition-colors duration-500">EKT</span>IA
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-6">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path}
                  href={item.path}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.3em] font-bold transition-all py-2 border-b-2",
                    pathname === item.path
                      ? "text-[#D4AF37] border-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                      : "text-white/50 border-transparent hover:text-[#D4AF37] hover:border-[#D4AF37]/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-white/20 hidden lg:block"></div>

            {!user ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden lg:flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] px-6 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all rounded-full"
              >
                Acceso
              </button>
            ) : (
              <div className="hidden lg:flex items-center gap-6">
                
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-[#D4AF37] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" title="Vidas">
                    <span className="text-lg">💛</span> <span>{progress.hearts !== undefined ? progress.hearts : 4}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
                    <Zap size={14} /> <span>{formatXP(progress.xp)} XP</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/20 rounded-full border border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    <Award size={14} /> <span>N.{progress.level || 1}</span>
                  </div>
                </div>

                <div className="h-4 w-[1px] bg-white/20"></div>

                <NotificationBell />

                <Link href="/clasificacion" className="text-white/50 hover:text-[#D4AF37] transition-colors" title="Clasificación">
                  <Trophy size={16} />
                </Link>

                <Link href="/perfil" className="flex items-center gap-3 group ml-2 pl-4 border-l border-white/20">
                  <div className="w-8 h-8 rounded-full border border-[#D4AF37] overflow-hidden group-hover:shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center bg-black">
                    {(currentAvatar as any).image ? (
                      <img src={(currentAvatar as any).image} alt={(currentAvatar as any).name} className="w-full h-full object-cover" />
                    ) : (
                      <AvatarIcon className="w-4 h-4 text-[#D4AF37]" />
                    )}
                  </div>
                  <span className="text-white font-sans text-xs group-hover:text-[#D4AF37] transition-colors">{(user as any).displayName?.split(' ')[0] || (user as any).name?.split(' ')[0] || 'Explorador'}</span>
                </Link>

                <button
                  onClick={signOut}
                  className="text-white/30 hover:text-red-400 transition-colors ml-2"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-4">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-[#D4AF37]/20 px-4 py-8 overflow-hidden"
          >
            <div className="flex flex-col gap-6">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xs uppercase tracking-[0.3em] font-sans",
                    pathname === item.path ? "text-[#D4AF37]" : "text-white/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="h-[1px] w-full bg-white/10 my-2"></div>
              
              {!user ? (
                <button
                  onClick={() => { setIsLoginModalOpen(true); setIsOpen(false); }}
                  className="text-xs uppercase tracking-[0.3em] font-sans text-left text-[#D4AF37]"
                >
                  Iniciar Sesión
                </button>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] font-sans text-white/50">Notificaciones</span>
                    <NotificationBell />
                  </div>
                  <Link href="/clasificacion" onClick={() => setIsOpen(false)} className="text-xs uppercase tracking-[0.3em] font-sans text-white">
                    Clasificación
                  </Link>
                  <Link href="/perfil" onClick={() => setIsOpen(false)} className="text-xs uppercase tracking-[0.3em] font-sans text-white">
                    Perfil ({formatXP(progress.xp)} XP)
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="text-xs uppercase tracking-[0.3em] font-sans text-left text-red-500"
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
