import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Image as ImageIcon,
  Play,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Download,
  Upload,
  Camera,
  Clock,
  Zap,
  Music,
  Type
} from 'lucide-react';

interface StoryboardShot {
  id: number;
  number: number;
  thumbnail: string;
  description: string;
  duration: string;
  cameraMovement: string;
  cameraAngle: string;
  shotType: string;
  audio: string;
  notes: string;
}

const Storyboard: React.FC = () => {
  const { theme } = useAppStore();
  const colors = themes[theme];

  const [shots, setShots] = useState<StoryboardShot[]>([
    {
      id: 1,
      number: 1,
      thumbnail: '',
      description: '城市街道夜景，霓虹灯闪烁，雨滴落下',
      duration: '3s',
      cameraMovement: '推镜',
      cameraAngle: '平视',
      shotType: '远景',
      audio: '雨声、背景音乐',
      notes: '注意雨的特效'
    },
    {
      id: 2,
      number: 2,
      thumbnail: '',
      description: '林小雨奔跑的特写，脚步溅起水花',
      duration: '2s',
      cameraMovement: '跟拍',
      cameraAngle: '低角度',
      shotType: '中景',
      audio: '脚步声、喘息声',
      notes: '表现紧张感'
    },
    {
      id: 3,
      number: 3,
      thumbnail: '',
      description: '两人相撞的瞬间，慢镜头',
      duration: '4s',
      cameraMovement: '环绕',
      cameraAngle: '平视',
      shotType: '近景',
      audio: '碰撞声、咖啡杯破碎声',
      notes: '重点拍四目相对'
    }
  ]);

  const [selectedShotId, setSelectedShotId] = useState(1);
  const selectedShot = shots.find(s => s.id === selectedShotId) || shots[0];

  const addShot = () => {
    const newShot: StoryboardShot = {
      id: Date.now(),
      number: shots.length + 1,
      thumbnail: '',
      description: '',
      duration: '3s',
      cameraMovement: '固定',
      cameraAngle: '平视',
      shotType: '中景',
      audio: '',
      notes: ''
    };
    setShots([...shots, newShot]);
    setSelectedShotId(newShot.id);
  };

  const deleteShot = (id: number) => {
    if (shots.length <= 1) return;
    const filtered = shots.filter(s => s.id !== id);
    setShots(filtered);
    if (selectedShotId === id) {
      setSelectedShotId(filtered[0].id);
    }
  };

  const updateShot = (id: number, updates: Partial<StoryboardShot>) => {
    setShots(shots.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const totalDuration = shots.reduce((sum, shot) => {
    const match = shot.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[0]) : 0);
  }, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: colors.title }}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold">分镜设计</h2>
          <div className="flex items-center gap-2 text-sm" style={{ color: colors.muted }}>
            <Clock size={14} />
            <span>共 {shots.length} 个镜头</span>
            <span>•</span>
            <span>总长 {totalDuration} 秒</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.input, color: colors.body }}>
            <Upload size={16} />
            导入
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.input, color: colors.body }}>
            <Download size={16} />
            导出
          </button>
          <button
            onClick={addShot}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: colors.primary, color: '#fff' }}
          >
            <Plus size={16} />
            添加镜头
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：镜头列表 */}
        <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm">镜头序列</h3>
            <button
              onClick={addShot}
              className="p-1.5 rounded hover:opacity-80"
              style={{ backgroundColor: colors.input }}
            >
              <Plus size={14} style={{ color: colors.primary }} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {shots.map((shot, index) => (
              <motion.div
                key={shot.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedShotId(shot.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedShotId === shot.id ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: selectedShotId === shot.id ? `${colors.primary}20` : colors.input,
                  borderColor: selectedShotId === shot.id ? colors.primary : 'transparent'
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1" style={{ color: colors.muted }}>
                    <GripVertical size={14} className="cursor-move" />
                    <span className="text-xs font-medium" style={{ color: selectedShotId === shot.id ? colors.primary : colors.muted }}>
                      #{shot.number}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="aspect-video rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${colors.muted}20` }}>
                      <Camera size={20} style={{ color: colors.muted, opacity: 0.5 }} />
                    </div>
                    
                    <p className="text-xs line-clamp-2 mb-1" style={{ color: colors.body }}>
                      {shot.description || '无描述'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                        {shot.duration}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteShot(shot.id);
                        }}
                        className="p-1 rounded hover:opacity-80"
                      >
                        <Trash2 size={12} style={{ color: colors.muted }} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 中间：主编辑区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 预览区 */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col" style={{ backgroundColor: colors.background }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">镜头 #{selectedShot.number}</h3>
                <p className="text-sm" style={{ color: colors.muted }}>{selectedShot.description}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                <Zap size={16} />
                AI 生成分镜
              </button>
            </div>
            
            <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#000' }}>
              <div className="text-center">
                <div className="aspect-video w-80 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.muted}20` }}>
                  <ImageIcon size={48} style={{ color: colors.muted, opacity: 0.3 }} />
                </div>
                <p className="text-sm" style={{ color: colors.muted }}>点击或拖拽添加图片</p>
              </div>
            </div>
          </div>

          {/* 时间轴 */}
          <div className="border-t p-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <div className="flex items-center gap-4 mb-3">
              <h4 className="font-medium text-sm">时间轴</h4>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded" style={{ backgroundColor: colors.input }}>
                  <Play size={14} style={{ color: colors.body }} />
                </button>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {shots.map((shot) => (
                <div
                  key={shot.id}
                  onClick={() => setSelectedShotId(shot.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg cursor-pointer transition-all ${selectedShotId === shot.id ? 'ring-2' : ''}`}
                  style={{
                    backgroundColor: selectedShotId === shot.id ? `${colors.primary}20` : colors.input,
                    borderColor: selectedShotId === shot.id ? colors.primary : 'transparent',
                    minWidth: 100
                  }}
                >
                  <div className="text-xs font-medium" style={{ color: selectedShotId === shot.id ? colors.primary : colors.title }}>
                    镜头 {shot.number}
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.muted }}>{shot.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：属性面板 */}
        <div className="w-80 flex-shrink-0 border-l flex flex-col overflow-hidden" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold flex items-center gap-2">
              <Settings size={16} style={{ color: colors.primary }} />
              镜头属性
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: colors.title }}>镜头描述</label>
              <textarea
                value={selectedShot.description}
                onChange={(e) => updateShot(selectedShot.id, { description: e.target.value })}
                placeholder="描述这个镜头的内容..."
                className="w-full px-3 py-2 rounded-lg text-sm resize-none h-24 outline-none"
                style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>景别</label>
                <select
                  value={selectedShot.shotType}
                  onChange={(e) => updateShot(selectedShot.id, { shotType: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                >
                  <option>远景</option>
                  <option>全景</option>
                  <option>中景</option>
                  <option>近景</option>
                  <option>特写</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>时长</label>
                <input
                  type="text"
                  value={selectedShot.duration}
                  onChange={(e) => updateShot(selectedShot.id, { duration: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>镜头运动</label>
                <select
                  value={selectedShot.cameraMovement}
                  onChange={(e) => updateShot(selectedShot.id, { cameraMovement: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                >
                  <option>固定</option>
                  <option>推镜</option>
                  <option>拉镜</option>
                  <option>摇镜</option>
                  <option>跟拍</option>
                  <option>环绕</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: colors.muted }}>拍摄角度</label>
                <select
                  value={selectedShot.cameraAngle}
                  onChange={(e) => updateShot(selectedShot.id, { cameraAngle: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                >
                  <option>平视</option>
                  <option>仰拍</option>
                  <option>俯拍</option>
                  <option>低角度</option>
                  <option>鸟瞰</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2" style={{ color: colors.title }}>
                <Music size={14} />
                音频设计
              </label>
              <textarea
                value={selectedShot.audio}
                onChange={(e) => updateShot(selectedShot.id, { audio: e.target.value })}
                placeholder="对话、音效、背景音乐..."
                className="w-full px-3 py-2 rounded-lg text-sm resize-none h-20 outline-none"
                style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2" style={{ color: colors.title }}>
                <Type size={14} />
                备注
              </label>
              <textarea
                value={selectedShot.notes}
                onChange={(e) => updateShot(selectedShot.id, { notes: e.target.value })}
                placeholder="拍摄备注、注意事项..."
                className="w-full px-3 py-2 rounded-lg text-sm resize-none h-20 outline-none"
                style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storyboard;