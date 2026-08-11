'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGamification } from '@/context/GamificationContext';
import { useAuth } from '@/context/AuthContext';
import { Compass, BookOpen, Hexagon, Trophy, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'El Camino del Sabio',
    description: 'Bienvenido a Anektia, el nexo infinito del conocimiento. Aquí tu aprendizaje es un viaje estelar. Explora las distintas ramas de la ciencia y la cultura a través de nuestras Constelaciones de Sabiduría.',
    icon: Compass,
    image: '/images/onboarding/step1.png',
  },
  {
    id: 'study',
    title: 'Estudio y Asimilación',
    description: 'A medida que lees guías y completas evaluaciones, asimilarás "Capas de Conocimiento". Esto te otorgará Experiencia (XP), haciéndote subir de nivel y ampliando tu intelecto.',
    icon: BookOpen,
    image: '/images/onboarding/step2.png',
  },
  {
    id: 'room',
    title: 'Tu Estancia Mágica',
    description: 'El conocimiento se materializa. Al dominar temas específicos, desbloquearás muebles y objetos únicos para personalizar tu Habitación del Conocimiento personal.',
    icon: Hexagon,
    image: '/images/onboarding/step3.png',
  },
  {
    id: 'relics',
    title: 'Reliquias y Gloria',
    description: 'Completar niveles enteros te recompensará con Reliquias legendarias. Tu XP te posicionará en la Clasificación Global de Sabios. ¿Estás listo para ascender?',
    icon: Trophy,
    image: '/images/onboarding/step4.png',
  }
];

export function OnboardingFunnel() {
  const { progress, markOnboardingSeen } = useGamification();
  const { user, signInWithGoogle } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!progress.hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [progress.hasSeenOnboarding]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsVisible(false);
    markOnboardingSeen();
    
    if (!user) {
      setTimeout(() => {
        signInWithGoogle();
      }, 500);
    }
  };

  if (!isVisible && progress.hasSeenOnboarding) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-brand-ink/90 backdrop-blur-xl pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[800px] bg-brand-ink border border-brand-gold/30 shadow-[0_0_80px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-brand-gold z-30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-brand-gold z-30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-brand-gold z-30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-brand-gold z-30" />
            
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-20" />

            <button
              onClick={handleFinish}
              className="absolute top-4 right-4 text-brand-gold/50 hover:text-brand-gold transition-colors z-40 bg-brand-ink/50 backdrop-blur-md rounded-full p-1"
            >
              <X size={20} />
            </button>

            <div className="relative min-h-[450px] flex">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col md:flex-row w-full"
                >
                  {/* Image Section */}
                  <div className="w-full md:w-1/2 h-[200px] md:h-auto relative border-b md:border-b-0 md:border-r border-brand-gold/20 overflow-hidden bg-brand-ink">
                    <img 
                      src={ONBOARDING_STEPS[currentStep].image} 
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen hover:scale-105 transition-transform duration-[3s] ease-out" 
                    />
                    {/* Gradientes para fundir la imagen con el fondo oscuro */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-ink via-transparent to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-brand-ink/20 pointer-events-none" />
                  </div>

                  {/* Text Section */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left relative z-10">
                    <div className="mb-8 relative w-20 h-20">
                      <div className="absolute inset-0 bg-brand-gold blur-2xl opacity-20 animate-pulse" />
                      <div className="relative w-full h-full rounded-full border border-brand-gold/30 bg-brand-ink/80 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        {React.createElement(ONBOARDING_STEPS[currentStep].icon, {
                          size: 32,
                          className: "text-brand-gold",
                        })}
                      </div>
                    </div>

                    <h2 className="font-serif text-3xl md:text-4xl text-brand-offwhite mb-4 italic tracking-tight">
                      {ONBOARDING_STEPS[currentStep].title}
                    </h2>
                    <p className="text-brand-offwhite/70 text-sm md:text-base leading-relaxed">
                      {ONBOARDING_STEPS[currentStep].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer con controles */}
            <div className="px-8 py-6 border-t border-brand-gold/10 bg-brand-ink/50 flex items-center justify-between relative z-10">
              
              {/* Dots */}
              <div className="flex items-center gap-2">
                {ONBOARDING_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === currentStep
                        ? "w-6 bg-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                        : "w-1.5 bg-brand-gold/20"
                    )}
                  />
                ))}
              </div>

              {/* Botón */}
              <button
                onClick={handleNext}
                className="group flex items-center gap-3 px-6 py-3 bg-brand-gold text-brand-ink text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-offwhite hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? (
                  "Comenzar Viaje"
                ) : (
                  <>
                    Siguiente <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
