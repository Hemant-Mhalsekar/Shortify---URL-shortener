import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Zap } from 'lucide-react'

export default function Navbar() {
  const { dark, setDark } = useTheme()

  return (
    <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b ${dark ? 'border-white/10 bg-[#0a0a0a]/80' : 'border-black/10 bg-white/80'} backdrop-blur-md`}>
      <div className="flex items-center gap-2">
        <Zap size={20} className="text-accent" fill="#00d4ff" />
        <span className="font-display font-bold text-xl tracking-tight">
          Shortify
        </span>
      </div>

      <button
        onClick={() => setDark(!dark)}
        className={`p-2 rounded-full transition-all duration-300 ${dark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </nav>
  )
}