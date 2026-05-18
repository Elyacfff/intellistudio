import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Subtitles,
  Play,
  Pause,
  Plus,
  Trash2,
  Download,
  Upload,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface SubtitleItem {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
  isActive: boolean;
}

const SubtitleEditor: React.FC = () => {
  const { theme } = useAppStore();
  const colors = themes[theme];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState('00:00');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor] = useState('transparent');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([
    { id: 1, startTime: '00:00:00', endTime: '00:00:04', text: '糟了糟了，要迟到了！', isActive: false },
    { id: 2, startTime: '00:00:04', endTime: '00:00:08', text: '对不起对不起！我不是故意的！', isActive: false },
    { id: 3, startTime: '00:00:08', endTime: '00:00:12', text: '没关系，你没事吧？', isActive: false },
  ]);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const addSubtitle = () => {
    const newSubtitle: SubtitleItem = {
      id: Date.now(),
      startTime: currentTime,
      endTime: '00:00:05',
      text: '新字幕',
      isActive: false
    };
    setSubtitles([...subtitles, newSubtitle]);
    setEditingId(newSubtitle.id);
    setEditText('新字幕');
  };

  const deleteSubtitle = (id: number) => {
    setSubtitles(subtitles.filter(s => s.id !== id));
  };

  const startEdit = (subtitle: SubtitleItem) => {
    setEditingId(subtitle.id);
    setEditText(subtitle.text);
  };

  const saveEdit = () => {
    if (editingId !== null) {
      setSubtitles(subtitles.map(s => 
        s.id === editingId ? { ...s, text: editText } : s
      ));
      setEditingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: colors.title }}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Subtitles size={20} style={{ color: colors.primary }} />
            字幕编辑
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.input, color: colors.body }}>
            <Upload size={16} />
            导入字幕
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.primary, color: '#fff' }}>
            <Download size={16} />
            导出字幕
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：视频预览区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 视频预览 */}
          <div className="flex-1 flex flex-col p-4" style={{ backgroundColor: colors.background }}>
            <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#000' }}>
              <div className="text-center">
                <div className="aspect-video w-80 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.muted}10` }}>
                  <Subtitles size={48} style={{ color: colors.muted, opacity: 0.3 }} />
                </div>
                
                {/* 字幕预览 */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="px-4 py-2 rounded-lg"
                    style={{ 
                      backgroundColor: bgColor !== 'transparent' ? bgColor : 'rgba(0,0,0,0.6)',
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      textAlign: alignment === 'left' ? 'left' : alignment === 'right' ? 'right' : 'center'
                    }}
                  >
                    这里会显示字幕
                  </div>
                </div>
              </div>
            </div>
            
            {/* 播放控制 */}
            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary, color: '#fff' }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <div className="flex-1">
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.input }}>
                    <div className="h-full" style={{ width: '30%', backgroundColor: colors.primary }} />
                  </div>
                  <div className="flex justify-between mt-1 text-xs" style={{ color: colors.muted }}>
                    <span>00:00</span>
                    <span>01:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：字幕列表和样式 */}
        <div className="w-96 flex-shrink-0 border-l flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm">字幕列表</h3>
            <button
              onClick={addSubtitle}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: colors.primary, color: '#fff' }}
            >
              <Plus size={14} />
              添加
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {subtitles.map((subtitle, index) => (
                <motion.div
                  key={subtitle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg transition-all ${subtitle.isActive ? 'ring-2' : ''}`}
                  style={{ 
                    backgroundColor: subtitle.isActive ? `${colors.primary}20` : colors.input,
                    borderColor: subtitle.isActive ? colors.primary : 'transparent'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                        {index + 1}
                      </span>
                      <span className="text-xs" style={{ color: colors.muted }}>
                        {subtitle.startTime} → {subtitle.endTime}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteSubtitle(subtitle.id)}
                      className="p-1 rounded hover:opacity-80"
                    >
                      <Trash2 size={14} style={{ color: colors.muted }} />
                    </button>
                  </div>
                  
                  {editingId === subtitle.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        className="w-full p-2 rounded text-sm outline-none resize-none"
                        style={{ backgroundColor: colors.card, color: colors.body, border: `1px solid ${colors.border}` }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p 
                      className="text-sm cursor-pointer"
                      style={{ color: colors.body }}
                      onClick={() => startEdit(subtitle)}
                    >
                      {subtitle.text}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* 样式设置 */}
          <div className="border-t p-4" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Palette size={16} style={{ color: colors.muted }} />
              字幕样式
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>字体大小</label>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-center mt-1" style={{ color: colors.muted }}>{fontSize}px</div>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>对齐方式</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAlignment('left')}
                    className={`p-2 rounded transition-all ${alignment === 'left' ? 'ring-1' : ''}`}
                    style={{ 
                      backgroundColor: alignment === 'left' ? `${colors.primary}20` : colors.input,
                      borderColor: alignment === 'left' ? colors.primary : 'transparent',
                      color: alignment === 'left' ? colors.primary : colors.muted
                    }}
                  >
                    <AlignLeft size={16} />
                  </button>
                  <button
                    onClick={() => setAlignment('center')}
                    className={`p-2 rounded transition-all ${alignment === 'center' ? 'ring-1' : ''}`}
                    style={{ 
                      backgroundColor: alignment === 'center' ? `${colors.primary}20` : colors.input,
                      borderColor: alignment === 'center' ? colors.primary : 'transparent',
                      color: alignment === 'center' ? colors.primary : colors.muted
                    }}
                  >
                    <AlignCenter size={16} />
                  </button>
                  <button
                    onClick={() => setAlignment('right')}
                    className={`p-2 rounded transition-all ${alignment === 'right' ? 'ring-1' : ''}`}
                    style={{ 
                      backgroundColor: alignment === 'right' ? `${colors.primary}20` : colors.input,
                      borderColor: alignment === 'right' ? colors.primary : 'transparent',
                      color: alignment === 'right' ? colors.primary : colors.muted
                    }}
                  >
                    <AlignRight size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>文字颜色</label>
                <div className="flex items-center gap-2">
                  {['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                      style={{ 
                        backgroundColor: color,
                        borderColor: textColor === color ? colors.primary : colors.border
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtitleEditor;