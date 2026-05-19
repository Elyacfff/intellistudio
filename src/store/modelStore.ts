import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserModelConfig,
  UserProviderConfig,
  DEFAULT_USER_PROVIDERS,
  DEFAULT_CHAT_MODEL,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_TTS_MODEL,
} from '../services/aiModels';
import { aiManager } from '../services/aiManager';

interface ModelState {
  providers: Record<string, UserProviderConfig>;
  chatModel: UserModelConfig;
  imageModel: UserModelConfig;
  ttsModel: UserModelConfig;
  voiceSettings: { voice: string; speed: number };

  setProviderConfig: (providerId: string, config: Partial<UserProviderConfig>) => void;
  setChatModel: (config: Partial<UserModelConfig>) => void;
  setImageModel: (config: Partial<UserModelConfig>) => void;
  setTTSModel: (config: Partial<UserModelConfig>) => void;
  setVoiceSettings: (settings: Partial<{ voice: string; speed: number }>) => void;
  syncToManager: () => void;
}

const loadStoredConfig = (): { providers: Record<string, UserProviderConfig>; chatModel: UserModelConfig; imageModel: UserModelConfig; ttsModel: UserModelConfig } => {
  try {
    const stored = localStorage.getItem('ai-model-config');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        providers: { ...DEFAULT_USER_PROVIDERS, ...parsed.state?.providers },
        chatModel: { ...DEFAULT_CHAT_MODEL, ...parsed.state?.chatModel },
        imageModel: { ...DEFAULT_IMAGE_MODEL, ...parsed.state?.imageModel },
        ttsModel: { ...DEFAULT_TTS_MODEL, ...parsed.state?.ttsModel },
      };
    }
  } catch {}

  return {
    providers: { ...DEFAULT_USER_PROVIDERS },
    chatModel: { ...DEFAULT_CHAT_MODEL },
    imageModel: { ...DEFAULT_IMAGE_MODEL },
    ttsModel: { ...DEFAULT_TTS_MODEL },
  };
};

const initial = loadStoredConfig();

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      providers: initial.providers,
      chatModel: initial.chatModel,
      imageModel: initial.imageModel,
      ttsModel: initial.ttsModel,
      voiceSettings: { voice: 'zh-CN-XiaoxiaoNeural', speed: 1.0 },

      setProviderConfig: (providerId, config) =>
        set((state) => {
          const newProviders = {
            ...state.providers,
            [providerId]: { ...state.providers[providerId], ...config },
          };

          if (config.apiKey !== undefined && providerId === 'deepseek') {
            return {
              providers: newProviders,
              chatModel: config.apiKey
                ? { ...state.chatModel, apiKey: config.apiKey, enabled: true }
                : state.chatModel,
            };
          }
          return { providers: newProviders };
        }),

      setChatModel: (config) =>
        set((state) => ({
          chatModel: { ...state.chatModel, ...config },
        })),

      setImageModel: (config) =>
        set((state) => ({
          imageModel: { ...state.imageModel, ...config },
        })),

      setTTSModel: (config) =>
        set((state) => ({
          ttsModel: { ...state.ttsModel, ...config },
        })),

      setVoiceSettings: (settings) =>
        set((state) => ({
          voiceSettings: { ...state.voiceSettings, ...settings },
        })),

      syncToManager: () => {
        const { providers, chatModel, imageModel, ttsModel } = get();
        aiManager.configure(providers, chatModel, imageModel, ttsModel);
      },
    }),
    {
      name: 'ai-model-config',
      partialize: (state) => ({
        providers: state.providers,
        chatModel: state.chatModel,
        imageModel: state.imageModel,
        ttsModel: state.ttsModel,
        voiceSettings: state.voiceSettings,
      }),
    }
  )
);