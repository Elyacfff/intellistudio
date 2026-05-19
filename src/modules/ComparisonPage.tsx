import React from 'react';
import { Check, X, Minus, Zap, Crown, TrendingUp, Award } from 'lucide-react';
import { useAppStore, themes } from '../store/appStore';

interface ComparisonRow {
  feature: string;
  ours: boolean | string;
  jianying: boolean | string;
  capcut: boolean | string;
  runway: boolean | string;
  sora: boolean | string;
  kling: boolean | string;
}

const ComparisonPage: React.FC = () => {
  const { theme } = useAppStore();
  const colors = themes[theme];
  const isDark = theme !== 'aurora';

  const comparisons: ComparisonRow[] = [
    { feature: 'AI 智能剧本生成', ours: '✅ 全模型', jianying: '❌', capcut: '❌', runway: '✅', sora: '❌', kling: '❌' },
    { feature: 'AI 图片生成', ours: '✅ DALL·E/Stable', jianying: '✅', capcut: '✅', runway: '✅', sora: '✅', kling: '✅' },
    { feature: 'AI 语音合成', ours: '✅ 多语种', jianying: '✅', capcut: '✅', runway: '❌', sora: '❌', kling: '❌' },
    { feature: 'AI 视频生成', ours: '✅ 规划中', jianying: '❌', capcut: '❌', runway: '✅', sora: '✅', kling: '✅' },
    { feature: '自定义 AI 模型', ours: '✅ 全部支持', jianying: '❌', capcut: '❌', runway: '❌', sora: '❌', kling: '❌' },
    { feature: '本地模型 (Ollama)', ours: '✅ 免费', jianying: '❌', capcut: '❌', runway: '❌', sora: '❌', kling: '❌' },
    { feature: '多语言支持', ours: '✅ 10+语言', jianying: '✅ 中英', capcut: '✅ 中英', runway: '✅ 英语', sora: '✅ 英语', kling: '✅ 中英' },
    { feature: '中/维双语界面', ours: '✅', jianying: '❌', capcut: '❌', runway: '❌', sora: '❌', kling: '❌' },
    { feature: 'RTL 布局（维语）', ours: '✅', jianying: '❌', capcut: '❌', runway: '❌', sora: '❌', kling: '❌' },
    { feature: '一键全流程创作', ours: '✅ IntelliStudio', jianying: '❌', capcut: '❌', runway: '❌', sora: '❌', kling: '❌' },
    { feature: '分镜脚本生成', ours: '✅ 自动', jianying: '✅ 手动', capcut: '✅ 手动', runway: '❌', sora: '❌', kling: '❌' },
    { feature: '声音克隆', ours: '✅', jianying: '✅', capcut: '❌', runway: '❌', sora: '❌', kling: '❌' },
    { feature: '字幕自动生成', ours: '✅', jianying: '✅', capcut: '✅', runway: '✅', sora: '❌', kling: '❌' },
    { feature: '数据本地存储', ours: '✅ 隐私安全', jianying: '❌ 云端', capcut: '❌ 云端', runway: '❌ 云端', sora: '❌ 云端', kling: '❌ 云端' },
    { feature: '免费使用额度', ours: '✅ 每日免费', jianying: '✅ 基础', capcut: '✅ 基础', runway: '⏸ 试用', sora: '❌ 付费', kling: '⏸ 试用' },
    { feature: '永久会员价格', ours: '¥19', jianying: '¥198/年', capcut: '¥168/年', runway: '$15/月', sora: '$20/月', kling: '¥66/月' },
    { feature: '无广告体验', ours: '✅', jianying: '❌', capcut: '❌', runway: '✅', sora: '✅', kling: '✅' },
    { feature: '4K 超清导出', ours: '✅ 永久会员', jianying: '✅ 会员', capcut: '✅ 会员', runway: '✅', sora: '✅', kling: '✅' },
    { feature: '批量处理', ours: '✅ 永久会员', jianying: '❌', capcut: '❌', runway: '✅', sora: '❌', kling: '❌' },
    { feature: '开源/可定制', ours: '✅ 前端开源', jianying: '❌', capcut: '❌', runway: '❌', sora: '❌', kling: '❌' },
  ];

  const renderValue = (val: boolean | string) => {
    if (typeof val === 'boolean') return val ? <Check size={16} style={{ color: colors.success }} /> : <X size={16} style={{ color: colors.error }} />;
    if (val === '✅') return <Check size={16} style={{ color: colors.success }} />;
    if (val === '❌') return <X size={16} style={{ color: colors.error, opacity: 0.5 }} />;
    if (val.startsWith('✅')) return <span className="text-xs font-medium" style={{ color: colors.success }}>{val.replace('✅ ', '')}</span>;
    if (val.startsWith('⏸')) return <span className="text-xs" style={{ color: colors.warning }}>{val.replace('⏸ ', '')}</span>;
    return <span className="text-xs" style={{ color: colors.muted }}>{val}</span>;
  };

  const products = [
    { name: 'Drama Studio Pro', ours: true, color: colors.primary, icon: <Crown size={14} /> },
    { name: '剪映', ours: false, color: '#00df80', icon: null },
    { name: 'CapCut', ours: false, color: '#ffffff', icon: null },
    { name: 'Runway', ours: false, color: '#7c3aed', icon: null },
    { name: 'Sora', ours: false, color: '#f59e0b', icon: null },
    { name: '可灵 Kling', ours: false, color: '#06b6d4', icon: null },
  ];

  const categories = [
    { title: '😮 AI 能力对比', count: 5 },
    { title: '🤿 多语言支持', count: 3 },
    { title: '🔥 创作流程', count: 4 },
    { title: '💪 价格与隐私', count: 5 },
    { title: '💰 高级功能', count: 3 },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>
            <TrendingUp size={24} className="inline mr-2" style={{ color: colors.primary }} />
            竞品功能对比
          </h1>
          <p className="text-sm" style={{ color: colors.muted }}>
            Drama Studio Pro vs 主流 AI 视频创作工具，全面对比不吹不黑
          </p>
        </div>

        <div
          className="rounded-2xl p-4 md:p-6 overflow-x-auto backdrop-blur-sm"
          style={{ background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.08)', border: `1px solid ${colors.border}` }}
        >
          <table className="w-full text-sm" style={{ minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <th className="text-left py-3 px-2 sticky left-0 z-10" style={{ background: isDark ? '#1e293b' : '#0f172a', color: colors.muted }}>
                  功能
                </th>
                {products.map((p) => (
                  <th key={p.name} className="py-3 px-2 text-center" style={{ color: p.ours ? colors.primary : colors.muted }}>
                    <div className="flex items-center justify-center gap-1.5">
                      {p.ours && <Award size={14} style={{ color: '#f59e0b' }} />}
                      <span className={`font-bold ${p.ours ? '' : 'text-xs'}`}>{p.name}</span>
                      {p.ours && <Award size={14} style={{ color: '#f59e0b' }} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr
                  key={i}
                  className="transition-all"
                  style={{ borderBottom: `1px solid ${colors.border}20` }}
                >
                  <td
                    className="py-3 px-2 font-medium sticky left-0 z-10"
                    style={{ background: isDark ? '#1e293b' : '#0f172a', color: colors.text }}
                  >
                    {row.feature}
                  </td>
                  <td className="py-3 px-2 text-center" style={{ background: `${colors.primary}10` }}>
                    {renderValue(row.ours)}
                  </td>
                  <td className="py-3 px-2 text-center">{renderValue(row.jianying)}</td>
                  <td className="py-3 px-2 text-center">{renderValue(row.capcut)}</td>
                  <td className="py-3 px-2 text-center">{renderValue(row.runway)}</td>
                  <td className="py-3 px-2 text-center">{renderValue(row.sora)}</td>
                  <td className="py-3 px-2 text-center">{renderValue(row.kling)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div
            className="p-5 rounded-2xl backdrop-blur-sm"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: colors.success }}>
              <TrendingUp size={18} /> 我们的优势
            </h3>
            <ul className="space-y-2">
              {[
                '支持自定义任何 AI 模型（OpenAI/DeepSeek/Ollama 等）',
                '唯一支持中/维双语 + RTL 布局的平台',
                '数据 100% 本地存储，隐私绝对安全',
                '¥19 永久会员，无订阅无续费',
                '一站式 IntelliStudio 全流程自动创作',
                '支持本地模型（Ollama），完全免费离线使用',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color: colors.success }} />
                  <span style={{ color: colors.text }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="p-5 rounded-2xl backdrop-blur-sm"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
              <Zap size={18} /> 竞品值得学习的
            </h3>
            <ul className="space-y-2">
              {[
                'AI 视频生成能力（Runway/Sora 领先）',
                '移动端 App 体验（剪映/CapCut）',
                '云端协同编辑（剪映团队版）',
                '模板市场丰富度（剪映/CapCut）',
                '实时预览渲染引擎',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Minus size={16} className="mt-0.5 shrink-0" style={{ color: colors.primary }} />
                  <span style={{ color: colors.text }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="p-5 rounded-2xl backdrop-blur-sm"
            style={{ background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}
          >
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: '#f59e0b' }}>
              <Crown size={18} /> 价格对比
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Drama Studio Pro', price: '¥19 永久', ours: true },
                { name: '剪映 VIP', price: '¥198/年' },
                { name: 'CapCut Pro', price: '¥168/年' },
                { name: 'Runway', price: '$15/月 ≈ ¥108/月' },
                { name: 'Sora', price: '$20/月 ≈ ¥144/月' },
                { name: '可灵 Kling', price: '¥66/月' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg" style={{ background: item.ours ? `${colors.primary}15` : colors.input }}>
                  <span style={{ color: item.ours ? colors.primary : colors.text, fontWeight: item.ours ? 'bold' : 'normal' }}>
                    {item.ours && '🏆 '}{item.name}
                  </span>
                  <span style={{ color: item.ours ? colors.success : colors.muted, fontWeight: item.ours ? 'bold' : 'normal' }}>
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;