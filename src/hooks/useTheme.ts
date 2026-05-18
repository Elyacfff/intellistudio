import { useEffect } from 'react';
import { ThemeType } from '../types';
import { themes } from '../store/appStore';

export function useTheme(theme: ThemeType) {
  useEffect(() => {
    const colors = themes[theme];
    const root = document.documentElement;
    
    // 设置CSS变量
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // 设置背景色
    document.body.style.background = colors.background;
  }, [theme]);
}

export { themes };