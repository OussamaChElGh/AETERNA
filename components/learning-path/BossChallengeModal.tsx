'use client'

import { useState, useEffect } from 'react'
import { X, ShieldAlert, Heart, Zap, FastForward, CheckCircle2 } from 'lucide-react'
import { useGamification } from '@/context/GamificationContext'
import { RouteNode } from './RouteMap'
import { cn } from '@/lib/utils'
import { BOSS_EXAMS, BossQuestion } from '@/data/bossExams'
import { ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog'
import { ROOM_ASSETS } from '@/data/roomEngineAssets'

interface BossChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  node: RouteNode
}

type ModalState = 'intro' | 'exam' | 'victory'

export function BossChallengeModal({ isOpen, onClose, node }: BossChallengeModalProps) {
  const { progress, loseHeart, completeBoss, skipBoss, addXP, grantFurniture } = useGamification()
  const [modalState, setModalState] = useState<ModalState>('intro')
  
  // Exam State
  const exam = BOSS_EXAMS[node.slug]
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'wrong' | 'correct'>('idle')
  
  // Rewards
  const [rewards, setRewards] = useState<typeof ROOM_ENGINE_CATALOG>([])

  useEffect(() => {
    if (isOpen) {
      setModalState('intro')
      setCurrentQuestionIdx(0)
      setSelectedOption(null)
      setFeedback('idle')
      setIsShaking(false)
    }
  }, [isOpen])

  // If no exam found for this boss, just skip it safely
  useEffect(() => {
    if (isOpen && !exam) {
      console.warn(`No boss exam found for slug: ${node.slug}`)
      completeBoss(node.slug)
      onClose()
    }
  }, [isOpen, exam, node.slug, completeBoss, onClose])

  useEffect(() => {
    if (progress.hearts <= 0 && isOpen && modalState === 'exam') {
      // Expulsar si no tiene vidas
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [progress.hearts, isOpen, modalState, onClose])

  if (!isOpen || !exam) return null

  const handleSkip = () => {
    skipBoss(node.slug)
    addXP(25, "Saltar Jefe")
    onClose()
  }

  const handleStartExam = () => {
    if (progress.hearts <= 0) return
    setModalState('exam')
  }

  const handleSelect = (index: number) => {
    if (feedback !== 'idle' || progress.hearts <= 0) return
    
    setSelectedOption(index)
    const question = exam.questions[currentQuestionIdx]
    
    if (index === question.correctIndex) {
      setFeedback('correct')
      setTimeout(() => {
        if (currentQuestionIdx < exam.questions.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1)
          setSelectedOption(null)
          setFeedback('idle')
        } else {
          // Victoria!
          generateRewards()
          completeBoss(node.slug)
          addXP(node.xp, "Vencer Jefe")
          setModalState('victory')
        }
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

  const generateRewards = () => {
    // Generate 3 random items
    const selected = []
    const available = [...ROOM_ENGINE_CATALOG]
    for(let i = 0; i < 3; i++) {
      if (available.length === 0) break
      const r = Math.floor(Math.random() * available.length)
      selected.push(available[r])
      available.splice(r, 1) // don't give exact same duplicate in same pull ideally
    }
    setRewards(selected)
    grantFurniture(selected.map(item => item.id))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        onClick={modalState !== 'exam' ? onClose : undefined}
      />
      
      <div 
        className={cn(
          "relative w-full max-w-2xl bg-[#0A0705] border-2 border-[#FF3366] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,51,102,0.4)] flex flex-col",
          isShaking && "animate-[shake_0.4s_ease-in-out_infinite]"
        )}
      >
        {/* Vidas (only show in exam) */}
        {modalState === 'exam' && (
          <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded-full border border-[#FF3366]/30 z-20">
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
        )}

        {/* Header */}
        <div className="relative h-32 bg-gradient-to-b from-[#FF3366]/20 to-transparent flex flex-col items-center justify-center border-b border-[#FF3366]/30">
          <ShieldAlert className="w-12 h-12 text-[#FF3366] drop-shadow-[0_0_15px_#FF3366] mb-2" />
          <h2 className="text-[#FF3366] font-bold text-2xl tracking-[0.2em] uppercase">
            {modalState === 'victory' ? '¡Victoria!' : exam.title}
          </h2>
          
          {modalState !== 'exam' && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* INTRO STATE */}
        {modalState === 'intro' && (
          <div className="p-8 flex flex-col items-center">
            <p className="text-center text-lg text-white/80 mb-8 font-serif leading-relaxed max-w-lg">
              {exam.description}
            </p>

            <div className="mb-10 w-full">
              <p className="text-xs text-[#FF3366]/80 uppercase tracking-widest text-center mb-6">Recompensas por vencer</p>
              <div className="flex justify-center gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-24 h-24 rounded-2xl bg-black border border-[#FF3366]/50 shadow-[0_0_20px_rgba(255,51,102,0.2)] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FF3366]/20 to-transparent opacity-50" />
                    <span className="text-4xl filter grayscale contrast-200 blur-[1px]">🎁</span>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white/20">?</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button
                onClick={handleStartExam}
                disabled={progress.hearts <= 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF3366] to-[#FF0055] text-white font-bold tracking-widest uppercase hover:scale-105 transition-transform disabled:opacity-50 shadow-[0_0_30px_rgba(255,51,102,0.5)]"
              >
                {progress.hearts > 0 ? 'Comenzar Examen' : 'Sin Vidas'}
              </button>
              
              <button
                onClick={handleSkip}
                className="w-full py-3 rounded-xl border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <FastForward size={16} /> Saltar Jefe (Sin recompensas)
              </button>
            </div>
          </div>
        )}

        {/* EXAM STATE */}
        {modalState === 'exam' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6 text-xs text-white/40 tracking-widest uppercase">
              <span>Pregunta {currentQuestionIdx + 1} de {exam.questions.length}</span>
              <span>XP: {node.xp}</span>
            </div>

            <p className="text-center text-xl text-white mb-10 font-serif leading-relaxed">
              {exam.questions[currentQuestionIdx].text}
            </p>

            <div className="space-y-4">
              {exam.questions[currentQuestionIdx].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === exam.questions[currentQuestionIdx].correctIndex;
                
                let btnClass = "border-white/10 hover:border-[#FF3366]/50 hover:bg-[#FF3366]/10 text-white/80"
                
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
                      "w-full p-5 rounded-xl border-2 transition-all text-left text-base font-bold flex items-center justify-between",
                      btnClass,
                      progress.hearts <= 0 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span>{opt}</span>
                    {feedback === 'wrong' && isSelected && <X size={20} />}
                    {feedback === 'correct' && isSelected && <Zap size={20} />}
                  </button>
                )
              })}
            </div>

            {progress.hearts <= 0 && (
              <div className="mt-8 text-center text-[#FF3366] font-bold animate-pulse text-lg">
                Has perdido todas tus vidas. Regresa cuando te hayas recuperado.
              </div>
            )}
          </div>
        )}

        {/* VICTORY STATE */}
        {modalState === 'victory' && (
          <div className="p-8 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-400 mb-4 drop-shadow-[0_0_20px_#4ade80]" />
            <p className="text-center text-xl text-white mb-2 font-bold">¡Has superado el examen!</p>
            <p className="text-center text-sm text-white/50 mb-8">El Guardián te ha concedido acceso y recompensas.</p>

            <div className="flex justify-center gap-6 mb-10 flex-wrap">
              {rewards.map((item, i) => (
                <div key={`${item.id}-${i}`} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-black border border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center p-3 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 to-transparent" />
                    <img src={ROOM_ASSETS[item.assetId]?.src || '/images/placeholders/furniture.png'} alt={item.name} className="w-full h-full object-contain drop-shadow-md z-10" />
                  </div>
                  <span className="text-xs text-[#D4AF37] mt-3 max-w-[96px] text-center truncate">{item.name}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              Reclamar y Continuar
            </button>
          </div>
        )}
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
