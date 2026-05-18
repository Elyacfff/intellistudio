/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 极光蓝主题
        aurora: {
          primary: '#165DFF',
          secondary: '#4080FF',
          tertiary: '#69B1FF',
          quaternary: '#9DD3FF',
          bg: '#0F172A',
          card: '#1E293B',
          input: '#334155',
          title: '#F8FAFC',
          body: '#E2E8F0',
          muted: '#94A3B8',
          hint: '#64748B',
          border: '#475569',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444'
        },
        // 暗夜紫主题
        night: {
          primary: '#722ED1',
          secondary: '#9254DE',
          tertiary: '#B37FEB',
          quaternary: '#D3ADF7',
          bg: '#12071F',
          card: '#1E1030',
          input: '#2D1B47',
          title: '#FAF5FF',
          body: '#E9D5FF',
          muted: '#C084FC',
          hint: '#A855F7',
          border: '#581C87'
        },
        // 纯黑 AMOLED 主题
        amoled: {
          primary: '#FFFFFF',
          secondary: '#E5E7EB',
          tertiary: '#D1D5DB',
          quaternary: '#9CA3AF',
          bg: '#000000',
          card: '#0A0A0A',
          input: '#141414',
          title: '#FFFFFF',
          body: '#F3F4F6',
          muted: '#D1D5DB',
          hint: '#9CA3AF',
          border: '#262626'
        }
      },
      fontFamily: {
        sans: ['"Source Han Sans SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        uyghur: ['"Noto Sans Uyghur"', 'system-ui']
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        input: '8px',
        modal: '16px'
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
}
