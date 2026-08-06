'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Settings,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface ImageInfo {
  path: string;
  relativePath: string;
  size: number;
  format: string;
  width?: number;
  height?: number;
  hasWebP: boolean;
  webpSize?: number;
  savings?: number;
}

interface ScanResult {
  totalImages: number;
  totalSize: number;
  images: ImageInfo[];
  pngCount: number;
  webpCount: number;
  potentialSavings: number;
}

interface ConvertResult {
  success: boolean;
  originalPath: string;
  webpPath: string;
  originalSize: number;
  webpSize: number;
  savings: number;
  savingsPercent: number;
}

type FilterType = 'all' | 'pending' | 'converted' | 'png' | 'webp';

function StatCard({ label, value, color, index }: { label: string; value: string | number; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4"
    >
      <p className="text-white/60 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </motion.div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t border-white/5 animate-pulse">
      <td className="p-4"><div className="w-4 h-4 bg-white/10 rounded" /></td>
      <td className="p-4"><div className="w-48 h-4 bg-white/10 rounded" /></td>
      <td className="p-4"><div className="w-16 h-4 bg-white/10 rounded" /></td>
      <td className="p-4"><div className="w-12 h-4 bg-white/10 rounded" /></td>
      <td className="p-4"><div className="w-20 h-4 bg-white/10 rounded" /></td>
    </tr>
  );
}

export default function ImageOptimizerPage() {
  const { showToast } = useToast();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [conversionResults, setConversionResults] = useState<ConvertResult[] | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [quality, setQuality] = useState(80);
  const [lossless, setLossless] = useState(false);
  const [deleteOriginal, setDeleteOriginal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

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
      showToast('error', 'Error al cargar imágenes', 'No se pudieron obtener los datos');
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

  function toggleImage(path: string) {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedImages(newSelected);
  }

  function selectAll() {
    const filtered = getFilteredImages();
    const selectable = filtered.filter(img => img.format === 'png' && !img.hasWebP);
    setSelectedImages(new Set(selectable.map(img => img.relativePath)));
  }

  function deselectAll() {
    setSelectedImages(new Set());
  }

  function getFilteredImages(): ImageInfo[] {
    if (!scanResult) return [];
    
    let images = scanResult.images;
    
    if (searchQuery) {
      images = images.filter(img => 
        img.relativePath.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch (filter) {
      case 'pending':
        images = images.filter(img => img.format === 'png' && !img.hasWebP);
        break;
      case 'converted':
        images = images.filter(img => img.hasWebP);
        break;
      case 'png':
        images = images.filter(img => img.format === 'png');
        break;
      case 'webp':
        images = images.filter(img => img.format === 'webp');
        break;
    }
    
    return images;
  }

  async function convertSelected() {
    if (selectedImages.size === 0) return;

    setConverting(true);
    setConversionResults(null);

    try {
      const res = await fetch('/api/admin/images/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths: Array.from(selectedImages),
          quality,
          lossless,
          deleteOriginal,
        }),
      });

      const data = await res.json();
      setConversionResults(data.results);
      
      const successCount = data.results.filter((r: ConvertResult) => r.success).length;
      const totalSavings = data.results.reduce((sum: number, r: ConvertResult) => sum + r.savings, 0);
      
      showToast('success', 'Conversión completada', 
        `${successCount} imágenes convertidas. Ahorro: ${formatBytes(totalSavings)}`
      );
      
      await fetchScanData();
      setSelectedImages(new Set());
    } catch (error) {
      console.error('Error converting images:', error);
      showToast('error', 'Error en la conversión', 'Algunas imágenes no se pudieron convertir');
    } finally {
      setConverting(false);
    }
  }

  const filteredImages = getFilteredImages();
  const pngWithoutWebP = scanResult?.images.filter(img => img.format === 'png' && !img.hasWebP) || [];
  const totalSelectedSize = Array.from(selectedImages).reduce((sum, path) => {
    const img = scanResult?.images.find(i => i.relativePath === path);
    return sum + (img?.size || 0);
  }, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ImageIcon size={32} className="text-blue-400" />
          Optimizador de Imágenes
        </h1>
        <p className="text-white/60 mt-2">
          Convierte PNG a WebP para reducir el tamaño sin perder calidad
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total PNG" value={scanResult?.pngCount || 0} color="text-blue-400" index={0} />
        <StatCard label="Ya Convertidos" value={scanResult?.webpCount || 0} color="text-green-400" index={1} />
        <StatCard label="Pendientes" value={pngWithoutWebP.length} color="text-orange-400" index={2} />
        <StatCard 
          label="Ahorro Total" 
          value={scanResult ? formatBytes(scanResult.potentialSavings) : '0 B'} 
          color="text-purple-400" 
          index={3} 
        />
      </div>

      {/* Conversion Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings size={20} className="text-purple-400" />
          Configuración
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Calidad: {quality}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={lossless}
              className="w-full"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lossless}
                onChange={(e) => setLossless(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-white/80">Sin pérdida (lossless)</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteOriginal}
                onChange={(e) => setDeleteOriginal(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-white/80">Eliminar PNG original</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Buscar imágenes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-white/40" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="converted">Convertidas</option>
              <option value="png">Solo PNG</option>
              <option value="webp">Solo WebP</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={selectAll}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Seleccionar todos
          </button>
          <button
            onClick={deselectAll}
            className="text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            Deseleccionar
          </button>
          <span className="text-white/60 text-sm">
            {selectedImages.size} seleccionados ({formatBytes(totalSelectedSize)})
          </span>
        </div>
        <button
          onClick={convertSelected}
          disabled={selectedImages.size === 0 || converting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:text-white/40 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {converting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Convirtiendo...
            </>
          ) : (
            <>
              <Download size={18} />
              Convertir a WebP
            </>
          )}
        </button>
      </motion.div>

      {/* Conversion Results */}
      <AnimatePresence>
        {conversionResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle size={20} />
                Conversión Completada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Convertidos</p>
                  <p className="text-xl font-bold text-white">
                    {conversionResults.filter(r => r.success).length}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Ahorro Total</p>
                  <p className="text-xl font-bold text-green-400">
                    {formatBytes(conversionResults.reduce((sum, r) => sum + r.savings, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Reducción Promedio</p>
                  <p className="text-xl font-bold text-blue-400">
                    {(conversionResults.reduce((sum, r) => sum + r.savingsPercent, 0) / conversionResults.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-white/60 text-sm">
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedImages.size > 0 && selectedImages.size === filteredImages.filter(img => img.format === 'png' && !img.hasWebP).length}
                    onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                    className="w-4 h-4"
                  />
                </th>
                <th className="p-4">Archivo</th>
                <th className="p-4">Dimensiones</th>
                <th className="p-4">Tamaño</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
              ) : filteredImages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">
                    No se encontraron imágenes
                  </td>
                </tr>
              ) : (
                filteredImages.map((img, idx) => {
                  const isSelectable = img.format === 'png' && !img.hasWebP;
                  const isSelected = selectedImages.has(img.relativePath);
                  
                  return (
                    <motion.tr
                      key={img.path}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.5) }}
                      className={`border-t border-white/5 ${
                        isSelected ? 'bg-blue-500/10' : ''
                      } ${isSelectable ? 'cursor-pointer hover:bg-white/5' : 'opacity-60'} transition-colors`}
                      onClick={() => isSelectable && toggleImage(img.relativePath)}
                    >
                      <td className="p-4">
                        {isSelectable && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleImage(img.relativePath)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4"
                          />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm text-white/80 truncate max-w-xs">
                          {img.relativePath}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-white/60">
                        {img.width && img.height ? `${img.width}×${img.height}` : '—'}
                      </td>
                      <td className="p-4 font-mono text-sm text-white/80">
                        {formatBytes(img.size)}
                      </td>
                      <td className="p-4">
                        {img.hasWebP ? (
                          <span className="flex items-center gap-1 text-green-400 text-sm">
                            <CheckCircle size={14} />
                            WebP
                          </span>
                        ) : img.format === 'png' ? (
                          <span className="flex items-center gap-1 text-orange-400 text-sm">
                            <AlertCircle size={14} />
                            Pendiente
                          </span>
                        ) : (
                          <span className="text-white/40 text-sm">—</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
