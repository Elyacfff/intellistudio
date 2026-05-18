import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Bot, 
  X, 
  RotateCcw, 
  Download,
  Settings,
  Terminal,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Workflow,
  Lightbulb,
  ArrowRight,
  FileText,
  Video,
  Mic,
  Subtitles,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { themes } from '../hooks/useTheme';
import { api } from '../services/api';

type WorkflowNode = {
  id: string;
  type: 'llm' | 'script' | 'video' | 'audio' | 'voice' | 'subtitle' | 'export';
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  logs: string[];
  result?: string;
};

const IntelliStudio: React.FC = () => {
  const { theme, addToast } = useAppStore();
  const colors = themes[theme];
  
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([]);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState('');
  const [generatedStoryboard, setGeneratedStoryboard] = useState('');
  
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logMessages]);

  const templates = [
    { id: 'romance', icon: '💕', title: '都市爱情', desc: '霸道总裁、甜宠剧情', prompt: '创作一个都市爱情短剧：咖啡店女老板与建筑设计师的浪漫邂逅，30集竖屏短剧，每集1-2分钟' },
    { id: 'fantasy', icon: '⚔️', title: '古风仙侠', desc: '玄幻修仙、古装题材', prompt: '创作一个古风仙侠短剧：凡人少年意外获得修仙秘籍，踏上逆天改命之路，40集竖屏短剧' },
    { id: 'mystery', icon: '🔍', title: '悬疑推理', desc: '烧脑剧情、反转结局', prompt: '创作一个悬疑推理短剧：小镇发生连环失踪案，新来的警探发现背后隐藏着惊天秘密，25集竖屏短剧' },
    { id: 'comedy', icon: '😂', title: '喜剧搞笑', desc: '轻松幽默、段子剧情', prompt: '创作一个喜剧短剧：三个性格迥异的室友的爆笑日常，轻松幽默风格，20集竖屏短剧' },
    { id: 'scifi', icon: '🚀', title: '科幻未来', desc: '未来世界、AI 题材', prompt: '创作一个科幻短剧：2045年，AI 觉醒后与人类共存的世界，30集竖屏短剧' },
    { id: 'horror', icon: '👻', title: '惊悚恐怖', desc: '悬疑惊悚、心理恐惧', prompt: '创作一个惊悚短剧：搬进新家的年轻夫妇发现房子里的诡异现象，心理恐惧层层递进，15集竖屏短剧' },
  ];

  const buildWorkflow = (): WorkflowNode[] => {
    return [
      { id: 'analyze', type: 'llm', name: '需求分析', status: 'idle', progress: 0, logs: [] },
      { id: 'script', type: 'script', name: '剧本生成', status: 'idle', progress: 0, logs: [] },
      { id: 'character', type: 'llm', name: '角色设计', status: 'idle', progress: 0, logs: [] },
      { id: 'storyboard', type: 'llm', name: '分镜规划', status: 'idle', progress: 0, logs: [] },
      { id: 'video', type: 'video', name: '视频生成', status: 'idle', progress: 0, logs: [] },
      { id: 'voice', type: 'voice', name: '配音方案', status: 'idle', progress: 0, logs: [] },
      { id: 'subtitle', type: 'subtitle', name: '字幕生成', status: 'idle', progress: 0, logs: [] },
      { id: 'export', type: 'export', name: '导出汇总', status: 'idle', progress: 0, logs: [] },
    ];
  };

  const updateNodeStatus = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setWorkflowNodes(prev => 
      prev.map(n => n.id === nodeId ? { ...n, ...updates } : n)
    );
  };

  const simulateProgress = (nodeId: string, duration: number, startPercent: number = 0) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(95, startPercent + Math.round((elapsed / duration) * (95 - startPercent)));
      updateNodeStatus(nodeId, { progress });
      
      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  };

  const startWorkflow = async () => {
    if (!userInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setLogMessages([]);
    setGeneratedScript('');
    setGeneratedStoryboard('');
    addLog('🚀 IntelliStudio 启动 · DeepSeek AI 引擎就绪');
    addLog(`📝 用户需求: "${userInput}"`);
    addToast({ type: 'info', title: 'AI 开始创作', message: 'DeepSeek 正在分析你的需求...' });
    
    const workflow = buildWorkflow();
    setWorkflowNodes(workflow);
    
    try {
      // Step 1: 需求分析
      addLog('⏳ 步骤 1/8: AI 需求分析...');
      updateNodeStatus('analyze', { status: 'running' });
      const clearAnalyze = simulateProgress('analyze', 3000);
      
      const intent = await api.analyzeIntent(userInput);
      clearAnalyze();
      updateNodeStatus('analyze', { status: 'completed', progress: 100 });
      addLog(`✅ 需求分析完成 · 题材: ${intent.genre} · 复杂度: ${intent.complexity}`);
      await new Promise(r => setTimeout(r, 500));

      // Step 2: 剧本生成
      addLog('⏳ 步骤 2/8: AI 剧本生成中（这可能需要30-60秒）...');
      updateNodeStatus('script', { status: 'running' });
      const clearScript = simulateProgress('script', 45000);
      
      const script = await api.generateScript(userInput, {
        genre: intent.genre,
        style: intent.complexity === 'complex' ? '电影级叙事' : '轻快节奏',
      });
      clearScript();
      setGeneratedScript(script);
      updateNodeStatus('script', { status: 'completed', progress: 100, result: script.slice(0, 200) });
      addLog(`✅ 剧本生成完成 · ${script.length} 字符`);
      await new Promise(r => setTimeout(r, 500));

      // Step 3: 角色设计
      addLog('⏳ 步骤 3/8: 角色设定生成...');
      updateNodeStatus('character', { status: 'running' });
      const clearChar = simulateProgress('character', 8000);
      
      const characterScript = await api.chatCompletion([
        { role: 'system', content: '你是角色设计师。根据剧本提取角色信息，格式：姓名 | 年龄 | 性格 | 外貌描述 | 角色关系' },
        { role: 'user', content: `从以下剧本中提取所有角色的详细设定：\n\n${script.slice(0, 3000)}` },
      ], { temperature: 0.5, maxTokens: 2048 });
      clearChar();
      updateNodeStatus('character', { status: 'completed', progress: 100, result: characterScript.choices[0]?.message?.content?.slice(0, 200) });
      addLog('✅ 角色设计完成');
      await new Promise(r => setTimeout(r, 500));

      // Step 4: 分镜规划
      addLog('⏳ 步骤 4/8: AI 分镜规划中...');
      updateNodeStatus('storyboard', { status: 'running' });
      const clearSB = simulateProgress('storyboard', 20000);
      
      const storyboard = await api.generateStoryboard(script, 8);
      clearSB();
      setGeneratedStoryboard(storyboard);
      updateNodeStatus('storyboard', { status: 'completed', progress: 100, result: storyboard.slice(0, 200) });
      addLog(`✅ 分镜规划完成 · ${storyboard.length} 字符`);
      await new Promise(r => setTimeout(r, 500));

      // Step 5: 视频方案
      addLog('⏳ 步骤 5/8: 视频生成方案规划...');
      updateNodeStatus('video', { status: 'running' });
      const clearVideo = simulateProgress('video', 5000);
      
      const videoPlan = await api.chatCompletion([
        { role: 'system', content: '你是视频制作顾问。根据剧本和分镜，给出视频制作建议：分辨率、帧率、转场风格、特效建议' },
        { role: 'user', content: `剧本: ${script.slice(0, 1000)}\n分镜: ${storyboard.slice(0, 1000)}\n请给出视频制作方案。` },
      ], { temperature: 0.5, maxTokens: 1024 });
      clearVideo();
      updateNodeStatus('video', { status: 'completed', progress: 100, result: videoPlan.choices[0]?.message?.content?.slice(0, 200) });
      addLog('✅ 视频方案规划完成');
      await new Promise(r => setTimeout(r, 500));

      // Step 6: 配音方案
      addLog('⏳ 步骤 6/8: 配音角色分配...');
      updateNodeStatus('voice', { status: 'running' });
      const clearVoice = simulateProgress('voice', 6000);
      
      const voicePlan = await api.chatCompletion([
        { role: 'system', content: '你是配音导演。为剧本中的每个角色推荐声音类型（甜美/沉稳/严厉/温柔等）和配音要点' },
        { role: 'user', content: `剧本: ${script.slice(0, 2000)}\n请为每个角色推荐配音方案。` },
      ], { temperature: 0.5, maxTokens: 1024 });
      clearVoice();
      updateNodeStatus('voice', { status: 'completed', progress: 100, result: voicePlan.choices[0]?.message?.content?.slice(0, 200) });
      addLog('✅ 配音方案完成');
      await new Promise(r => setTimeout(r, 500));

      // Step 7: 字幕生成
      addLog('⏳ 步骤 7/8: 智能字幕生成...');
      updateNodeStatus('subtitle', { status: 'running' });
      const clearSub = simulateProgress('subtitle', 10000);
      
      const subtitles = await api.generateSubtitles(script, 'srt');
      clearSub();
      updateNodeStatus('subtitle', { status: 'completed', progress: 100, result: subtitles.slice(0, 200) });
      addLog('✅ 字幕生成完成');
      await new Promise(r => setTimeout(r, 500));

      // Step 8: 汇总导出
      addLog('⏳ 步骤 8/8: 汇总所有产出...');
      updateNodeStatus('export', { status: 'running' });
      const clearExport = simulateProgress('export', 2000);
      await new Promise(r => setTimeout(r, 2000));
      clearExport();
      updateNodeStatus('export', { status: 'completed', progress: 100 });
      addLog('✅ 导出汇总完成');
      
      addLog('🎉 全流程完成！剧本 + 分镜 + 配音 + 字幕 已就绪！');
      addLog(`📊 Token 用量: 预估消耗约 15000 tokens`);
      addToast({ type: 'success', title: '创作完成！', message: 'DeepSeek AI 已完成全流程创作' });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      addLog(`❌ 错误: ${errMsg}`);
      addToast({ type: 'error', title: '创作出错', message: errMsg });
      
      setWorkflowNodes(prev => 
        prev.map(n => n.status === 'running' ? { ...n, status: 'error' as const, progress: n.progress } : n)
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const stopWorkflow = () => {
    setIsProcessing(false);
    addLog('⚠️ 流程已手动停止');
    addToast({ type: 'warning', title: '流程已停止', message: '你可以随时重新开始' });
  };

  const resetWorkflow = () => {
    setIsProcessing(false);
    setWorkflowNodes([]);
    setLogMessages([]);
    setUserInput('');
    setActiveTemplate(null);
    setGeneratedScript('');
    setGeneratedStoryboard('');
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setUserInput(template.prompt);
    setActiveTemplate(template.id);
  };

  const getNodeColor = (status: WorkflowNode['status']) => {
    switch (status) {
      case 'running': return colors.warning || '#f59e0b';
      case 'completed': return colors.success || '#10b981';
      case 'error': return colors.error || '#ef4444';
      default: return colors.muted || '#6b7280';
    }
  };

  const getNodeIcon = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'script': return <FileText size={14} />;
      case 'video': return <Video size={14} />;
      case 'voice': case 'audio': return <Mic size={14} />;
      case 'subtitle': return <Subtitles size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  const completedCount = workflowNodes.filter(n => n.status === 'completed').length;
  const totalCount = workflowNodes.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden" style={{ color: colors.title }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${colors.primary}20` }}>
            <Sparkles style={{ color: colors.primary }} size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">IntelliStudio</h1>
            <p style={{ color: colors.muted }}>DeepSeek AI 驱动 · 一站式短剧智能创作</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="p-2.5 rounded-lg transition-all hover:opacity-80 relative"
            style={{ backgroundColor: colors.input }}
            title="运行日志"
          >
            <Terminal size={20} style={{ color: colors.body }} />
            {logMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                {logMessages.length}
              </span>
            )}
          </button>
          <button 
            className="p-2.5 rounded-lg transition-all hover:opacity-80"
            style={{ backgroundColor: colors.input }}
            title="设置"
          >
            <Settings size={20} style={{ color: colors.body }} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* 输入区域 */}
          <div className="glass-card rounded-xl p-6 flex-shrink-0" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: `${colors.primary}20` }}>
                <Bot size={24} style={{ color: colors.primary }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">描述你的创作需求</h3>
                <p className="text-sm mb-4" style={{ color: colors.muted }}>
                  用自然语言描述，DeepSeek AI 自动完成剧本、分镜、角色、配音、字幕全流程
                </p>
                <textarea
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value);
                    setActiveTemplate(null);
                  }}
                  placeholder="例如：创作一个都市爱情短剧，女主角是咖啡店老板，男主角是建筑设计师，30集竖屏，每集1-2分钟..."
                  className="w-full p-4 rounded-xl resize-none text-base transition-all focus:ring-2"
                  style={{ 
                    backgroundColor: colors.input, 
                    color: colors.body, 
                    border: `1px solid ${colors.border}`,
                    outline: 'none',
                    minHeight: '100px',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      !isProcessing && userInput.trim() && startWorkflow();
                    }
                  }}
                  disabled={isProcessing}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    {!isProcessing ? (
                      <>
                        <button
                          onClick={startWorkflow}
                          className="px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
                          style={{ backgroundColor: colors.primary, color: '#fff' }}
                          disabled={!userInput.trim()}
                        >
                          <Zap size={18} />
                          开始创作
                        </button>
                        <button
                          onClick={resetWorkflow}
                          className="px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:opacity-80"
                          style={{ backgroundColor: colors.input, color: colors.body }}
                        >
                          <RotateCcw size={16} />
                          重置
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={stopWorkflow}
                        className="px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:opacity-80"
                        style={{ backgroundColor: colors.error || '#ef4444', color: '#fff' }}
                      >
                        <X size={18} />
                        停止
                      </button>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: colors.muted }}>
                    Enter 快速开始 · Shift+Enter 换行
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 模板选择 */}
          {!isProcessing && workflowNodes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} style={{ color: colors.primary }} />
                <span className="text-sm font-medium">快速模板</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => applyTemplate(template)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      activeTemplate === template.id ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: activeTemplate === template.id ? `${colors.primary}20` : colors.input,
                      borderColor: activeTemplate === template.id ? colors.primary : 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{template.icon}</span>
                      <span className="text-sm font-medium" style={{ color: colors.title }}>
                        {template.title}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: colors.muted }}>{template.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 工作流进度 */}
          {workflowNodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 glass-card rounded-xl p-6 overflow-hidden flex flex-col"
              style={{ border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Workflow size={20} style={{ color: colors.primary }} />
                  工作流进度
                </h3>
                <span className="text-sm" style={{ color: colors.muted }}>
                  {completedCount}/{totalCount} 完成
                </span>
              </div>

              <div className="mb-4">
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.muted}20` }}>
                  <motion.div 
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                    style={{ backgroundColor: colors.primary }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {workflowNodes.map((node, index) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3.5 rounded-xl transition-all"
                      style={{ 
                        backgroundColor: node.status === 'running' ? `${colors.primary}10` : colors.input,
                        border: node.status === 'running' ? `1px solid ${colors.primary}30` : '1px solid transparent'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {node.status === 'idle' && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.muted}20` }}>
                              {getNodeIcon(node.type)}
                            </div>
                          )}
                          {node.status === 'running' && (
                            <motion.div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              style={{ backgroundColor: `${colors.warning}20` }}
                            >
                              <Clock size={14} className="animate-spin" style={{ color: colors.warning }} />
                            </motion.div>
                          )}
                          {node.status === 'completed' && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.success}20` }}>
                              <CheckCircle2 size={14} style={{ color: colors.success }} />
                            </div>
                          )}
                          {node.status === 'error' && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.error}20` }}>
                              <AlertCircle size={14} style={{ color: colors.error }} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium" style={{ 
                              color: node.status === 'completed' ? colors.success : 
                                     node.status === 'running' ? colors.warning : colors.title 
                            }}>
                              {node.name}
                            </span>
                            {node.status === 'running' && (
                              <span className="text-xs" style={{ color: colors.warning }}>{node.progress}%</span>
                            )}
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.muted}15` }}>
                            <motion.div 
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${node.progress}%` }}
                              transition={{ duration: 0.3 }}
                              style={{ backgroundColor: getNodeColor(node.status) }}
                            />
                          </div>
                          {node.result && node.status === 'completed' && (
                            <p className="text-xs mt-1.5 truncate" style={{ color: colors.muted }}>
                              {node.result}
                            </p>
                          )}
                        </div>
                        {index < workflowNodes.length - 1 && (
                          <ChevronRight size={14} style={{ color: colors.muted, opacity: 0.3 }} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {allCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-5 rounded-xl text-center"
                  style={{ backgroundColor: `${colors.success}10`, border: `1px solid ${colors.success}30` }}
                >
                  <CheckCircle2 size={36} style={{ color: colors.success, margin: '0 auto 12px' }} />
                  <h4 className="font-semibold text-lg mb-2">🎉 创作完成！</h4>
                  <p className="text-sm mb-4" style={{ color: colors.muted }}>
                    你的短剧已全部生成完毕，包含剧本、分镜、角色、配音方案和字幕
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      onClick={() => {
                        const { setCurrentModule } = useAppStore.getState();
                        setCurrentModule('export');
                      }}
                      className="px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: colors.primary, color: '#fff' }}
                    >
                      <Download size={18} />
                      导出成品
                    </button>
                    <button
                      onClick={() => {
                        const { setCurrentModule } = useAppStore.getState();
                        setCurrentModule('script');
                        if (generatedScript) {
                          addToast({ type: 'info', title: '剧本已生成', message: '可在剧本编辑器中查看和修改' });
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:opacity-80"
                      style={{ backgroundColor: colors.input, color: colors.body }}
                    >
                      <FileText size={18} />
                      查看剧本
                    </button>
                    <button
                      onClick={resetWorkflow}
                      className="px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:opacity-80"
                      style={{ backgroundColor: colors.input, color: colors.body }}
                    >
                      <RotateCcw size={18} />
                      重新创作
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 空状态 */}
          {workflowNodes.length === 0 && !isProcessing && (
            <div className="flex-1 glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center" style={{ border: `1px solid ${colors.border}` }}>
              <motion.div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Sparkles size={48} style={{ color: colors.primary }} />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">开始你的 AI 创作之旅</h3>
              <p className="mb-6" style={{ color: colors.muted, maxWidth: '450px' }}>
                只需描述你的创意想法，DeepSeek AI 将自动完成从剧本到成品的全部流程
              </p>
              <div className="flex items-center gap-6 text-sm" style={{ color: colors.muted }}>
                <div className="flex items-center gap-1.5">
                  <FileText size={14} />
                  <span>智能编剧</span>
                </div>
                <ArrowRight size={14} />
                <div className="flex items-center gap-1.5">
                  <Video size={14} />
                  <span>AI 分镜</span>
                </div>
                <ArrowRight size={14} />
                <div className="flex items-center gap-1.5">
                  <Mic size={14} />
                  <span>自动配音</span>
                </div>
                <ArrowRight size={14} />
                <div className="flex items-center gap-1.5">
                  <Subtitles size={14} />
                  <span>智能字幕</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 日志面板 */}
        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '340px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div 
                className="h-full glass-card rounded-xl p-4 flex flex-col"
                style={{ border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Terminal size={18} style={{ color: colors.primary }} />
                    运行日志
                  </h3>
                  <button
                    onClick={() => setLogMessages([])}
                    className="text-xs px-2 py-1 rounded hover:opacity-80"
                    style={{ backgroundColor: colors.input, color: colors.muted }}
                  >
                    清空
                  </button>
                </div>
                <div 
                  className="flex-1 overflow-y-auto p-3 rounded-lg font-mono text-xs"
                  style={{ backgroundColor: '#0d1117', color: '#c9d1d9' }}
                >
                  {logMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full" style={{ color: '#484f58' }}>
                      <Terminal size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                      <p>等待 AI 启动...</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {logMessages.map((log, i) => (
                        <div key={i} className="leading-relaxed">{log}</div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntelliStudio;