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
    <div
      className="min-h-screen flex items-center justify-center bg-white px-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="w-full max-w-sm">
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
          <div className="px-8 pt-9 pb-2 text-center">
            <img src="/aaua-logo.jpg" alt="AAUA Logo" className="h-12 w-12 mx-auto mb-4 object-contain grayscale" />
            <p className="text-black text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
              AAUA
            </p>
            <p className="text-neutral-500 text-xs mt-0.5">Faculty of Computing</p>
            <div
              className="inline-flex items-center gap-2 text-neutral-500 text-[10px] font-medium uppercase mt-4"
              style={{ letterSpacing: '0.12em' }}
            >
              <span className="w-4 h-px bg-neutral-300" />
              Administrator Access
              <span className="w-4 h-px bg-neutral-300" />
            </div>
          </div>

          <div className="px-8 pb-8 pt-5">
            {error && (
              <p className="text-red-700 text-xs text-center mb-4 bg-red-50 border border-red-200 rounded-md py-2">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <label
                  className="text-neutral-500 text-[10px] font-medium uppercase block mb-1"
                  style={{ letterSpacing: '0.1em' }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm outline-none text-black focus:border-black transition-colors"
                />
              </div>
              <div>
                <label
                  className="text-neutral-500 text-[10px] font-medium uppercase block mb-1"
                  style={{ letterSpacing: '0.1em' }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm outline-none text-black focus:border-black transition-colors"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-black text-white text-xs font-medium uppercase py-3 rounded-md mt-2 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '0.08em' }}
              >
                {loading ? 'Logging in…' : 'Log In'}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-neutral-400 text-[11px] mt-6">
          Restricted to authorised faculty administrators
        </p>
      </div>
    </div>
  )
}

export default AdminLogin