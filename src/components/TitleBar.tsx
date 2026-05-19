import React from 'react';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import { Minus, Square, X, Zap } from 'lucide-react';

const TitleBar: React.FC = () => {
  const { theme, language } = useAppStore();
  const colors = themes[theme];
  const isRTL = language === 'ug';

  const handleMinimize = () => {
    // Tauri minimize
  };

  const handleMaximize = () => {
    // Tauri maximize
  };

  const handleClose = () => {
    // Tauri close
  };

  return (
    <div 
      className="drag-region flex items-center justify-between px-4 h-9 border-b mobile-titlebar"
      style={{ 
        backgroundColor: colors.card,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center gap-2">
        <Zap size={18} style={{ color: colors.primary }} className="no-drag" />
        <span 
          className="text-sm font-semibold no-drag"
          style={{ color: colors.title }}
        >
          Drama Studio Pro
        </span>
      </div>

      <div className="flex items-center gap-2 no-drag titlebar-controls">
        <button
          onClick={handleMinimize}
          className="w-8 h-8 flex items-center justify-center rounded hover:opacity-70 transition-opacity"
          style={{ color: colors.muted }}
        >
          <Minus size={16} />
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-8 flex items-center justify-center rounded hover:opacity-70 transition-opacity"
          style={{ color: colors.muted }}
        >
          <Square size={14} />
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-500/20 hover:text-red-500 transition-all"
          style={{ color: colors.muted }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
