import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Mic,
  Play,
  Pause,
  Download,
  Upload,
  Plus,
  Trash2,
  Wand2,
  Settings,
  User
} from 'lucide-react';

interface VoiceItem {
  id: number;
  name: string;
  avatar: string;
  language: string;
  style: string;
  sampleText: string;
}

interface AudioSegment {
  id: number;
  name: string;
  duration: string;
  voice: string;
  text: string;
  status: 'pending' | 'generating' | 'completed';
}

const VoiceCloning: React.FC = () => {
  const { theme } = useAppStore();
  const colors = themes[theme];
  
  const [isRecording, setIsRecording] = useState(false);
  const [currentVoice, setCurrentVoice] = useState('林小雨 - 甜美女声');
  const [textToGenerate, setTextToGenerate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [availableVoices] = useState<VoiceItem[]>([
    { id: 1, name: '林小雨 - 甜美女声', avatar: '', language: '中文', style: '甜美', sampleText: '你好，我是林小雨，很高兴认识你。' },
    { id: 2, name: '顾北辰 - 沉稳男声', avatar: '', language: '中文', style: '沉稳', sampleText: '大家好，我是顾北辰，请多指教。' },
    { id: 3, name: '老板 - 严厉男声', avatar: '', language: '中文', style: '严厉', sampleText: '这个月业绩再不达标，你就别来了！' },
    { id: 4, name: '助手 - 温柔女声', avatar: '', language: '中文', style: '温柔', sampleText: '请问有什么可以帮助您的吗？' },
  ]);
  
  const [audioSegments, setAudioSegments] = useState<AudioSegment[]>([
    { id: 1, name: '林小雨开场.mp3', duration: '0:05', voice: '林小雨 - 甜美女声', text: '糟了糟了，要迟到了！', status: 'completed' },
    { id: 2, name: '顾北辰道歉.mp3', duration: '0:08', voice: '顾北辰 - 沉稳男声', text: '没关系，你没事吧？', status: 'completed' },
  ]);

  const generateVoice = () => {
    if (!textToGenerate.trim()) return;
    
    setIsGenerating(true);
    
    const newSegment: AudioSegment = {
      id: Date.now(),
      name: `生成音频_${Date.now()}.mp3`,
      duration: '0:00',
      voice: currentVoice,
      text: textToGenerate,
      status: 'generating'
    };
    
    setAudioSegments([newSegment, ...audioSegments]);
    
    setTimeout(() => {
      setIsGenerating(false);
      setAudioSegments(segments => 
        segments.map(seg => 
          seg.id === newSegment.id 
            ? { ...seg, status: 'completed', duration: '0:06' }
            : seg
        )
      );
      setTextToGenerate('');
    }, 2000);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: colors.title }}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Mic size={20} style={{ color: colors.primary }} />
            音频配音
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.primary, color: '#fff' }}>
            <Upload size={16} />
            导入音频
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：声音库 */}
        <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm">声音库</h3>
            <button className="p-1.5 rounded-lg hover:opacity-80" style={{ backgroundColor: colors.input }}>
              <Plus size={14} style={{ color: colors.primary }} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {availableVoices.map((voice) => (
              <motion.button
                key={voice.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setCurrentVoice(voice.name)}
                className={`w-full p-3 rounded-lg text-left transition-all ${currentVoice === voice.name ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: currentVoice === voice.name ? `${colors.primary}20` : colors.input,
                  borderColor: currentVoice === voice.name ? colors.primary : 'transparent'
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                    <User size={18} style={{ color: colors.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: currentVoice === voice.name ? colors.primary : colors.title }}>
                      {voice.name}
                    </div>
                    <div className="text-xs" style={{ color: colors.muted }}>{voice.style} · {voice.language}</div>
                  </div>
                </div>
                <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.card, color: colors.body }}>
                  "{voice.sampleText}"
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 中间：主工作区 */}
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          {/* 文字转语音 */}
          <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Wand2 size={18} style={{ color: colors.primary }} />
              <h3 className="font-semibold">文字转语音</h3>
            </div>
            
            <textarea
              value={textToGenerate}
              onChange={(e) => setTextToGenerate(e.target.value)}
              placeholder="输入要转换的文字内容..."
              className="w-full p-3 rounded-lg text-sm resize-none h-32 outline-none mb-3"
              style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: colors.muted }}>使用声音: </span>
                <span className="text-sm font-medium" style={{ color: colors.primary }}>{currentVoice}</span>
              </div>
              <button
                onClick={generateVoice}
                disabled={isGenerating || !textToGenerate.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: colors.primary, color: '#fff' }}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    生成音频
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* 音频段列表 */}
          <div className="flex-1 overflow-hidden rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
              <h3 className="font-semibold">音频片段</h3>
              <span className="text-sm" style={{ color: colors.muted }}>{audioSegments.length} 个片段</span>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-3">
              {audioSegments.map((segment) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg flex items-center gap-4 transition-all hover:opacity-90"
                  style={{ backgroundColor: colors.input }}
                >
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm" style={{ color: colors.title }}>{segment.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ 
                        backgroundColor: segment.status === 'completed' ? `${colors.success}15` : 
                                          segment.status === 'generating' ? `${colors.warning}15` : 
                                          `${colors.muted}15`, 
                        color: segment.status === 'completed' ? colors.success : 
                               segment.status === 'generating' ? colors.warning : colors.muted 
                      }}>
                        {segment.status === 'completed' ? '已完成' : 
                         segment.status === 'generating' ? '生成中' : '待处理'}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: colors.muted }}>
                      {segment.voice} · {segment.duration}
                    </div>
                    <div className="text-xs mt-1 truncate" style={{ color: colors.body }}>
                      {segment.text}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:opacity-80" style={{ color: colors.muted }}>
                      <Download size={14} />
                    </button>
                    <button className="p-1.5 rounded hover:opacity-80" style={{ color: colors.muted }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：录音和参数 */}
        <div className="w-72 flex-shrink-0 border-l flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Mic size={16} style={{ color: colors.primary }} />
              录音
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 录音按钮 */}
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: colors.input }}>
              <button
                onClick={() => setIsRecording(!isRecording)}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 transition-all hover:scale-105"
                style={{ 
                  backgroundColor: isRecording ? colors.error : colors.primary, 
                  color: '#fff',
                  boxShadow: isRecording ? `0 0 20px ${colors.error}` : 'none'
                }}
              >
                {isRecording ? (
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: '#fff' }} />
                ) : (
                  <Mic size={32} />
                )}
              </button>
              <p className="text-sm" style={{ color: isRecording ? colors.error : colors.title }}>
                {isRecording ? '正在录音...' : '点击开始录音'}
              </p>
            </div>
            
            {/* 参数设置 */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.input }}>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Settings size={14} style={{ color: colors.muted }} />
                参数设置
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>语速</label>
                  <input type="range" min="0.5" max="2" step="0.1" className="w-full" />
                </div>
                
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>音调</label>
                  <input type="range" min="-10" max="10" step="1" className="w-full" />
                </div>
                
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>音量</label>
                  <input type="range" min="0" max="1" step="0.1" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCloning;