export type ThemeType = 'aurora' | 'night' | 'amoled';
export type LanguageType = 'zh' | 'ug';

export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  bg: string;
  card: string;
  input: string;
  title: string;
  body: string;
  muted: string;
  hint: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface AppState {
  theme: ThemeType;
  language: LanguageType;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  windowOpacity: number;
  currentModule: ModuleType;
}

export type ModuleType = 
  | 'dashboard'
  | 'intelli'
  | 'script'
  | 'storyboard'
  | 'video'
  | 'assets'
  | 'voice'
  | 'subtitle'
  | 'export'
  | 'settings';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
}

export interface Script {
  id: string;
  projectId: string;
  title: string;
  content: string;
  episodes: number;
  genre: string;
}

export interface Asset {
  id: string;
  type: 'character' | 'scene' | 'prop' | 'audio' | 'video';
  name: string;
  path: string;
  tags: string[];
}
