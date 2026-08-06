'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Package, 
  Gem, 
  Image as ImageIcon, 
  Trash2, 
  Edit2, 
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  createAsset, 
  getAllAssets, 
  deleteAsset, 
  updateAssetImage,
  type AssetMetadata,
  type UploadAssetInput 
} from '@/lib/adminAssets';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

type AssetType = 'all' | 'furniture' | 'relic' | 'decoration' | 'scientific' | 'plants' | 'books';

const TYPE_OPTIONS = [
  { value: 'furniture', label: 'Mueble' },
  { value: 'relic', label: 'Reliquia' },
  { value: 'decoration', label: 'Decoración' },
  { value: 'scientific', label: 'Científico' },
  { value: 'plants', label: 'Planta' },
  { value: 'books', label: 'Libro' },
];

const DISCIPLINE_OPTIONS = [
  { value: 'physics', label: 'Física' },
  { value: 'mathematics', label: 'Matemáticas' },
  { value: 'computer_science', label: 'Informática' },
  { value: 'philosophy', label: 'Filosofía' },
  { value: 'biology', label: 'Biología' },
  { value: 'general', label: 'General' },
];

const RARITY_OPTIONS = [
  { value: 'common', label: 'Común', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Poco común', color: 'text-green-400' },
  { value: 'rare', label: 'Raro', color: 'text-blue-400' },
  { value: 'epic', label: 'Épico', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendario', color: 'text-orange-400' },
];

const SURFACE_OPTIONS = [
  { value: 'floor', label: 'Piso' },
  { value: 'wall', label: 'Pared' },
  { value: 'desk', label: 'Escritorio' },
];

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<UploadAssetInput>({
    name: '',
    description: '',
    type: 'furniture',
    discipline: 'physics',
    rarity: 'common',
    category: 'furniture',
    placementSurface: 'floor',
    canRotate: false,
    footprintTileWidth: 2,
    footprintTileHeight: 2,
    pixelWidth: 128,
    pixelHeight: 128,
    anchorX: 0.5,
    anchorY: 0.85,
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }

  function handleInputChange(field: keyof UploadAssetInput, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'type') {
      setFormData(prev => ({ ...prev, [field]: value, category: value as any }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      showToast('error', 'Selecciona una imagen');
      return;
    }
    if (!formData.name.trim()) {
      showToast('error', 'Ingresa un nombre');
      return;
    }

    setUploading(true);
    try {
      await createAsset(formData, file);
      showToast('success', 'Asset creado', `${formData.name} añadido correctamente`);
      setFile(null);
      setPreview(null);
      setFormData({
        name: '',
        description: '',
        type: 'furniture',
        discipline: 'physics',
        rarity: 'common',
        category: 'furniture',
        placementSurface: 'floor',
        canRotate: false,
        footprintTileWidth: 2,
        footprintTileHeight: 2,
        pixelWidth: 128,
        pixelHeight: 128,
        anchorX: 0.5,
        anchorY: 0.85,
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating asset:', error);
      showToast('error', 'Error al crear asset', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Plus size={20} className="text-blue-400" />
        Nuevo Asset
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Imagen</label>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-white/40 transition-colors">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black/70"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload size={32} className="text-white/40 mx-auto mb-2" />
                <p className="text-white/60 text-sm">Click para seleccionar imagen</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {file && <p className="text-white/40 text-xs mt-2 truncate">{file.name}</p>}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              placeholder="Ej: Telescopio Barroco"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Descripción del asset..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/60 text-sm mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              >
                {TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1">Disciplina</label>
              <select
                value={formData.discipline}
                onChange={(e) => handleInputChange('discipline', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              >
                {DISCIPLINE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/60 text-sm mb-1">Rareza</label>
              <select
                value={formData.rarity}
                onChange={(e) => handleInputChange('rarity', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              >
                {RARITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1">Superficie</label>
              <select
                value={formData.placementSurface}
                onChange={(e) => handleInputChange('placementSurface', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              >
                {SURFACE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/60 text-sm mb-1">Ancho (tiles)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.footprintTileWidth}
                onChange={(e) => handleInputChange('footprintTileWidth', parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1">Alto (tiles)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.footprintTileHeight}
                onChange={(e) => handleInputChange('footprintTileHeight', parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="canRotate"
              checked={formData.canRotate}
              onChange={(e) => handleInputChange('canRotate', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="canRotate" className="text-white/80 text-sm">Puede rotar</label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading || !file || !formData.name.trim()}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:text-white/40 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Subiendo...
          </>
        ) : (
          <>
            <Upload size={18} />
            Subir Asset
          </>
        )}
      </button>
    </form>
  );
}

function AssetCard({ asset, onDelete, onRefresh }: { 
  asset: AssetMetadata & { id: string }; 
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleImageReplace(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await updateAssetImage(asset.id, file);
      showToast('success', 'Imagen actualizada');
      onRefresh();
    } catch (error) {
      showToast('error', 'Error al actualizar imagen');
    } finally {
      setUploading(false);
    }
  }

  const rarityInfo = RARITY_OPTIONS.find(r => r.value === asset.rarity);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group"
      >
        <div className="relative aspect-square bg-black/20">
          <img 
            src={asset.imageUrl} 
            alt={asset.name}
            className="w-full h-full object-contain p-4"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className={`p-2 rounded-full cursor-pointer transition-colors ${uploading ? 'bg-white/10' : 'bg-white/20 hover:bg-white/30'}`}>
              {uploading ? <Loader2 className="text-white animate-spin" size={18} /> : <Edit2 className="text-white" size={18} />}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageReplace}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
            >
              <Trash2 className="text-red-400" size={18} />
            </button>
          </div>
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium ${rarityInfo?.color || 'text-gray-400'} bg-black/50`}>
            {rarityInfo?.label || asset.rarity}
          </span>
        </div>
        <div className="p-3">
          <h4 className="text-white font-medium text-sm truncate">{asset.name}</h4>
          <p className="text-white/40 text-xs mt-1">{TYPE_OPTIONS.find(t => t.value === asset.type)?.label}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-white/30">
            <span>{asset.footprintTileWidth}×{asset.footprintTileHeight}</span>
            <span>•</span>
            <span>{asset.placementSurface}</span>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDelete(asset.id)}
        title="Eliminar Asset"
        message={`¿Estás seguro de eliminar "${asset.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </>
  );
}

export default function AdminAssetsPage() {
  const { showToast } = useToast();
  const [assets, setAssets] = useState<(AssetMetadata & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AssetType>('all');

  async function fetchAssets() {
    try {
      const data = await getAllAssets();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      showToast('error', 'Error al cargar assets');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(assetId: string) {
    try {
      await deleteAsset(assetId);
      showToast('success', 'Asset eliminado');
      fetchAssets();
    } catch (error) {
      showToast('error', 'Error al eliminar asset');
    }
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = filter === 'all' 
    ? assets 
    : assets.filter(a => a.type === filter);

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Package size={32} className="text-blue-400" />
          Gestión de Assets
        </h1>
        <p className="text-white/60 mt-2">
          Sube y gestiona imágenes para muebles y reliquias
        </p>
      </motion.div>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <UploadForm onSuccess={fetchAssets} />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          Todos ({assets.length})
        </button>
        {TYPE_OPTIONS.map(opt => {
          const count = assets.filter(a => a.type === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as AssetType)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === opt.value ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </motion.div>

      {/* Assets Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-white" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Package size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No hay assets aún</p>
          <p className="text-white/30 text-sm mt-1">Sube tu primer asset usando el formulario de arriba</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {filteredAssets.map(asset => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                onDelete={handleDelete}
                onRefresh={fetchAssets}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
