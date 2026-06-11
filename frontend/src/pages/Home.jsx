import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiryDays, setExpiryDays] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!url) return setError('Please enter a URL.')
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8080/api/shorten', {
        url,
        customAlias: customAlias || null,
        expiryDays: expiryDays ? parseInt(expiryDays) : null,
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.shortUrl)
    alert('Copied!')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-2 text-indigo-400">Shortify</h1>
      <p className="text-gray-400 mb-8">Shorten your links instantly</p>

      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-xl">
        <input
          type="text"
          placeholder="Paste your long URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Custom alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          placeholder="Expiry in days (optional)"
          value={expiryDays}
          onChange={(e) => setExpiryDays(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? 'Shortening...' : 'Generate Short Link'}
        </button>

        {result && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Your short link:</p>
            <p className="text-indigo-400 font-mono text-lg break-all">{result.shortUrl}</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm transition"
              >
                Copy
              </button>
              <button
                onClick={() => navigate(`/stats/${result.shortCode}`)}
                className="flex-1 bg-indigo-700 hover:bg-indigo-600 py-2 rounded-lg text-sm transition"
              >
                View Stats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}