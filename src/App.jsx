import React, { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react'

// ================================================================
//  Pollinations APP — AI Creative Studio
//  Design: Dark Glassmorphism · Responsive Two-Column · i18n
//  Stack: React 19 + Tailwind CSS 4 + Vite
// ================================================================

// ─── i18n ──────────────────────────────────────────────────────

const LANGUAGES = { zh: '中文', en: 'English' }

const I18N = {
  en: {
    heroDesc: 'Pollinations Studio 中文版 — 专为中文用户打造的 AI 创意工作台。官方 Pollinations 暂不支持中文界面，本页面提供完整的中文体验，免费使用，无需注册。',
    tabImage: '文生图', tabChat: 'AI 对话', tabVideo: '图生视频',
    prompt: '提示词', negPrompt: '反向提示', model: '模型',
    aspectRatio: '画面比例', advanced: '高级选项',
    seed: '随机种子', guidance: '引导强度', enhance: '提示词增强', nologo: '去除水印',
    ctrlEnter: 'Ctrl + Enter 快速生成', chars: '字符',
    generate: '生成图像', generating: '正在生成图像...',
    genImageHint: '描述你想要生成的图像画面',
    genImagePH: '电影广角镜头下的未来城市日落，金色光线，体积雾，8K...',
    negPH: '模糊、低质量、水印、文字、扭曲...',
    viewFull: '查看原图', download: '下载', copyUrl: '复制 URL', directUrl: '直接链接',
    loading: '生成中...',
    chatPH: '输入你的消息...', chatStart: '开始对话', chatStartDesc: '选择模型，发送消息开始聊天',
    enterSend: '按 Enter 发送', tokens: '最大令牌', temp: '温度',
    refImage: '参考图片 URL', refImageHint: '支持 PNG、JPG、WebP — 提供可公开访问的图片链接',
    refPH: 'https://example.com/your-reference-image.jpg',
    motionDesc: '运动描述',
    motionPH: '镜头缓缓右移，水面泛起轻柔的涟漪...',
    duration: '时长', width: '宽度', height: '高度',
    genVideo: '生成视频', genVideoHint: '可能需要几分钟',
    downloadVideo: '下载视频',
    enterPrompt: '请输入提示词', enterRef: '请提供参考图片 URL',
    reqTimeout: '请求超时，请重试。',
    imgFailed: '图像加载失败，请尝试不同的提示词或模型。',
    videoFailed: '视频生成超时', genFailed: '生成失败',
    footer: '基于 Pollinations AI 构建 · GitHub 开源 · 免费使用',
    copied: 'URL 已复制到剪贴板', random: '随机',
    videoMode: '视频模式', img2video: '图生视频', txt2video: '文生视频',
    refPic: '参考图片（选填）', motionPHshort: '描述画面中的运动...',
    history: 'History',
  },
  zh: {
    heroDesc: 'Pollinations Studio 中文版 — 专为中文用户打造的 AI 创意工作台。官方 Pollinations 暂不支持中文界面，本页面提供完整的中文体验，免费使用，无需注册。',
    tabImage: '文生图', tabChat: 'AI 对话', tabVideo: '图生视频',
    prompt: '提示词', negPrompt: '反向提示', model: '模型',
    aspectRatio: '画面比例', advanced: '高级选项',
    seed: '随机种子', guidance: '引导强度', enhance: '提示词增强', nologo: '去除水印',
    ctrlEnter: 'Ctrl + Enter 快速生成', chars: '字符',
    generate: '生成图像', generating: '正在生成图像...',
    genImageHint: '描述你想要生成的图像画面',
    genImagePH: '电影广角镜头下的未来城市日落，金色光线，体积雾，8K...',
    negPH: '模糊、低质量、水印、文字、扭曲...',
    viewFull: '查看原图', download: '下载', copyUrl: '复制 URL', directUrl: '直接链接',
    loading: '生成中...',
    chatPH: '输入你的消息...', chatStart: '开始对话', chatStartDesc: '选择模型，发送消息开始聊天',
    enterSend: '按 Enter 发送', tokens: '最大令牌', temp: '温度',
    refImage: '参考图片 URL', refImageHint: '支持 PNG、JPG、WebP — 提供可公开访问的图片链接',
    refPH: 'https://example.com/your-reference-image.jpg',
    motionDesc: '运动描述',
    motionPH: '镜头缓缓右移，水面泛起轻柔的涟漪...',
    duration: '时长', width: '宽度', height: '高度',
    genVideo: '生成视频', genVideoHint: '可能需要几分钟',
    downloadVideo: '下载视频',
    enterPrompt: '请输入提示词', enterRef: '请提供参考图片 URL',
    reqTimeout: '请求超时，请重试。',
    imgFailed: '图像加载失败，请尝试不同的提示词或模型。',
    videoFailed: '视频生成超时', genFailed: '生成失败',
    footer: '基于 Pollinations AI 构建 · GitHub 开源 · 免费使用',
    copied: 'URL 已复制到剪贴板', random: '随机',
    videoMode: '视频模式', img2video: '图生视频', txt2video: '文生视频',
    refPic: '参考图片（选填）', motionPHshort: '描述画面中的运动...',
    history: '临时记录',
  },
}

const LangContext = createContext('zh')

// ─── Utilities ─────────────────────────────────────────────────
function encodePrompt(t) { return encodeURIComponent(t.trim()) }

// ─── SVG Icons ─────────────────────────────────────────────────
const Icons = {
  Sparkles: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/><path d="M5 3l.5 2L7 5.5 5 6l-.5 2L4 6l-2-.5L4 5l.5-2L5 3z"/><path d="M19 15l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2z"/></svg>,
  Image: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  MessageCircle: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Video: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Download: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Copy: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  ExternalLink: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Settings: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  AlertCircle: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Send: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  User: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Bot: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Loader: p => <svg className={`animate-spin ${p.className}`} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/></svg>,
  Globe: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  ChevronDown: p => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
}

// ─── Data ──────────────────────────────────────────────────────
const IMAGE_MODELS = [
  { value: 'flux', label: 'Flux', free: true }, { value: 'flux-realism', label: 'Realism', free: true },
  { value: 'flux-3d', label: '3D Render', free: true }, { value: 'flux-anime', label: 'Anime', free: true },
  { value: 'flux-pixel', label: 'Pixel Art', free: true }, { value: 'flux-cablyai', label: 'CablyAI', free: true },
  { value: 'turbo', label: 'Turbo', free: false }, { value: 'flux-caricature', label: 'Caricature', free: true },
]
const ASPECT_RATIOS = [
  { label: '1:1', w: 1024, h: 1024 }, { label: '16:9', w: 1344, h: 768 }, { label: '9:16', w: 768, h: 1344 },
  { label: '4:3', w: 1152, h: 896 }, { label: '3:4', w: 896, h: 1152 }, { label: '3:2', w: 1216, h: 832 }, { label: '2:3', w: 832, h: 1216 },
]
const TEXT_MODELS = [
  { value: 'openai', label: 'GPT-4o', descZh: 'OpenAI · 全能', descEn: 'OpenAI · Versatile' },
  { value: 'anthropic', label: 'Claude', descZh: 'Anthropic · 推理', descEn: 'Anthropic · Reasoning' },
  { value: 'google', label: 'Gemini', descZh: 'Google · 多模态', descEn: 'Google · Multimodal' },
  { value: 'meta', label: 'Llama', descZh: 'Meta · 开源', descEn: 'Meta · Open source' },
]
const VIDEO_MODELS = [
  { value: 'ltxv', label: 'LTX-Video', free: true },
  { value: 'flux', label: 'Flux Video', free: false },
  { value: 'wan', label: 'Wan 2.1', free: false },
]

// ─── Shared Components ─────────────────────────────────────────
function GlassCard({ children, className = '' }) {
  return <div className={`backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl ${className}`}>{children}</div>
}

function Input({ value, onChange, placeholder, ...rest }) {
  return <input value={value} onChange={onChange} placeholder={placeholder}
    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/90 placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 transition-all duration-200 text-sm" {...rest} />
}

function Textarea({ value, onChange, placeholder, rows = 3, onKeyDown }) {
  return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} onKeyDown={onKeyDown}
    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/90 placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 transition-all duration-200 text-sm resize-none" />
}

function SectionLabel({ icon: Icon, children }) {
  return <div className="flex items-center gap-2 mb-3">{Icon && <Icon className="w-4 h-4 text-violet-400" />}<span className="text-xs font-semibold text-white/60 uppercase tracking-wider">{children}</span></div>
}

function Chip({ label, active, free, onClick }) {
  return <button onClick={onClick}
    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active ? 'bg-violet-500/20 border border-violet-400/30 text-violet-200 shadow-lg shadow-violet-500/10' : 'bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.06]'}`}>
    {label}{free && <span className="ml-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">FREE</span>}
  </button>
}

function PrimaryBtn({ children, onClick, disabled, loading, icon: Icon }) {
  return <button onClick={onClick} disabled={disabled}
    className={`group relative w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${disabled ? 'bg-white/[0.05] text-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] hover:bg-right text-white shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 active:scale-[0.98]'}`}>
    <span className="relative z-10 flex items-center justify-center gap-2">
      {loading ? <Icons.Loader className="w-4 h-4" /> : Icon && <Icon className="w-4 h-4" />}{children}
    </span>
  </button>
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl backdrop-blur-xl border text-sm font-medium animate-[slideUp_0.3s_ease-out] ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/10 border-white/10 text-white'}`}>{message}</div>
}

// ─── Header ────────────────────────────────────────────────────
function Header({ lang, setLang }) {
  const [showLang, setShowLang] = useState(false)
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Pollinations APP</h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/20">中文版</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <button onClick={() => setShowLang(!showLang)} className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/[0.06]">
              <Icons.Globe className="w-4 h-4" /><span className="text-xs font-medium hidden sm:inline">{LANGUAGES[lang]}</span><Icons.ChevronDown className={`w-3 h-3 transition-transform ${showLang ? 'rotate-180' : ''}`} />
            </button>
            {showLang && <><div className="fixed inset-0 z-10" onClick={() => setShowLang(false)} /><div className="absolute right-0 top-full mt-1 z-20 bg-gray-900 border border-white/[0.1] rounded-xl p-1 shadow-xl min-w-[100px]">{Object.entries(LANGUAGES).map(([k, v]) => <button key={k} onClick={() => { setLang(k); setShowLang(false) }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${lang === k ? 'bg-violet-500/20 text-violet-200' : 'text-white/60 hover:bg-white/[0.06]'}`}>{v}</button>)}</div></>}
          </div>
          <a href="https://github.com/EasongChung/pollinations-studio" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </header>
  )
}

// ─── Tab Nav ───────────────────────────────────────────────────
function TabNav({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center mb-6 sm:mb-8">
      <div className="inline-flex bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-1 overflow-x-auto max-w-full">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === t.key ? 'bg-violet-500/20 text-white shadow-lg shadow-violet-500/10' : 'text-white/40 hover:text-white/70'}`}>
            <t.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Image Tab ─────────────────────────────────────────────────
function ImageTab({ t, history, addToHistory }) {
  const lang = useContext(LangContext)
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('flux')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [seed, setSeed] = useState('')
  const [enhance, setEnhance] = useState(false)
  const [nologo, setNologo] = useState(false)
  const [guidanceScale, setGuidanceScale] = useState(3.5)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageError, setImageError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState(null)

  const r = ASPECT_RATIOS.find(x => x.label === aspectRatio) || ASPECT_RATIOS[0]

  const gen = useCallback(() => {
    if (!prompt.trim()) { setImageError(t('enterPrompt')); return }
    setImageError(''); setGenerating(true); setImageUrl('')
    const p = new URLSearchParams()
    p.set('model', model); p.set('width', r.w); p.set('height', r.h)
    if (seed) p.set('seed', seed); if (negativePrompt) p.set('negative_prompt', negativePrompt)
    if (enhance) p.set('enhance', 'true'); if (nologo) p.set('nologo', 'true')
    p.set('safe', 'true'); if (guidanceScale) p.set('guidance_scale', String(guidanceScale))
    const url = `https://image.pollinations.ai/p/${encodeURIComponent(prompt.trim())}?${p.toString()}`
    setGeneratedUrl(url)
    const img = new Image()
    img.onload = () => { setImageUrl(url); setGenerating(false); addToHistory({ url, prompt: prompt.trim(), model, aspectRatio }) }
    img.onerror = () => { setImageError(t('imgFailed')); setGenerating(false) }
    img.src = url
  }, [prompt, model, r, seed, negativePrompt, enhance, nologo, guidanceScale, t])

  const copyUrl = () => navigator.clipboard.writeText(generatedUrl).then(() => setToast({ message: t('copied'), type: 'success' }))
  const dl = () => { const a = document.createElement('a'); a.href = imageUrl; a.download = `pollinations-${Date.now()}.jpg`; a.click() }

  const left = (
    <div className="space-y-4">
      <GlassCard className="p-4 sm:p-5">
        <SectionLabel icon={Icons.Sparkles}>{t('prompt')}</SectionLabel>
        <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('genImagePH')} rows={4}
          onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); gen() }}} />
        <div className="flex justify-between mt-2"><p className="text-[10px] text-white/20">{t('ctrlEnter')}</p><p className="text-[10px] text-white/20">{prompt.length} {t('chars')}</p></div>
      </GlassCard>
      <GlassCard className="p-4 sm:p-5">
        <SectionLabel icon={Icons.AlertCircle}>{t('negPrompt')}</SectionLabel>
        <Textarea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder={t('negPH')} rows={2} />
      </GlassCard>
      <GlassCard className="p-4 sm:p-5">
        <SectionLabel icon={Icons.Image}>{t('model')}</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {IMAGE_MODELS.map(m => <Chip key={m.value} label={m.label} active={model === m.value} free={m.free} onClick={() => setModel(m.value)} />)}
        </div>
      </GlassCard>
      <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors">
        <Icons.Settings className="w-3.5 h-3.5" />{t('advanced')}
        <svg className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      {showAdvanced && (
        <GlassCard className="p-4 sm:p-5 space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-white/40 mb-1.5 block">{t('seed')}</label><input type="text" value={seed} onChange={e => setSeed(e.target.value)} placeholder={t('random')} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/40" /></div>
            <div><label className="text-xs text-white/40 mb-1.5 block">{t('guidance')} · {guidanceScale}</label><input type="range" min="1" max="20" step="0.5" value={guidanceScale} onChange={e => setGuidanceScale(parseFloat(e.target.value))} className="w-full accent-violet-500" /></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={enhance} onChange={e => setEnhance(e.target.checked)} className="w-4 h-4 accent-violet-500 rounded" /><span className="text-xs text-white/60">{t('enhance')}</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={nologo} onChange={e => setNologo(e.target.checked)} className="w-4 h-4 accent-violet-500 rounded" /><span className="text-xs text-white/60">{t('nologo')}</span></label>
          </div>
        </GlassCard>
      )}
    </div>
  )

  // Right: generate btn + aspect ratio + preview
  const right = (
    <div className="space-y-4">
      <PrimaryBtn onClick={gen} disabled={generating || !prompt.trim()} loading={generating} icon={Icons.Sparkles}>{t('generate')}</PrimaryBtn>
      <GlassCard className="p-4 sm:p-5">
        <SectionLabel>{t('aspectRatio')}</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {ASPECT_RATIOS.map(r2 => (
            <button key={r2.label} onClick={() => setAspectRatio(r2.label)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${aspectRatio === r2.label ? 'bg-violet-500/20 border-violet-400/30 text-violet-200' : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06]'}`}>
              {r2.label}<span className="ml-1 text-[10px] text-white/30">{r2.w}×{r2.h}</span>
            </button>
          ))}
        </div>
      </GlassCard>
      {generating && (
        <GlassCard className="p-4 overflow-hidden">
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 animate-pulse flex items-center justify-center"><Icons.Loader className="w-6 h-6 text-violet-400" /></div>
            <p className="text-sm text-white/40">{t('generating')}</p>
            <div className="w-48 h-0.5 bg-white/[0.06] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-[shimmer_2s_ease-in-out_infinite]" style={{width:'60%'}} /></div>
          </div>
        </GlassCard>
      )}
      {imageUrl && !generating && (
        <GlassCard className="p-3 sm:p-4 overflow-hidden">
          <div className="relative group rounded-xl overflow-hidden">
            <img src={imageUrl} alt={prompt} className="w-full max-h-[65vh] object-contain rounded-xl" onError={() => setImageError(t('imgFailed'))} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-xl flex items-center justify-center">
              <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2.5 rounded-xl font-medium text-sm"><Icons.ExternalLink className="w-4 h-4" />{t('viewFull')}</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={dl} className="flex items-center justify-center gap-2 py-3 bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 transition-all"><Icons.Download className="w-4 h-4" />{t('download')}</button>
            <button onClick={copyUrl} className="flex items-center justify-center gap-2 py-3 bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 transition-all"><Icons.Copy className="w-4 h-4" />{t('copyUrl')}</button>
          </div>
        </GlassCard>
      )}
      {!generating && !imageUrl && (
        <GlassCard className="p-4 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 text-white/20 gap-3">
            <Icons.Image className="w-14 h-14 opacity-30" /><p className="text-sm text-white/15">{t('genImageHint')}</p>
          </div>
        </GlassCard>
      )}
      {imageError && (
        <GlassCard className="p-4 border-red-500/20 bg-red-500/[0.04]">
          <div className="flex items-start gap-3"><Icons.AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /><p className="text-sm text-red-400/80">{imageError}</p></div>
        </GlassCard>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {history && history.length > 0 && (
        <GlassCard className="p-3 sm:p-4">
          <SectionLabel>{t('history')}</SectionLabel>
          <div className="grid grid-cols-3 gap-2 mt-2 max-h-[320px] overflow-y-auto">
            {history.map(item => (
              <button key={item.id} onClick={() => { window.open(item.url, '_blank') }}
                className="group relative aspect-square rounded-lg overflow-hidden border border-white/[0.06] hover:border-violet-400/40 transition-all">
                <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-[10px] text-white/80 px-2 py-1 bg-black/60 rounded-md">{item.model}</span>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )

  return (
    <>
      <div className="lg:hidden space-y-5">
        <PrimaryBtn onClick={gen} disabled={generating || !prompt.trim()} loading={generating} icon={Icons.Sparkles}>{t('generate')}</PrimaryBtn>
        {left}{right}
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-10">
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </>
  )
}

// ─── Chat Tab ──────────────────────────────────────────────────
function ChatTab({ t }) {
  const lang = useContext(LangContext)
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('openai')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [maxTokens, setMaxTokens] = useState('2000')
  const [temperature, setTemperature] = useState('0.7')
  const chatRef = useRef(null)

  useEffect(() => { chatRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = useCallback(() => {
    if (!prompt.trim() || loading) return
    setMessages(p => [...p, { role: 'user', content: prompt.trim() }])
    setPrompt(''); setLoading(true)
    fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt.trim())}?model=${model}&max_tokens=${maxTokens}&temperature=${temperature}`, { signal: AbortSignal.timeout(120000) })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(t => { setMessages(p => [...p, { role: 'assistant', content: t }]); setLoading(false) })
      .catch(e => { setMessages(p => [...p, { role: 'assistant', content: e.name === 'AbortError' ? t('reqTimeout') : `${t('genFailed')}: ${e.message}` }]); setLoading(false) })
  }, [prompt, model, maxTokens, temperature, loading, t])

  // Left: model selector (narrow single column)
  const left = (
    <GlassCard className="p-3">
      <p className="text-xs text-white/30 mb-3 font-semibold uppercase tracking-wider">{t('model')}</p>
      <div className="flex flex-col gap-1.5">
        {TEXT_MODELS.map(m => (
          <button key={m.value} onClick={() => setModel(m.value)}
            className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${model === m.value ? 'bg-violet-500/20 border-violet-400/30' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'}`}>
            <div className="text-sm font-semibold text-white">{m.label}</div>
            <div className="text-xs text-white/30 mt-0.5">{lang === 'zh' ? m.descZh : m.descEn}</div>
          </button>
        ))}
      </div>
    </GlassCard>
  )

  // Right: fixed chat window with scrollbar
  const right = (
    <GlassCard className="overflow-hidden flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3 p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center"><Icons.Bot className="w-8 h-8" /></div>
            <p className="text-base font-medium">{t('chatStart')}</p>
            <p className="text-sm text-white/10">{t('chatStartDesc')}</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-violet-500/20' : 'bg-white/[0.06]'}`}>
                  {msg.role === 'user' ? <Icons.User className="w-4 h-4 text-violet-300" /> : <Icons.Bot className="w-4 h-4 text-white/40" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-base leading-relaxed ${msg.role === 'user' ? 'bg-violet-500/15 border border-violet-400/20 text-white/90 rounded-tr-md' : 'bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-tl-md'}`}>
                  <pre className="whitespace-pre-wrap font-sans text-base">{msg.content}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0"><Icons.Bot className="w-4 h-4 text-white/40" /></div>
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3"><div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" /><div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{animationDelay:'150ms'}} /><div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{animationDelay:'300ms'}} /></div></div>
              </div>
            )}
            <div ref={chatRef} />
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.06] p-3 sm:p-4 shrink-0">
        <div className="flex gap-2">
          <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }}} placeholder={t('chatPH')}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/90 placeholder-white/25 text-base focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 transition-all" />
          <button onClick={send} disabled={loading || !prompt.trim()}
            className="w-11 h-11 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:bg-white/[0.06] disabled:cursor-not-allowed flex items-center justify-center transition-all"><Icons.Send className="w-4 h-4 text-white" /></button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><label className="text-[10px] text-white/20">{t('tokens')}: {maxTokens}</label><input type="range" min="256" max="8192" step="256" value={maxTokens} onChange={e => setMaxTokens(e.target.value)} className="w-20 accent-violet-500" /></div>
            <div className="flex items-center gap-2"><label className="text-[10px] text-white/20">{t('temp')}: {temperature}</label><input type="range" min="0.1" max="2" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-20 accent-violet-500" /></div>
          </div>
          <p className="text-[10px] text-white/15">{t('enterSend')}</p>
        </div>
      </div>
    </GlassCard>
  )

  return (
    <>
      <div className="lg:hidden space-y-4">{left}{right}</div>
      <div className="hidden lg:grid lg:grid-cols-[180px_1fr] lg:gap-6">{left}{right}</div>
    </>
  )
}

// ─── Video Tab ─────────────────────────────────────────────────
function VideoTab({ t }) {
  const [videoMode, setVideoMode] = useState('img2video') // img2video | txt2video
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [model, setModel] = useState('ltxv')
  const [duration, setDuration] = useState('5s')
  const [width, setWidth] = useState('512')
  const [height, setHeight] = useState('512')
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const gen = useCallback(() => {
    if (!prompt.trim()) { setError(t('enterPrompt')); return }
    if (videoMode === 'img2video' && !imageUrl.trim()) { setError(t('enterRef')); return }
    setError(''); setLoading(true); setProgress(5); setVideoUrl('')
    const frames = duration === '2s' ? '49' : duration === '5s' ? '121' : '241'
    let url
    if (videoMode === 'img2video') {
      url = `https://video.pollinations.ai/${encodeURIComponent(prompt.trim())}?model=${model}&image_url=${encodeURIComponent(imageUrl)}&duration=${duration}&width=${width}&height=${height}&frames=${frames}`
    } else {
      url = `https://video.pollinations.ai/${encodeURIComponent(prompt.trim())}?model=${model}&duration=${duration}&width=${width}&height=${height}&frames=${frames}`
    }
    setProgress(20)
    fetch(url, { signal: AbortSignal.timeout(300000) })
      .then(r => { setProgress(60); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob() })
      .then(b => { setProgress(80); setVideoUrl(URL.createObjectURL(b)); setProgress(100); setLoading(false) })
      .catch(e => { setProgress(0); setLoading(false); setError(e.name === 'AbortError' ? t('videoFailed') : `${t('genFailed')}: ${e.message}`) })
  }, [prompt, imageUrl, model, duration, width, height, videoMode, t])

  const left = (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex gap-2 mb-2">
        <button onClick={() => setVideoMode('img2video')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${videoMode === 'img2video' ? 'bg-violet-500/20 border border-violet-400/30 text-violet-200' : 'bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/70'}`}>
          🖼️ {t('img2video')}
        </button>
        <button onClick={() => setVideoMode('txt2video')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${videoMode === 'txt2video' ? 'bg-violet-500/20 border border-violet-400/30 text-violet-200' : 'bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/70'}`}>
          ✍️ {t('txt2video')}
        </button>
      </div>

      {videoMode === 'img2video' && (
        <GlassCard className="p-4 sm:p-5">
          <SectionLabel icon={Icons.Image}>{t('refImage')}</SectionLabel>
          <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder={t('refPH')} />
          <p className="text-[10px] text-white/20 mt-2">{t('refImageHint')}</p>
        </GlassCard>
      )}

      <GlassCard className="p-4 sm:p-5">
        <SectionLabel icon={Icons.Video}>{t('motionDesc')}</SectionLabel>
        <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={videoMode === 'img2video' ? t('motionPH') : t('motionPHshort')} rows={3} />
      </GlassCard>

      <GlassCard className="p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {VIDEO_MODELS.map(m => <Chip key={m.value} label={m.label} active={model === m.value} free={m.free} onClick={() => setModel(m.value)} />)}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-[10px] text-white/30 mb-1 block">{t('duration')}</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40">
              <option value="2s">2s</option><option value="5s">5s</option><option value="10s">10s</option>
            </select></div>
          <div><label className="text-[10px] text-white/30 mb-1 block">{t('width')}</label><input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" /></div>
          <div><label className="text-[10px] text-white/30 mb-1 block">{t('height')}</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" /></div>
        </div>
      </GlassCard>
    </div>
  )

  const right = (
    <div className="space-y-4">
      <PrimaryBtn onClick={gen} disabled={loading || !prompt.trim()} loading={loading} icon={Icons.Video}>{t('genVideo')}</PrimaryBtn>

      {loading && (
        <GlassCard className="p-4">
          <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-out" style={{width:`${progress}%`}} />
          </div>
          <p className="text-center text-xs text-white/30">{progress}% — {t('genVideoHint')}</p>
        </GlassCard>
      )}

      {!loading && !videoUrl && !error && (
        <GlassCard className="p-4 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 text-white/20 gap-3">
            <Icons.Video className="w-14 h-14 opacity-30" />
            <p className="text-sm text-white/15">{t('genVideo')}</p>
          </div>
        </GlassCard>
      )}

      {videoUrl && (
        <>
          <GlassCard className="p-3 sm:p-4 overflow-hidden">
            <video src={videoUrl} controls className="w-full rounded-xl" />
          </GlassCard>
          <button onClick={() => { const a = document.createElement('a'); a.href = videoUrl; a.download = `pollinations-video-${Date.now()}.mp4`; a.click() }}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 transition-all">
            <Icons.Download className="w-4 h-4" />{t('downloadVideo')}
          </button>
        </>
      )}

      {error && (
        <GlassCard className="p-4 border-red-500/20 bg-red-500/[0.04]">
          <div className="flex items-start gap-3"><Icons.AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /><p className="text-sm text-red-400/80">{error}</p></div>
        </GlassCard>
      )}
    </div>
  )

  return (
    <>
      <div className="lg:hidden space-y-5">{left}{right}</div>
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-10"><div>{left}</div><div>{right}</div></div>
    </>
  )
}

// ─── Main App ──────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(() => navigator.language?.startsWith('zh') ? 'zh' : 'zh')
  const [activeTab, setActiveTab] = useState('image')
  const [imageHistory, setImageHistory] = useState([])

  const addToHistory = useCallback((record) => {
    setImageHistory(prev => [{ id: Date.now(), ...record }, ...prev].slice(0, 20))
  }, [])

  const tabs = [
    { key: 'image', label: I18N[lang].tabImage, icon: Icons.Image },
    { key: 'text', label: I18N[lang].tabChat, icon: Icons.MessageCircle },
    { key: 'video', label: I18N[lang].tabVideo, icon: Icons.Video },
  ]

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[900px] h-[900px] bg-violet-500/[0.05] rounded-full blur-[160px]" />
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-fuchsia-500/[0.05] rounded-full blur-[160px]" />
          <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
        </div>
        <Header lang={lang} setLang={setLang} />
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">Pollinations Studio</h2>
            <p className="text-sm sm:text-base text-white/30 mt-1 max-w-2xl mx-auto">{I18N[lang].heroDesc}</p>
            <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer"
               className="inline-block mt-2 text-xs sm:text-sm text-violet-400/60 hover:text-violet-300 transition-colors">
              {lang === 'zh' ? '前往 Pollinations 官方网站 →' : 'Visit Pollinations Official Site →'}
            </a>
          </div>
          <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="max-w-5xl mx-auto">
            {activeTab === 'image' && <ImageTab t={k => I18N[lang][k]} history={imageHistory} addToHistory={addToHistory} />}
            {activeTab === 'text' && <ChatTab t={k => I18N[lang][k]} />}
            {activeTab === 'video' && <VideoTab t={k => I18N[lang][k]} />}
          </div>
          <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/[0.04] text-center">
            <p className="text-xs text-white/20">{I18N[lang].footer}</p>
          </footer>
        </main>
      </div>
    </LangContext.Provider>
  )
}
