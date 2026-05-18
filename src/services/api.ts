const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const BASE_URL = 'https://api.deepseek.com/v1';

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
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class ApiService {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
  }

  private async request<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    return response.json();
  }

  async chatCompletion(
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<ChatCompletionResponse> {
    const body: ChatCompletionRequest = {
      model: options.model || 'deepseek-chat',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      stream: false,
    };

    return this.request<ChatCompletionResponse>('/chat/completions', body);
  }

  async generateScript(
    prompt: string,
    options: {
      genre?: string;
      episodeCount?: number;
      style?: string;
    } = {}
  ): Promise<string> {
    const systemPrompt = `你是一个专业的短剧剧本编剧。请根据用户需求生成一个完整的短剧剧本。
格式要求：
- 包含剧名
- 角色设定（姓名、年龄、性格）
- 按场次分集，每集包含：场景描述、人物对话、动作指导
- 对话自然流畅，符合角色性格
- 适合竖屏短视频拍摄（9:16比例）
- 每集时长控制在1-2分钟`;

    const userPrompt = `请创作一个${options.genre || '都市爱情'}题材的短剧剧本。
${options.episodeCount ? `共${options.episodeCount}集` : '30集左右'}
风格：${options.style || '现代都市'}
需求：${prompt}

请用中文创作。`;

    const response = await this.chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.8, maxTokens: 8192 });

    return response.choices[0]?.message?.content || '';
  }

  async generateStoryboard(
    scriptContent: string,
    sceneCount: number = 10
  ): Promise<string> {
    const systemPrompt = `你是一个专业的分镜设计师。请根据剧本内容生成详细的分镜脚本。
每个分镜需要包含：
1. 镜头编号
2. 镜头类型（远景/中景/近景/特写）
3. 画面描述
4. 运镜方式
5. 预估时长
6. AI绘画提示词（英文，用于生成画面）`;

    const response = await this.chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `请根据以下剧本内容，生成${sceneCount}个关键分镜：\n\n${scriptContent}` },
    ], { temperature: 0.7, maxTokens: 4096 });

    return response.choices[0]?.message?.content || '';
  }

  async generateVoiceScript(
    text: string,
    character: string
  ): Promise<string> {
    const systemPrompt = `你是一个专业的配音导演。请根据角色设定和台词，标注合适的语气、语速和情感。`;

    const response = await this.chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `角色：${character}\n台词：${text}\n\n请为这段台词标注配音指导。` },
    ], { temperature: 0.6, maxTokens: 2048 });

    return response.choices[0]?.message?.content || '';
  }

  async analyzeIntent(userInput: string): Promise<{
    intent: string;
    genre: string;
    keywords: string[];
    complexity: 'simple' | 'medium' | 'complex';
  }> {
    const systemPrompt = `你是一个创作意图分析助手。分析用户输入的创作需求，返回JSON格式：
{
  "intent": "创作意图",
  "genre": "题材类型",
  "keywords": ["关键词1", "关键词2"],
  "complexity": "simple/medium/complex"
}`;

    const response = await this.chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `分析以下创作需求：${userInput}` },
    ], { temperature: 0.3, maxTokens: 1024 });

    try {
      const content = response.choices[0]?.message?.content || '{}';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { intent: 'unknown', genre: '通用', keywords: [], complexity: 'simple' };
    } catch {
      return { intent: 'unknown', genre: '通用', keywords: [], complexity: 'simple' };
    }
  }

  async generateSubtitles(
    script: string,
    format: 'srt' | 'ass' | 'vtt' = 'srt'
  ): Promise<string> {
    const systemPrompt = `你是一个字幕制作专家。请根据剧本对话生成字幕文件。
格式要求（${format}格式）：
- 每条字幕编号递增
- 时间轴合理（每句1-3秒）
- 字幕简洁，单行不超过20字`;

    const response = await this.chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `请为以下剧本生成${format}格式字幕：\n\n${script}` },
    ], { temperature: 0.4, maxTokens: 4096 });

    return response.choices[0]?.message?.content || '';
  }
}

export const api = new ApiService();
export type { ChatMessage };