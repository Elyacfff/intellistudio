import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Sparkles,
  Home,
  FileText,
  Clapperboard,
  Video,
  FolderOpen,
  Mic,
  Subtitles,
  Download,
  Settings,
  Plus,
  History,
  ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { 
    theme, 
    language, 
    sidebarCollapsed, 
    currentModule,
    setCurrentModule,
    toggleSidebar 
  } = useAppStore();
  
  const colors = themes[theme];
  const isRTL = language === 'ug';

  const navItems = [
    { id: 'dashboard', icon: Home, label: '工作台', active: currentModule === 'dashboard' },
    { id: 'intelli', icon: Sparkles, label: 'IntelliStudio', active: currentModule === 'intelli' },
    { id: 'script', icon: FileText, label: '剧本编辑', active: currentModule === 'script' },
    { id: 'storyboard', icon: Clapperboard, label: '分镜设计', active: currentModule === 'storyboard' },
    { id: 'video', icon: Video, label: '视频生成', active: currentModule === 'video' },
    { id: 'assets', icon: FolderOpen, label: '素材管理', active: currentModule === 'assets' },
    { id: 'voice', icon: Mic, label: '音频配音', active: currentModule === 'voice' },
    { id: 'subtitle', icon: Subtitles, label: '字幕制作', active: currentModule === 'subtitle' },
    { id: 'export', icon: Download, label: '导出设置', active: currentModule === 'export' },
  ];

  const recentProjects = [
    { id: 1, name: '咖啡店的相遇', time: '今天' },
    { id: 2, name: '逆袭人生', time: '昨天' },
    { id: 3, name: '古代穿越', time: '3天前' },
  ];

  const quickTemplates = [
    { id: 1, name: '都市爱情', desc: '30集竖屏' },
    { id: 2, name: '古风仙侠', desc: '玄幻故事' },
    { id: 3, name: '悬疑推理', desc: '烧脑剧情' },
    { id: 4, name: '喜剧搞笑', desc: '轻松幽默' },
  ];

  return (
    <div
      className="h-full flex flex-col border-r relative"
      style={{ 
        width: sidebarCollapsed ? 64 : 280,
        backgroundColor: colors.card,
        borderColor: colors.border,
        transition: 'width 0.2s ease'
      }}
    >
      {/* Logo区域 */}
      <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: colors.border }}>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${colors.primary}20` }}
        >
          <Sparkles style={{ color: colors.primary }} size={22} />
        </div>
        {!sidebarCollapsed && (
          <div>
            <h2 className="font-bold text-base">IntelliStudio</h2>
            <p className="text-xs" style={{ color: colors.muted }}>AI 智能创作平台</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 新建项目按钮 */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <button
              onClick={() => setCurrentModule('dashboard')}
              className="w-full py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: colors.primary, color: '#fff' }}
            >
              <Plus size={18} />
              新建项目
            </button>
          </div>
        )}

        {/* 主导航 */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setCurrentModule(item.id as any)}
                className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${item.active ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: item.active ? `${colors.primary}20` : 'transparent',
                  borderColor: item.active ? colors.primary : 'transparent',
                  color: item.active ? colors.primary : colors.muted
                }}
              >
                <item.icon size={18} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            {/* 快速模板 */}
            <div className="px-4 py-3 border-t" style={{ borderColor: colors.border }}>
              <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: colors.muted }}>
                快速模板
              </h3>
              <div className="space-y-2">
                {quickTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setCurrentModule('script')}
                    className="w-full p-2.5 rounded-lg text-left transition-all hover:opacity-80"
                    style={{ backgroundColor: colors.input }}
                  >
                    <div className="font-medium text-xs" style={{ color: colors.title }}>{template.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: colors.muted }}>{template.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 最近项目 */}
            <div className="px-4 py-3 border-t" style={{ borderColor: colors.border }}>
              <h3 className="text-xs font-semibold uppercase mb-3 flex items-center gap-2" style={{ color: colors.muted }}>
                <History size={12} />
                最近项目
              </h3>
              <div className="space-y-1">
                {recentProjects.map((project) => (
                  <button
                    key={project.id}
                    className="w-full p-2 rounded-lg text-left flex items-center gap-2.5 transition-all hover:opacity-80"
                  >
                    <FolderOpen size={14} style={{ color: colors.muted }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs truncate" style={{ color: colors.title }}>{project.name}</div>
                      <div className="text-xs" style={{ color: colors.muted }}>{project.time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 底部设置 */}
        <div className="p-3 border-t mt-auto" style={{ borderColor: colors.border }}>
          <button
            onClick={() => setCurrentModule('settings')}
            className="w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all hover:opacity-80"
            style={{ 
              backgroundColor: currentModule === 'settings' ? `${colors.primary}20` : 'transparent',
              color: currentModule === 'settings' ? colors.primary : colors.muted
            }}
          >
            <Settings size={18} />
            {!sidebarCollapsed && <span className="text-sm font-medium">设置</span>}
          </button>
        </div>
      </div>

      {/* 折叠按钮 */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center rounded-lg border transition-all hover:opacity-80 no-drag"
        style={{
          [isRTL ? 'left' : 'right']: -12,
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.muted
        }}
      >
        <ChevronRight 
          size={14} 
          style={{ 
            transform: isRTL 
              ? (sidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)')
              : (sidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)')
          }} 
        />
      </button>
    </div>
  );
};

export default Sidebar;