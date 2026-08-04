'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShieldCheck, Target } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signInWithGoogle } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    onClose();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#09090B] p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] md:p-16 z-10"
          >
            {/* Decorative background gradients */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gold/10 blur-[80px]" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand-cosmic/10 blur-[80px]" />

            <button
              onClick={onClose}
              className="absolute right-8 top-8 text-white/20 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 shadow-xl">
                <ShieldCheck className="h-10 w-10 text-brand-gold" />
              </div>

              <h2 className="mb-4 font-serif text-3xl tracking-tight text-white md:text-4xl">
                Acceso al Nexo
              </h2>
              <p className="mb-10 font-sans text-[10px] tracking-[0.4em] text-white/40 uppercase">
                Sincroniza tu integridad cognitiva
              </p>

              <div className="mb-12 space-y-6 text-left w-full">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-brand-gold/10 p-2">
                    <Sparkles className="h-4 w-4 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white/90">Guarda tu Progreso</h4>
                    <p className="text-xs text-white/40">Sincroniza tus niveles de exégesis y XP.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-brand-cosmic/10 p-2">
                    <Target className="h-4 w-4 text-brand-cosmic" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white/90">Desbloquea Desafíos</h4>
                    <p className="text-xs text-white/40">Accede a contenido de frontera y exámenes.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-xl bg-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-brand-gold"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-4 w-4" />
                <span>Continuar con Google</span>
              </button>

              <p className="mt-8 text-[9px] text-white/20 uppercase tracking-[0.3em]">
                Protocolos Anektia Verificados
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
