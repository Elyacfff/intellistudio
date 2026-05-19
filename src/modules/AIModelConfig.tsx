import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import { useModelStore } from '@/store/modelStore';
import { AI_PROVIDERS, VOICE_OPTIONS, type UserModelConfig } from '@/services/aiModels';
import { aiManager } from '@/services/aiManager';
import {
  Brain, Image, Mic, Key, Globe, Cpu, CheckCircle2, XCircle, TestTube,
  Sparkles, AlertCircle, Info, RefreshCw, Eye, EyeOff, Trash2, Plus, Settings2,
  Zap, ArrowRight, ChevronDown, ExternalLink
} from 'lucide-react';

type ConfigTab = 'chat' | 'image' | 'tts';

const AIModelConfig: React.FC = () => {
  const { t } = useTranslation();
  const { theme: appTheme } = useAppStore();
  const colors = themes[appTheme];
  const {
    providers, chatModel, imageModel, ttsModel, voiceSettings,
    setProviderConfig, setChatModel, setImageModel, setTTSModel,
    setVoiceSettings, syncToManager,
  } = useModelStore();

  const [activeTab, setActiveTab] = useState<ConfigTab>('chat');
  const [testStatus, setTestStatus] = useState<Record<string, { testing: boolean; result?: { success: boolean; message: string; models?: string[] } }>>({});
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  const currentModel = activeTab === 'chat' ? chatModel : activeTab === 'image' ? imageModel : ttsModel;
  const setCurrentModel = activeTab === 'chat' ? setChatModel : activeTab === 'image' ? setImageModel : setTTSModel;
  const filteredProviders = AI_PROVIDERS.filter((p) => {
    if (activeTab === 'chat') return p.supportsChat;
    if (activeTab === 'image') return p.supportsImage;
    if (activeTab === 'tts') return p.supportsTTS;
    return false;
  });

  useEffect(() => {
    syncToManager();
  }, [chatModel, imageModel, ttsModel, providers, syncToManager]);

  const handleProviderSelect = (providerId: string) => {
    const provider = AI_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) return;

    const defaultModel = provider.models.find((m) => m.type === activeTab);
    const providerConfig = providers[providerId];

    setCurrentModel({
      providerId,
      modelId: defaultModel?.id || provider.models[0]?.id || '',
      apiKey: providerConfig?.apiKey || '',
      baseUrl: providerConfig?.baseUrl || provider.defaultBaseUrl,
      temperature: currentModel.temperature,
      maxTokens: currentModel.maxTokens || (activeTab === 'chat' ? 8192 : 0),
      isCustom: providerId === 'custom',
      label: provider.name,
      enabled: true,
    } as Partial<UserModelConfig>);

    if (activeTab === 'tts' && providerId === 'edge-tts') {
      setVoiceSettings({ voice: 'zh-CN-XiaoxiaoNeural' });
    }
  };

  const handleApiKeyChange = (providerId: string, apiKey: string) => {
    setProviderConfig(providerId, { apiKey, enabled: apiKey.length > 0 || providerId === 'edge-tts' || providerId === 'ollama' });

    if (currentModel.providerId === providerId) {
      setCurrentModel({ apiKey } as Partial<UserModelConfig>);
    }
  };

  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKey((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const handleTestConnection = async (providerId: string) => {
    setTestStatus((prev) => ({ ...prev, [providerId]: { testing: true } }));
    const config = providers[providerId];
    if (!config) {
      setTestStatus((prev) => ({ ...prev, [providerId]: { testing: false, result: { success: false, message: '未找到提供商配置' } } }));
      return;
    }
    try {
      const result = await aiManager.testConnection(providerId, config.apiKey, config.baseUrl);
      setTestStatus((prev) => ({ ...prev, [providerId]: { testing: false, result } }));
    } catch (err) {
      setTestStatus((prev) => ({
        ...prev,
        [providerId]: { testing: false, result: { success: false, message: err instanceof Error ? err.message : String(err) } },
      }));
    }
  };

  const handleModelSelect = (modelId: string) => {
    setCurrentModel({ modelId, isCustom: false } as Partial<UserModelConfig>);
  };

  const handleCustomModelName = (name: string) => {
    setCurrentModel({ modelId: name, isCustom: true } as Partial<UserModelConfig>);
  };

  const handleBaseUrlChange = (url: string) => {
    setProviderConfig(currentModel.providerId, { baseUrl: url });
    setCurrentModel({ baseUrl: url } as Partial<UserModelConfig>);
  };

  const isProviderConfigured = (providerId: string) => {
    const p = providers[providerId];
    if (!p) return false;
    if (providerId === 'edge-tts' || providerId === 'ollama') return p.enabled;
    return p.enabled && p.apiKey.length > 0;
  };

  const getCurrentProvider = () => AI_PROVIDERS.find((p) => p.id === currentModel.providerId);
  const currentProvider = getCurrentProvider();

  const tabs: { id: ConfigTab; icon: React.ReactNode; label: string }[] = [
    { id: 'chat', icon: <Brain size={18} />, label: '对话模型' },
    { id: 'image', icon: <Image size={18} />, label: '图片模型' },
    { id: 'tts', icon: <Mic size={18} />, label: '语音模型' },
  ];

  return (
    <div className="h-full overflow-auto p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${colors.primary}20` }}>
              <Settings2 size={22} style={{ color: colors.primary }} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold" style={{ color: colors.title }}>AI 模型配置</h1>
              <p className="text-sm" style={{ color: colors.muted }}>配置自定义 AI 模型，支持国内外所有主流大模型</p>
            </div>
          </div>
        </motion.div>

        {/* 状态提示 */}
        {!isProviderConfigured(currentModel.providerId) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl flex items-start gap-3"
            style={{ backgroundColor: `${colors.warning}15`, border: `1px solid ${colors.warning}40` }}
          >
            <AlertCircle size={20} style={{ color: colors.warning, flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="font-medium text-sm" style={{ color: colors.warning }}>需要配置 API Key</p>
              <p className="text-xs mt-0.5" style={{ color: colors.muted }}>
                请在下方选择一个 AI 服务商，并填入你的 API Key 以开始使用
              </p>
            </div>
          </motion.div>
        )}

        {/* 类型切换 */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: colors.input }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? colors.card : 'transparent',
                  color: isActive ? colors.primary : colors.muted,
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 提供商选择 */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.title }}>
            <Globe size={16} style={{ color: colors.primary }} />
            选择 AI 服务商
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredProviders.map((provider) => {
              const isSelected = currentModel.providerId === provider.id;
              const configured = isProviderConfigured(provider.id);
              return (
                <motion.button
                  key={provider.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleProviderSelect(provider.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all text-left flex items-start gap-3 ${
                    isSelected ? 'ring-1' : ''
                  }`}
                  style={{
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? `${colors.primary}10` : colors.card,
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{provider.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate" style={{ color: colors.title }}>{provider.name}</span>
                      {configured && (
                        <CheckCircle2 size={14} style={{ color: colors.success, flexShrink: 0 }} />
                      )}
                    </div>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: colors.muted }}>{provider.description}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {provider.models.filter((m) => m.type === activeTab).slice(0, 3).map((m) => (
                        <span
                          key={m.id}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: colors.input, color: colors.muted }}
                        >
                          {m.name}
                        </span>
                      ))}
                      {provider.models.filter((m) => m.type === activeTab).length > 3 && (
                        <span className="text-xs" style={{ color: colors.muted }}>
                          +{provider.models.filter((m) => m.type === activeTab).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 当前提供商详细配置 */}
        {currentProvider && (
          <motion.div
            key={currentModel.providerId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl space-y-4"
            style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentProvider.icon}</span>
                <span className="font-semibold" style={{ color: colors.title }}>{currentProvider.name}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                  {activeTab === 'chat' ? '文本对话' : activeTab === 'image' ? '图片生成' : '语音合成'}
                </span>
              </div>
              <button
                onClick={() => handleTestConnection(currentModel.providerId)}
                disabled={testStatus[currentModel.providerId]?.testing}
                className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all hover:opacity-80"
                style={{ backgroundColor: colors.input, color: colors.body }}
              >
                {testStatus[currentModel.providerId]?.testing ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <TestTube size={14} />
                )}
                测试连接
              </button>
            </div>

            {/* 测试结果 */}
            {testStatus[currentModel.providerId]?.result && (
              <div
                className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                  testStatus[currentModel.providerId]?.result?.success ? '' : ''
                }`}
                style={{
                  backgroundColor: testStatus[currentModel.providerId]?.result?.success
                    ? `${colors.success}15`
                    : `${colors.error}15`,
                  color: testStatus[currentModel.providerId]?.result?.success ? colors.success : colors.error,
                }}
              >
                {testStatus[currentModel.providerId]?.result?.success ? (
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="flex-shrink-0 mt-0.5" />
                )}
                <span>{testStatus[currentModel.providerId]?.result?.message}</span>
              </div>
            )}

            {/* API Key */}
            {currentModel.providerId !== 'edge-tts' && currentModel.providerId !== 'ollama' && (
              <div>
                <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.muted }}>
                  <Key size={14} />
                  API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey[currentModel.providerId] ? 'text' : 'password'}
                      value={providers[currentModel.providerId]?.apiKey || ''}
                      onChange={(e) => handleApiKeyChange(currentModel.providerId, e.target.value)}
                      placeholder={`输入 ${currentProvider.name} API Key...`}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none pr-10"
                      style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
                    />
                    <button
                      onClick={() => toggleApiKeyVisibility(currentModel.providerId)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2"
                      style={{ color: colors.muted }}
                    >
                      {showApiKey[currentModel.providerId] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: colors.muted }}>
                  <Info size={12} />
                  API Key 仅存储在本地浏览器中，不会上传到任何服务器
                </p>
              </div>
            )}

            {/* Base URL */}
            <div>
              <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.muted }}>
                <Globe size={14} />
                API 端点地址
              </label>
              <input
                type="text"
                value={providers[currentModel.providerId]?.baseUrl || currentProvider.defaultBaseUrl}
                onChange={(e) => handleBaseUrlChange(e.target.value)}
                placeholder={currentProvider.defaultBaseUrl}
                className="w-full px-3 py-2.5 rounded-lg text-sm font-mono outline-none"
                style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}` }}
              />
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                默认: {currentProvider.defaultBaseUrl || '无需设置'} — 如使用中转服务请修改此地址
              </p>
            </div>

            {/* 模型选择 */}
            <div>
              <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.muted }}>
                <Cpu size={14} />
                选择模型
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {currentProvider.models
                  .filter((m) => m.type === activeTab)
                  .map((model) => {
                    const isModelSelected = !currentModel.isCustom && currentModel.modelId === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className={`p-3 rounded-lg text-left transition-all border ${
                          isModelSelected ? 'ring-1' : ''
                        }`}
                        style={{
                          borderColor: isModelSelected ? colors.primary : colors.border,
                          backgroundColor: isModelSelected ? `${colors.primary}15` : colors.input,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm" style={{ color: colors.title }}>{model.name}</span>
                          {isModelSelected && <CheckCircle2 size={14} style={{ color: colors.primary }} />}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: colors.muted }}>{model.description}</p>
                        {model.maxTokens && (
                          <span className="text-xs mt-1 inline-block px-1.5 py-0.5 rounded" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                            {model.maxTokens >= 1000 ? `${Math.round(model.maxTokens / 1000)}K Context` : `${model.maxTokens} tokens`}
                          </span>
                        )}
                        {model.inputPrice && (
                          <span className="text-xs mt-1 inline-block ml-1 px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.input, color: colors.muted }}>
                            {model.inputPrice}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* 自定义模型名 */}

              <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: colors.input }}>
                <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: colors.muted }}>
                  <Plus size={14} />
                  或用自定义模型名（兼容 OpenAI 格式的其他模型）
                </label>
                <input
                  type="text"
                  value={currentModel.isCustom ? currentModel.modelId : ''}
                  onChange={(e) => handleCustomModelName(e.target.value)}
                  placeholder="例如: gpt-4-turbo, claude-3-opus, qwen-max..."
                  className="w-full mt-1.5 px-3 py-2 rounded-lg text-sm font-mono outline-none"
                  style={{ backgroundColor: colors.card, color: colors.body, border: `1px solid ${colors.border}` }}
                />
              </div>
            </div>

            {/* 高级参数 */}
            {activeTab === 'chat' && (
              <div>
                <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.muted }}>
                  <Zap size={14} />
                  高级参数
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: colors.muted }}>Temperature: {currentModel.temperature}</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={currentModel.temperature}
                      onChange={(e) => setCurrentModel({ temperature: parseFloat(e.target.value) } as Partial<UserModelConfig>)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-0.5" style={{ color: colors.muted }}>
                      <span>精确 0</span>
                      <span>创意 2.0</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: colors.muted }}>Max Tokens: {currentModel.maxTokens}</label>
                    <input
                      type="range"
                      min="512"
                      max="32768"
                      step="512"
                      value={currentModel.maxTokens || 4096}
                      onChange={(e) => setCurrentModel({ maxTokens: parseInt(e.target.value) } as Partial<UserModelConfig>)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-0.5" style={{ color: colors.muted }}>
                      <span>512</span>
                      <span>32K</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TTS 语音选择 */}
            {activeTab === 'tts' && VOICE_OPTIONS[currentModel.providerId] && (
              <div>
                <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.muted }}>
                  <Mic size={14} />
                  选择声音
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {VOICE_OPTIONS[currentModel.providerId]?.map((voice) => {
                    const isVoiceSelected = voiceSettings.voice === voice.id;
                    return (
                      <button
                        key={voice.id}
                        onClick={() => setVoiceSettings({ voice: voice.id })}
                        className={`p-2.5 rounded-lg text-left transition-all border ${
                          isVoiceSelected ? 'ring-1' : ''
                        }`}
                        style={{
                          borderColor: isVoiceSelected ? colors.primary : colors.border,
                          backgroundColor: isVoiceSelected ? `${colors.primary}15` : colors.input,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium" style={{ color: colors.title }}>{voice.name}</span>
                          {isVoiceSelected && <CheckCircle2 size={12} style={{ color: colors.primary }} />}
                        </div>
                        <span className="text-xs" style={{ color: colors.muted }}>
                          {voice.language} · {voice.gender === 'female' ? '女' : voice.gender === 'male' ? '男' : '中'}
                        </span>
                      </button>
                    );
                  }) || <p className="text-xs" style={{ color: colors.muted }}>该提供商无预设声音列表</p>}
                </div>
                {currentModel.providerId === 'elevenlabs' && (
                  <p className="text-xs mt-2" style={{ color: colors.muted }}>
                    <Info size={12} className="inline mr-1" />
                    这是默认声音列表，你的 ElevenLabs 账户可能包含更多自定义声音
                  </p>
                )}
              </div>
            )}

            {/* 语音速度 */}
            {activeTab === 'tts' && (
              <div>
                <label className="text-xs font-medium mb-1.5" style={{ color: colors.muted }}>语速: {voiceSettings.speed}x</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings({ speed: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs mt-0.5" style={{ color: colors.muted }}>
                  <span>慢速 0.5x</span>
                  <span>快速 2.0x</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 当前配置摘要 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.title }}>
            <Brain size={16} style={{ color: colors.primary }} />
            当前模型配置总览
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: '对话模型', model: chatModel, icon: <Brain size={14} /> },
              { label: '图片模型', model: imageModel, icon: <Image size={14} /> },
              { label: '语音模型', model: ttsModel, icon: <Mic size={14} /> },
            ].map(({ label, model, icon }) => {
              const provider = AI_PROVIDERS.find((p) => p.id === model.providerId);
              const configured = isProviderConfigured(model.providerId);
              return (
                <div
                  key={label}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: colors.input }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium flex items-center gap-1" style={{ color: colors.muted }}>
                      {icon} {label}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        configured ? '' : ''
                      }`}
                      style={{ backgroundColor: configured ? colors.success : colors.error }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{provider?.icon}</span>
                    <span className="text-sm font-medium truncate" style={{ color: colors.title }}>
                      {provider?.name || '未配置'}
                    </span>
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: colors.muted }}>
                    {model.isCustom ? `自定义: ${model.modelId}` : AI_PROVIDERS.find((p) => p.id === model.providerId)?.models.find((m) => m.id === model.modelId)?.name || model.modelId}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIModelConfig;