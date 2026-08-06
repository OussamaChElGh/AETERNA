'use client';

import { motion } from 'framer-motion';
import { Terminal, Play, Clock, History } from 'lucide-react';

const SCRIPTS = [
  { name: 'audit-structured.ts', description: 'Auditoría estructurada de contenido', category: 'Auditoría' },
  { name: 'verify-all-project-images.ts', description: 'Verifica todas las imágenes del proyecto', category: 'Imágenes' },
  { name: 'images-generate.ts', description: 'Genera imágenes faltantes', category: 'Imágenes' },
  { name: 'article-sync.ts', description: 'Sincroniza artículos con Firebase', category: 'Contenido' },
  { name: 'generate-pixel-art-pngs.ts', description: 'Genera pixel art PNGs', category: 'Imágenes' },
];

function ScriptCard({ script, index }: { script: typeof SCRIPTS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-green-500/10 p-3 rounded-lg">
          <Terminal size={24} className="text-green-400" />
        </div>
        <span className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60">
          {script.category}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-mono">{script.name}</h3>
      <p className="text-white/60 text-sm mb-4">{script.description}</p>
      <button
        disabled
        className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Play size={16} />
        Ejecutar
      </button>
    </motion.div>
  );
}

export default function AdminScriptsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Terminal size={32} className="text-green-400" />
          Ejecutor de Scripts
        </h1>
        <p className="text-white/60 mt-2">
          Ejecuta scripts CLI del proyecto desde la interfaz web
        </p>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-white/10 rounded-xl p-8 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="bg-green-500/20 p-4 rounded-full">
            <Clock size={32} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Próximamente en Fase 4</h2>
            <p className="text-white/60 mt-1">
              El ejecutor de scripts permitirá ejecutar comandos CLI con output en tiempo real y historial.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scripts Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Terminal size={20} className="text-green-400" />
          Scripts Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCRIPTS.map((script, idx) => (
            <ScriptCard key={script.name} script={script} index={idx} />
          ))}
        </div>
      </div>

      {/* History Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <History size={20} className="text-blue-400" />
          Historial de Ejecuciones
        </h2>
        <div className="text-center py-8">
          <History size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No hay ejecuciones recientes</p>
          <p className="text-white/30 text-sm mt-1">El historial aparecerá aquí cuando ejecutes scripts</p>
        </div>
      </motion.div>
    </div>
  );
}
