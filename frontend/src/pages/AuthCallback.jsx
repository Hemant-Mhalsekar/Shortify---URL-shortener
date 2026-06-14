import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      const decoded = jwtDecode(token)
      const userData = {
        email: decoded.sub,
        name: decoded.name,
        picture: decoded.picture,
      }
      login(token, userData)
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-sm" style={{ color: '#00d4ff' }}>
        Signing you in...
      </p>
    </div>
  )
}