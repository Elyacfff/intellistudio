import {
  AI_PROVIDERS,
  UserModelConfig,
  UserProviderConfig,
  VOICE_OPTIONS,
  type AIModel,
} from './aiModels';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
}

interface ChatCompletionResponse {
  id: string;
  choices: { index: number; message: { role: string; content: string }; finish_reason: string }[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

interface ImageGenerationRequest {
  model?: string;
  prompt: string;
  n?: number;
  size?: string;
  quality?: string;
  style?: string;
}

interface ImageGenerationResponse {
  data: { url?: string; b64_json?: string }[];
}

interface TTSRequest {
  model: string;
  input: string;
  voice: string;
  speed?: number;
}

interface TTSResponse {
  audioUrl: string;
  audioBlob?: Blob;
}

class AIManager {
  private providers: Map<string, UserProviderConfig> = new Map();
  private chatModel: UserModelConfig | null = null;
  private imageModel: UserModelConfig | null = null;
  private ttsModel: UserModelConfig | null = null;

  configure(
    providers: Record<string, UserProviderConfig>,
    chatModel: UserModelConfig,
    imageModel: UserModelConfig,
    ttsModel: UserModelConfig
  ) {
    this.providers = new Map(Object.entries(providers));
    this.chatModel = chatModel;
    this.imageModel = imageModel;
    this.ttsModel = ttsModel;
  }

  getProvider(id: string): UserProviderConfig | undefined {
    return this.providers.get(id);
  }

  getProviderDef(id: string) {
    return AI_PROVIDERS.find((p) => p.id === id);
  }

  getEnabledProviders() {
    return Array.from(this.providers.values()).filter((p) => p.enabled && p.apiKey);
  }

  isProviderConfigured(id: string): boolean {
    const p = this.providers.get(id);
    if (!p) return false;
    if (id === 'edge-tts' || id === 'ollama') return p.enabled;
    return p.enabled && p.apiKey.length > 0;
  }

  getChatModelConfig(): UserModelConfig | null {
    return this.chatModel;
  }

  getImageModelConfig(): UserModelConfig | null {
    return this.imageModel;
  }

  getTTSModelConfig(): UserModelConfig | null {
    return this.ttsModel;
  }

  private getEffectiveConfig(config: UserModelConfig): { apiKey: string; baseUrl: string; modelId: string } {
    const provider = this.providers.get(config.providerId);
    const providerDef = AI_PROVIDERS.find((p) => p.id === config.providerId);

    let baseUrl = config.baseUrl || provider?.baseUrl || providerDef?.defaultBaseUrl || '';

    if (config.providerId === 'google') {
      baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${config.isCustom ? config.modelId : config.modelId}:generateContent`;
    }

    let modelId = config.isCustom ? config.modelId : config.modelId;
    if (config.modelId === '_custom') {
      modelId = '';
    }

    return {
      apiKey: config.apiKey || provider?.apiKey || '',
      baseUrl,
      modelId,
    };
  }

  async chatCompletion(
    messages: ChatMessage[],
    options: { temperature?: number; maxTokens?: number; stream?: boolean } = {}
  ): Promise<ChatCompletionResponse> {
    if (!this.chatModel) throw new Error('未配置对话模型');

    const config = this.getEffectiveConfig(this.chatModel);
    if (!config.apiKey && this.chatModel.providerId !== 'ollama') {
      throw new Error(`请先配置 ${this.chatModel.providerId} 的 API Key`);
    }

    const modelId = this.chatModel.isCustom
      ? this.chatModel.customModelName || this.chatModel.modelId
      : this.chatModel.modelId;

    if (this.chatModel.providerId === 'google') {
      return this.googleChatCompletion(config.apiKey, modelId, messages, options);
    }

    if (this.chatModel.providerId === 'anthropic') {
      return this.anthropicChatCompletion(config.apiKey, messages, options);
    }

    return this.openaiCompatibleChatCompletion(
      config.baseUrl,
      config.apiKey,
      modelId,
      messages,
      options
    );
  }

  private async openaiCompatibleChatCompletion(
    baseUrl: string,
    apiKey: string,
    modelId: string,
    messages: ChatMessage[],
    options: { temperature?: number; maxTokens?: number }
  ): Promise<ChatCompletionResponse> {
    const endpoint = `${baseUrl}/chat/completions`;
    const body: ChatCompletionRequest = {
      model: modelId,
      messages,
      temperature: options.temperature ?? this.chatModel?.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? this.chatModel?.maxTokens ?? 4096,
      stream: false,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    return response.json();
  }

  private async googleChatCompletion(
    apiKey: string,
    modelId: string,
    messages: ChatMessage[],
    options: { temperature?: number; maxTokens?: number }
  ): Promise<ChatCompletionResponse> {
    const systemMsg = messages.find((m) => m.role === 'system');
    const userMsgs = messages.filter((m) => m.role !== 'system');

    const contents = userMsgs.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    if (systemMsg) {
      contents.unshift({ role: 'user', parts: [{ text: `System: ${systemMsg.content}` }] });
    }

    const body = {
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 4096,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API Error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      id: data.candidates?.[0]?.content?.role || 'gemini',
      choices: [{ index: 0, message: { role: 'assistant', content: text }, finish_reason: 'stop' }],
      usage: {
        prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
        completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
        total_tokens: data.usageMetadata?.totalTokenCount || 0,
      },
    };
  }

  private async anthropicChatCompletion(
    apiKey: string,
    messages: ChatMessage[],
    options: { temperature?: number; maxTokens?: number }
  ): Promise<ChatCompletionResponse> {
    const systemMsg = messages.find((m) => m.role === 'system');
    const chatMessages = messages.filter((m) => m.role !== 'system');

    const body = {
      model: this.chatModel?.modelId || 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
      system: systemMsg?.content || '',
      messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API Error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    return {
      id: data.id || 'claude',
      choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
      usage: {
        prompt_tokens: data.usage?.input_tokens || 0,
        completion_tokens: data.usage?.output_tokens || 0,
        total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }

  async generateImage(
    prompt: string,
    options: { size?: string; n?: number; style?: string } = {}
  ): Promise<ImageGenerationResponse> {
    if (!this.imageModel) throw new Error('未配置图片生成模型');

    const config = this.getEffectiveConfig(this.imageModel);

    if (this.imageModel.providerId === 'siliconflow') {
      return this.siliconflowImageGeneration(config.apiKey, config.baseUrl, this.imageModel.modelId, prompt, options);
    }

    if (this.imageModel.providerId === 'google') {
      return this.googleImageGeneration(config.apiKey, prompt, options);
    }

    return this.openaiCompatibleImageGeneration(
      config.baseUrl,
      config.apiKey,
      this.imageModel.modelId,
      prompt,
      options
    );
  }

  private async openaiCompatibleImageGeneration(
    baseUrl: string,
    apiKey: string,
    modelId: string,
    prompt: string,
    options: { size?: string; n?: number; style?: string }
  ): Promise<ImageGenerationResponse> {
    const endpoint = `${baseUrl}/images/generations`;
    const body: ImageGenerationRequest = {
      model: modelId,
      prompt,
      n: options.n || 1,
      size: options.size || '1024x1024',
      quality: 'standard',
      style: options.style || 'vivid',
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Image API Error ${response.status}: ${error}`);
    }

    return response.json();
  }

  private async siliconflowImageGeneration(
    apiKey: string,
    baseUrl: string,
    modelId: string,
    prompt: string,
    options: { size?: string; n?: number }
  ): Promise<ImageGenerationResponse> {
    const endpoint = `${baseUrl}/image/generations`;
    const body = {
      model: modelId,
      prompt,
      num_images: options.n || 1,
      image_size: options.size || '1024x1024',
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Image API Error ${response.status}: ${error}`);
    }

    const data = await response.json();
    return { data: (data.images || []).map((img: { url?: string }) => ({ url: img.url })) };
  }

  private async googleImageGeneration(
    apiKey: string,
    prompt: string,
    _options: { size?: string; n?: number }
  ): Promise<ImageGenerationResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ parts: [{ text: `Generate an image: ${prompt}` }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini Image API Error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const images: { url?: string; b64_json?: string }[] = [];

    for (const part of data.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        images.push({ b64_json: part.inlineData.data, url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` });
      }
    }

    return { data: images };
  }

  async generateSpeech(
    text: string,
    options: { voice?: string; speed?: number } = {}
  ): Promise<TTSResponse> {
    if (!this.ttsModel) throw new Error('未配置语音合成模型');

    const config = this.getEffectiveConfig(this.ttsModel);

    if (this.ttsModel.providerId === 'edge-tts') {
      return this.edgeTTSSynthesis(text, options);
    }

    if (this.ttsModel.providerId === 'elevenlabs') {
      return this.elevenlabsTTS(config.apiKey, text, options);
    }

    if (this.ttsModel.providerId === 'openai') {
      return this.openaiTTS(config.apiKey, text, options);
    }

    throw new Error(`不支持的 TTS 提供商: ${this.ttsModel.providerId}`);
  }

  private async openaiTTS(
    apiKey: string,
    text: string,
    options: { voice?: string; speed?: number }
  ): Promise<TTSResponse> {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.ttsModel?.modelId || 'tts-1',
        input: text,
        voice: options.voice || 'alloy',
        speed: options.speed || 1.0,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TTS API Error ${response.status}: ${error}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return { audioUrl, audioBlob: blob };
  }

  private async elevenlabsTTS(
    apiKey: string,
    text: string,
    options: { voice?: string; speed?: number }
  ): Promise<TTSResponse> {
    const voiceId = options.voice || '21m00Tcm4TlvDq8ikWAM';
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: this.ttsModel?.modelId || 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs API Error ${response.status}: ${error}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return { audioUrl, audioBlob: blob };
  }

  private async edgeTTSSynthesis(
    text: string,
    options: { voice?: string; speed?: number }
  ): Promise<TTSResponse> {
    const voice = options.voice || this.ttsModel?.modelId || 'zh-CN-XiaoxiaoNeural';
    const speed = options.speed || 1.0;

    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
      <voice name="${voice}">
        <prosody rate="${speed >= 1 ? '+' + Math.round((speed - 1) * 100) + '%' : Math.round((speed - 1) * 100) + '%'}">
          ${text}
        </prosody>
      </voice>
    </speak>`;

    const response = await fetch(
      `https://corsproxy.io/?${encodeURIComponent(
        `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4`
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'Mozilla/5.0',
        },
        body: ssml,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Edge TTS Error ${response.status}: ${error}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return { audioUrl, audioBlob: blob };
  }

  async testConnection(providerId: string, apiKey: string, baseUrl: string): Promise<{ success: boolean; message: string; models?: string[] }> {
    try {
      if (providerId === 'edge-tts') {
        const result = await this.edgeTTSSynthesis('测试语音', { voice: 'zh-CN-XiaoxiaoNeural' });
        return { success: !!result.audioUrl, message: 'Edge TTS 连接正常' };
      }

      if (providerId === 'elevenlabs') {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: { 'xi-api-key': apiKey },
        });
        if (response.ok) {
          const data = await response.json();
          return { success: true, message: `连接成功，可用 ${data.voices?.length || 0} 种声音`, models: data.voices?.map((v: { name: string }) => v.name) };
        }
        throw new Error(`HTTP ${response.status}`);
      }

      if (providerId === 'anthropic') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 10, messages: [{ role: 'user', content: 'hi' }] }),
        });
        if (response.ok) return { success: true, message: 'Claude 连接正常' };
        throw new Error(`HTTP ${response.status}`);
      }

      if (providerId === 'google') {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        if (response.ok) {
          const data = await response.json();
          return { success: true, message: `连接成功，可用 ${data.models?.length || 0} 个模型`, models: data.models?.map((m: { name: string }) => m.name.replace('models/', '')) };
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const url = `${baseUrl}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: providerId === 'deepseek' ? 'deepseek-chat' : providerId === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 5,
        }),
      });

      if (response.ok) return { success: true, message: '连接正常' };
      const error = await response.text();
      return { success: false, message: `连接失败: ${response.status} - ${error.slice(0, 200)}` };
    } catch (err) {
      return { success: false, message: `连接失败: ${err instanceof Error ? err.message : String(err)}` };
    }
  }
}

export const aiManager = new AIManager();
export type { ChatMessage, ChatCompletionResponse, ImageGenerationResponse, TTSResponse };