import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Video,
  Settings,
  Zap,
  Plus,
  Sliders,
  Wand2,
  Film,
  Image as ImageIcon
} from 'lucide-react';

const VideoGenerator: React.FC = () => {
  const { theme } = useAppStore();
  const colors = themes[theme];

  const [selectedModel, setSelectedModel] = useState('kling');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoParams, setVideoParams] = useState({
    duration: '8s',
    aspectRatio: '9:16',
    resolution: '1080p',
    style: 'realistic',
    motion: 'medium',
    camera: 'smooth',
    seed: '',
  });

  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');

  const models = [
    { id: 'kling', name: 'Kling AI', desc: '高质量视频生成' },
    { id: 'sora', name: 'Sora', desc: 'OpenAI 视频模型' },
    { id: 'runway', name: 'Runway', desc: '专业影视制作' },
    { id: 'pika', name: 'Pika', desc: '创意动画风格' },
    { id: 'leia', name: 'LeiaPix', desc: '2D转3D转换' },
  ];

  const addReferenceImage = () => {
    // 模拟添加图片
    setReferenceImages([...referenceImages, '']);
  };

  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    // 模拟进度
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return p + Math.random() * 5;
      });
    }, 500);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: colors.title }}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Film size={20} style={{ color: colors.primary }} />
            视频生成
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            disabled={!prompt || isGenerating}
            onClick={startGeneration}
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
                <Zap size={16} />
                开始生成
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：模型选择 */}
        <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm">AI 模型</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {models.map((model) => (
              <motion.button
                key={model.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedModel(model.id)}
                className={`w-full p-3.5 rounded-lg text-left transition-all ${selectedModel === model.id ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: selectedModel === model.id ? `${colors.primary}20` : colors.input,
                  borderColor: selectedModel === model.id ? colors.primary : 'transparent'
                }}
              >
                <div className="font-medium text-sm" style={{ color: selectedModel === model.id ? colors.primary : colors.title }}>
                  {model.name}
                </div>
                <div className="text-xs mt-1" style={{ color: colors.muted }}>
                  {model.desc}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 中间：主工作区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 预览区 */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col" style={{ backgroundColor: colors.background }}>
            <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#000' }}>
              {isGenerating ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 rounded-full border-t-transparent mb-4 mx-auto animate-spin" style={{ borderColor: colors.primary }} />
                  <div className="text-lg font-medium mb-2">生成中...</div>
                  <div className="w-64 h-2 rounded-full overflow-hidden mx-auto mb-2" style={{ backgroundColor: `${colors.muted}30` }}>
                    <div className="h-full transition-all" style={{ width: `${progress}%`, backgroundColor: colors.primary }} />
                  </div>
                  <div className="text-sm" style={{ color: colors.muted }}>{Math.round(progress)}%</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="aspect-video w-80 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.muted}20` }}>
                    <Video size={56} style={{ color: colors.muted, opacity: 0.4 }} />
                  </div>
                  <p className="text-sm" style={{ color: colors.muted }}>输入提示词并选择模型开始生成</p>
                </div>
              )}
            </div>
          </div>

          {/* 提示词区域 */}
          <div className="border-t p-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block flex items-center gap-2" style={{ color: colors.title }}>
                  <Wand2 size={14} />
                  视频描述
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要的视频内容、场景、风格..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm resize-none h-24 outline-none"
                  style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: colors.muted }}>
                  负面提示词 (可选)
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="描述不想要的内容..."
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：参数设置 */}
        <div className="w-80 flex-shrink-0 border-l flex flex-col overflow-hidden" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: colors.border }}>
            <Sliders size={16} style={{ color: colors.primary }} />
            <h3 className="font-semibold text-sm">生成参数</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* 视频时长 */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: colors.muted }}>视频时长</label>
              <div className="grid grid-cols-4 gap-2">
                {['4s', '8s', '12s', '16s'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setVideoParams({ ...videoParams, duration: d })}
                    className={`py-2 px-1.5 rounded-lg text-sm font-medium transition-all ${videoParams.duration === d ? 'ring-1' : ''}`}
                    style={{
                      backgroundColor: videoParams.duration === d ? `${colors.primary}20` : colors.input,
                      borderColor: videoParams.duration === d ? colors.primary : 'transparent',
                      color: videoParams.duration === d ? colors.primary : colors.body
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* 分辨率 */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: colors.muted }}>分辨率</label>
              <select
                value={videoParams.resolution}
                onChange={(e) => setVideoParams({ ...videoParams, resolution: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
              >
                <option>720p</option>
                <option>1080p</option>
                <option>1440p</option>
                <option>4K</option>
              </select>
            </div>

            {/* 宽高比 */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: colors.muted }}>宽高比</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { ratio: '9:16', label: '竖屏' },
                  { ratio: '16:9', label: '横屏' },
                  { ratio: '1:1', label: '方形' },
                ].map(({ ratio, label }) => (
                  <button
                    key={ratio}
                    onClick={() => setVideoParams({ ...videoParams, aspectRatio: ratio })}
                    className={`py-2 px-1.5 rounded-lg text-xs font-medium transition-all ${videoParams.aspectRatio === ratio ? 'ring-1' : ''}`}
                    style={{
                      backgroundColor: videoParams.aspectRatio === ratio ? `${colors.primary}20` : colors.input,
                      borderColor: videoParams.aspectRatio === ratio ? colors.primary : 'transparent',
                      color: videoParams.aspectRatio === ratio ? colors.primary : colors.body
                    }}
                  >
                    {label}
                    <div>{ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 视频风格 */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: colors.muted }}>风格预设</label>
              <select
                value={videoParams.style}
                onChange={(e) => setVideoParams({ ...videoParams, style: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
              >
                <option value="realistic">真实风格</option>
                <option value="anime">动漫风格</option>
                <option value="3d">3D 渲染</option>
                <option value="cinematic">电影风格</option>
                <option value="vintage">复古风格</option>
              </select>
            </div>

            {/* 参考图片 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: colors.muted }}>参考图片</label>
                <button
                  onClick={addReferenceImage}
                  className="text-xs px-2 py-1 rounded transition-all hover:opacity-80"
                  style={{ backgroundColor: colors.input, color: colors.primary }}
                >
                  <Plus size={12} className="inline mr-1" />
                  添加
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {referenceImages.map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.muted}20` }}
                  >
                    <ImageIcon size={16} style={{ color: colors.muted, opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* 高级设置 */}
            <div className="border-t pt-4" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2 mb-3">
                <Settings size={14} style={{ color: colors.muted }} />
                <span className="text-xs font-medium" style={{ color: colors.muted }}>高级设置</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>随机种子</label>
                  <input
                    type="text"
                    value={videoParams.seed}
                    onChange={(e) => setVideoParams({ ...videoParams, seed: e.target.value })}
                    placeholder="留空自动生成"
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs outline-none"
                    style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;