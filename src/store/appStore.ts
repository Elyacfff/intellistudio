import { create } from 'zustand';

// 主题类型
export type ThemeType = 'aurora' | 'night' | 'amoled';

// 主题颜色接口
export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  text: string;
  title: string;
  body: string;
  muted: string;
  border: string;
  input: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// 全新设计的专业主题 - 高对比度，完美可读
export const themes: Record<ThemeType, ThemeColors> = {
  // 极光蓝 - 清爽专业
  aurora: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    surface: '#1e293b',
    card: 'rgba(30, 41, 59, 0.95)',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    text: '#ffffff',
    title: '#ffffff',
    body: '#e2e8f0',
    muted: '#94a3b8',
    border: 'rgba(255, 255, 255, 0.15)',
    input: 'rgba(255, 255, 255, 0.08)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  // 夜幕紫 - 优雅神秘
  night: {
    background: 'linear-gradient(135deg, #1a1625 0%, #2d1f4e 50%, #1a1625 100%)',
    surface: '#2d1f4e',
    card: 'rgba(45, 31, 78, 0.95)',
    primary: '#a855f7',
    primaryHover: '#9333ea',
    secondary: '#3b82f6',
    accent: '#ec4899',
    text: '#ffffff',
    title: '#ffffff',
    body: '#e9d5ff',
    muted: '#a78bfa',
    border: 'rgba(255, 255, 255, 0.18)',
    input: 'rgba(255, 255, 255, 0.1)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  // 纯黑 AMOLED - 省电护眼
  amoled: {
    background: '#000000',
    surface: '#0a0a0a',
    card: 'rgba(15, 15, 15, 0.98)',
    primary: '#00d4ff',
    primaryHover: '#00b3d9',
    secondary: '#ff006e',
    accent: '#7c3aed',
    text: '#ffffff',
    title: '#ffffff',
    body: '#f0f0f0',
    muted: '#71717a',
    border: 'rgba(255, 255, 255, 0.12)',
    input: 'rgba(255, 255, 255, 0.06)',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff4444',
    info: '#00d4ff',
  },
};

// 应用状态接口
interface AppState {
  // 主题相关
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  
  // 语言相关
  language: 'zh' | 'ug';
  setLanguage: (lang: 'zh' | 'ug') => void;
  
  // 模块导航
  currentModule: string;
  setCurrentModule: (module: string) => void;
  
  // 侧边栏
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // 窗口透明度
  windowOpacity: number;
  setWindowOpacity: (opacity: number) => void;

  // Toast 通知
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // 自动保存
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
  lastSaved: string | null;
  setLastSaved: (time: string) => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// 创建 Zustand Store
export const useAppStore = create<AppState>((set) => ({
  // 主题
  theme: 'aurora',
  setTheme: (theme) => set({ theme }),
  
  // 语言
  language: 'zh',
  setLanguage: (language) => set({ language }),
  
  // 模块导航
  currentModule: 'dashboard',
  setCurrentModule: (module) => set({ currentModule: module }),
  
  // 侧边栏
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  // 窗口透明度
  windowOpacity: 1,
  setWindowOpacity: (opacity) => set({ windowOpacity: opacity }),

  // Toast 通知
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Date.now().toString() + Math.random().toString(36).slice(2) }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  // 自动保存
  autoSaveEnabled: true,
  setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
  lastSaved: null,
  setLastSaved: (time) => set({ lastSaved: time }),
}));