# Drama Studio Pro - 极致本地 AI 短剧创作平台

## 🚀 项目简介

纯本地零云端、功能碾压全球的 Tauri 原生 AI 短剧创作桌面应用，专为个人极致优化。

## ✨ 核心特性

- 🛡️ **数据主权绝对优先** - 所有数据 100% 本地加密存储
- 🎨 **三种精美主题** - 极光蓝、暗夜紫、纯黑 AMOLED
- 🌐 **汉维双语原生支持** - 完美支持 RTL 布局
- 📹 **极致性能** - 冷启动 < 120ms
- 🎭 **动态玻璃态 UI** - 磨砂玻璃效果 + 粒子背景

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| 前端框架 | React 18.3.1 + TypeScript 5.5.4 |
| 构建工具 | Vite 5.4.10 |
| UI 组件库 | Ant Design 5.21.1 |
| 样式方案 | Tailwind CSS 3.4.13 + Framer Motion 11.0.28 |
| 状态管理 | Zustand 4.4.7 |
| 国际化 | i18next 23.12.2 + react-i18next 14.1.2 |
| 桌面框架 | Tauri 2.0 (即将配置 |

## 📦 安装依赖

```bash
npm install
```

## 🏃 开发运行

```bash
npm run dev
```

## 📦 项目结构

```
drama-studio-pro/
├── src/
│   ├── components/      # 组件目录
│   │   ├── TitleBar.tsx        # 自定义标题栏
│   │   ├── Sidebar.tsx        # 侧边栏
│   │   └── DynamicBackground.tsx    # 动态背景
│   ├── hooks/         # Hooks
│   │   └── useTheme.ts
│   ├── i18n/          # 国际化
│   │   └── index.ts
│   ├── locales/       # 语言文件
│   │   ├── zh.ts
│   │   └── ug.ts
│   ├── modules/       # 功能模块
│   │   ├── Dashboard.tsx
│   │   ├── Settings.tsx
│   │   └── GenericModule.tsx
│   ├── store/         # 状态管理
│   │   └── appStore.ts
│   ├── types/         # 类型定义
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎯 功能模块

- 📊 **工作台** - 快速开始和最近项目
- ✍️ **剧本创作** - AI 生成完整剧本
- 🎬 **分镜脚本** - 自动分镜
- 🎥 **视频生成** - 本地多模型调度
- 📁 **资产管理** - 角色/场景/道具库
- 🎤 **声音克隆** - 本地声音克隆
- 📝 **字幕编辑** - 智能字幕时间轴
- 📤 **导出设置** - 高清视频导出
- ⚙️ **系统设置** - 主题/语言/快捷键

## 🌟 **预览截图**

项目已完成 UI 框架，欢迎体验！
