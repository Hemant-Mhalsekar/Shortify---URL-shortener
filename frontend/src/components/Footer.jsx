import { useTheme } from '../context/ThemeContext'
import { Globe, ExternalLink } from 'lucide-react'

export default function Footer() {
  const { dark } = useTheme()

  return (
    <footer className={`w-full border-t py-6 px-6 ${dark ? 'border-white/10' : 'border-black/10'}`}>
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className={`text-xs font-mono ${dark ? 'text-white/30' : 'text-black/30'}`}>
          Built by <span style={{ color: '#00d4ff' }}>Hemant Mhalsekar</span>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Hemant-Mhalsekar"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${dark ? 'text-white/30 hover:text-white' : 'text-black/30 hover:text-black'}`}
          >
            <Globe size={14} />
            GitHub
          </a>
          <a
            href="https://hemant-mhalsekar.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${dark ? 'text-white/30 hover:text-white' : 'text-black/30 hover:text-black'}`}
          >
            <ExternalLink size={14} />
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  )
}