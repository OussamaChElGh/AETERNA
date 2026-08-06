'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: ReactNode;
}

const VARIANT_STYLES = {
  danger: {
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    confirmBg: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    confirmBg: 'bg-orange-600 hover:bg-orange-700',
  },
  info: {
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    confirmBg: 'bg-blue-600 hover:bg-blue-700',
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  icon,
}: ConfirmModalProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`${styles.iconBg} p-3 rounded-full`}>
                  {icon || <AlertTriangle size={24} className={styles.iconColor} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-white/60 text-sm mt-1">{message}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white/80 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-white/60 hover:text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${styles.confirmBg}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
