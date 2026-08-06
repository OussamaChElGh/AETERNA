'use client'

import { useState, useEffect } from 'react'
import { X, ShieldAlert, Heart, Zap } from 'lucide-react'
import { useGamification } from '@/context/GamificationContext'
import { useRouter } from 'next/navigation'
import { RouteNode } from './RouteMap'
import { cn } from '@/lib/utils'

interface BossChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  node: RouteNode
}

export function BossChallengeModal({ isOpen, onClose, node }: BossChallengeModalProps) {
  const { progress, loseHeart } = useGamification()
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'wrong' | 'correct'>('idle')

  // Dummy question for generic boss
  const question = {
    text: `El Guardián del Conocimiento bloquea tu acceso a "${node.title}". Para avanzar, debes demostrar tu valía.`,
    options: [
      "Ignorar al Guardián y pasar",
      "Demostrar mi sabiduría",
      "Retroceder con miedo"
    ],
    correctIndex: 1
  }

  useEffect(() => {
    if (progress.hearts <= 0 && isOpen) {
      // Expulsar si no tiene vidas
      onClose()
    }
  }, [progress.hearts, isOpen, onClose])

  if (!isOpen) return null

  const handleSelect = (index: number) => {
    if (feedback !== 'idle' || progress.hearts <= 0) return
    setSelectedOption(index)
    
    if (index === question.correctIndex) {
      setFeedback('correct')
      setTimeout(() => {
        onClose()
        router.push(`/guias/ciencias_naturales/fisica/${node.slug}`)
      }, 1500)
    } else {
      setFeedback('wrong')
      setIsShaking(true)
      loseHeart()
      
      setTimeout(() => {
        setIsShaking(false)
        setFeedback('idle')
        setSelectedOption(null)
      }, 800)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div 
        className={cn(
          "relative w-full max-w-lg bg-[#0F0C18] border-2 border-[#FF3366] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,51,102,0.3)] flex flex-col",
          isShaking && "animate-[shake_0.4s_ease-in-out_infinite]"
        )}
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-b from-[#FF3366]/20 to-transparent flex flex-col items-center justify-center border-b border-[#FF3366]/30">
          <ShieldAlert className="w-12 h-12 text-[#FF3366] drop-shadow-[0_0_15px_#FF3366] mb-2" />
          <h2 className="text-[#FF3366] font-bold text-xl tracking-[0.2em] uppercase">Desafío de Jefe</h2>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Vidas */}
        <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded-full border border-[#FF3366]/30">
          {Array.from({ length: progress.maxHearts }).map((_, i) => (
            <Heart 
              key={i} 
              size={16} 
              className={cn(
                "transition-all duration-300",
                i < progress.hearts 
                  ? "fill-[#FF3366] text-[#FF3366] drop-shadow-[0_0_5px_#FF3366]" 
                  : "text-white/20"
              )} 
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-center text-lg text-white/90 mb-8 font-serif leading-relaxed">
            {question.text}
          </p>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;
              
              let btnClass = "border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-white/80"
              
              if (feedback !== 'idle' && isSelected) {
                if (isCorrect) {
                  btnClass = "border-green-500 bg-green-500/20 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                } else {
                  btnClass = "border-[#FF3366] bg-[#FF3366]/20 text-[#FF3366] shadow-[0_0_15px_rgba(255,51,102,0.3)]"
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={feedback !== 'idle' || progress.hearts <= 0}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all text-left text-sm font-bold flex items-center justify-between",
                    btnClass,
                    progress.hearts <= 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span>{opt}</span>
                  {feedback === 'wrong' && isSelected && <X size={18} />}
                  {feedback === 'correct' && isSelected && <Zap size={18} />}
                </button>
              )
            })}
          </div>

          {progress.hearts <= 0 && (
            <div className="mt-6 text-center text-[#FF3366] font-bold animate-pulse">
              Has perdido todas tus vidas. Regresa cuando te hayas recuperado.
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px) rotate(-1deg); }
          75% { transform: translateX(8px) rotate(1deg); }
        }
      `}} />
    </div>
  )
}
