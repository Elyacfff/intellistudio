import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LoginMethod = 'github' | 'phone' | 'wechat';

export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  loginMethod: LoginMethod;
  phone?: string;
  wechatId?: string;
  githubId?: string;
  email?: string;
  createdAt?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  rememberMe: boolean;
  loginHistory: { method: LoginMethod; time: string }[];

  login: (user: UserInfo) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserInfo>) => void;
  setRememberMe: (val: boolean) => void;
}

const generateId = () => 'user_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      rememberMe: false,
      loginHistory: [],

      login: (user) => {
        const history = get().loginHistory;
        set({
          isLoggedIn: true,
          user: { ...user, id: user.id || generateId(), createdAt: user.createdAt || new Date().toISOString() },
          loginHistory: [
            { method: user.loginMethod, time: new Date().toISOString() },
            ...history,
          ].slice(0, 20),
        });
      },

      logout: () => set({ isLoggedIn: false, user: null }),

      updateProfile: (updates) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      setRememberMe: (val) => set({ rememberMe: val }),
    }),
    {
      name: 'drama-auth',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        rememberMe: state.rememberMe,
        loginHistory: state.loginHistory,
      }),
    }
  )
);