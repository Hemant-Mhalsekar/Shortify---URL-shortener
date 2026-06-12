import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { ArrowLeft, LinkIcon } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  const { dark } = useTheme()

  return (
    <div className={`min-h-screen pt-20 flex items-center justify-center ${dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-[#0a0a0a]'}`}>
      <div className="text-center px-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <LinkIcon size={28} color="#00d4ff" />
        </div>

        <h1 className="font-display font-bold text-5xl mb-3"
          style={{
            background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
          404
        </h1>

        <p className="font-display font-semibold text-xl mb-2">Page not found</p>

        <p className={`text-sm mb-8 ${dark ? 'text-white/40' : 'text-black/40'}`}>
          This link doesn't exist or may have expired.
        </p>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #00d4ff)' }}
        >
          <ArrowLeft size={15} />
          Back to home
        </button>
      </div>
    </div>
  )
}