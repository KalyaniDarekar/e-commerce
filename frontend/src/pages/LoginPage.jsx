import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { FiMail, FiLock, FiUser, FiZap, FiEye, FiEyeOff } from 'react-icons/fi'
import { setCredentials } from '../store/slices/authSlice'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form
      const { data } = await api.post(endpoint, payload)
      dispatch(setCredentials(data))
      toast.success(isLogin ? 'Welcome back!' : 'Account created!')
      
      if (data.user?.role === 'admin' || data.role === 'admin') {
        toast.error('Admins must log in via the admin portal')
        dispatch(setCredentials(null))
        setLoading(false)
        return
      }
      
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="glow-orb w-96 h-96 top-[-100px] left-[-100px]" style={{ background: 'rgba(79,70,229,0.15)' }} />
      <div className="glow-orb w-64 h-64 bottom-0 right-[-50px]" style={{ background: 'rgba(168,85,247,0.12)' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="glass-card p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center mb-4 shadow-glow-md">
              <FiZap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black font-poppins gradient-text">ElectroStore</h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex glass-card p-1 rounded-xl mb-8">
            {['Login', 'Sign Up'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setIsLogin(tab === 'Login')
                  setForm({ name: '', email: '', password: '' })
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  (tab === 'Login') === isLogin
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {!isLogin && (
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-glass pl-11"
                  />
                </div>
              )}

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-glass pl-11"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-glass pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-xs text-slate-500 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
