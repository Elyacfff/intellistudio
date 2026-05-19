import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import { changeLanguage } from '@/i18n';
import { Palette, Globe, Monitor, Keyboard } from 'lucide-react';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { theme, language, windowOpacity, setTheme, setLanguage, setWindowOpacity } = useAppStore();
  const colors = themes[theme];

  const themeOptions = [
    { key: 'aurora', label: t('settings.auroraTheme'), color: '#165DFF' },
    { key: 'night', label: t('settings.nightTheme'), color: '#722ED1' },
    { key: 'amoled', label: t('settings.amoledTheme'), color: '#FFFFFF' },
  ];

  const languageOptions = [
    { key: 'zh', label: '简体中文', flag: '🇨🇳' },
    { key: 'ug', label: 'ئۇيغۇرچە', flag: '🏳️' },
  ];

  const handleLanguageChange = (lng: 'zh' | 'ug') => {
    setLanguage(lng);
    changeLanguage(lng);
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: colors.title }}
          >
            {t('modules.settings')}
          </h1>
          <p style={{ color: colors.muted }}>
            自定义你的创作环境
          </p>
        </motion.div>

        {/* 主题设置 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Palette size={20} style={{ color: colors.primary }} />
            <h2 
              className="text-lg font-semibold"
              style={{ color: colors.title }}
            >
              {t('settings.theme')}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setTheme(option.key as any)}
                className={`
                  p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                  ${theme === option.key ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
                `}
                style={{
                  borderColor: theme === option.key ? option.color : colors.border,
                  backgroundColor: theme === option.key ? `${option.color}15` : 'transparent'
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: colors.title }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 语言设置 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} style={{ color: colors.primary }} />
            <h2 
              className="text-lg font-semibold"
              style={{ color: colors.title }}
            >
              {t('settings.language')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languageOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleLanguageChange(option.key as any)}
                className={`
                  p-4 rounded-xl border-2 transition-all flex items-center gap-3
                  ${language === option.key ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
                `}
                style={{
                  borderColor: language === option.key ? colors.primary : colors.border,
                  backgroundColor: language === option.key ? `${colors.primary}15` : 'transparent'
                }}
              >
                <span className="text-2xl">{option.flag}</span>
                <span 
                  className="font-medium"
                  style={{ color: colors.title }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 窗口透明度 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Monitor size={20} style={{ color: colors.primary }} />
            <h2 
              className="text-lg font-semibold"
              style={{ color: colors.title }}
            >
              {t('settings.opacity')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={windowOpacity}
              onChange={(e) => setWindowOpacity(parseFloat(e.target.value))}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(windowOpacity - 0.5) * 200}%, ${colors.input} ${(windowOpacity - 0.5) * 200}%, ${colors.input} 100%)`
              }}
            />
            <span 
              className="text-sm font-medium w-16 text-right"
              style={{ color: colors.title }}
            >
              {Math.round(windowOpacity * 100)}%
            </span>
          </div>
        </motion.div>

        {/* 快捷键 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Keyboard size={20} style={{ color: colors.primary }} />
            <h2 
              className="text-lg font-semibold"
              style={{ color: colors.title }}
            >
              {t('settings.shortcuts')}
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { keys: 'Ctrl + G', action: '一键生成' },
              { keys: 'Ctrl + E', action: '导出视频' },
              { keys: 'Ctrl + S', action: '保存项目' },
              { keys: 'Ctrl + Z', action: '撤销' },
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2"
              >
                <span style={{ color: colors.body }}>{item.action}</span>
                <div 
                  className="px-3 py-1 rounded-lg text-sm font-mono"
                  style={{ backgroundColor: colors.input, color: colors.muted }}
                >
                  {item.keys}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
