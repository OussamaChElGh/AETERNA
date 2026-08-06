'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { ROOM_ITEM_CATALOG } from '@/data/roomCatalog'

interface ChestRewardModalProps {
  isOpen: boolean
  onClose: () => void
  chestLevel: number
}

// 4 possible items from the catalog
const POSSIBLE_ITEMS = ROOM_ITEM_CATALOG.filter(item => 
  ['physics_telescope', 'physics_prism', 'physics_schrodinger_cat', 'math_golden_spiral'].includes(item.id)
)

export function ChestRewardModal({ isOpen, onClose, chestLevel }: ChestRewardModalProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [reward, setReward] = useState<typeof POSSIBLE_ITEMS[0] | null>(null)
  
  useEffect(() => {
    if (isOpen) {
      setIsOpening(false)
      setReward(null)
    }
  }, [isOpen])

  const handleOpenChest = () => {
    setIsOpening(true)
    // Simulate RNG opening (spin animation)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * POSSIBLE_ITEMS.length)
      setReward(POSSIBLE_ITEMS[randomIndex])
      setIsOpening(false)
    }, 2500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-[#0A0705] border border-[#D4AF37]/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden"
          style={{ background: 'radial-gradient(circle at top, #1A120B 0%, #0A0705 100%)' }}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {!reward ? (
            <div className="flex flex-col items-center py-8">
              <h2 className="text-3xl font-serif text-[#D4AF37] mb-2">Tesoro del Nivel {chestLevel}</h2>
              <p className="text-white/60 mb-8 text-center max-w-md">
                Has alcanzado un nodo de recompensa. Este cofre arcano contiene mobiliario para tu sala de estudio.
              </p>

              {/* Posibles Recompensas */}
              <div className="w-full mb-10">
                <p className="text-xs text-[#D4AF37]/80 uppercase tracking-widest text-center mb-4">Posibles Recompensas</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {POSSIBLE_ITEMS.map((item) => (
                    <div key={item.id} className="w-24 h-24 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-2 relative group">
                      <img src={item.asset.src} alt={item.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100" />
                      {/* Tooltip */}
                      <div className="absolute -bottom-8 bg-black border border-[#D4AF37]/50 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10 transition-opacity">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón Abrir */}
              <button 
                onClick={handleOpenChest}
                disabled={isOpening}
                className="relative px-8 py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 overflow-hidden group"
              >
                {isOpening ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="animate-spin" size={18} /> Sintetizando...
                  </span>
                ) : (
                  <span>Abrir Cofre</span>
                )}
                <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8"
            >
              <h2 className="text-3xl font-serif text-[#D4AF37] mb-2 text-center">¡Recompensa Obtenida!</h2>
              <p className="text-white/60 mb-8 text-center max-w-md">
                Este objeto se ha añadido a tu inventario y podrás colocarlo en tu sala de estudio.
              </p>

              {/* Recompensa Destacada */}
              <div className="relative w-48 h-48 rounded-full bg-black/50 border-2 border-[#D4AF37] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full animate-pulse" />
                <img src={reward.asset.src} alt={reward.name} className="w-32 h-32 object-contain relative z-10 animate-bounce" />
                <div className="absolute -bottom-3 px-4 py-1 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-full border border-[#FFF8DC]">
                  {reward.rarity}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
              <p className="text-white/50 text-sm text-center max-w-sm mb-8">{reward.description}</p>

              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors uppercase tracking-widest font-bold text-sm"
              >
                Continuar
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
