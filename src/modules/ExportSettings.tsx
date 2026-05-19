import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Download,
  Settings,
  Video,
  FileVideo,
  Music,
  Subtitles,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';

interface ExportPreset {
  id: string;
  name: string;
  description: string;
  resolution: string;
  format: string;
}

const ExportSettings: React.FC = () => {
  const { theme } = useAppStore();
  const colors = themes[theme];
  
  const [exportPreset, setExportPreset] = useState<string>('tiktok');
  const [customResolution, setCustomResolution] = useState('1080x1920');
  const [customFormat, setCustomFormat] = useState('mp4');
  const [quality, setQuality] = useState(80);
  const [fps, setFps] = useState(30);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const presets: ExportPreset[] = [
    { id: 'tiktok', name: '抖音/ TikTok', description: '9:16 竖屏，1080x1920', resolution: '1080x1920', format: 'mp4' },
    { id: 'youtube', name: 'YouTube 短视频', description: '9:16 竖屏，1080x1920', resolution: '1080x1920', format: 'mp4' },
    { id: 'bilibili', name: 'B 站', description: '16:9 横屏，1920x1080', resolution: '1920x1080', format: 'mp4' },
    { id: 'instagram', name: 'Instagram', description: '1:1 正方形，1080x1080', resolution: '1080x1080', format: 'mp4' },
  ];

  const startExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExporting(false), 500);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 300);
  };

  const selectPreset = (preset: ExportPreset) => {
    setExportPreset(preset.id);
    setCustomResolution(preset.resolution);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: colors.title }}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Download size={20} style={{ color: colors.primary }} />
            导出设置
          </h2>
        </div>
        
        <button
          onClick={startExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: colors.primary, color: '#fff' }}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              正在导出...
            </>
          ) : (
            <>
              <Download size={16} />
              开始导出
            </>
          )}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：预设 */}
        <div className="w-80 flex-shrink-0 border-r flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm">导出预设</h3>
            <p className="text-xs mt-1" style={{ color: colors.muted }}>选择适合的平台预设</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {presets.map((preset) => (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => selectPreset(preset)}
                className={`w-full p-4 rounded-xl text-left transition-all ${exportPreset === preset.id ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: exportPreset === preset.id ? `${colors.primary}20` : colors.input,
                  borderColor: exportPreset === preset.id ? colors.primary : 'transparent'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-sm" style={{ color: exportPreset === preset.id ? colors.primary : colors.title }}>
                    {preset.name}
                  </div>
                  {exportPreset === preset.id && (
                    <CheckCircle2 size={16} style={{ color: colors.primary }} />
                  )}
                </div>
                <p className="text-xs" style={{ color: colors.muted }}>{preset.description}</p>
              </motion.button>
            ))}
            
            <button
              onClick={() => setExportPreset('custom')}
              className={`w-full p-4 rounded-xl text-left transition-all ${exportPreset === 'custom' ? 'ring-2' : ''}`}
              style={{
                backgroundColor: exportPreset === 'custom' ? `${colors.primary}20` : colors.input,
                borderColor: exportPreset === 'custom' ? colors.primary : 'transparent'
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-sm flex items-center gap-2" style={{ color: exportPreset === 'custom' ? colors.primary : colors.title }}>
                  <Settings size={16} />
                  自定义设置
                </div>
                {exportPreset === 'custom' && (
                  <CheckCircle2 size={16} style={{ color: colors.primary }} />
                )}
              </div>
              <p className="text-xs" style={{ color: colors.muted }}>完全自定义导出参数</p>
            </button>
          </div>
        </div>

        {/* 中间：详细设置 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* 进度条 */}
            {isExporting && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl"
                style={{ backgroundColor: `${colors.primary}10`, border: `1px solid ${colors.primary}20` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={18} style={{ color: colors.primary }} />
                  <span className="font-medium">正在导出视频...</span>
                  <span className="ml-auto text-sm" style={{ color: colors.muted }}>{Math.round(exportProgress)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.muted}20` }}>
                  <div 
                    className="h-full transition-all duration-300"
                    style={{ width: `${exportProgress}%`, backgroundColor: colors.primary }}
                  />
                </div>
              </motion.div>
            )}
            
            {/* 视频设置 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Video size={18} style={{ color: colors.primary }} />
                视频设置
              </h3>
              <div className="p-4 rounded-xl space-y-4" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>分辨率</label>
                    <select
                      value={customResolution}
                      onChange={(e) => setCustomResolution(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                    >
                      <option value="1080x1920">1080 x 1920 (竖屏)</option>
                      <option value="1920x1080">1920 x 1080 (横屏)</option>
                      <option value="1080x1080">1080 x 1080 (方形)</option>
                      <option value="720x1280">720 x 1280</option>
                      <option value="4K">3840 x 2160 (4K)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>视频格式</label>
                    <select
                      value={customFormat}
                      onChange={(e) => setCustomFormat(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                    >
                      <option value="mp4">MP4 (H.264)</option>
                      <option value="mov">MOV (ProRes)</option>
                      <option value="avi">AVI</option>
                      <option value="mkv">MKV</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>
                      视频质量: {quality}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>
                      帧率: {fps} fps
                    </label>
                    <select
                      value={fps}
                      onChange={(e) => setFps(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                    >
                      <option value={24}>24 fps (电影)</option>
                      <option value={30}>30 fps (标准)</option>
                      <option value={60}>60 fps (流畅)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 导出内容 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileVideo size={18} style={{ color: colors.primary }} />
                导出内容
              </h3>
              <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                {[
                  { id: 'video', icon: Video, label: '视频文件', checked: true },
                  { id: 'audio', icon: Music, label: '独立音频文件', checked: true },
                  { id: 'subtitles', icon: Subtitles, label: '字幕文件', checked: true },
                  { id: 'thumbnail', icon: Video, label: '缩略图', checked: false },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:opacity-80" style={{ backgroundColor: colors.input }}>
                    <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4" />
                    <item.icon size={16} style={{ color: colors.muted }} />
                    <span className="text-sm" style={{ color: colors.body }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* 高级设置 */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings size={18} style={{ color: colors.primary }} />
                高级设置
              </h3>
              <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                {[
                  { label: '开启硬件加速', desc: '使用 GPU 加速导出', checked: true },
                  { label: '自动补帧', desc: '智能生成过渡帧，更流畅', checked: true },
                  { label: '优化文件大小', desc: '在画质和文件大小间平衡', checked: true },
                  { label: '添加水印', desc: '在视频中添加品牌水印', checked: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:opacity-80" style={{ backgroundColor: colors.input }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.body }}>{item.label}</div>
                      <div className="text-xs" style={{ color: colors.muted }}>{item.desc}</div>
                    </div>
                    <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：预览和信息 */}
        <div className="w-80 flex-shrink-0 border-l flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm">导出预览</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 预览框 */}
            <div className="aspect-[9/16] rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.input }}>
              <Video size={40} style={{ color: colors.muted, opacity: 0.3 }} />
            </div>
            
            {/* 文件信息 */}
            <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: colors.input }}>
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Settings size={14} style={{ color: colors.muted }} />
                文件信息
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span style={{ color: colors.muted }}>预计文件大小</span>
                  <span style={{ color: colors.body }}>~ 150 MB</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.muted }}>预计导出时间</span>
                  <span style={{ color: colors.body }}>2-5 分钟</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.muted }}>视频时长</span>
                  <span style={{ color: colors.body }}>1:30</span>
                </div>
              </div>
            </div>
            
            {/* 快速操作 */}
            <div className="space-y-2">
              <button className="w-full p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                <Zap size={16} />
                智能优化导出
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSettings;