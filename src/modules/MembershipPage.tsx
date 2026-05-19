import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Zap, Check, X, Clock, Gift, TrendingUp, Star, CreditCard, Smartphone, Wallet, ArrowRight, Sparkles, ShieldCheck, Infinity, Heart } from 'lucide-react';
import { useAppStore, themes } from '../store/appStore';
import { usePointStore, getMemberLimits, MemberLevel } from '../store/pointStore';

const MembershipPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useAppStore();
  const colors = themes[theme];
  const { points, member, dailySignIn, dailyCheckIn, purchaseMembership, deductPoints, getRemainingDays } = usePointStore();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat'>('alipay');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const isDark = theme !== 'aurora';
  const isPermanent = member.level === 'permanent';
  const limits = getMemberLimits(member.level);
  const remainingDays = getRemainingDays();
  const today = new Date().toDateString();
  const hasCheckedIn = dailySignIn === today;

  const handlePurchase = (level: MemberLevel) => {
    if (level === 'permanent') {
      setShowPayment(true);
    } else if (level === 'vip') {
      const result = purchaseMembership('vip');
      if (result.success) {
        setPurchaseSuccess(true);
        setTimeout(() => setPurchaseSuccess(false), 3000);
      }
    }
  };

  const handleConfirmPayment = () => {
    const result = purchaseMembership('permanent');
    if (result.success) {
      setShowPayment(false);
      setPurchaseSuccess(true);
      setTimeout(() => setPurchaseSuccess(false), 3000);
    }
  };

  const handleDailyCheckIn = () => {
    const result = dailyCheckIn();
    alert(result.message);
  };

  const plans = [
    {
      level: 'free' as MemberLevel,
      name: '免费版',
      price: '¥0',
      icon: <Zap size={20} />,
      color: colors.muted,
      features: [
        { text: 'AI 剧本生成（3次/天）', included: true },
        { text: 'AI 图片生成（2次/天）', included: true },
        { text: 'AI 语音合成（2次/天）', included: true },
        { text: '基础模型选择', included: true },
        { text: '高清导出 720p', included: true },
        { text: '自定义 AI 模型', included: false },
        { text: '高级模型（GPT-4o/DALL·E 3）', included: false },
        { text: '批量生成', included: false },
        { text: '无广告创作体验', included: false },
        { text: '1080p/4K 导出', included: false },
        { text: '优先技术支持', included: false },
      ],
    },
    {
      level: 'vip' as MemberLevel,
      name: 'VIP 月度会员',
      price: '¥9.9/月',
      icon: <Star size={20} />,
      color: colors.primary,
      popular: false,
      features: [
        { text: 'AI 剧本生成（20次/天）', included: true },
        { text: 'AI 图片生成（15次/天）', included: true },
        { text: 'AI 语音合成（15次/天）', included: true },
        { text: '全部模型选择', included: true },
        { text: '高清导出 1080p', included: true },
        { text: '自定义 AI 模型', included: true },
        { text: '高级模型（GPT-4o/DALL·E 3）', included: true },
        { text: '批量生成', included: false },
        { text: '无广告创作体验', included: true },
        { text: '1080p/4K 导出', included: false },
        { text: '优先技术支持', included: false },
      ],
    },
    {
      level: 'permanent' as MemberLevel,
      name: '永久会员',
      price: '¥19',
      icon: <Crown size={20} />,
      color: '#f59e0b',
      popular: true,
      features: [
        { text: 'AI 剧本生成（无限次）', included: true },
        { text: 'AI 图片生成（无限次）', included: true },
        { text: 'AI 语音合成（无限次）', included: true },
        { text: '全部模型选择', included: true },
        { text: '4K 超高清导出', included: true },
        { text: '自定义 AI 模型', included: true },
        { text: '高级模型（GPT-4o/DALL·E 3）', included: true },
        { text: '批量生成', included: true },
        { text: '无广告创作体验', included: true },
        { text: '4K HDR 导出', included: true },
        { text: '优先技术支持', included: true },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>
            <Crown size={28} className="inline mr-2" style={{ color: '#f59e0b' }} />
            会员中心
          </h1>
          <p className="text-sm" style={{ color: colors.muted }}>
            {isPermanent ? '🎉 你是尊贵的永久会员，畅享全部功能' : '升级会员，解锁无限 AI 创作能力'}
          </p>
        </div>

        {purchaseSuccess && (
          <div
            className="p-4 rounded-xl text-center animate-pulse"
            style={{ background: `${colors.success}20`, color: colors.success, border: `1px solid ${colors.success}40` }}
          >
            🎉 购买成功！尽情享受 AI 创作吧！
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            className="p-4 rounded-xl backdrop-blur-sm text-center"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <div className="text-2xl font-bold" style={{ color: colors.primary }}>{points}</div>
            <p className="text-xs mt-1" style={{ color: colors.muted }}>当前积分</p>
          </div>
          <div
            className="p-4 rounded-xl backdrop-blur-sm text-center"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <div className="text-2xl font-bold" style={{ color: colors.success }}>
              {member.level === 'permanent' ? <Infinity size={24} className="inline" /> : String(limits.dailyTotal)}
            </div>
            <p className="text-xs mt-1" style={{ color: colors.muted }}>每日额度</p>
          </div>
          <div
            className="p-4 rounded-xl backdrop-blur-sm text-center"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <div className="text-2xl font-bold capitalize" style={{ color: colors.accent }}>
              {member.level === 'permanent' ? '永久' : member.level === 'vip' ? 'VIP' : '免费'}
            </div>
            <p className="text-xs mt-1" style={{ color: colors.muted }}>会员等级</p>
          </div>
          <div
            className="p-4 rounded-xl backdrop-blur-sm text-center"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <div className="text-2xl font-bold" style={{ color: colors.warning }}>
              {isPermanent ? <Infinity size={24} className="inline" /> : remainingDays}
            </div>
            <p className="text-xs mt-1" style={{ color: colors.muted }}>剩余天数</p>
          </div>
        </div>

        <button
          onClick={handleDailyCheckIn}
          disabled={hasCheckedIn}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
          style={{
            background: hasCheckedIn ? colors.input : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            color: hasCheckedIn ? colors.muted : '#fff',
            cursor: hasCheckedIn ? 'not-allowed' : 'pointer',
          }}
        >
          <Gift size={18} />
          {hasCheckedIn ? '今日已签到 ✓' : '每日签到 +10 积分（连续签到 +30）'}
        </button>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = member.level === plan.level || (plan.level === 'permanent' && isPermanent);
            return (
              <div
                key={plan.level}
                className={`p-6 rounded-2xl backdrop-blur-sm relative transition-all ${
                  plan.popular ? 'scale-105 md:scale-110 ring-2' : ''
                }`}
                style={{
                  background: isDark ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.08)',
                  border: `2px solid ${plan.popular ? plan.color : colors.border}`,
                  boxShadow: plan.popular ? `0 0 20px ${plan.color}40` : undefined,
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: plan.color, color: '#000' }}
                  >
                    🔥 最超值
                  </div>
                )}
                {isCurrent && (
                  <div
                    className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${colors.success}30`, color: colors.success }}
                  >
                    当前
                  </div>
                )}

                <div className="text-center mb-4 mt-2">
                  <div className="flex items-center justify-center gap-2 mb-2" style={{ color: plan.color }}>
                    {plan.icon}
                    <span className="font-bold text-lg">{plan.name}</span>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{ color: colors.text }}>
                    {plan.price}
                  </div>
                  {plan.level === 'permanent' && (
                    <p className="text-xs" style={{ color: colors.success }}>一次购买 · 永久使用 · 无续费</p>
                  )}
                  {plan.level === 'vip' && (
                    <p className="text-xs" style={{ color: colors.muted }}>按月订阅</p>
                  )}
                </div>

                <div className="space-y-2.5 mb-5">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {f.included ? (
                        <Check size={16} style={{ color: colors.success }} />
                      ) : (
                        <X size={16} style={{ color: colors.muted, opacity: 0.5 }} />
                      )}
                      <span style={{ color: f.included ? colors.text : colors.muted, opacity: f.included ? 1 : 0.5 }}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchase(plan.level)}
                  disabled={isCurrent}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    background: isCurrent ? colors.input : plan.color,
                    color: isCurrent ? colors.muted : plan.level === 'permanent' ? '#000' : '#fff',
                    cursor: isCurrent ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCurrent ? '当前方案' : plan.level === 'permanent' ? '¥19 立即解锁' : '立即订阅'}
                  {!isCurrent && <ArrowRight size={16} />}
                </button>
              </div>
            );
          })}
        </div>

        <div
          className="p-4 rounded-xl backdrop-blur-sm"
          style={{ background: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
            <TrendingUp size={16} style={{ color: colors.primary }} />
            积分记录
          </h3>
          <div className="max-h-48 overflow-auto space-y-2">
            {usePointStore.getState().pointHistory.slice(0, 20).map((record, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg" style={{ background: colors.input }}>
                <span style={{ color: colors.text }}>{record.reason}</span>
                <span style={{ color: record.amount > 0 ? colors.success : colors.error }}>
                  {record.amount > 0 ? '+' : ''}{record.amount}
                </span>
              </div>
            ))}
            {usePointStore.getState().pointHistory.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: colors.muted }}>暂无积分记录</p>
            )}
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: isDark ? '#1e293b' : '#1a1a2e', border: `1px solid ${colors.border}` }}
          >
            <h3 className="text-lg font-bold mb-2 text-center" style={{ color: colors.text }}>
              💎 永久会员
            </h3>
            <p className="text-center text-3xl font-bold mb-4" style={{ color: '#f59e0b' }}>¥19.00</p>
            <p className="text-center text-xs mb-5" style={{ color: colors.muted }}>
              一次购买，永久使用，所有功能全部解锁
            </p>

            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setPaymentMethod('alipay')}
                className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{
                  background: paymentMethod === 'alipay' ? colors.primary : colors.input,
                  color: paymentMethod === 'alipay' ? '#fff' : colors.muted,
                }}
              >
                <Smartphone size={16} /> 支付宝
              </button>
              <button
                onClick={() => setPaymentMethod('wechat')}
                className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{
                  background: paymentMethod === 'wechat' ? colors.primary : colors.input,
                  color: paymentMethod === 'wechat' ? '#fff' : colors.muted,
                }}
              >
                <Wallet size={16} /> 微信支付
              </button>
            </div>

            <div
              className="w-48 h-48 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ background: colors.input, border: `2px dashed ${colors.border}` }}
            >
              <div className="text-center">
                {paymentMethod === 'alipay' ? (
                  <CreditCard size={48} style={{ color: '#1677FF' }} />
                ) : (
                  <Wallet size={48} style={{ color: '#07C160' }} />
                )}
                <p className="text-xs mt-2" style={{ color: colors.muted }}>
                  {paymentMethod === 'alipay' ? '支付宝扫码支付' : '微信扫码支付'}
                </p>
                <p className="text-xs" style={{ color: colors.muted }}>¥19.00</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: colors.input, color: colors.muted }}
              >
                取消
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: '#f59e0b', color: '#000' }}
              >
                确认支付 ¥19
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;