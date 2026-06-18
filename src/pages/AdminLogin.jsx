import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import useAuthStore from '../store/authStore'

function AdminLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/login.php', { username, password })
      if (res.data.success) {
        login(res.data.data.token)
        navigate('/admin/dashboard')
      } else {
        setError(res.data.message || 'Invalid credentials')
      }
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative"
  style={{ backgroundImage: 'url(/faculty.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
  <div className="absolute inset-0 opacity-85" style={{ background: 'linear-gradient(135deg, #1a2e4a 0%, #2E7D32 100%)' }} />
      <div className="relative z-10 rounded-2xl p-8 w-full max-w-sm" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="text-center mb-6">
          <img src="/aaua-logo.jpg" alt="AAUA Logo" className="h-14 w-14 mx-auto mb-3 object-contain" />
          <p className="font-bold text-white text-lg">AAUA</p>
          <p className="text-[#4CAF50] text-xs font-semibold tracking-wide">Faculty of Computing</p>
          <p className="text-white/70 text-sm mt-2">Admin Login</p>
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center mb-4">{error}</p>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-white/30 rounded-md px-4 py-2 text-sm outline-none bg-white/10 text-white placeholder-white/60 focus:border-white/60"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="border border-white/30 rounded-md px-4 py-2 text-sm outline-none bg-white/10 text-white placeholder-white/60 focus:border-white/60"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#1B5E20] text-white text-sm py-2 rounded-md hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin