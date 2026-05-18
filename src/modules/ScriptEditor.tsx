import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Save,
  Undo,
  Redo,
  Sparkles,
  Type,
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

interface Scene {
  id: number;
  number: number;
  title: string;
  content: string;
  location: string;
  time: string;
  characters: string[];
  duration: string;
  notes: string;
}

const ScriptEditor: React.FC = () => {
  const { theme } = useAppStore();
  const colors = themes[theme];

  const [title, setTitle] = useState('我的短剧作品');
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 1,
      number: 1,
      title: '第一场：初遇',
      content: '【场景】\n城市街道，傍晚，下着小雨。\n\n【镜头】\n远景：霓虹灯光映在湿滑的路面上。\n\n【人物】\n林小雨（24岁）：咖啡店员工，性格开朗。\n顾北辰（28岁）：建筑设计师，沉默寡言。\n\n林小雨：（急匆匆地跑着）糟了糟了，要迟到了！\n\n林小雨不小心撞到了顾北辰，手里的咖啡洒了顾北辰一身。\n\n林小雨：（慌忙道歉）啊！对不起对不起！我不是故意的！\n\n顾北辰：（皱眉，但还是温和地）没关系，你没事吧？\n\n林小雨抬头看到顾北辰，两人四目相对...',
      location: '城市街道',
      time: '傍晚',
      characters: ['林小雨', '顾北辰'],
      duration: '0:45',
      notes: '这里要注意雨的特效'
    },
    {
      id: 2,
      number: 2,
      title: '第二场：咖啡店',
      content: '【场景】\n"时光咖啡"店内，温暖的灯光。\n\n【镜头】\n特写：咖啡机制作咖啡的声音。\n\n林小雨正在工作，顾北辰走了进来。\n\n林小雨：（惊讶）是你？\n\n顾北辰：（微笑）我来这里看看。\n\n林小雨：（不好意思）今天真的很抱歉，你的衣服...\n\n顾北辰：没关系，我正好想换个风格。（停顿）其实，我是来问你有没有兴趣做我们公司新楼盘的形象代言...',
      location: '咖啡店',
      time: '白天',
      characters: ['林小雨', '顾北辰'],
      duration: '1:00',
      notes: ''
    }
  ]);

  const [selectedSceneId, setSelectedSceneId] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const selectedScene = scenes.find(s => s.id === selectedSceneId) || scenes[0];

  const addScene = () => {
    const newScene: Scene = {
      id: Date.now(),
      number: scenes.length + 1,
      title: `第${scenes.length + 1}场：新场景`,
      content: '【场景】\n\n【镜头】\n\n【人物】\n\n',
      location: '',
      time: '',
      characters: [],
      duration: '0:30',
      notes: ''
    };
    setScenes([...scenes, newScene]);
    setSelectedSceneId(newScene.id);
  };

  const deleteScene = (id: number) => {
    if (scenes.length <= 1) return;
    const filtered = scenes.filter(s => s.id !== id);
    setScenes(filtered);
    if (selectedSceneId === id) {
      setSelectedSceneId(filtered[0].id);
    }
  };

  const updateScene = (id: number, updates: Partial<Scene>) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const generateWithAI = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setShowAiPanel(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: colors.title }}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold bg-transparent outline-none"
            style={{ color: colors.title }}
            placeholder="剧本标题"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1" style={{ borderColor: colors.border }}>
            <button className="p-1.5 rounded hover:opacity-80" title="撤销">
              <Undo size={16} style={{ color: colors.muted }} />
            </button>
            <button className="p-1.5 rounded hover:opacity-80" title="重做">
              <Redo size={16} style={{ color: colors.muted }} />
            </button>
          </div>
          
          <div className="flex items-center gap-1 border rounded-lg p-1" style={{ borderColor: colors.border }}>
            <button className="p-1.5 rounded hover:opacity-80" title="加粗">
              <Bold size={16} style={{ color: colors.muted }} />
            </button>
            <button className="p-1.5 rounded hover:opacity-80" title="斜体">
              <Italic size={16} style={{ color: colors.muted }} />
            </button>
            <button className="p-1.5 rounded hover:opacity-80" title="下划线">
              <Underline size={16} style={{ color: colors.muted }} />
            </button>
          </div>
          
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
          >
            <Sparkles size={16} />
            AI 写作
          </button>
          
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.primary, color: '#fff' }}>
            <Save size={16} />
            保存
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：场景列表 */}
        <div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">场景列表</h3>
              <button
                onClick={addScene}
                className="p-1.5 rounded-lg hover:opacity-80"
                style={{ backgroundColor: colors.input }}
              >
                <Plus size={16} style={{ color: colors.primary }} />
              </button>
            </div>
            <p className="text-xs" style={{ color: colors.muted }}>共 {scenes.length} 场</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {scenes.map((scene) => (
              <motion.div
                key={scene.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedSceneId(scene.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedSceneId === scene.id ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: selectedSceneId === scene.id ? `${colors.primary}20` : colors.input,
                  borderColor: selectedSceneId === scene.id ? colors.primary : 'transparent'
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-sm" style={{ color: selectedSceneId === scene.id ? colors.primary : colors.title }}>
                    第 {scene.number} 场
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteScene(scene.id);
                    }}
                    className="p-1 rounded hover:opacity-80"
                  >
                    <Trash2 size={12} style={{ color: colors.muted }} />
                  </button>
                </div>
                <p className="text-xs mb-2" style={{ color: colors.body }}>{scene.title}</p>
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.muted }}>
                  <span>{scene.location}</span>
                  <span>•</span>
                  <span>{scene.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 中间：编辑器 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 场景信息栏 */}
          <div className="p-4 border-b flex items-center gap-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.input, color: colors.muted }}>
                第 {selectedScene.number} 场
              </span>
              <input
                type="text"
                value={selectedScene.title}
                onChange={(e) => updateScene(selectedScene.id, { title: e.target.value })}
                className="font-medium bg-transparent outline-none"
                style={{ color: colors.title }}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="text"
                value={selectedScene.location}
                onChange={(e) => updateScene(selectedScene.id, { location: e.target.value })}
                placeholder="地点"
                className="text-sm px-3 py-1.5 rounded border"
                style={{ backgroundColor: colors.input, color: colors.body, borderColor: colors.border }}
              />
              <input
                type="text"
                value={selectedScene.time}
                onChange={(e) => updateScene(selectedScene.id, { time: e.target.value })}
                placeholder="时间"
                className="text-sm px-3 py-1.5 rounded border"
                style={{ backgroundColor: colors.input, color: colors.body, borderColor: colors.border }}
              />
              <input
                type="text"
                value={selectedScene.duration}
                onChange={(e) => updateScene(selectedScene.id, { duration: e.target.value })}
                placeholder="时长"
                className="text-sm px-3 py-1.5 rounded border w-20"
                style={{ backgroundColor: colors.input, color: colors.body, borderColor: colors.border }}
              />
            </div>
          </div>

          {/* 编辑区域 */}
          <div className="flex-1 overflow-hidden flex">
            <textarea
              ref={editorRef}
              value={selectedScene.content}
              onChange={(e) => updateScene(selectedScene.id, { content: e.target.value })}
              className="flex-1 p-6 resize-none outline-none font-mono text-sm"
              style={{ backgroundColor: colors.background, color: colors.body, lineHeight: '1.8' }}
              placeholder="在这里编写剧本..."
            />
          </div>

          {/* 底部备注 */}
          <div className="p-4 border-t" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Type size={14} style={{ color: colors.muted }} />
              <span className="text-xs font-medium" style={{ color: colors.muted }}>备注</span>
            </div>
            <textarea
              value={selectedScene.notes}
              onChange={(e) => updateScene(selectedScene.id, { notes: e.target.value })}
              placeholder="拍摄备注、注意事项..."
              className="w-full px-3 py-2 rounded text-sm resize-none h-16 outline-none"
              style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
            />
          </div>
        </div>

        {/* 右侧：AI 面板 */}
        <AnimatePresence>
          {showAiPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l flex flex-col overflow-hidden"
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles size={16} style={{ color: colors.primary }} />
                  AI 写作助手
                </h3>
                <button onClick={() => setShowAiPanel(false)} className="p-1 rounded hover:opacity-80">
                  <Trash2 size={16} style={{ color: colors.muted }} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: colors.title }}>我想要...</label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="描述你想要的剧情、场景、风格..."
                    className="w-full px-3 py-2 rounded-lg resize-none h-32 text-sm outline-none"
                    style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium" style={{ color: colors.muted }}>快速模板</p>
                  {[
                    '续写当前场景',
                    '增加冲突和转折',
                    '让对话更幽默',
                    '添加情感描写',
                    '创建下一场'
                  ].map((template, i) => (
                    <button
                      key={i}
                      onClick={() => setAiPrompt(template)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                      style={{ backgroundColor: colors.input, color: colors.body }}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  onClick={generateWithAI}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80 disabled:opacity-50"
                  style={{ backgroundColor: colors.primary, color: '#fff' }}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      AI 生成
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 添加 AnimatePresence 导入
import { AnimatePresence } from 'framer-motion';

export default ScriptEditor;