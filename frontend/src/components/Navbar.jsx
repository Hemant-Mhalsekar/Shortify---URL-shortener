import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Zap, LayoutDashboard, LogOut } from 'lucide-react'

export default function Navbar() {
  const { dark, setDark } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  return (
    <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b ${dark ? 'border-white/10 bg-[#0a0a0a]/80' : 'border-black/10 bg-white/80'} backdrop-blur-md`}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <Zap size={20} className="text-accent" fill="#00d4ff" />
        <span className="font-display font-bold text-xl tracking-tight">
          Shortify
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all duration-200 ${dark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-black/60 hover:text-black hover:bg-black/10'}`}
            >
              <LayoutDashboard size={15} />
              Dashboard
            </button>
            <div className="flex items-center gap-2">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full"
                />
              )}
              <span className={`text-sm hidden sm:block ${dark ? 'text-white/60' : 'text-black/60'}`}>
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className={`p-2 rounded-full transition-all duration-300 ${dark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
            >
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all duration-200"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #00d4ff)' }}
          >
            Sign in with Google
          </button>
        )}

        <button
          onClick={() => setDark(!dark)}
          className={`p-2 rounded-full transition-all duration-300 ${dark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  )
}