'use client';

import { motion } from 'framer-motion';

export function DistributionChart({ pngCount, webpCount }: { pngCount: number; webpCount: number }) {
  const total = pngCount + webpCount;
  const pngPercent = total > 0 ? (pngCount / total) * 100 : 0;
  const webpPercent = total > 0 ? (webpCount / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6"
    >
      <h3 className="text-lg font-bold text-white mb-4">Distribución de Formatos</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-orange-400 flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full" />
              PNG
            </span>
            <span className="text-white/60 font-mono">{pngCount} ({pngPercent.toFixed(1)}%)</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pngPercent}%` }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-400 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              WebP
            </span>
            <span className="text-white/60 font-mono">{webpCount} ({webpPercent.toFixed(1)}%)</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${webpPercent}%` }}
              transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
