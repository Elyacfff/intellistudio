import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Plus,
  Clock,
  Zap,
  FileText,
  Video,
  Mic,
  Subtitles,
  Sparkles,
  TrendingUp,
  Star,
  Users,
  Play
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { theme, setCurrentModule } = useAppStore();
  const colors = themes[theme];
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const recentProjects = [
    { id: 1, name: '咖啡店的相遇', type: '都市爱情', duration: '1:30', progress: 100, updated: '今天' },
    { id: 2, name: '逆袭人生', type: '励志', duration: '2:15', progress: 75, updated: '昨天' },
    { id: 3, name: '古代穿越', type: '古装', duration: '1:45', progress: 50, updated: '3天前' },
    { id: 4, name: '悬疑推理', type: '悬疑', duration: '2:00', progress: 30, updated: '1周前' },
  ];
  
  const quickTemplates = [
    { id: 1, name: '都市爱情短剧', desc: '经典霸道总裁、甜宠剧情', icon: Users, color: colors.primary },
    { id: 2, name: '古风仙侠', desc: '玄幻、修仙、古装题材', icon: Sparkles, color: '#9333ea' },
    { id: 3, name: '悬疑推理', desc: '烧脑剧情、反转结局', icon: TrendingUp, color: '#f59e0b' },
    { id: 4, name: '喜剧搞笑', desc: '轻松幽默、段子剧情', icon: Zap, color: '#10b981' },
  ];
  
  const quickStart = [
    { id: 'script', label: '写剧本', icon: FileText, desc: '开始创作剧本' },
    { id: 'video', label: '生成视频', icon: Video, desc: 'AI 视频生成' },
    { id: 'voice', label: '配音', icon: Mic, desc: '智能配音生成' },
    { id: 'subtitle', label: '加字幕', icon: Subtitles, desc: '自动字幕生成' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: colors.title }}>
      {/* 顶部标题 */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b flex-wrap gap-2" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Sparkles size={24} style={{ color: colors.primary }} />
            欢迎回来！
          </h1>
          <p className="text-xs md:text-sm mt-1 hide-on-mobile" style={{ color: colors.muted }}>今天你想创作什么样的短剧呢？</p>
        </div>
        
        <button
          onClick={() => setCurrentModule('script')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all hover:opacity-80 hover:scale-[1.02]"
          style={{ backgroundColor: colors.primary, color: '#fff' }}
        >
          <Plus size={18} />
          新建项目
        </button>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        <div className="content-max-width mx-auto space-y-6 md:space-y-8" style={{ maxWidth: '1400px' }}>
          
          {/* 快速开始 */}
          <section>
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2">
              <Zap size={18} style={{ color: colors.primary }} />
              快速开始
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {quickStart.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentModule(item.id as any)}
                  className="p-5 rounded-2xl text-left transition-all"
                  style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.primary}15` }}>
                    <item.icon size={24} style={{ color: colors.primary }} />
                  </div>
                  <h3 className="font-bold mb-1">{item.label}</h3>
                  <p className="text-xs" style={{ color: colors.muted }}>{item.desc}</p>
                </motion.button>
              ))}
            </div>
          </section>
          
          {/* 快速模板 */}
          <section>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-bold flex items-center gap-2">
                <Star size={18} style={{ color: colors.primary }} />
                快速模板
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {quickTemplates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentModule('script')}
                  className="p-5 rounded-2xl text-left transition-all group"
                  style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${template.color}15` }}>
                    <template.icon size={28} style={{ color: template.color }} />
                  </div>
                  <h3 className="font-bold mb-1 group-hover:text-white transition-colors">{template.name}</h3>
                  <p className="text-xs" style={{ color: colors.muted }}>{template.desc}</p>
                </motion.button>
              ))}
            </div>
          </section>
          
          {/* 最近项目 */}
          <section>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-bold flex items-center gap-2">
                <Clock size={18} style={{ color: colors.primary }} />
                最近项目
              </h2>
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-2 rounded-lg transition-all"
                  style={{ backgroundColor: viewMode === 'grid' ? `${colors.primary}20` : colors.input, color: viewMode === 'grid' ? colors.primary : colors.muted }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-2 rounded-lg transition-all"
                  style={{ backgroundColor: viewMode === 'list' ? `${colors.primary}20` : colors.input, color: viewMode === 'list' ? colors.primary : colors.muted }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {recentProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group cursor-pointer"
                  >
                    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                      <div className="aspect-video relative flex items-center justify-center" style={{ backgroundColor: `${colors.muted}10` }}>
                        <Video size={48} style={{ color: colors.muted, opacity: 0.3 }} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                            <Play size={28} style={{ color: '#fff' }} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold truncate flex-1">{project.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full ml-2" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                            {project.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-3" style={{ color: colors.muted }}>
                          <span>{project.duration}</span>
                          <span>{project.updated}</span>
                        </div>
                        {project.progress < 100 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs" style={{ color: colors.muted }}>
                              <span>进度</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.muted}20` }}>
                              <div className="h-full rounded-full" style={{ width: `${project.progress}%`, backgroundColor: colors.primary }} />
                            </div>
                          </div>
                        )}
                        {project.progress === 100 && (
                          <div className="flex items-center gap-1 text-xs" style={{ color: colors.success }}>
                            <Star size={12} fill={colors.success} />
                            <span>已完成</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden responsive-table" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: colors.muted }}>项目名称</th>
                      <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: colors.muted }}>类型</th>
                      <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: colors.muted }}>时长</th>
                      <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: colors.muted }}>进度</th>
                      <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: colors.muted }}>更新时间</th>
                      <th className="text-right py-4 px-6 text-xs font-medium" style={{ color: colors.muted }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project.id} style={{ borderBottom: `1px solid ${colors.border}` }} className="hover:bg-opacity-50">
                        <td className="py-3 md:py-4 px-4 md:px-6" data-label="项目名称">
                          <div className="font-medium" style={{ color: colors.title }}>{project.name}</div>
                        </td>
                        <td className="py-3 md:py-4 px-4 md:px-6" data-label="类型">
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                            {project.type}
                          </span>
                        </td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-sm" style={{ color: colors.body }} data-label="时长">{project.duration}</td>
                        <td className="py-3 md:py-4 px-4 md:px-6" data-label="进度">
                          <div className="flex items-center gap-3">
                            <div className="w-16 md:w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.muted}20` }}>
                              <div className="h-full" style={{ width: `${project.progress}%`, backgroundColor: colors.primary }} />
                            </div>
                            <span className="text-xs" style={{ color: colors.muted }}>{project.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-sm" style={{ color: colors.muted }} data-label="更新">{project.updated}</td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-right" data-label="操作">
                          <button className="text-sm px-3 py-1.5 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: colors.input, color: colors.body }}>
                            打开
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;