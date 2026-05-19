import React from 'react';
import { useAppStore } from '@/store/appStore';
import { themes } from '@/hooks/useTheme';
import {
  Home,
  Sparkles,
  FileText,
  Clapperboard,
  Settings,
  Crown
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: Home, label: '工作台' },
  { id: 'intelli', icon: Sparkles, label: 'AI创作' },
  { id: 'script', icon: FileText, label: '剧本' },
  { id: 'storyboard', icon: Clapperboard, label: '分镜' },
  { id: 'membership', icon: Crown, label: '会员' },
];

const BottomNav: React.FC = () => {
  const { theme, currentModule, setCurrentModule } = useAppStore();
  const colors = themes[theme];

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: colors.card,
        borderTop: `1px solid ${colors.border}`,
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-around w-full h-full px-1">
        {navItems.map((item) => {
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentModule(item.id as any)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all"
              style={{
                color: isActive ? colors.primary : colors.muted,
                minWidth: 0,
                minHeight: 0,
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg transition-all"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: isActive ? `${colors.primary}20` : 'transparent',
                }}
              >
                <item.icon size={18} />
              </div>
              <span
                className="text-xs font-medium"
                style={{
                  color: isActive ? colors.primary : colors.muted,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;