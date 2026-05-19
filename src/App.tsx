import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppStore } from './store/appStore';
import { changeLanguage } from './i18n';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import DynamicBackground from './components/DynamicBackground';
import Toast from './components/Toast';
import SearchModal from './components/SearchModal';
import IntelliStudio from './modules/IntelliStudio';
import Dashboard from './modules/Dashboard';
import ScriptEditor from './modules/ScriptEditor';
import Storyboard from './modules/Storyboard';
import VideoGenerator from './modules/VideoGenerator';
import AssetsManager from './modules/AssetsManager';
import VoiceCloning from './modules/VoiceCloning';
import SubtitleEditor from './modules/SubtitleEditor';
import ExportSettings from './modules/ExportSettings';
import Settings from './modules/Settings';
import AIModelConfig from './modules/AIModelConfig';
import LoginPage from './modules/LoginPage';
import MembershipPage from './modules/MembershipPage';
import ComparisonPage from './modules/ComparisonPage';
import OnboardingGuide from './modules/OnboardingGuide';
import { useModelStore } from './store/modelStore';
import { useAuthStore } from './store/authStore';
import './index.css';

const App: React.FC = () => {
  const { theme, language, currentModule, windowOpacity } = useAppStore();
  const syncToManager = useModelStore((s) => s.syncToManager);
  
  useTheme(theme);
  useKeyboardShortcuts();
  
  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    syncToManager();
  }, []);

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'intelli':
        return <IntelliStudio />;
      case 'script':
        return <ScriptEditor />;
      case 'storyboard':
        return <Storyboard />;
      case 'video':
        return <VideoGenerator />;
      case 'assets':
        return <AssetsManager />;
      case 'voice':
        return <VoiceCloning />;
      case 'subtitle':
        return <SubtitleEditor />;
      case 'export':
        return <ExportSettings />;
      case 'settings':
        return <Settings />;
      case 'ai-config':
        return <AIModelConfig />;
      case 'login':
        return <LoginPage />;
      case 'membership':
        return <MembershipPage />;
      case 'comparison':
        return <ComparisonPage />;
      case 'onboarding':
        return <OnboardingGuide />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div 
        className="w-screen h-screen flex flex-col overflow-hidden"
        style={{ opacity: windowOpacity }}
      >
        {/* 动态背景 */}
        <DynamicBackground />
        
        {/* Toast 通知 */}
        <Toast />
        
        {/* 全局搜索 */}
        <SearchModal />
        
        {/* 标题栏 */}
        <TitleBar />
        
        {/* 主内容区 */}
        <div className="flex-1 flex overflow-hidden relative pb-16 md:pb-0">
          {/* 侧边栏 */}
          <div className="desktop-sidebar">
            <Sidebar />
          </div>
          
          {/* 内容区域 */}
          <div className="flex-1 overflow-hidden relative">
            {renderModule()}
          </div>
        </div>
        
        {/* 底部导航 - 仅移动端显示 */}
        <BottomNav />
      </div>
    </I18nextProvider>
  );
};

export default App;