'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Upload, 
  Loader2, 
  Save, 
  Copy, 
  Check,
  X,
  Image as ImageIcon,
  FileCode,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

const PRESET_PATHS = [
  { label: 'components/learning-path/', value: 'components/learning-path/' },
  { label: 'components/environment-engine/', value: 'components/environment-engine/' },
  { label: 'components/ui/', value: 'components/ui/' },
  { label: 'app/admin/', value: 'app/admin/' },
  { label: 'Custom...', value: '__custom__' },
];

export default function AdminStitchPage() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetPath, setTargetPath] = useState('components/learning-path/');
  const [customPath, setCustomPath] = useState('');
  const [fileName, setFileName] = useState('GeneratedComponent.tsx');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setGeneratedCode(null);
      setSaved(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setGeneratedCode(null);
      setSaved(false);
    }
  }

  async function generate() {
    if (!image) {
      showToast('error', 'Sube una imagen primero');
      return;
    }

    setGenerating(true);
    setGeneratedCode(null);
    setSaved(false);

    const formData = new FormData();
    formData.append('image', image);
    
    const finalPath = targetPath === '__custom__' ? customPath : targetPath;
    const fullPath = finalPath.endsWith('/') 
      ? `${finalPath}${fileName}` 
      : `${finalPath}/${fileName}`;
    formData.append('targetPath', fullPath);
    
    if (customPrompt) {
      formData.append('prompt', customPrompt);
    }

    try {
      const res = await fetch('/api/admin/stitch', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.error) {
        showToast('error', data.error);
      } else {
        setGeneratedCode(data.code);
        if (data.savedPath) {
          setSaved(true);
          showToast('success', 'Código generado y guardado', `${data.savedPath} (${data.charCount} chars)`);
        } else {
          showToast('success', 'Código generado', `${data.charCount} caracteres`);
        }
      }
    } catch (error) {
      showToast('error', 'Error al generar código');
    } finally {
      setGenerating(false);
    }
  }

  async function copyCode() {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      showToast('success', 'Código copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function reset() {
    setImage(null);
    setPreview(null);
    setGeneratedCode(null);
    setSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Code2 size={32} className="text-cyan-400" />
          Stitch-to-Code
        </h1>
        <p className="text-white/60 mt-2">
          Convierte diseños y screenshots en componentes React con Gemini Vision
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload & Config */}
        <div className="space-y-6">
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-cyan-400" />
              Imagen de Diseño
            </h3>
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={40} className="text-white/30 mx-auto mb-3" />
                  <p className="text-white/60">Arrastra una imagen o haz click para seleccionar</p>
                  <p className="text-white/30 text-sm mt-1">PNG, JPG, WebP</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </motion.div>

          {/* Output Config */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileCode size={18} className="text-purple-400" />
              Configuración de Salida
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-1">Directorio</label>
                <select
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {PRESET_PATHS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              
              {targetPath === '__custom__' && (
                <div>
                  <label className="block text-white/60 text-sm mb-1">Ruta personalizada</label>
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="components/my-component/"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-white/60 text-sm mb-1">Nombre del archivo</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="GeneratedComponent.tsx"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              
              <div>
                <label className="block text-white/60 text-sm mb-1">
                  Prompt personalizado <span className="text-white/30">(opcional)</span>
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  placeholder="Instrucciones adicionales para la IA..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={generate}
              disabled={!image || generating}
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl flex items-center justify-center gap-3 font-medium transition-all"
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generando código...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generar Componente
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Right: Generated Code */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden sticky top-8"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 size={18} className="text-green-400" />
                Código Generado
              </h3>
              <div className="flex items-center gap-2">
                {generatedCode && (
                  <>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="p-2 text-white/40 hover:text-white/80 transition-colors"
                      title={showPreview ? 'Ocultar preview' : 'Mostrar preview'}
                    >
                      {showPreview ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={copyCode}
                      className="p-2 text-white/40 hover:text-white/80 transition-colors"
                      title="Copiar código"
                    >
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {generating ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="w-20 h-20 border-2 border-cyan-500/30 rounded-full animate-pulse" />
                    <Code2 size={28} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-pulse" />
                  </div>
                  <p className="text-white/40 text-sm mt-4">Gemini está analizando la imagen...</p>
                  <p className="text-white/20 text-xs mt-1">Esto puede tomar unos segundos</p>
                </div>
              ) : generatedCode ? (
                <div>
                  {saved && (
                    <div className="bg-green-500/10 border-b border-green-500/20 px-4 py-2 flex items-center gap-2">
                      <Check size={14} className="text-green-400" />
                      <span className="text-green-400 text-sm">Guardado en {targetPath === '__custom__' ? customPath : targetPath}{fileName}</span>
                    </div>
                  )}
                  {showPreview && preview && (
                    <div className="border-b border-white/10 p-4 bg-black/20">
                      <img src={preview} alt="Source" className="max-h-32 mx-auto rounded" />
                    </div>
                  )}
                  <pre className="p-4 text-sm font-mono text-white/80 overflow-x-auto whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Code2 size={40} className="text-white/10 mb-3" />
                  <p className="text-white/30 text-sm">El código generado aparecerá aquí</p>
                  <p className="text-white/20 text-xs mt-1">Sube una imagen y presiona Generar</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
