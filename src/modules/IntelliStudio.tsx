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
  ChevronRight,
  Image as ImageIcon,
  Volume2,
  Cpu,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { themes } from '../hooks/useTheme';
import { aiManager } from '../services/aiManager';
import { useModelStore } from '../store/modelStore';
import { AI_PROVIDERS } from '../services/aiModels';

type WorkflowNode = {
  id: string;
  type: 'llm' | 'script' | 'video' | 'audio' | 'voice' | 'subtitle' | 'export' | 'image' | 'tts';
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  logs: string[];
  result?: string;
};

const IntelliStudio: React.FC = () => {
  const { theme, addToast } = useAppStore();
  const colors = themes[theme];
  const { chatModel, imageModel, ttsModel, voiceSettings, syncToManager } = useModelStore();
  
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([]);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState('');
  const [generatedStoryboard, setGeneratedStoryboard] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState('');
  const [advancedMode, setAdvancedMode] = useState(false);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logMessages]);

  useEffect(() => {
    syncToManager();
  }, []);

  const templates = [
    { id: 'romance', icon: '💕', title: '都市爱情', desc: '霸道总裁、甜宠剧情', prompt: '创作一个都市爱情短剧：咖啡店女老板与建筑设计师的浪漫邂逅，30集竖屏短剧，每集1-2分钟' },
    { id: 'fantasy', icon: '⚔️', title: '古风仙侠', desc: '玄幻修仙、古装题材', prompt: '创作一个古风仙侠短剧：凡人少年意外获得修仙秘籍，踏上逆天改命之路，40集竖屏短剧' },
    { id: 'mystery', icon: '🔍', title: '悬疑推理', desc: '烧脑剧情、反转结局', prompt: '创作一个悬疑推理短剧：小镇发生连环失踪案，新来的警探发现背后隐藏着惊天秘密，25集竖屏短剧' },
    { id: 'comedy', icon: '😂', title: '喜剧搞笑', desc: '轻松幽默、段子剧情', prompt: '创作一个喜剧短剧：三个性格迥异的室友的爆笑日常，轻松幽默风格，20集竖屏短剧' },
    { id: 'scifi', icon: '🚀', title: '科幻未来', desc: '未来世界、AI 题材', prompt: '创作一个科幻短剧：2045年，AI 觉醒后与人类共存的世界，30集竖屏短剧' },
    { id: 'horror', icon: '👻', title: '惊悚恐怖', desc: '悬疑惊悚、心理恐惧', prompt: '创作一个惊悚短剧：搬进新家的年轻夫妇发现房子里的诡异现象，心理恐惧层层递进，15集竖屏短剧' },
  ];

  const buildWorkflow = (): WorkflowNode[] => {
    const nodes: WorkflowNode[] = [
      { id: 'analyze', type: 'llm', name: '需求分析', status: 'idle', progress: 0, logs: [] },
      { id: 'script', type: 'script', name: '剧本生成', status: 'idle', progress: 0, logs: [] },
      { id: 'character', type: 'llm', name: '角色设计', status: 'idle', progress: 0, logs: [] },
      { id: 'storyboard', type: 'llm', name: '分镜规划', status: 'idle', progress: 0, logs: [] },
    ];
    if (advancedMode) {
      nodes.push({ id: 'imageGen', type: 'image', name: 'AI 图片生成', status: 'idle', progress: 0, logs: [] });
    }
    nodes.push(
      { id: 'video', type: 'video', name: '视频方案', status: 'idle', progress: 0, logs: [] },
      { id: 'voice', type: 'voice', name: '配音方案', status: 'idle', progress: 0, logs: [] },
    );
    if (advancedMode) {
      nodes.push({ id: 'ttsGen', type: 'tts', name: 'AI 语音合成', status: 'idle', progress: 0, logs: [] });
    }
    nodes.push(
      { id: 'subtitle', type: 'subtitle', name: '字幕生成', status: 'idle', progress: 0, logs: [] },
      { id: 'export', type: 'export', name: '导出汇总', status: 'idle', progress: 0, logs: [] },
    );
    return nodes;
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

  const getChatProviderName = () => {
    const provider = AI_PROVIDERS.find(p => p.id === chatModel.providerId);
    return provider?.name || 'AI';
  };

  const getImageProviderName = () => {
    const provider = AI_PROVIDERS.find(p => p.id === imageModel.providerId);
    return provider?.name || 'AI';
  };

  const getTTSProviderName = () => {
    const provider = AI_PROVIDERS.find(p => p.id === ttsModel.providerId);
    return provider?.name || 'AI';
  };

  const aiChat = async (systemPrompt: string, userPrompt: string, maxTokens = 4096, temperature = 0.7) => {
    return aiManager.chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { maxTokens, temperature });
  };

  const startWorkflow = async () => {
    if (!userInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setLogMessages([]);
    setGeneratedScript('');
    setGeneratedStoryboard('');
    setGeneratedImageUrl('');
    setGeneratedAudioUrl('');
    
    const modelName = getChatProviderName();
    addLog(`🚀 IntelliStudio 启动 · ${modelName} AI 引擎就绪`);
    addLog(`📝 用户需求: "${userInput}"`);
    addToast({ type: 'info', title: 'AI 开始创作', message: `${modelName} 正在分析你的需求...` });
    
    const workflow = buildWorkflow();
    setWorkflowNodes(workflow);
    
    try {
      addLog('⏳ 步骤 1/' + workflow.length + ': AI 需求分析...');
      updateNodeStatus('analyze', { status: 'running' });
      const clearAnalyze = simulateProgress('analyze', 3000);
      
      const intentResp = await aiChat(
        '你是影视内容分析师。分析用户需求，返回 JSON：{"genre":"题材","complexity":"简单/复杂","targetLength":"集数","tone":"风格"}',
        userInput,
        512,
        0.3
      );
      clearAnalyze();
      
      let intent: { genre: string; complexity: string; targetLength: string; tone: string };
      try {
        const content = intentResp.choices[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        intent = jsonMatch ? JSON.parse(jsonMatch[0]) : { genre: '剧情', complexity: '中等', targetLength: '20集', tone: '标准' };
      } catch {
        intent = { genre: '剧情', complexity: '中等', targetLength: '20集', tone: '标准' };
      }
      
      updateNodeStatus('analyze', { status: 'completed', progress: 100 });
      addLog(`✅ 需求分析完成 · 题材: ${intent.genre} · 风格: ${intent.tone}`);
      await new Promise(r => setTimeout(r, 500));

      addLog('⏳ 步骤 2/' + workflow.length + ': AI 剧本生成中...');
      updateNodeStatus('script', { status: 'running' });
      const clearScript = simulateProgress('script', 35000);
      
      const scriptResp = await aiChat(
        `你是专业短剧编剧。根据需求创作完整短剧剧本。
格式要求：
- 总集数：${intent.targetLength}
- 每集时长：1-2分钟
- 包含：剧名、剧情简介、角色列表、分集大纲（前5集详细）
- 风格：${intent.tone}
- 适合竖屏观看`,
        `创作需求：${userInput}`,
        8192,
        0.8
      );
      clearScript();
      
      const script = scriptResp.choices[0]?.message?.content || '';
      setGeneratedScript(script);
      updateNodeStatus('script', { status: 'completed', progress: 100, result: script.slice(0, 200) });
      addLog(`✅ 剧本生成完成 · ${script.length} 字符`);
      await new Promise(r => setTimeout(r, 500));

      addLog('⏳ 步骤 3/' + workflow.length + ': 角色设定生成...');
      updateNodeStatus('character', { status: 'running' });
      const clearChar = simulateProgress('character', 8000);
      
      const charResp = await aiChat(
        '你是角色设计师。根据剧本提取角色信息，格式：姓名 | 年龄 | 性格 | 外貌描述 | 角色关系',
        `从以下剧本中提取所有角色的详细设定：\n\n${script.slice(0, 3000)}`,
        2048,
        0.5
      );
      clearChar();
      updateNodeStatus('character', { status: 'completed', progress: 100, result: charResp.choices[0]?.message?.content?.slice(0, 200) });
      addLog('✅ 角色设计完成');
      await new Promise(r => setTimeout(r, 500));

      addLog('⏳ 步骤 4/' + workflow.length + ': AI 分镜规划中...');
      updateNodeStatus('storyboard', { status: 'running' });
      const clearSB = simulateProgress('storyboard', 20000);
      
      const sbResp = await aiChat(
        '你是分镜师。按照以下格式为每个镜头标注：镜头号 | 时长 | 景别 | 运镜方式 | 画面描述 | 对话/旁白 | 备注',
        `为以下剧本设计详细分镜表（8-12个关键镜头）：\n\n${script.slice(0, 3000)}`,
        4096,
        0.7
      );
      clearSB();
      
      const storyboard = sbResp.choices[0]?.message?.content || '';
      setGeneratedStoryboard(storyboard);
      updateNodeStatus('storyboard', { status: 'completed', progress: 100, result: storyboard.slice(0, 200) });
      addLog(`✅ 分镜规划完成 · ${storyboard.length} 字符`);
      await new Promise(r => setTimeout(r, 500));

      if (advancedMode) {
        addLog(`⏳ 步骤 5/' + workflow.length + ': AI 图片生成中（${getImageProviderName()}）...`);
        updateNodeStatus('imageGen', { status: 'running' });
        const clearImg = simulateProgress('imageGen', 15000);
        
        try {
          const sceneDesc = storyboard.slice(0, 500);
          const imgPromptResp = await aiChat(
            '你是视觉设计师。根据剧本生成高质量的图片生成提示词（英文），适合 AI 画图。风格：电影感、竖屏9:16',
            `为以下场景生成图片提示词：\n${sceneDesc}\n\n请给出一个详细的英文 prompt。`,
            512,
            0.7
          );
          
          const imgPrompt = imgPromptResp.choices[0]?.message?.content?.trim() || 'cinematic scene, dramatic lighting, 9:16 aspect ratio';
          addLog(`  📸 图片 Prompt: ${imgPrompt.slice(0, 100)}...`);
          
          const imgResult = await aiManager.generateImage(imgPrompt, { size: '1024x1024', n: 1 });
          if (imgResult.data?.[0]?.url) {
            setGeneratedImageUrl(imgResult.data[0].url);
            addLog('  ✅ AI 图片生成成功');
            updateNodeStatus('imageGen', { status: 'completed', progress: 100, result: '图片已生成' });
          }
        } catch (imgErr) {
          addLog(`  ⚠️ 图片生成失败: ${imgErr instanceof Error ? imgErr.message : String(imgErr)}（继续其他步骤）`);
          updateNodeStatus('imageGen', { status: 'completed', progress: 100, result: '生成失败，已跳过' });
        }
        clearImg();
        await new Promise(r => setTimeout(r, 500));
      }

      const nextIdx = advancedMode ? 6 : 5;
      addLog(`⏳ 步骤 ${nextIdx}/' + workflow.length + ': 视频方案规划...`);
      updateNodeStatus('video', { status: 'running' });
      const clearVideo = simulateProgress('video', 6000);
      
      const videoResp = await aiChat(
        '你是视频制作顾问。给出视频制作建议：分辨率、帧率、转场风格、特效建议',
        `剧本: ${script.slice(0, 1000)}\n分镜: ${storyboard.slice(0, 1000)}`,
        1024,
        0.5
      );
      clearVideo();
      updateNodeStatus('video', { status: 'completed', progress: 100, result: videoResp.choices[0]?.message?.content?.slice(0, 200) });
      addLog('✅ 视频方案规划完成');
      await new Promise(r => setTimeout(r, 500));

      const voiceIdx = advancedMode ? 7 : 6;
      addLog(`⏳ 步骤 ${voiceIdx}/' + workflow.length + ': 配音角色分配...`);
      updateNodeStatus('voice', { status: 'running' });
      const clearVoice = simulateProgress('voice', 6000);
      
      const voiceResp = await aiChat(
        '你是配音导演。为剧本中的每个角色推荐声音类型（甜美/沉稳/严厉/温柔等）和配音要点',
        `剧本: ${script.slice(0, 2000)}`,
        1024,
        0.5
      );
      clearVoice();
      updateNodeStatus('voice', { status: 'completed', progress: 100, result: voiceResp.choices[0]?.message?.content?.slice(0, 200) });
      addLog('✅ 配音方案完成');
      await new Promise(r => setTimeout(r, 500));

      if (advancedMode) {
        addLog(`⏳ 步骤 ${voiceIdx + 1}/' + workflow.length + ': AI 语音合成中（${getTTSProviderName()}）...`);
        updateNodeStatus('ttsGen', { status: 'running' });
        const clearTTS = simulateProgress('ttsGen', 12000);
        
        try {
          const sampleText = (script.match(/旁白[：:]\s*(.+?)(?:\n|$)/) || script.match(/[^。]+。/))?.[0]?.slice(0, 200) || '欢迎来到 AI 短剧创作平台';
          const ttsResult = await aiManager.generateSpeech(sampleText, {
            voice: voiceSettings.voice,
            speed: voiceSettings.speed,
          });
          if (ttsResult.audioUrl) {
            setGeneratedAudioUrl(ttsResult.audioUrl);
            addLog('  ✅ AI 语音合成成功');
            updateNodeStatus('ttsGen', { status: 'completed', progress: 100, result: '语音已合成' });
          }
        } catch (ttsErr) {
          addLog(`  ⚠️ 语音合成失败: ${ttsErr instanceof Error ? ttsErr.message : String(ttsErr)}（继续其他步骤）`);
          updateNodeStatus('ttsGen', { status: 'completed', progress: 100, result: '合成失败，已跳过' });
        }
        clearTTS();
        await new Promise(r => setTimeout(r, 500));
      }

      const subIdx = advancedMode ? 9 : 7;
      addLog(`⏳ 步骤 ${subIdx}/' + workflow.length + ': 智能字幕生成...`);
      updateNodeStatus('subtitle', { status: 'running' });
      const clearSub = simulateProgress('subtitle', 8000);
      
      const subResp = await aiChat(
        '你根据剧本生成 SRT 格式字幕，每句独立时间轴，适合短剧口播风格',
        `剧本：${script.slice(0, 3000)}`,
        4096,
        0.4
      );
      clearSub();
      updateNodeStatus('subtitle', { status: 'completed', progress: 100, result: subResp.choices[0]?.message?.content?.slice(0, 200) });
      addLog('✅ 字幕生成完成');
      await new Promise(r => setTimeout(r, 500));

      const expIdx = advancedMode ? 10 : 8;
      addLog(`⏳ 步骤 ${expIdx}/' + workflow.length + ': 汇总所有产出...`);
      updateNodeStatus('export', { status: 'running' });
      const clearExport = simulateProgress('export', 2000);
      await new Promise(r => setTimeout(r, 2000));
      clearExport();
      updateNodeStatus('export', { status: 'completed', progress: 100 });
      addLog('✅ 导出汇总完成');
      
      addLog('🎉 全流程完成！剧本 + 分镜 + 配音 + 字幕 + ' + (advancedMode ? '图片 + 语音' : '') + ' 已就绪！');
      addToast({ type: 'success', title: '创作完成！', message: `${getChatProviderName()} 已完成全流程创作` });
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
    setGeneratedImageUrl('');
    setGeneratedAudioUrl('');
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
      case 'image': return <ImageIcon size={14} />;
      case 'tts': return <Volume2 size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  const completedCount = workflowNodes.filter(n => n.status === 'completed').length;
  const totalCount = workflowNodes.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="h-full flex flex-col p-4 md:p-6 pb-20 md:pb-6 overflow-hidden" style={{ color: colors.title }}>
      <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 rounded-xl" style={{ backgroundColor: `${colors.primary}20` }}>
            <Sparkles style={{ color: colors.primary }} size={22} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold">IntelliStudio</h1>
            <p className="text-xs md:text-sm flex items-center gap-1.5" style={{ color: colors.muted }}>
              <Cpu size={12} style={{ color: colors.primary }} />
              {getChatProviderName()} AI 驱动 · 一站式短剧智能创作
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setAdvancedMode(!advancedMode)}
            className={`p-2 md:p-2.5 rounded-lg transition-all hover:opacity-80 text-xs md:text-sm font-medium flex items-center gap-1.5`}
            style={{ 
              backgroundColor: advancedMode ? `${colors.primary}25` : colors.input,
              color: advancedMode ? colors.primary : colors.body,
              border: advancedMode ? `1px solid ${colors.primary}40` : '1px solid transparent'
            }}
          >
            <Zap size={16} />
            {advancedMode ? '高级模式' : '基础模式'}
          </button>
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="p-2 md:p-2.5 rounded-lg transition-all hover:opacity-80 relative"
            style={{ backgroundColor: colors.input }}
            title="运行日志"
          >
            <Terminal size={18} className="md:w-5 md:h-5" style={{ color: colors.body }} />
            {logMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                {logMessages.filter(l => l.includes('✅') || l.includes('❌')).length}
              </span>
            )}
          </button>
          {isProcessing ? (
            <button 
              onClick={stopWorkflow}
              className="p-2 md:p-2.5 rounded-lg transition-all hover:opacity-80 flex items-center gap-1.5"
              style={{ backgroundColor: `${colors.error}20`, color: colors.error }}
            >
              <X size={18} />
              <span className="text-xs md:text-sm font-medium hidden sm:inline">停止</span>
            </button>
          ) : (
            <button 
              onClick={resetWorkflow}
              className="p-2 md:p-2.5 rounded-lg transition-all hover:opacity-80"
              style={{ backgroundColor: colors.input }}
              title="重置"
            >
              <RotateCcw size={18} style={{ color: colors.body }} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
          {!isProcessing && workflowNodes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="p-4 rounded-xl" style={{ backgroundColor: colors.input }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={18} style={{ color: colors.primary }} />
                  <span className="font-semibold text-sm">快速模板</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className={`p-3 rounded-lg text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        activeTemplate === template.id ? 'ring-2' : ''
                      }`}
                      style={{ 
                        backgroundColor: activeTemplate === template.id ? `${colors.primary}15` : colors.card,
                        borderColor: activeTemplate === template.id ? colors.primary : 'transparent',
                        borderWidth: 1
                      }}
                    >
                      <span className="text-xl">{template.icon}</span>
                      <div className="font-semibold text-sm mt-1" style={{ color: colors.title }}>{template.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: colors.muted }}>{template.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        startWorkflow();
                      }
                    }}
                    placeholder="描述你想要创作的短剧... 例如：创作一个关于创业者的励志短剧，30集，每集1分钟，主角是有梦想的年轻人..."
                    rows={4}
                    className="w-full p-3 rounded-xl text-sm resize-none outline-none"
                    style={{ backgroundColor: colors.card, color: colors.title, border: `1px solid ${colors.border}` }}
                  />
                </div>
                <button
                  onClick={startWorkflow}
                  disabled={!userInput.trim()}
                  className="px-4 md:px-6 rounded-xl font-semibold text-sm md:text-base flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed self-stretch"
                  style={{ backgroundColor: colors.primary, color: '#fff' }}
                >
                  <span className="hidden sm:inline">开始创作</span>
                  <ArrowRight size={18} />
                </button>
              </div>
              
              <p className="text-xs flex items-center gap-1" style={{ color: colors.muted }}>
                <Cpu size={12} />
                当前对话模型：{getChatProviderName()} · 图片模型：{getImageProviderName()} · 语音模型：{getTTSProviderName()}
              </p>
            </motion.div>
          )}

          {workflowNodes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Workflow size={18} style={{ color: colors.primary }} />
                  <span className="font-semibold text-sm">创作流程 ({completedCount}/{totalCount})</span>
                  {isProcessing && <span className="text-xs px-2 py-0.5 rounded-full animate-pulse" style={{ backgroundColor: `${colors.warning}20`, color: colors.warning }}>运行中</span>}
                  {allCompleted && <CheckCircle2 size={16} style={{ color: colors.success }} />}
                </div>
                {!isProcessing && (
                  <button
                    onClick={resetWorkflow}
                    className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{ backgroundColor: colors.input, color: colors.muted }}
                  >
                    <RotateCcw size={12} /> 重新开始
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {workflowNodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg"
                    style={{ backgroundColor: colors.input }}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${getNodeColor(node.status)}20` }}
                    >
                      {node.status === 'running' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles size={14} style={{ color: getNodeColor(node.status) }} />
                        </motion.div>
                      ) : node.status === 'completed' ? (
                        <CheckCircle2 size={14} style={{ color: getNodeColor(node.status) }} />
                      ) : node.status === 'error' ? (
                        <AlertCircle size={14} style={{ color: getNodeColor(node.status) }} />
                      ) : (
                        <span style={{ color: getNodeIcon(node.type) ? undefined : getNodeColor(node.status) }}>
                          {getNodeIcon(node.type)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{node.name}</span>
                        <span className="text-xs flex-shrink-0 ml-2" style={{ color: colors.muted }}>
                          {node.status === 'idle' ? '等待中' : 
                           node.status === 'completed' ? '完成' : 
                           node.status === 'error' ? '出错' : `${node.progress}%`}
                        </span>
                      </div>
                      {node.status === 'running' && (
                        <div className="mt-1 h-1 rounded-full w-full" style={{ backgroundColor: colors.border }}>
                          <motion.div 
                            className="h-full rounded-full"
                            style={{ backgroundColor: getNodeColor(node.status), width: `${node.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {generatedImageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: colors.input }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon size={16} style={{ color: colors.primary }} />
                    <span className="text-sm font-semibold">AI 生成的场景图</span>
                  </div>
                  <img 
                    src={generatedImageUrl} 
                    alt="AI Generated" 
                    className="w-full rounded-lg object-cover max-h-64"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </motion.div>
              )}

              {generatedAudioUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: colors.input }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 size={16} style={{ color: colors.primary }} />
                    <span className="text-sm font-semibold">AI 语音合成</span>
                  </div>
                  <audio controls className="w-full" src={generatedAudioUrl} />
                </motion.div>
              )}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div 
                className="p-3 rounded-xl h-64 lg:h-full"
                style={{ backgroundColor: '#1a1a2e', color: '#e0e0e0' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-green-400 flex items-center gap-1.5">
                    <Terminal size={12} /> 运行日志
                  </span>
                  <span className="text-xs text-gray-500">{logMessages.length} 条</span>
                </div>
                <div className="overflow-y-auto h-[calc(100%-28px)] font-mono text-xs leading-relaxed">
                  {logMessages.length === 0 ? (
                    <div className="text-gray-500 italic">等待任务开始...</div>
                  ) : (
                    logMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="py-0.5"
                        style={{ color: msg.includes('❌') ? '#ef4444' : msg.includes('✅') ? '#10b981' : msg.includes('⚠️') ? '#f59e0b' : '#e0e0e0' }}
                      >
                        {msg}
                      </motion.div>
                    ))
                  )}
                  <div ref={logEndRef} />
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