export interface AIProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultBaseUrl: string;
  models: AIModel[];
  supportsChat: boolean;
  supportsImage: boolean;
  supportsTTS: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: 'chat' | 'image' | 'tts';
  maxTokens?: number;
  supportsStreaming?: boolean;
  inputPrice?: string;
  outputPrice?: string;
}

export interface UserModelConfig {
  id: string;
  providerId: string;
  modelId: string;
  apiKey: string;
  baseUrl: string;
  customModelName?: string;
  temperature: number;
  maxTokens: number;
  isCustom: boolean;
  label: string;
  enabled: boolean;
}

export interface UserProviderConfig {
  providerId: string;
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🟢',
    description: 'GPT-4o, DALL·E 3, TTS — 最全面的 AI 平台',
    defaultBaseUrl: 'https://api.openai.com/v1',
    supportsChat: true,
    supportsImage: true,
    supportsTTS: true,
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: '最新多模态模型，速度快，能力强', type: 'chat', maxTokens: 128000, supportsStreaming: true, inputPrice: '$2.50/1M', outputPrice: '$10/1M' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: '轻量级，性价比极高', type: 'chat', maxTokens: 128000, supportsStreaming: true, inputPrice: '$0.15/1M', outputPrice: '$0.60/1M' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '强大的推理能力', type: 'chat', maxTokens: 128000, supportsStreaming: true, inputPrice: '$10/1M', outputPrice: '$30/1M' },
      { id: 'o3-mini', name: 'o3-mini', description: '推理模型，擅长复杂逻辑', type: 'chat', maxTokens: 200000, supportsStreaming: true },
      { id: 'dall-e-3', name: 'DALL·E 3', description: '高质量图片生成', type: 'image', inputPrice: '$0.04/图', outputPrice: '' },
      { id: 'tts-1', name: 'TTS-1', description: '标准语音合成', type: 'tts', inputPrice: '$15/1M字符', outputPrice: '' },
      { id: 'tts-1-hd', name: 'TTS-1 HD', description: '高清语音合成', type: 'tts', inputPrice: '$30/1M字符', outputPrice: '' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🐋',
    description: '国产最强，性价比极高',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    supportsChat: true,
    supportsImage: false,
    supportsTTS: false,
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3', description: '通用对话模型，综合性能强劲', type: 'chat', maxTokens: 64000, supportsStreaming: true, inputPrice: '¥2/1M', outputPrice: '¥8/1M' },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1', description: '深度推理模型，擅长逻辑分析', type: 'chat', maxTokens: 64000, supportsStreaming: true, inputPrice: '¥4/1M', outputPrice: '¥16/1M' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '🟠',
    description: 'Claude 系列，安全可靠',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    supportsChat: true,
    supportsImage: false,
    supportsTTS: false,
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: '最新旗舰模型，编程/创作均顶尖', type: 'chat', maxTokens: 200000, supportsStreaming: true, inputPrice: '$3/1M', outputPrice: '$15/1M' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: '最强推理能力', type: 'chat', maxTokens: 200000, supportsStreaming: true, inputPrice: '$15/1M', outputPrice: '$75/1M' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: '极速响应，性价比高', type: 'chat', maxTokens: 200000, supportsStreaming: true, inputPrice: '$0.25/1M', outputPrice: '$1.25/1M' },
    ],
  },
  {
    id: 'google',
    name: 'Google Gemini',
    icon: '🔵',
    description: 'Gemini 系列，多模态原生支持',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    supportsChat: true,
    supportsImage: true,
    supportsTTS: false,
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: '极速多模态，免费额度大', type: 'chat', maxTokens: 1000000, supportsStreaming: true },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: '旗舰模型，百万级上下文', type: 'chat', maxTokens: 2000000, supportsStreaming: true },
      { id: 'gemini-2.0-flash-exp-image-generation', name: 'Gemini 图片生成', description: '原生文生图能力', type: 'image' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: '⚡',
    description: '全球最快推理引擎',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    supportsChat: true,
    supportsImage: false,
    supportsTTS: false,
    models: [
      { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', description: '开源旗舰，综合能力强', type: 'chat', maxTokens: 128000, supportsStreaming: true },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: '极致速度，极低成本', type: 'chat', maxTokens: 128000, supportsStreaming: true },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'MoE 架构，性能卓越', type: 'chat', maxTokens: 32768, supportsStreaming: true },
      { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B', description: '开源推理模型', type: 'chat', maxTokens: 128000, supportsStreaming: true },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (本地)',
    icon: '🦙',
    description: '本地运行，完全免费，数据不出设备',
    defaultBaseUrl: 'http://localhost:11434/v1',
    supportsChat: true,
    supportsImage: false,
    supportsTTS: false,
    models: [
      { id: 'llama3.2', name: 'Llama 3.2', description: '轻量本地模型', type: 'chat' },
      { id: 'qwen2.5', name: 'Qwen 2.5', description: '阿里通义千问本地版', type: 'chat' },
      { id: 'deepseek-r1', name: 'DeepSeek R1', description: '推理能力强的本地模型', type: 'chat' },
    ],
  },
  {
    id: 'siliconflow',
    name: '硅基流动',
    icon: '🔥',
    description: '国产模型聚合平台，SD/Flux 图片生成',
    defaultBaseUrl: 'https://api.siliconflow.cn/v1',
    supportsChat: true,
    supportsImage: true,
    supportsTTS: false,
    models: [
      { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 72B', description: '通义千问旗舰', type: 'chat', maxTokens: 32000, supportsStreaming: true },
      { id: 'Pro/Llama-3.3-70B-Instruct', name: 'Llama 3.3 70B', description: '开源最强', type: 'chat', maxTokens: 32000, supportsStreaming: true },
      { id: 'black-forest-labs/FLUX.1-dev', name: 'FLUX.1-dev', description: '最强开源文生图', type: 'image' },
      { id: 'stabilityai/stable-diffusion-3-5-large', name: 'SD 3.5 Large', description: '高质量图片生成', type: 'image' },
    ],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    icon: '🎙️',
    description: '最先进的AI语音合成与克隆',
    defaultBaseUrl: 'https://api.elevenlabs.io/v1',
    supportsChat: false,
    supportsImage: false,
    supportsTTS: true,
    models: [
      { id: 'eleven_multilingual_v2', name: 'Eleven 多语言 V2', description: '支持29种语言的顶级TTS', type: 'tts' },
      { id: 'eleven_turbo_v2_5', name: 'Eleven Turbo 2.5', description: '低延迟高质量', type: 'tts' },
      { id: 'eleven_flash_v2_5', name: 'Eleven Flash 2.5', description: '极速合成', type: 'tts' },
    ],
  },
  {
    id: 'edge-tts',
    name: 'Microsoft Edge TTS',
    icon: '🔊',
    description: '免费微软语音合成，无需API Key',
    defaultBaseUrl: '',
    supportsChat: false,
    supportsImage: false,
    supportsTTS: true,
    models: [
      { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓 (女声)', description: '自然流畅的中文女声', type: 'tts' },
      { id: 'zh-CN-YunxiNeural', name: '云希 (男声)', description: '沉稳专业的中文男声', type: 'tts' },
      { id: 'zh-CN-XiaoyiNeural', name: '晓伊 (女声)', description: '温柔亲切的中文女声', type: 'tts' },
      { id: 'ug-UZ-MadinaNeural', name: 'Madina (维吾尔语)', description: '维吾尔语女声', type: 'tts' },
    ],
  },
  {
    id: 'custom',
    name: '自定义 OpenAI 兼容',
    icon: '🔧',
    description: '兼容 OpenAI API 格式的任何服务',
    defaultBaseUrl: 'https://your-api-endpoint.com/v1',
    supportsChat: true,
    supportsImage: true,
    supportsTTS: true,
    models: [
      { id: '_custom', name: '自定义模型', description: '输入你的模型名称', type: 'chat', maxTokens: 128000, supportsStreaming: true },
    ],
  },
];

export const DEFAULT_USER_PROVIDERS: Record<string, UserProviderConfig> = {
  openai: { providerId: 'openai', apiKey: '', baseUrl: 'https://api.openai.com/v1', enabled: false },
  deepseek: { providerId: 'deepseek', apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '', baseUrl: 'https://api.deepseek.com/v1', enabled: true },
  anthropic: { providerId: 'anthropic', apiKey: '', baseUrl: 'https://api.anthropic.com/v1', enabled: false },
  google: { providerId: 'google', apiKey: '', baseUrl: 'https://generativelanguage.googleapis.com/v1beta', enabled: false },
  groq: { providerId: 'groq', apiKey: '', baseUrl: 'https://api.groq.com/openai/v1', enabled: false },
  ollama: { providerId: 'ollama', apiKey: '', baseUrl: 'http://localhost:11434/v1', enabled: false },
  siliconflow: { providerId: 'siliconflow', apiKey: '', baseUrl: 'https://api.siliconflow.cn/v1', enabled: false },
  elevenlabs: { providerId: 'elevenlabs', apiKey: '', baseUrl: 'https://api.elevenlabs.io/v1', enabled: false },
  'edge-tts': { providerId: 'edge-tts', apiKey: '', baseUrl: '', enabled: true },
  custom: { providerId: 'custom', apiKey: '', baseUrl: 'https://your-api-endpoint.com/v1', enabled: false },
};

export const VOICE_OPTIONS: Record<string, { id: string; name: string; language: string; gender: string }[]> = {
  'edge-tts': [
    { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓', language: 'zh-CN', gender: 'female' },
    { id: 'zh-CN-YunxiNeural', name: '云希', language: 'zh-CN', gender: 'male' },
    { id: 'zh-CN-XiaoyiNeural', name: '晓伊', language: 'zh-CN', gender: 'female' },
    { id: 'zh-CN-YunyangNeural', name: '云扬', language: 'zh-CN', gender: 'male' },
    { id: 'zh-CN-XiaochenNeural', name: '晓辰', language: 'zh-CN', gender: 'female' },
    { id: 'ug-UZ-MadinaNeural', name: 'Madina', language: 'ug', gender: 'female' },
    { id: 'en-US-JennyNeural', name: 'Jenny', language: 'en-US', gender: 'female' },
    { id: 'en-US-GuyNeural', name: 'Guy', language: 'en-US', gender: 'male' },
    { id: 'ja-JP-NanamiNeural', name: 'Nanami', language: 'ja-JP', gender: 'female' },
    { id: 'ko-KR-SunHiNeural', name: 'SunHi', language: 'ko-KR', gender: 'female' },
  ],
  openai: [
    { id: 'alloy', name: 'Alloy', language: 'en', gender: 'neutral' },
    { id: 'echo', name: 'Echo', language: 'en', gender: 'male' },
    { id: 'fable', name: 'Fable', language: 'en', gender: 'male' },
    { id: 'onyx', name: 'Onyx', language: 'en', gender: 'male' },
    { id: 'nova', name: 'Nova', language: 'en', gender: 'female' },
    { id: 'shimmer', name: 'Shimmer', language: 'en', gender: 'female' },
  ],
  elevenlabs: [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', language: 'en', gender: 'female' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', language: 'en', gender: 'female' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', language: 'en', gender: 'female' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', language: 'en', gender: 'male' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', language: 'en', gender: 'female' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', language: 'en', gender: 'male' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', language: 'en', gender: 'male' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', language: 'en', gender: 'male' },
  ],
};

export const DEFAULT_CHAT_MODEL: UserModelConfig = {
  id: 'default-chat',
  providerId: 'deepseek',
  modelId: 'deepseek-chat',
  apiKey: '',
  baseUrl: '',
  temperature: 0.8,
  maxTokens: 8192,
  isCustom: false,
  label: '默认对话模型',
  enabled: true,
};

export const DEFAULT_IMAGE_MODEL: UserModelConfig = {
  id: 'default-image',
  providerId: 'openai',
  modelId: 'dall-e-3',
  apiKey: '',
  baseUrl: '',
  temperature: 1,
  maxTokens: 0,
  isCustom: false,
  label: '默认图片模型',
  enabled: false,
};

export const DEFAULT_TTS_MODEL: UserModelConfig = {
  id: 'default-tts',
  providerId: 'edge-tts',
  modelId: 'zh-CN-XiaoxiaoNeural',
  apiKey: '',
  baseUrl: '',
  temperature: 1,
  maxTokens: 0,
  isCustom: false,
  label: '默认语音模型',
  enabled: true,
};