import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, FileText, Video, Mic, Subtitles, Folder, Download, Settings, Home, Sparkles } from 'lucide-react';
import { useAppStore, themes } from '../store/appStore';

interface SearchItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  module: string;
  shortcut?: string;
}

const SearchModal: React.FC = () => {
  const { theme, setCurrentModule, addToast } = useAppStore();
  const colors = themes[theme];
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchItems: SearchItem[] = [
    { id: 'dashboard', label: '工作台', description: '项目概览与快速开始', icon: <Home size={18} />, module: 'dashboard', shortcut: 'Ctrl+1' },
    { id: 'script', label: '剧本编辑', description: 'AI 辅助剧本创作', icon: <FileText size={18} />, module: 'script', shortcut: 'Ctrl+2' },
    { id: 'storyboard', label: '分镜设计', description: '可视化分镜规划', icon: <Video size={18} />, module: 'storyboard', shortcut: 'Ctrl+3' },
    { id: 'video', label: '视频生成', description: 'AI 视频生成与编辑', icon: <Video size={18} />, module: 'video', shortcut: 'Ctrl+4' },
    { id: 'assets', label: '素材管理', description: '管理角色、场景、音频素材', icon: <Folder size={18} />, module: 'assets', shortcut: 'Ctrl+5' },
    { id: 'voice', label: '音频配音', description: '声音克隆与配音合成', icon: <Mic size={18} />, module: 'voice', shortcut: 'Ctrl+6' },
    { id: 'subtitle', label: '字幕制作', description: '智能字幕生成与编辑', icon: <Subtitles size={18} />, module: 'subtitle', shortcut: 'Ctrl+7' },
    { id: 'export', label: '导出设置', description: '多平台格式导出', icon: <Download size={18} />, module: 'export', shortcut: 'Ctrl+8' },
    { id: 'intelli', label: 'IntelliStudio', description: 'AI 智能一站式创作', icon: <Sparkles size={18} />, module: 'intelli', shortcut: 'Ctrl+I' },
    { id: 'settings', label: '设置', description: '主题、语言、偏好设置', icon: <Settings size={18} />, module: 'settings', shortcut: 'Ctrl+,' },
  ];

  const filteredItems = query.trim()
    ? searchItems.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    setCurrentModule(item.module);
    addToast({ type: 'info', title: `已切换到: ${item.label}` });
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[9999] w-[560px] max-w-[90vw]"
          >
            <div 
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: colors.border }}>
                <Search size={20} style={{ color: colors.muted }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="搜索功能、模块..."
                  className="flex-1 bg-transparent outline-none text-base"
                  style={{ color: colors.title }}
                />
                <kbd className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: colors.input, color: colors.muted }}>
                  ESC
                </kbd>
              </div>
              <div className="max-h-[320px] overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: colors.muted }}>
                    未找到匹配结果
                  </div>
                ) : (
                  filteredItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                      style={{
                        backgroundColor: index === selectedIndex ? `${colors.primary}15` : 'transparent',
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm" style={{ color: colors.title }}>
                          {item.label}
                        </div>
                        <div className="text-xs" style={{ color: colors.muted }}>
                          {item.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.shortcut && (
                          <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: colors.input, color: colors.muted }}>
                            {item.shortcut}
                          </kbd>
                        )}
                        <ArrowRight size={14} style={{ color: colors.muted }} />
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;