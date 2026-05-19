import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, MessageCircle, Github, LogIn, ArrowRight, Eye, EyeOff, Shield, Sparkles, Zap, Crown } from 'lucide-react';
import { useAppStore, themes } from '../store/appStore';
import { useAuthStore, LoginMethod } from '../store/authStore';
import { usePointStore } from '../store/pointStore';

const LoginPage: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { theme } = useAppStore();
  const colors = themes[theme];
  const { login } = useAuthStore();
  const { member } = usePointStore();

  const [activeMethod, setActiveMethod] = useState<LoginMethod>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme !== 'aurora';

  const handlePhoneLogin = async () => {
    setErrorMsg('');
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setErrorMsg('请输入正确的手机号码');
      return;
    }
    if (code.length < 4) {
      setErrorMsg('请输入验证码');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login({
      id: '',
      nickname: `用户${phone.slice(-4)}`,
      avatar: '',
      loginMethod: 'phone',
      phone,
    });
    setIsLoading(false);
    onComplete?.();
  };

  const handleWechatLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    login({
      id: '',
      nickname: '微信用户',
      avatar: '🐼',
      loginMethod: 'wechat',
      wechatId: 'wx_' + Math.random().toString(36).substring(2, 9),
    });
    setIsLoading(false);
    onComplete?.();
  };

  const handleGitHubLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    login({
      id: '',
      nickname: 'GitHub用户',
      avatar: '🐱',
      loginMethod: 'github',
      githubId: 'gh_' + Math.random().toString(36).substring(2, 9),
    });
    setIsLoading(false);
    onComplete?.();
  };

  const handleSendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setErrorMsg('请输入正确的手机号码');
      return;
    }
    setErrorMsg('');
    alert('验证码已发送（演示模式：输入 1234）');
  };

  const methods: { id: LoginMethod; icon: React.ReactNode; label: string; desc: string }[] = [
    { id: 'phone', icon: <Smartphone size={20} />, label: '手机登录', desc: '手机号 + 验证码' },
    { id: 'wechat', icon: <MessageCircle size={20} />, label: '微信登录', desc: '微信扫码授权' },
    { id: 'github', icon: <Github size={20} />, label: 'GitHub登录', desc: 'GitHub OAuth' },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎬</div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
            Drama Studio Pro
          </h1>
          <p className="text-sm" style={{ color: colors.muted }}>
            AI 驱动的智能短剧创作平台
          </p>
        </div>

        <div
          className="rounded-2xl p-6 backdrop-blur-xl"
          style={{
            background: isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.1)',
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: colors.input }}>
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => { setActiveMethod(m.id); setErrorMsg(''); }}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                style={{
                  background: activeMethod === m.id ? colors.primary : 'transparent',
                  color: activeMethod === m.id ? '#fff' : colors.muted,
                }}
              >
                {m.icon}
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>

          {errorMsg && (
            <div
              className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2"
              style={{ background: `${colors.error}20`, color: colors.error, border: `1px solid ${colors.error}40` }}
            >
              <Shield size={16} /> {errorMsg}
            </div>
          )}

          {activeMethod === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: colors.muted }}>手机号码</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="请输入手机号码"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{
                    background: colors.input,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <label className="text-xs mb-1.5 block" style={{ color: colors.muted }}>验证码</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入验证码"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: colors.input,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  />
                </div>
                <div className="pt-5">
                  <button
                    onClick={handleSendCode}
                    className="px-4 py-3 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
                    style={{ background: colors.secondary, color: '#fff' }}
                  >
                    获取验证码
                  </button>
                </div>
              </div>
              <button
                onClick={handlePhoneLogin}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: '#fff',
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} /> 登录 / 注册
                  </>
                )}
              </button>
            </div>
          )}

          {activeMethod === 'wechat' && (
            <div className="text-center py-6 space-y-4">
              <div
                className="w-48 h-48 mx-auto rounded-2xl flex items-center justify-center"
                style={{ background: colors.input, border: `2px dashed ${colors.border}` }}
              >
                <div className="text-center">
                  <MessageCircle size={48} style={{ color: '#07C160' }} />
                  <p className="text-xs mt-2" style={{ color: colors.muted }}>微信扫码登录</p>
                  <p className="text-xs mt-1" style={{ color: colors.muted }}>（演示模式）</p>
                </div>
              </div>
              <button
                onClick={handleWechatLogin}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  background: '#07C160',
                  color: '#fff',
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <MessageCircle size={18} /> 模拟微信登录
                  </>
                )}
              </button>
            </div>
          )}

          {activeMethod === 'github' && (
            <div className="text-center py-6 space-y-4">
              <div
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
                style={{ background: '#24292e' }}
              >
                <Github size={56} color="#fff" />
              </div>
              <p className="text-sm" style={{ color: colors.muted }}>
                使用 GitHub 账号一键登录
              </p>
              <button
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  background: '#24292e',
                  color: '#fff',
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Github size={18} /> 模拟 GitHub 登录
                  </>
                )}
              </button>
            </div>
          )}

          <p className="text-xs text-center mt-5" style={{ color: colors.muted }}>
            登录即表示同意 <span style={{ color: colors.primary, cursor: 'pointer' }}>服务条款</span> 和 <span style={{ color: colors.primary, cursor: 'pointer' }}>隐私政策</span>
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div
            className="p-3 rounded-xl text-center backdrop-blur-sm"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <Zap size={20} style={{ color: colors.primary }} className="mx-auto mb-1" />
            <p className="text-xs font-medium" style={{ color: colors.text }}>AI剧本生成</p>
          </div>
          <div
            className="p-3 rounded-xl text-center backdrop-blur-sm"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <Sparkles size={20} style={{ color: colors.accent }} className="mx-auto mb-1" />
            <p className="text-xs font-medium" style={{ color: colors.text }}>AI图片创作</p>
          </div>
          <div
            className="p-3 rounded-xl text-center backdrop-blur-sm"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <Crown size={20} style={{ color: colors.warning }} className="mx-auto mb-1" />
            <p className="text-xs font-medium" style={{ color: colors.text }}>AI语音合成</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;