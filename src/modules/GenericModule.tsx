import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import { Settings } from 'lucide-react';

interface GenericModuleProps {
  moduleName: string;
}

const GenericModule: React.FC<GenericModuleProps> = ({ moduleName }) => {
  const { t } = useTranslation();
  const { theme } = useAppStore();
  const colors = themes[theme];

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 rounded-2xl text-center"
      >
        <div 
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${colors.primary}20` }}
        >
          <Settings size={40} style={{ color: colors.primary }} />
        </div>
        <h2 
          className="text-xl font-bold mb-2"
          style={{ color: colors.title }}
        >
          {t(`modules.${moduleName}`)}
        </h2>
        <p style={{ color: colors.muted }}>
          功能开发中，敬请期待...
        </p>
      </motion.div>
    </div>
  );
};

export default GenericModule;
