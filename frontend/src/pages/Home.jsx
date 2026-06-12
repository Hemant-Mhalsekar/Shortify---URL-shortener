import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Link2, Zap, Copy, Check, ArrowRight, Clock, Tag, SlidersHorizontal, BarChart2 } from 'lucide-react'

export default function Home() {
  const { dark } = useTheme()
  const navigate = useNavigate()

  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiryDays, setExpiryDays] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [displayedUrl, setDisplayedUrl] = useState('')

  const typeUrl = (fullUrl) => {
    let i = 0
    setDisplayedUrl('')
    const interval = setInterval(() => {
      setDisplayedUrl(fullUrl.slice(0, i + 1))
      i++
      if (i >= fullUrl.length) clearInterval(interval)
    }, 30)
  }

  const handleSubmit = async () => {
    if (!url) return setError('Please enter a URL.')

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return setError('URL must start with http:// or https://')
    }

    if (expiryDays && (parseInt(expiryDays) < 1 || parseInt(expiryDays) > 365)) {
      return setError('Expiry must be between 1 and 365 days.')
    }

    setError('')
    setLoading(true)
    setResult(null)

    try {
      const response = await axios.post('http://localhost:8080/api/shorten', {
        url,
        customAlias: customAlias || null,
        expiryDays: expiryDays ? parseInt(expiryDays) : null,
      })
      setResult(response.data)
      typeUrl(response.data.shortUrl)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = `w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 border
    ${dark
      ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-accent focus:bg-white/8'
      : 'bg-black/5 border-black/10 text-black placeholder-black/30 focus:border-accent focus:bg-white'
    }`

  return (
    <div className={`min-h-screen pt-20 ${dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-[#0a0a0a]'}`}>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6 fade-up"
          style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
          <Zap size={12} fill="#00d4ff" />
          Fast. Simple. Free.
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-4 fade-up fade-up-delay-1">
          Long URLs.{' '}
          <span style={{
            background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Instantly Short.
          </span>
        </h1>

        <p className={`text-lg mb-12 fade-up fade-up-delay-2 ${dark ? 'text-white/50' : 'text-black/50'}`}>
          Paste. Shorten. Share. Make life simple by keeping your links shorter.
        </p>

        {/* Input Card */}
        <div className={`rounded-2xl p-6 fade-up fade-up-delay-3 ${dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/10 shadow-sm'}`}>

          {/* Main URL input */}
          <div className="flex items-center gap-3 mb-4">
            <Link2 size={18} className={dark ? 'text-white/30' : 'text-black/30'} />
            <input
              type="text"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className={inputClass}
            />
          </div>

          {/* Optional fields row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Tag size={15} className={dark ? 'text-white/30' : 'text-black/30'} />
              <input
                type="text"
                placeholder="Custom alias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className={dark ? 'text-white/30' : 'text-black/30'} />
              <input
                type="number"
                placeholder="Expiry in days"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-left font-mono">{error}</p>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg font-display font-semibold text-white text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
            style={loading
              ? { background: 'linear-gradient(90deg, #7c3aed, #00d4ff, #7c3aed)', backgroundSize: '200% auto', animation: 'charge 1.5s linear infinite' }
              : { background: 'linear-gradient(90deg, #7c3aed, #00d4ff)' }
            }
          >
            {loading ? 'Shortening...' : (
              <>
                Generate Short Link
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-4 rounded-2xl p-5 text-left fade-up ${dark ? 'bg-white/5 border border-accent/20' : 'bg-white border border-accent/30 shadow-sm'}`}
            style={{ boxShadow: '0 0 20px rgba(0,212,255,0.05)' }}>

            <p className={`text-xs font-mono mb-2 ${dark ? 'text-white/40' : 'text-black/40'}`}>
              Your short link is ready
            </p>

            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-accent text-lg truncate">
                {displayedUrl}
              </span>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{ background: copied ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.08)', color: copied ? '#00d4ff' : 'inherit' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>

                <button
                  onClick={() => navigate(`/stats/${result.shortCode}`)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}
                >
                  Stats
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features section */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: <Zap size={18} color="#00d4ff" />, title: 'Instant', desc: 'Links generated in milliseconds' },
            { icon: <SlidersHorizontal size={18} color="#00d4ff" />, title: 'Custom Alias', desc: 'Make your links memorable' },
            { icon: <BarChart2 size={18} color="#00d4ff" />, title: 'Analytics', desc: 'Track every click in real time' },
          ].map((f, i) => (
            <div key={i} className={`rounded-xl p-4 text-center ${dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/10'}`}>
              <div className="flex justify-center mb-2">{f.icon}</div>
              <div className="font-display font-semibold text-sm mb-1">{f.title}</div>
              <div className={`text-xs ${dark ? 'text-white/40' : 'text-black/40'}`}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}