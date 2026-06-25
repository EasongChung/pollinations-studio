import React, { useState, useCallback, useRef, useEffect } from 'react'

// ================================================================
//  Pollinations Studio — AI Creative Studio
//  Design: Dark Glassmorphism · Premium · Professional
//  Stack: React 19 + Tailwind CSS 4 + Vite
// ================================================================

// ─── Utilities ─────────────────────────────────────────────────

function encodePrompt(text) {
  return encodeURIComponent(text.trim())
}

// ─── SVG Icons (no emoji) ──────────────────────────────────────

const Icons = {
  Sparkles: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
      <path d="M5 3l.5 2L7 5.5 5 6l-.5 2L4 6l-2-.5L4 5l.5-2L5 3z"/>
      <path d="M19 15l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2z"/>
    </svg>
  ),
  Image: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  MessageCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Video: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  Download: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Copy: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  ExternalLink: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Settings: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Check: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  AlertCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  ChevronRight: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Send: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  User: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Bot: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  Loader: ({ className }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  ),
}

// ─── Data ──────────────────────────────────────────────────────

const IMAGE_MODELS = [
  { value: 'flux', label: 'Flux', desc: 'Default · Fast & free', free: true },
  { value: 'flux-realism', label: 'Realism', desc: 'Photorealistic', free: true },
  { value: 'flux-3d', label: '3D Render', desc: '3D style', free: true },
  { value: 'flux-anime', label: 'Anime', desc: 'Anime style', free: true },
  { value: 'flux-pixel', label: 'Pixel Art', desc: 'Retro pixel', free: true },
  { value: 'flux-cablyai', label: 'CablyAI', desc: 'Balanced quality', free: true },
  { value: 'turbo', label: 'Turbo', desc: 'Ultra fast', free: false },
  { value: 'flux-caricature', label: 'Caricature', desc: 'Cartoon style', free: true },
]

const ASPECT_RATIOS = [
  { label: '1:1', w: 1024, h: 1024 },
  { label: '16:9', w: 1344, h: 768 },
  { label: '9:16', w: 768, h: 1344 },
  { label: '4:3', w: 1152, h: 896 },
  { label: '3:4', w: 896, h: 1152 },
  { label: '3:2', w: 1216, h: 832 },
  { label: '2:3', w: 832, h: 1216 },
]

const TEXT_MODELS = [
  { value: 'openai', label: 'GPT-4o', desc: 'OpenAI · Versatile' },
  { value: 'anthropic', label: 'Claude', desc: 'Anthropic · Reasoning' },
  { value: 'google', label: 'Gemini', desc: 'Google · Multimodal' },
  { value: 'meta', label: 'Llama', desc: 'Meta · Open source' },
]

const VIDEO_MODELS = [
  { value: 'ltxv', label: 'LTX-Video', desc: '5s · 24fps', free: true },
  { value: 'flux', label: 'Flux Video', desc: 'Fast gen', free: false },
  { value: 'wan', label: 'Wan 2.1', desc: 'High quality', free: false },
]

const VIDEO_DURATIONS = [
  { label: '2s', frames: 49 },
  { label: '5s', frames: 121 },
  { label: '10s', frames: 241 },
]

// ─── Shared Components ─────────────────────────────────────────

function GlassCard({ children, className = '', hover = false }) {
  return (
    <div className={`backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl ${hover ? 'hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  )
}

function GlassInput({ value, onChange, placeholder, rows = 1, className = '', onKeyDown }) {
  const Tag = rows > 1 ? 'textarea' : 'input'
  return (
    <Tag
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={rows > 1 ? rows : undefined}
      className={`w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white/90 placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 transition-all duration-200 text-sm ${rows > 1 ? 'resize-none' : ''} ${className}`}
    />
  )
}

function ModelChip({ label, desc, active, onClick, free }) {
  return (
    <button
      onClick={onClick}
      title={desc}
      className={`relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-violet-500/20 border border-violet-400/30 text-violet-200 shadow-lg shadow-violet-500/10'
          : 'bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.06]'
      }`}
    >
      <span className="relative z-10">{label}</span>
      {free && (
        <span className="ml-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">FREE</span>
      )}
    </button>
  )
}

function PrimaryButton({ children, onClick, disabled, loading, icon: Icon, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
        disabled
          ? 'bg-white/[0.05] text-white/20 cursor-not-allowed'
          : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] hover:bg-right text-white shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 active:scale-[0.98]'
      } ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? <Icons.Loader className="w-4 h-4" /> : Icon && <Icon className="w-4 h-4" />}
        {loading ? 'Generating...' : children}
      </span>
    </button>
  )
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl backdrop-blur-xl border text-sm font-medium animate-[slideUp_0.3s_ease-out] ${
      type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
      type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
      'bg-white/10 border-white/10 text-white'
    }`}>
      {message}
    </div>
  )
}

// ─── Header ────────────────────────────────────────────────────

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Pollinations Studio</h1>
            <p className="text-[11px] text-white/30 -mt-0.5">AI Creative Workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/EasongChung/pollinations-studio" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer" className="text-[11px] text-white/25 hover:text-white/50 transition-colors font-mono">pollinations.ai</a>
        </div>
      </div>
    </header>
  )
}

// ─── Image Tab ─────────────────────────────────────────────────

function ImageTab() {
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

  const currentRatio = ASPECT_RATIOS.find(r => r.label === aspectRatio) || ASPECT_RATIOS[0]

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      setImageError('Please enter an image description')
      return
    }
    setImageError('')
    setGenerating(true)
    setImageUrl('')

    const params = new URLSearchParams()
    params.set('model', model)
    params.set('width', currentRatio.w)
    params.set('height', currentRatio.h)
    if (seed) params.set('seed', seed)
    if (negativePrompt) params.set('negative_prompt', negativePrompt)
    if (enhance) params.set('enhance', 'true')
    if (nologo) params.set('nologo', 'true')
    params.set('safe', 'true')
    if (guidanceScale) params.set('guidance_scale', String(guidanceScale))

    const url = `https://image.pollinations.ai/p/${encodePrompt(prompt)}?${params.toString()}`
    setGeneratedUrl(url)

    const img = new Image()
    img.onload = () => {
      setImageUrl(url)
      setGenerating(false)
    }
    img.onerror = () => {
      setImageError('Image failed to load. Try a different prompt or model.')
      setGenerating(false)
    }
    img.src = url
  }, [prompt, model, currentRatio, seed, negativePrompt, enhance, nologo, guidanceScale])

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => setToast({ message: 'URL copied to clipboard', type: 'success' })).catch(() => {})
  }

  const handleDownload = () => {
    if (imageUrl) {
      const a = document.createElement('a')
      a.href = imageUrl
      a.download = `pollinations-${Date.now()}.jpg`
      a.click()
    }
  }

  return (
    <div className="space-y-5">
      {/* Prompt Card */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Prompt</span>
        </div>
        <GlassInput
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="A cinematic wide shot of a futuristic city at sunset, golden hour lighting, volumetric fog, 8K..."
          rows={3}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleGenerate() } }}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-white/20">Ctrl + Enter to generate</p>
          <p className="text-[11px] text-white/20">{prompt.length} chars</p>
        </div>
      </GlassCard>

      {/* Negative Prompt */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icons.AlertCircle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Negative Prompt</span>
        </div>
        <GlassInput
          value={negativePrompt}
          onChange={e => setNegativePrompt(e.target.value)}
          placeholder="blurry, low quality, watermark, text, distorted..."
          rows={2}
        />
      </GlassCard>

      {/* Model Picker */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Image className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Model</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2">
          {IMAGE_MODELS.map(m => (
            <ModelChip key={m.value} label={m.label} desc={m.desc} active={model === m.value} free={m.free} onClick={() => setModel(m.value)} />
          ))}
        </div>
      </GlassCard>

      {/* Aspect Ratio */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Aspect Ratio</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ASPECT_RATIOS.map(r => (
            <button
              key={r.label}
              onClick={() => setAspectRatio(r.label)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                aspectRatio === r.label
                  ? 'bg-violet-500/20 border-violet-400/30 text-violet-200'
                  : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
              }`}
            >
              {r.label}
              <span className="ml-1.5 text-[10px] text-white/30">{r.w}×{r.h}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
      >
        <Icons.Settings className="w-3.5 h-3.5" />
        Advanced Options
        <svg className={`w-3 h-3 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <GlassCard className="p-5 space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Seed</label>
              <input
                type="text"
                value={seed}
                onChange={e => setSeed(e.target.value)}
                placeholder="Random"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Guidance Scale · {guidanceScale}</label>
              <input
                type="range" min="1" max="20" step="0.5"
                value={guidanceScale}
                onChange={e => setGuidanceScale(parseFloat(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={enhance} onChange={e => setEnhance(e.target.checked)} className="w-4 h-4 accent-violet-500 rounded" />
              <span className="text-xs text-white/60">Enhance prompt</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={nologo} onChange={e => setNologo(e.target.checked)} className="w-4 h-4 accent-violet-500 rounded" />
              <span className="text-xs text-white/60">Remove watermark</span>
            </label>
          </div>
        </GlassCard>
      )}

      {/* Generate Button */}
      <PrimaryButton onClick={handleGenerate} disabled={generating || !prompt.trim()} loading={generating} icon={Icons.Sparkles}>
        Generate Image
      </PrimaryButton>

      {/* Loading State */}
      {generating && (
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 animate-pulse flex items-center justify-center">
              <Icons.Loader className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <p className="text-sm text-white/40">Creating your image...</p>
          <div className="w-48 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-[shimmer_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {/* Result */}
      {imageUrl && !generating && (
        <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
          <GlassCard className="p-3 overflow-hidden">
            <div className="relative group rounded-xl overflow-hidden">
              <img src={imageUrl} alt={prompt} className="w-full rounded-xl" onError={() => setImageError('Image failed to load')} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-xl flex items-center justify-center">
                <a
                  href={imageUrl} target="_blank" rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2.5 rounded-xl font-medium text-sm"
                >
                  <Icons.ExternalLink className="w-4 h-4" />
                  View Full Size
                </a>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleDownload} className="flex items-center justify-center gap-2 py-3 bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 transition-all duration-200">
              <Icons.Download className="w-4 h-4" />
              Download
            </button>
            <button onClick={handleCopyUrl} className="flex items-center justify-center gap-2 py-3 bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 transition-all duration-200">
              <Icons.Copy className="w-4 h-4" />
              Copy URL
            </button>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/[0.04]">
            <p className="text-[10px] text-white/20 mb-1.5 font-mono uppercase tracking-wider">Direct URL</p>
            <code className="text-[11px] text-violet-400/80 break-all font-mono leading-relaxed">{generatedUrl}</code>
          </div>
        </div>
      )}

      {imageError && (
        <GlassCard className="p-4 border-red-500/20 bg-red-500/[0.04]">
          <div className="flex items-start gap-3">
            <Icons.AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-400/80">{imageError}</p>
          </div>
        </GlassCard>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// ─── Text Tab ──────────────────────────────────────────────────

function TextTab() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('openai')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [maxTokens, setMaxTokens] = useState('2000')
  const [temperature, setTemperature] = useState('0.7')
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(() => {
    if (!prompt.trim() || loading) return

    const userMsg = { role: 'user', content: prompt.trim() }
    setMessages(prev => [...prev, userMsg])
    setPrompt('')
    setLoading(true)

    const url = `https://text.pollinations.ai/${encodePrompt(prompt)}?model=${model}&max_tokens=${maxTokens}&temperature=${temperature}`

    fetch(url, { signal: AbortSignal.timeout(120000) })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.text() })
      .then(text => { setMessages(prev => [...prev, { role: 'assistant', content: text }]); setLoading(false) })
      .catch(err => {
        setMessages(prev => [...prev, { role: 'assistant', content: err.name === 'AbortError' ? 'Request timed out. Please try again.' : `Error: ${err.message}` }])
        setLoading(false)
      })
  }, [prompt, model, maxTokens, temperature, loading])

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }, [handleSend])

  return (
    <div className="space-y-4">
      {/* Model Selector */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {TEXT_MODELS.map(m => (
            <button
              key={m.value}
              onClick={() => setModel(m.value)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                model === m.value
                  ? 'bg-violet-500/20 border-violet-400/30'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
              }`}
            >
              <div className="text-sm font-semibold text-white">{m.label}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Chat Area */}
      <GlassCard className="overflow-hidden">
        <div className="h-[480px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <Icons.Bot className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium">Start a conversation</p>
              <p className="text-xs text-white/10">Choose a model and send a message</p>
            </div>
          ) : (
            <div className="p-4 space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-violet-500/20' : 'bg-white/[0.06]'
                  }`}>
                    {msg.role === 'user'
                      ? <Icons.User className="w-4 h-4 text-violet-300" />
                      : <Icons.Bot className="w-4 h-4 text-white/40" />
                    }
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-violet-500/15 border border-violet-400/20 text-white/90 rounded-tr-md'
                      : 'bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-tl-md'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                    <Icons.Bot className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/90 placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 transition-all duration-200"
            />
            <button
              onClick={handleSend}
              disabled={loading || !prompt.trim()}
              className="w-11 h-11 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:bg-white/[0.06] disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
            >
              <Icons.Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-white/20">Tokens: {maxTokens}</label>
                <input type="range" min="256" max="8192" step="256" value={maxTokens} onChange={e => setMaxTokens(e.target.value)} className="w-20 accent-violet-500" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-white/20">Temp: {temperature}</label>
                <input type="range" min="0.1" max="2" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-20 accent-violet-500" />
              </div>
            </div>
            <p className="text-[10px] text-white/15">Press Enter to send</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

// ─── Video Tab ─────────────────────────────────────────────────

function VideoTab() {
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

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) { setError('Please enter a motion description'); return }
    if (!imageUrl.trim()) { setError('Please provide a reference image URL'); return }
    setError('')
    setLoading(true)
    setProgress(5)
    setVideoUrl('')

    const frames = duration === '2s' ? '49' : duration === '5s' ? '121' : '241'
    const url = `https://video.pollinations.ai/${encodePrompt(prompt)}?model=${model}&image_url=${encodeURIComponent(imageUrl)}&duration=${duration}&width=${width}&height=${height}&frames=${frames}`

    setProgress(20)

    fetch(url, { signal: AbortSignal.timeout(300000) })
      .then(res => { setProgress(60); if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.blob() })
      .then(blob => { setProgress(80); setVideoUrl(URL.createObjectURL(blob)); setProgress(100); setLoading(false) })
      .catch(err => {
        setProgress(0); setLoading(false)
        setError(err.name === 'AbortError' ? 'Video generation timed out' : `Generation failed: ${err.message}`)
      })
  }, [prompt, imageUrl, model, duration, width, height])

  return (
    <div className="space-y-5">
      {/* Reference Image */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Image className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Reference Image URL</span>
        </div>
        <GlassInput
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="https://example.com/your-reference-image.jpg"
        />
        <p className="text-[11px] text-white/20 mt-2">Supports PNG, JPG, WebP — provide a publicly accessible URL</p>
      </GlassCard>

      {/* Motion Prompt */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Video className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Motion Description</span>
        </div>
        <GlassInput
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="The camera slowly pans right as gentle waves ripple across the water surface..."
          rows={3}
        />
      </GlassCard>

      {/* Model & Settings */}
      <GlassCard className="p-5">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {VIDEO_MODELS.map(m => (
            <ModelChip key={m.value} label={m.label} desc={m.desc} active={model === m.value} free={m.free} onClick={() => setModel(m.value)} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-white/30 mb-1 block">Duration</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40">
              {VIDEO_DURATIONS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-white/30 mb-1 block">Width</label>
            <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
          </div>
          <div>
            <label className="text-[10px] text-white/30 mb-1 block">Height</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
          </div>
        </div>
      </GlassCard>

      <PrimaryButton onClick={handleGenerate} disabled={loading || !prompt.trim() || !imageUrl.trim()} loading={loading} icon={Icons.Video}>
        Generate Video
      </PrimaryButton>

      {loading && (
        <div className="space-y-4">
          <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-center text-xs text-white/30">{progress}% — this may take a few minutes</p>
        </div>
      )}

      {videoUrl && (
        <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
          <GlassCard className="p-3 overflow-hidden">
            <video src={videoUrl} controls className="w-full rounded-xl" />
          </GlassCard>
          <button
            onClick={() => { const a = document.createElement('a'); a.href = videoUrl; a.download = `pollinations-video-${Date.now()}.mp4`; a.click() }}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 transition-all duration-200"
          >
            <Icons.Download className="w-4 h-4" />
            Download Video
          </button>
        </div>
      )}

      {error && (
        <GlassCard className="p-4 border-red-500/20 bg-red-500/[0.04]">
          <div className="flex items-start gap-3">
            <Icons.AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}

// ─── Main App ──────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState('image')

  const tabs = [
    { key: 'image', label: 'Image Generation', icon: Icons.Image },
    { key: 'text', label: 'AI Chat', icon: Icons.MessageCircle },
    { key: 'video', label: 'Video Generation', icon: Icons.Video },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-500/[0.02] to-transparent rounded-full blur-[100px]" />
      </div>

      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Create with <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
          </h2>
          <p className="text-sm text-white/30 mt-2 max-w-md mx-auto">
            Generate images, chat with AI, and create videos — all powered by Pollinations, completely free.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-violet-500/20 text-white shadow-lg shadow-violet-500/10'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {activeTab === 'image' && <ImageTab />}
          {activeTab === 'text' && <TextTab />}
          {activeTab === 'video' && <VideoTab />}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/[0.04] text-center">
          <p className="text-xs text-white/20">
            Built with Pollinations AI · Open source on GitHub · Free to use
          </p>
        </footer>
      </main>
    </div>
  )
}