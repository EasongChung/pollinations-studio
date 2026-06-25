import React, { useState, useCallback, useRef, useEffect } from 'react'

// ============================================================
// Pollinations Studio — AI Creative Studio
// Free AI Image, Text & Video Generation Powered by Pollinations
// ============================================================

// ─── Utilities ────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function encodePrompt(text) {
  return encodeURIComponent(text.trim())
}

// ─── Image Models ─────────────────────────────────────────────

const IMAGE_MODELS = [
  { value: 'flux', label: 'Flux (Default)', desc: 'Fast & free', free: true },
  { value: 'flux-realism', label: 'Flux Realism', desc: 'Photorealistic', free: true },
  { value: 'flux-3d', label: 'Flux 3D', desc: '3D style', free: true },
  { value: 'flux-caricature', label: 'Flux Caricature', desc: 'Cartoon style', free: true },
  { value: 'flux-anime', label: 'Flux Anime', desc: 'Anime style', free: true },
  { value: 'flux-pixel', label: 'Flux Pixel', desc: 'Pixel art', free: true },
  { value: 'flux-cablyai', label: 'CablyAI', desc: 'Balanced quality', free: true },
  { value: 'turbo', label: 'Turbo', desc: 'Ultra fast', free: false },
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

// ─── Text Models ──────────────────────────────────────────────

const TEXT_MODELS = [
  { value: 'openai', label: 'OpenAI (GPT)', desc: 'GPT-4o', models: ['gpt-4o', 'gpt-4o-mini'] },
  { value: 'anthropic', label: 'Anthropic (Claude)', desc: 'Claude', models: ['claude-sonnet-4-20250514'] },
  { value: 'google', label: 'Google (Gemini)', desc: 'Gemini', models: ['gemini-2.5-pro'] },
  { value: 'meta', label: 'Meta (Llama)', desc: 'Llama', models: ['llama-3.3-70b'] },
]

const TEXT_SERVICES = [
  { value: 'pollinations', label: 'Pollinations Text', desc: 'Free text generation' },
  { value: 'openai', label: 'OpenAI Compatible', desc: 'Via gen.pollinations.ai' },
]

// ─── Video Models ─────────────────────────────────────────────

const VIDEO_MODELS = [
  { value: 'ltxv', label: 'LTX-Video', desc: '121 frames (~5s)', free: true },
  { value: 'flux', label: 'Flux Video', desc: 'Fast video gen', free: false },
  { value: 'wan', label: 'Wan 2.1', desc: 'High quality', free: false },
]

const VIDEO_DURATIONS = [
  { label: '2s', frames: 49 },
  { label: '5s', frames: 121 },
  { label: '10s', frames: 241 },
]

// ─── Components ───────────────────────────────────────────────

function Header() {
  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌱</span>
          <div>
            <h1 className="text-xl font-bold text-white">Pollinations Studio</h1>
            <p className="text-xs text-white/50">AI 创意工作室 · Powered by Free APIs</p>
          </div>
        </div>
        <a
          href="https://pollinations.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          pollinations.ai
        </a>
      </div>
    </header>
  )
}

function ImageTab() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('flux')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [seed, setSeed] = useState('')
  const [enhance, setEnhance] = useState(false)
  const [nologo, setNologo] = useState(false)
  const [safe, setSafe] = useState(true)
  const [privateGen, setPrivateGen] = useState(false)
  const [guidanceScale, setGuidanceScale] = useState(3.5)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageError, setImageError] = useState('')
  const imgRef = useRef(null)

  const currentRatio = ASPECT_RATIOS.find(r => r.label === aspectRatio) || ASPECT_RATIOS[0]

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      setImageError('请输入图像描述')
      return
    }
    setImageError('')
    setLoading(true)
    setImageUrl('')

    const params = new URLSearchParams()
    params.set('model', model)
    params.set('width', currentRatio.w)
    params.set('height', currentRatio.h)
    if (seed) params.set('seed', seed)
    if (negativePrompt) params.set('negative_prompt', negativePrompt)
    if (enhance) params.set('enhance', 'true')
    if (nologo) params.set('nologo', 'true')
    if (safe) params.set('safe', 'true')
    if (privateGen) params.set('private', 'true')
    if (guidanceScale) params.set('guidance_scale', String(guidanceScale))

    const url = `https://image.pollinations.ai/p/${encodePrompt(prompt)}?${params.toString()}`
    setGeneratedUrl(url)
    setImageUrl(url)
    setLoading(false)
  }, [prompt, model, currentRatio, seed, negativePrompt, enhance, nologo, safe, privateGen, guidanceScale])

  const handleCopyUrl = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl).then(() => {
        alert('URL 已复制到剪贴板！')
      })
    }
  }

  const handleSave = () => {
    if (imageUrl) {
      const a = document.createElement('a')
      a.href = imageUrl
      a.download = `pollinations-${Date.now()}.jpg`
      a.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div className="bg-white/5 rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          ✨ 图像描述
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              handleGenerate()
            }
          }}
        />
        <p className="text-xs text-white/30 mt-1">Ctrl + Enter 快速生成</p>
      </div>

      {/* Negative Prompt */}
      <div className="bg-white/5 rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          🚫 反向提示（不包含的元素）
        </label>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="What to avoid in the image..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          rows={2}
        />
      </div>

      {/* Model */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {IMAGE_MODELS.map((m) => (
          <button
            key={m.value}
            onClick={() => setModel(m.value)}
            className={`p-3 rounded-lg border text-left transition-all ${
              model === m.value
                ? 'bg-emerald-500/20 border-emerald-500 text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <div className="text-sm font-medium">{m.label}</div>
            <div className="text-xs text-white/40 mt-1">{m.desc} {m.free && '🆓'}</div>
          </button>
        ))}
      </div>

      {/* Aspect Ratio */}
      <div className="bg-white/5 rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-3">
          📐 画面比例
        </label>
        <div className="flex gap-2 flex-wrap">
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r.label}
              onClick={() => setAspectRatio(r.label)}
              className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                aspectRatio === r.label
                  ? 'bg-emerald-500/20 border-emerald-500 text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <details className="bg-white/5 rounded-xl border border-white/10">
        <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-white/80 select-none">
          ⚙️ 高级选项
        </summary>
        <div className="px-5 pb-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Seed (随机种子)</label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="留空则随机"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Guidance Scale: {guidanceScale}</label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { checked: enhance, set: setEnhance, label: 'Enhance (提示词增强)' },
              { checked: nologo, set: setNologo, label: 'No Logo (去除水印)' },
              { checked: safe, set: setSafe, label: 'Safe Filter (安全过滤)' },
              { checked: privateGen, set: setPrivateGen, label: 'Private (仅自己可见)' },
            ].map(({ checked, set, label }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => set(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span className="text-sm text-white/70">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </details>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            生成中...
          </>
        ) : (
          <>🎨 生成图像</>
        )}
      </button>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-white/60">正在生成图像，请稍候...</p>
          <p className="text-xs text-white/30 mt-2">通常 5-30 秒完成</p>
        </div>
      )}

      {/* Result */}
      {imageUrl && !loading && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="relative group">
              <img
                ref={imgRef}
                src={imageUrl}
                alt={prompt}
                className="w-full rounded-lg"
                onError={() => setImageError('图像加载失败，请重试')}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center">
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden group-hover:flex items-center gap-2 bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-medium"
                >
                  🔗 在新窗口查看原图
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSave}
              className="py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
            >
              💾 下载图片
            </button>
            <button
              onClick={handleCopyUrl}
              className="py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
            >
              📋 复制 URL
            </button>
          </div>

          {/* Generated URL */}
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <div className="text-xs text-white/40 mb-2">直接链接</div>
            <code className="text-xs text-emerald-400 break-all">{generatedUrl}</code>
          </div>
        </div>
      )}

      {imageError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
          {imageError}
        </div>
      )}
    </div>
  )
}

function TextTab() {
  const [service, setService] = useState('pollinations')
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('flux')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [maxTokens, setMaxTokens] = useState('2000')
  const [temperature, setTemperature] = useState('0.7')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return

    const userMsg = { role: 'user', content: prompt.trim() }
    setMessages(prev => [...prev, userMsg])
    setPrompt('')
    setLoading(true)

    const url = `https://text.pollinations.ai/${encodePrompt(prompt)}?model=${model}&max_tokens=${maxTokens}&temperature=${temperature}`

    fetch(url, { signal: AbortSignal.timeout(120000) })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then(text => {
        setMessages(prev => [...prev, { role: 'assistant', content: text }])
        setLoading(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '⚠️ 请求超时，请重试。如果持续失败，可能是模型响应较慢。'
          }])
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `❌ 错误: ${err.message}`
          }])
        }
        setLoading(false)
      })
  }, [prompt, model, maxTokens, temperature])

  return (
    <div className="space-y-4">
      {/* Model Selector */}
      <div className="grid grid-cols-2 gap-3">
        {TEXT_MODELS.map((m) => (
          <button
            key={m.value}
            onClick={() => setModel(m.value)}
            className={`p-3 rounded-lg border text-left transition-all ${
              model === m.value
                ? 'bg-emerald-500/20 border-emerald-500 text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <div className="text-sm font-medium">{m.label}</div>
            <div className="text-xs text-white/40 mt-1">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Prompt Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="输入你的问题或指令..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleGenerate()
            }
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          {loading ? '⏳' : '💬'}
        </button>
      </div>

      {/* Chat Messages */}
      <div className="bg-white/5 rounded-xl border border-white/10 min-h-[300px] max-h-[500px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-white/30">
            <div className="text-center">
              <p className="text-lg">💬</p>
              <p className="text-sm mt-2">开始一段对话</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500/20 text-white'
                      : 'bg-white/10 text-white/90'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {msg.content}
                  </pre>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Max Tokens: {maxTokens}</label>
          <input
            type="range"
            min="256"
            max="8192"
            step="256"
            value={maxTokens}
            onChange={(e) => setMaxTokens(e.target.value)}
            className="w-full accent-emerald-500"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Temperature: {temperature}</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>
    </div>
  )
}

function VideoTab() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [model, setModel] = useState('ltxv')
  const [duration, setDuration] = useState('5s')
  const [width, setWidth] = useState('512')
  const [height, setHeight] = useState('512')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoBlob, setVideoBlob] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [progress, setProgress] = useState(0)

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return
    if (!imageUrl.trim()) {
      alert('图生视频需要提供参考图片 URL')
      return
    }

    setLoading(true)
    setProgress(5)
    setVideoBlob(null)
    setVideoUrl('')

    const params = new URLSearchParams({
      model: model,
      prompt: encodePrompt(prompt),
      image_url: imageUrl,
      duration: duration,
      width: width,
      height: height,
      frames: duration === '2s' ? '49' : duration === '5s' ? '121' : '241',
    })

    const url = `https://video.pollinations.ai/${params.toString()}`
    setGeneratedUrl(url)
    setProgress(20)

    // Fetch the video
    fetch(url, { signal: AbortSignal.timeout(300000) })
      .then(res => {
        setProgress(60)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.blob()
      })
      .then(blob => {
        setProgress(80)
        setVideoBlob(blob)
        setVideoUrl(URL.createObjectURL(blob))
        setProgress(100)
        setLoading(false)
      })
      .catch(err => {
        setProgress(0)
        setLoading(false)
        alert(`生成失败: ${err.message}`)
      })
  }, [prompt, imageUrl, model, duration, width, height])

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `pollinations-video-${Date.now()}.mp4`
      a.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Reference Image URL */}
      <div className="bg-white/5 rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          🖼️ 参考图片 URL（必填）
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/reference-image.jpg"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <p className="text-xs text-white/30 mt-1">输入图片的网络地址，支持 PNG/JPG/WebP</p>
      </div>

      {/* Motion Description */}
      <div className="bg-white/5 rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          🎬 运动描述
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述图片中应该发生的运动或变化..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          rows={3}
        />
      </div>

      {/* Model & Duration */}
      <div className="grid grid-cols-3 gap-3">
        {VIDEO_MODELS.map((m) => (
          <button
            key={m.value}
            onClick={() => setModel(m.value)}
            className={`p-3 rounded-lg border text-left transition-all ${
              model === m.value
                ? 'bg-emerald-500/20 border-emerald-500 text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <div className="text-sm font-medium">{m.label}</div>
            <div className="text-xs text-white/40 mt-1">{m.desc} {m.free && '🆓'}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">时长</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {VIDEO_DURATIONS.map(d => (
              <option key={d.label} value={d.label}>{d.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">宽度</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">高度</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || !imageUrl.trim()}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            生成视频中... ({progress}%)
          </>
        ) : (
          <>🎬 生成视频</>
        )}
      </button>

      {/* Progress Bar */}
      {loading && (
        <div className="bg-white/5 rounded-lg overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Video Result */}
      {videoUrl && (
        <div className="space-y-4">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-xl border border-white/10 bg-black"
          />
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
          >
            💾 下载视频
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState('image')

  const tabs = [
    { key: 'image', label: '文生图', icon: '🎨' },
    { key: 'text', label: 'AI 对话', icon: '💬' },
    { key: 'video', label: '图生视频', icon: '🎬' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-gray-950 to-gray-950">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-emerald-500/20 text-white shadow-lg'
                    : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="md:grid md:grid-cols-5 md:gap-6">
            <div className="md:col-span-3">
              {activeTab === 'image' && <ImageTab />}
              {activeTab === 'text' && <TextTab />}
              {activeTab === 'video' && <VideoTab />}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-2 mt-6 md:mt-0">
              <div className="space-y-4">
                {/* Stats Card */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-emerald-400 mb-3">💡 使用提示</h3>
                  <ul className="space-y-2 text-xs text-white/60">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>所有生成都免费，无需注册或 API Key</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>图像生成通常 5-30 秒完成</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>详细描述画面可获得更好的效果</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>生成的图片可直接下载或复制链接分享</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>图生视频需要先提供参考图片 URL</span>
                    </li>
                  </ul>
                </div>

                {/* API Info Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-white/80 mb-3">🔗 直接链接</h3>
                  <div className="space-y-2 text-xs">
                    <a
                      href="https://image.pollinations.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-white/50 hover:text-emerald-400 transition-colors"
                    >
                      图像 API →
                    </a>
                    <a
                      href="https://text.pollinations.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-white/50 hover:text-emerald-400 transition-colors"
                    >
                      文本 API →
                    </a>
                    <a
                      href="https://gen.pollinations.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-white/50 hover:text-emerald-400 transition-colors"
                    >
                      统一 API 网关 →
                    </a>
                  </div>
                </div>

                {/* License Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-white/80 mb-2">📜 开源协议</h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    本应用基于 Pollinations.ai 构建。
                    Pollinations 采用 MIT 许可证开源。
                    所有生成的内容版权归用户所有。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
