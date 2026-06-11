import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Stats() {
  const { shortCode } = useParams()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:8080/api/stats/${shortCode}`)
      .then(res => setStats(res.data))
      .catch(() => setError('Link not found.'))
  }, [shortCode])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">Link Stats</h2>

        {error && <p className="text-red-400">{error}</p>}

        {stats && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Original URL</p>
              <p className="text-white break-all mt-1">{stats.longUrl}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Short URL</p>
              <p className="text-indigo-400 font-mono mt-1">{stats.shortUrl}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Clicks</p>
              <p className="text-4xl font-bold text-white mt-1">{stats.clicks}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg text-sm transition"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}