import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export function useKeyboardShortcuts() {
  const { setCurrentModule, addToast } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === '1') {
        e.preventDefault();
        setCurrentModule('dashboard');
        addToast({ type: 'info', title: '切换到工作台' });
      }
      if (ctrl && e.key === '2') {
        e.preventDefault();
        setCurrentModule('script');
        addToast({ type: 'info', title: '切换到剧本编辑' });
      }
      if (ctrl && e.key === '3') {
        e.preventDefault();
        setCurrentModule('storyboard');
        addToast({ type: 'info', title: '切换到分镜设计' });
      }
      if (ctrl && e.key === '4') {
        e.preventDefault();
        setCurrentModule('video');
        addToast({ type: 'info', title: '切换到视频生成' });
      }
      if (ctrl && e.key === '5') {
        e.preventDefault();
        setCurrentModule('assets');
        addToast({ type: 'info', title: '切换到素材管理' });
      }
      if (ctrl && e.key === '6') {
        e.preventDefault();
        setCurrentModule('voice');
        addToast({ type: 'info', title: '切换到音频配音' });
      }
      if (ctrl && e.key === '7') {
        e.preventDefault();
        setCurrentModule('subtitle');
        addToast({ type: 'info', title: '切换到字幕制作' });
      }
      if (ctrl && e.key === '8') {
        e.preventDefault();
        setCurrentModule('export');
        addToast({ type: 'info', title: '切换到导出设置' });
      }
      if (ctrl && e.key === ',') {
        e.preventDefault();
        setCurrentModule('settings');
        addToast({ type: 'info', title: '打开设置' });
      }
      if (ctrl && e.key === 'b') {
        e.preventDefault();
        const { sidebarCollapsed, toggleSidebar } = useAppStore.getState();
        toggleSidebar();
        addToast({ type: 'info', title: sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏' });
      }
      if (ctrl && e.key === 'k') {
        e.preventDefault();
        addToast({ type: 'info', title: '搜索功能', message: '使用全局搜索快速定位功能' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentModule, addToast]);
}