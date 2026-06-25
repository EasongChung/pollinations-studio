# Pollinations Studio 中文版

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite" alt="Vite 7">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
</p>

> 基于 [Pollinations AI](https://pollinations.ai) 的中文 AI 创意工作台，免费使用，无需注册。

[**🌐 在线体验**](https://pollinations-studio.vercel.app) · [**🏠 Pollinations 官网**](https://pollinations.ai)

---

## ✨ 功能

| 模块 | 说明 |
|------|------|
| 🖼️ **文生图** | 支持 Flux 等 8 种模型，多种比例，高级参数调节 |
| 💬 **AI 对话** | GPT-4o / Claude / Gemini / Llama 自由切换，对话历史保存 |
| 🎬 **视频生成** | 图生视频 + 文生视频双模式，LTX-Video 免费生成 |

### 亮点

- 🇨🇳 **完整中文界面** — 官方 Pollinations 不支持中文，本项目提供全中文体验
- 🌙 **暗色玻璃态设计** — 深色背景 + 毛玻璃效果，现代大气
- 📱 **响应式布局** — 桌面端双列、移动端堆叠，适配各种屏幕
- 📝 **临时记录** — 图片/视频/对话生成记录自动保存，切换页面不丢失
- ⚡ **免费使用** — 无需注册，无需 API Key，开箱即用

## 🛠 技术栈

- **框架**: React 19
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 4
- **部署**: Vercel
- **国际化**: 自定义 i18n Context（中/英）

## 🚀 本地运行

```bash
# 克隆项目
git clone https://github.com/EasongChung/pollinations-studio.git
cd pollinations-studio

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📦 部署

项目已配置为 Vercel 一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/EasongChung/pollinations-studio)

或手动部署：

```bash
npx vercel --prod
```

## 📂 项目结构

```
pollinations-studio/
├── src/
│   ├── App.jsx          # 主应用（所有组件 + i18n）
│   ├── main.jsx         # 入口
│   └── index.css        # 全局样式 + 动画
├── dist/                # 构建产物
├── index.html
├── package.json
└── vite.config.js
```

## 🙏 致谢

- 图像生成 API: [image.pollinations.ai](https://image.pollinations.ai)
- 文本生成 API: [text.pollinations.ai](https://text.pollinations.ai)
- 视频生成 API: [video.pollinations.ai](https://video.pollinations.ai)

## 📄 许可

MIT © [EasongChung](https://github.com/EasongChung)