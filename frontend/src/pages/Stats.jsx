import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'
import { ArrowLeft, Copy, Check, Link2, Calendar, Clock, BarChart2, AlertCircle, ExternalLink } from 'lucide-react'

export default function Stats() {
  const { shortCode } = useParams()
  const navigate = useNavigate()
  const { dark } = useTheme()

  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(0)

  useEffect(() => {
    axios.get(`http://localhost:8080/api/stats/${shortCode}`)
      .then(res => {
        setStats(res.data)
        animateCount(res.data.clicks)
      })
      .catch(() => setError('Link not found or has been deleted.'))
  }, [shortCode])

  const animateCount = (target) => {
    let current = 0
    const step = Math.max(1, Math.floor(target / 40))
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        setDisplayedCount(target)
        clearInterval(interval)
      } else {
        setDisplayedCount(current)
      }
    }, 30)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stats.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isExpired = (dateStr) => {
    if (!dateStr) return false
    return new Date(dateStr) < new Date()
  }

  const cardClass = `rounded-xl p-5 ${dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/10'}`

  return (
    <div className={`min-h-screen pt-20 ${dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-[#0a0a0a]'}`}>
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 text-sm mb-8 transition-all duration-200 ${dark ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black'}`}
        >
          <ArrowLeft size={16} />
          Back to home
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl mb-1">Link Analytics</h1>
          <p className={`text-sm ${dark ? 'text-white/40' : 'text-black/40'}`}>
            Stats for{' '}
            <span className="font-mono text-accent">/{shortCode}</span>
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle size={18} color="#ef4444" />
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {stats && (
          <div className="space-y-4 fade-up">

            {/* Click count — hero card */}
            <div className="rounded-xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))',
                border: '1px solid rgba(0,212,255,0.15)'
              }}>
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 size={16} color="#00d4ff" />
                <span className={`text-xs font-mono uppercase tracking-widest ${dark ? 'text-white/40' : 'text-black/40'}`}>
                  Total Clicks
                </span>
              </div>
              <div className="font-display font-bold text-6xl"
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                {displayedCount}
              </div>
            </div>

            {/* Short URL card */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-3">
                <Link2 size={15} color="#00d4ff" />
                <span className={`text-xs font-mono uppercase tracking-widest ${dark ? 'text-white/40' : 'text-black/40'}`}>
                  Short URL
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-accent truncate">{stats.shortUrl}</span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{
                      background: copied ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.08)',
                      color: copied ? '#00d4ff' : 'inherit'
                    }}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  
                    href={stats.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}
                  >
                    Open
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Original URL card */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink size={15} color="#00d4ff" />
                <span className={`text-xs font-mono uppercase tracking-widest ${dark ? 'text-white/40' : 'text-black/40'}`}>
                  Original URL
                </span>
              </div>
              
                href={stats.longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm break-all hover:text-accent transition-colors duration-200 ${dark ? 'text-white/70' : 'text-black/70'}`}
              >
                {stats.longUrl}
              </a>
            </div>

            {/* Date info row */}
            <div className="grid grid-cols-2 gap-4">

              {/* Created at */}
              <div className={cardClass}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={15} color="#00d4ff" />
                  <span className={`text-xs font-mono uppercase tracking-widest ${dark ? 'text-white/40' : 'text-black/40'}`}>
                    Created
                  </span>
                </div>
                <p className="font-display font-semibold text-sm">
                  {formatDate(stats.createdAt) || '—'}
                </p>
              </div>

              {/* Expiry */}
              <div className={cardClass}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={15} color="#00d4ff" />
                  <span className={`text-xs font-mono uppercase tracking-widest ${dark ? 'text-white/40' : 'text-black/40'}`}>
                    Expires
                  </span>
                </div>
                {stats.expiryDate ? (
                  <div className="flex items-center gap-2">
                    <p className="font-display font-semibold text-sm">
                      {formatDate(stats.expiryDate)}
                    </p>
                    {isExpired(stats.expiryDate) ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                        Expired
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono glow-pulse"
                        style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
                        Active
                      </span>
                    )}
                  </div>
                ) : (
                  <p className={`font-display font-semibold text-sm ${dark ? 'text-white/30' : 'text-black/30'}`}>
                    Never
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}