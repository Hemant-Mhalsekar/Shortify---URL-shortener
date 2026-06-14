import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../api/axios'
import { BarChart2, Copy, Check, Trash2, ExternalLink, ArrowRight, Link2 } from 'lucide-react'

export default function Dashboard() {
  const { user, token } = useAuth()
  const { dark } = useTheme()
  const navigate = useNavigate()

  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }
    fetchLinks()
  }, [token])

  const fetchLinks = async () => {
    try {
      const res = await api.get('/api/dashboard')
      setLinks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (shortCode) => {
    try {
      await api.delete(`/api/link/${shortCode}`)
      setLinks(links.filter(l => l.shortCode !== shortCode))
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopy = (shortUrl, shortCode) => {
    navigator.clipboard.writeText(shortUrl)
    setCopiedCode(shortCode)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const isExpired = (dateStr) => {
    if (!dateStr) return false
    return new Date(dateStr) < new Date()
  }

  const bg = dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-[#0a0a0a]'
  const cardBg = dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/10'
  const mutedText = dark ? 'text-white/40' : 'text-black/40'

  return (
    <div className={`min-h-screen pt-20 ${bg}`}>
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">Dashboard</h1>
            <p className={`text-sm ${mutedText}`}>
              Welcome back,{' '}
              <span style={{ color: '#00d4ff' }}>{user?.name}</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #00d4ff)' }}
          >
            <Link2 size={14} />
            New Link
          </button>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`rounded-xl p-5 animate-pulse ${dark ? 'bg-white/5' : 'bg-black/5'}`}
                style={{ height: '80px' }}
              />
            ))}
          </div>
        )}

        {!loading && links.length === 0 && (
          <div className={`rounded-2xl p-12 text-center ${cardBg}`}>
            <Link2 size={32} className={`mx-auto mb-4 ${mutedText}`} />
            <p className="font-display font-semibold mb-2">No links yet</p>
            <p className={`text-sm mb-6 ${mutedText}`}>
              Shorten your first URL to see it here
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #00d4ff)' }}
            >
              Create a link
            </button>
          </div>
        )}

        {!loading && links.length > 0 && (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.shortCode} className={`rounded-xl p-4 ${cardBg}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-sm" style={{ color: '#00d4ff' }}>
                        {link.shortUrl}
                      </span>
                      {isExpired(link.expiryDate) ? (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-mono"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                        >
                          Expired
                        </span>
                      ) : (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-mono"
                          style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${mutedText}`}>
                      {link.longUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-lg mr-2"
                      style={{ background: 'rgba(0,212,255,0.08)' }}
                    >
                      <BarChart2 size={12} color="#00d4ff" />
                      <span className="text-xs font-mono" style={{ color: '#00d4ff' }}>
                        {link.clicks}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(link.shortUrl, link.shortCode)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${dark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                    >
                      {copiedCode === link.shortCode
                        ? <Check size={14} color="#00d4ff" />
                        : <Copy size={14} className={mutedText} />
                      }
                    </button>

                    <button
                      onClick={() => navigate(`/stats/${link.shortCode}`)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${dark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                    >
                      <ArrowRight size={14} className={mutedText} />
                    </button>

                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1.5 rounded-lg transition-all duration-200 ${dark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                    >
                      <ExternalLink size={14} className={mutedText} />
                    </a>

                    <button
                      onClick={() => handleDelete(link.shortCode)}
                      className="p-1.5 rounded-lg transition-all duration-200 hover:bg-red-500/10"
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}