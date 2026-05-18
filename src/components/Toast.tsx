import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useAppStore, themes } from '../store/appStore';

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const Toast: React.FC = () => {
  const { toasts, removeToast, theme } = useAppStore();
  const colors = themes[theme];

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          const color = colorMap[toast.type];

          return (
            <ToastItem
              key={toast.id}
              toast={toast}
              icon={<Icon size={18} style={{ color }} />}
              color={color}
              colors={colors}
              onClose={() => removeToast(toast.id)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: { id: string; type: string; title: string; message?: string; duration?: number };
  icon: React.ReactNode;
  color: string;
  colors: any;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, icon, color, colors, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl min-w-[320px] max-w-[420px]"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${color}30`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm" style={{ color: colors.title }}>
          {toast.title}
        </div>
        {toast.message && (
          <div className="text-xs mt-1" style={{ color: colors.muted }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
        style={{ color: colors.muted }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export default Toast;