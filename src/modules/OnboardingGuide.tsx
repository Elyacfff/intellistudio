import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, Star, Zap, Sparkles, Play, Settings, Brain, Image, Volume2, ChevronRight } from 'lucide-react';
import { useAppStore, themes } from '../store/appStore';

const OnboardingGuide: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setCurrentModule } = useAppStore();
  const colors = themes[theme];
  const isDark = theme !== 'aurora';
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <BookOpen size={36} style={{ color: colors.primary }} />,
      title: '欢迎来到 Drama Studio Pro',
      desc: '国内最强 AI 短剧智能创作平台，支持全模型自定义，一站式完成剧本→分镜→图片→语音全流程创作。',
      tips: ['💡 这是第一步，跟着引导了解核心功能吧'],
    },
    {
      icon: <Brain size={36} style={{ color: colors.secondary }} />,
      title: '1. 配置你的 AI 模型',
      desc: '支持 OpenAI、DeepSeek、Anthropic、Google Gemini、Groq、Ollama 等所有主流 AI。你可以选择自己喜欢的模型来创作，数据 100% 本地存储。',
      action: { label: '去配置 AI 模型 →', module: 'ai-config' },
      tips: ['🔑 建议先配置 OpenAI 或 DeepSeek 的 API Key', '🏠 如果你有本地 GPU，可以用 Ollama 免费使用'],
    },
    {
      icon: <Zap size={36} style={{ color: '#f59e0b' }} />,
      title: '2. 使用 IntelliStudio 开始创作',
      desc: '只需描述你想要的故事，AI 会自动生成剧本、角色设定、分镜脚本。高级模式下还能自动生成配图和语音！',
      action: { label: '进入 IntelliStudio →', module: 'intelli' },
      tips: ['📝 基础模式：只生成文字剧本和分镜', '🎨 高级模式：额外生成 AI 图片和语音'],
    },
    {
      icon: <Image size={36} style={{ color: colors.accent }} />,
      title: '3. 独立工具链',
      desc: '除了 AI 全自动创作，我们还提供剧本编辑器、分镜脚本、视频生成、资产管理、声音克隆、字幕编辑等专业工具。',
      action: { label: '浏览工作台 →', module: 'dashboard' },
      tips: ['🎬 你可以手动调整每一帧的分镜', '🎤 声音克隆功能可以定制专属配音'],
    },
    {
      icon: <Settings size={36} style={{ color: colors.muted }} />,
      title: '4. 自定义你的工作环境',
      desc: '支持极光蓝、暗夜紫、纯黑 AMOLED 三种主题，中/维双语界面切换，窗口透明度调节。移动端完美适配。',
      action: { label: '打开设置 →', module: 'settings' },
      tips: ['🌙 AMOLED 纯黑模式超省电', '📱 手机端底部导航栏方便单手操作'],
    },
    {
      icon: <Star size={36} style={{ color: '#f59e0b' }} />,
      title: '准备就绪！',
      desc: '你已经了解了核心功能，现在开始你的第一个 AI 短剧创作吧！如果遇到任何问题，随时回来查看这个引导。',
      tips: ['🎉 注册即送 50 积分', '💎 ¥19 永久会员解锁全部功能'],
    },
  ];

  const handleAction = (module: string) => {
    setCurrentModule(module);
  };

  const currentStep = steps[step];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="text-center mb-6">
          <div className="text-sm mb-2" style={{ color: colors.muted }}>
            新手引导 · {step + 1}/{steps.length}
          </div>
          <div className="flex gap-1.5 justify-center">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 32 : 8,
                  background: i <= step ? colors.primary : colors.border,
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-6 md:p-8 backdrop-blur-sm"
          style={{ background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.08)', border: `1px solid ${colors.border}` }}
        >
          <div className="text-center mb-6">
            <div className="mb-4">{currentStep.icon}</div>
            <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: colors.text }}>
              {currentStep.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>
              {currentStep.desc}
            </p>
          </div>

          {'action' in currentStep && currentStep.action && (
            <div className="mb-6 text-center">
              <button
                onClick={() => handleAction(currentStep.action!.module)}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: '#fff',
                }}
              >
                {currentStep.action.label} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {currentStep.tips && (
            <div
              className="p-4 rounded-xl space-y-2"
              style={{ background: colors.input }}
            >
              {currentStep.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                  {tip}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
            style={{
              background: step === 0 ? 'transparent' : colors.input,
              color: step === 0 ? 'transparent' : colors.text,
              cursor: step === 0 ? 'default' : 'pointer',
            }}
          >
            <ArrowLeft size={16} /> 上一步
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
              style={{ background: colors.primary, color: '#fff' }}
            >
              下一步 <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentModule('dashboard')}
              className="px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
              style={{ background: colors.success, color: '#fff' }}
            >
              <CheckCircle size={16} /> 开始使用
            </button>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { icon: <Brain size={14} />, label: 'AI 模型', module: 'ai-config' },
            { icon: <Sparkles size={14} />, label: 'AI 创作', module: 'intelli' },
            { icon: <Play size={14} />, label: '工作台', module: 'dashboard' },
            { icon: <Settings size={14} />, label: '设置', module: 'settings' },
          ].map((item) => (
            <button
              key={item.module}
              onClick={() => setCurrentModule(item.module)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium transition-all"
              style={{ background: colors.input, color: colors.muted }}
            >
              {item.icon}
              {item.label}
              <ChevronRight size={12} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;