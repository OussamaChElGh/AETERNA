'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog'
import { ROOM_ASSETS } from '@/data/roomEngineAssets'
import { useGamification } from '@/context/GamificationContext'

interface ChestRewardModalProps {
  isOpen: boolean
  onClose: () => void
  chestLevel: number
}

export function ChestRewardModal({ isOpen, onClose, chestLevel }: ChestRewardModalProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [reward, setReward] = useState<typeof ROOM_ENGINE_CATALOG[0] | null>(null)
  const { grantFurniture } = useGamification()
  
  // Computamos los premios posibles dinámicamente según el nivel
  const possibleRewards = ROOM_ENGINE_CATALOG.slice(
    (chestLevel - 1) * 4,
    chestLevel * 4
  )

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
      const randomIndex = Math.floor(Math.random() * possibleRewards.length)
      const selectedReward = possibleRewards[randomIndex]
      setReward(selectedReward)
      setIsOpening(false)
      
      // Guardar permanentemente el mueble
      if (selectedReward) {
        grantFurniture([selectedReward.id])
      }
    }, 2500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Épico estilo Boss */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        />
        
        {/* Rayos Rojos de Fondo (Boss Aesthetic) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-30">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-[200vw] h-[200vw] origin-center"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, #991b1b 10deg, transparent 20deg, #991b1b 30deg, transparent 40deg, #991b1b 50deg, transparent 60deg, #991b1b 70deg, transparent 80deg, #991b1b 90deg, transparent 100deg, #991b1b 110deg, transparent 120deg, #991b1b 130deg, transparent 140deg, #991b1b 150deg, transparent 160deg, #991b1b 170deg, transparent 180deg, #991b1b 190deg, transparent 200deg, #991b1b 210deg, transparent 220deg, #991b1b 230deg, transparent 240deg, #991b1b 250deg, transparent 260deg, #991b1b 270deg, transparent 280deg, #991b1b 290deg, transparent 300deg, #991b1b 310deg, transparent 320deg, #991b1b 330deg, transparent 340deg, #991b1b 350deg, transparent 360deg)'
            }}
          />
        </div>

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="relative w-full max-w-2xl bg-[#0a0202] border-2 border-red-900/50 rounded-2xl p-8 shadow-[0_0_80px_rgba(220,38,38,0.2)] overflow-hidden"
          style={{ background: 'radial-gradient(circle at center, #1a0505 0%, #0a0202 100%)' }}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-20"
          >
            <X size={24} />
          </button>

          {!reward ? (
            <div className="flex flex-col items-center py-8 relative z-10">
              <h2 className="text-4xl font-serif text-red-500 mb-2 uppercase tracking-widest text-center" style={{ textShadow: '0 0 20px rgba(239,68,68,0.5)' }}>
                Tesoro del Nivel {chestLevel}
              </h2>
              <p className="text-white/60 mb-8 text-center max-w-md text-sm">
                Has alcanzado un nodo de recompensa. Este cofre arcano contiene mobiliario exclusivo para tu sala de estudio.
              </p>

              {/* Posibles Recompensas */}
              <div className="w-full mb-10">
                <p className="text-xs text-red-400/80 uppercase tracking-widest text-center mb-6">Contenidos Detectados</p>
                <div className="flex justify-center gap-6 flex-wrap">
                  {possibleRewards.map((item, idx) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="w-28 h-28 rounded-xl bg-black/80 border border-red-900/50 flex flex-col items-center justify-center p-2 relative group shadow-[0_0_20px_rgba(153,27,27,0.3)]"
                    >
                      <img src={ROOM_ASSETS[item.assetId]?.src || '/images/placeholders/furniture.png'} alt={item.name} className="w-16 h-16 object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                      {/* Tooltip */}
                      <div className="absolute -bottom-8 bg-[#0a0202] border border-red-900 text-xs text-red-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10 transition-opacity">
                        {item.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Botón Abrir */}
              <button 
                onClick={handleOpenChest}
                disabled={isOpening}
                className="relative px-10 py-4 rounded-full bg-gradient-to-r from-red-900 to-red-600 text-white font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 overflow-hidden group shadow-[0_0_30px_rgba(220,38,38,0.4)]"
              >
                {isOpening ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="animate-spin text-yellow-500" size={18} /> ROMPIENDO EL SELLO...
                  </span>
                ) : (
                  <span>Desbloquear Cofre</span>
                )}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <h2 className="text-4xl font-serif text-yellow-500 mb-2 text-center uppercase tracking-widest drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                  ¡Recompensa Obtenida!
                </h2>
              </motion.div>
              <p className="text-white/60 mb-8 text-center max-w-md">
                Este objeto se ha guardado en tu inventario permanentemente.
              </p>

              {/* Recompensa Destacada */}
              <div className="relative w-56 h-56 rounded-full bg-black/50 border-2 border-yellow-500 flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(234,179,8,0.3)]">
                <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-pulse" />
                <motion.img 
                  initial={{ y: 20 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  src={ROOM_ASSETS[reward.assetId]?.src || '/images/placeholders/furniture.png'} 
                  alt={reward.name} 
                  className="w-36 h-36 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" 
                />
                <div className="absolute -bottom-4 px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold text-xs uppercase tracking-widest rounded-full border border-[#FFF8DC] shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                  {reward.rarity}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{reward.name}</h3>
              <p className="text-white/50 text-sm text-center max-w-sm mb-10">{reward.description}</p>

              <button 
                onClick={onClose}
                className="px-10 py-3 rounded-full border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-colors uppercase tracking-widest font-bold text-sm"
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
