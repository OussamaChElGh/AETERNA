'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  Image as ImageIcon, 
  ShieldCheck, 
  HardDrive, 
  TrendingDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { StatCard } from '@/components/admin/StatCard';
import { DistributionChart } from '@/components/admin/DistributionChart';
import { SkeletonCard } from '@/components/admin/SkeletonCard';

interface ScanResult {
  totalImages: number;
  totalSize: number;
  images: any[];
  pngCount: number;
  webpCount: number;
  potentialSavings: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminDashboard() {
  const { data: scanResult, error, isLoading } = useSWR<ScanResult>('/api/admin/images/scan', fetcher, {
    revalidateOnFocus: false
  });

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl mb-8">
          Error cargando datos: {error.message}
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
