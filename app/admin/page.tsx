'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Image as ImageIcon, 
  ShieldCheck, 
  HardDrive, 
  TrendingDown,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

interface ScanResult {
  totalImages: number;
  totalSize: number;
  images: any[];
  pngCount: number;
  webpCount: number;
  potentialSavings: number;
}

function StatCard({ stat, index }: { stat: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.2, type: "spring" }}
            className={`${stat.bgColor} p-3 rounded-lg`}
          >
            <stat.icon className={stat.color} size={24} />
          </motion.div>
          <ArrowUpRight size={16} className="text-white/40 group-hover:text-white/80 transition-colors" />
        </div>
        <div>
          <p className="text-white/60 text-sm">{stat.title}</p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
            className="text-2xl font-bold text-white mt-1"
          >
            {stat.value}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

function DistributionChart({ pngCount, webpCount }: { pngCount: number; webpCount: number }) {
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

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-lg" />
        <div className="w-4 h-4 bg-white/10 rounded" />
      </div>
      <div className="space-y-2">
        <div className="w-20 h-3 bg-white/10 rounded" />
        <div className="w-16 h-6 bg-white/10 rounded" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScanData();
  }, []);

  async function fetchScanData() {
    try {
      const res = await fetch('/api/admin/images/scan');
      const data = await res.json();
      setScanResult(data);
    } catch (error) {
      console.error('Error fetching scan data:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  const stats = scanResult ? [
    {
      title: 'Total Imágenes',
      value: scanResult.totalImages,
      icon: ImageIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Tamaño Total',
      value: formatBytes(scanResult.totalSize),
      icon: HardDrive,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Ahorro Potencial',
      value: formatBytes(scanResult.potentialSavings),
      icon: TrendingDown,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'PNG sin WebP',
      value: scanResult.images.filter(img => img.format === 'png' && !img.hasWebP).length,
      icon: AlertCircle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ] : [];

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60 mt-2">Vista general del sistema</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} index={idx} />
            ))}
          </div>

          {/* Quick Actions + Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-400" />
                Optimización de Imágenes
              </h2>
              <p className="text-white/60 mb-4">
                Convierte tus imágenes PNG a WebP para reducir el tamaño sin perder calidad.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/80">
                  <span>Archivos PNG:</span>
                  <span className="font-mono">{scanResult?.pngCount || 0}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Archivos WebP:</span>
                  <span className="font-mono">{scanResult?.webpCount || 0}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Ahorro estimado:</span>
                  <span className="font-mono text-green-400">
                    {scanResult ? formatBytes(scanResult.potentialSavings) : '0 B'}
                  </span>
                </div>
              </div>
              <a
                href="/admin/imagenes"
                className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition-colors"
              >
                Ir al Optimizador →
              </a>
            </motion.div>

            <DistributionChart 
              pngCount={scanResult?.pngCount || 0} 
              webpCount={scanResult?.webpCount || 0} 
            />
          </div>

          {/* Auditoria Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-purple-400" />
              Auditoría de Contenido
            </h2>
            <p className="text-white/60 mb-4">
              Evalúa la calidad pedagógica de tus artículos con el framework Anektia.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span>Framework Anektia integrado</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span>7 dimensiones evaluadas</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span>Reportes detallados</span>
              </div>
            </div>
            <a
              href="/admin/auditoria"
              className="mt-4 block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg transition-colors"
            >
              Ir al Auditor →
            </a>
          </motion.div>

          {/* Recent Images */}
          {scanResult && scanResult.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Imágenes Más Grandes</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-white/60 text-sm border-b border-white/10">
                      <th className="pb-3 pr-4">Archivo</th>
                      <th className="pb-3 pr-4">Formato</th>
                      <th className="pb-3 pr-4">Tamaño</th>
                      <th className="pb-3">WebP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResult.images.slice(0, 10).map((img, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="text-sm border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 pr-4 font-mono text-white/80 truncate max-w-xs">
                          {img.relativePath}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            img.format === 'png' 
                              ? 'bg-orange-500/20 text-orange-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {img.format.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-mono text-white/80">
                          {formatBytes(img.size)}
                        </td>
                        <td className="py-3">
                          {img.hasWebP ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-white/40">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
