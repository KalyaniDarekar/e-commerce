import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { FiMail, FiLock, FiShield, FiEye, FiEyeOff } from 'react-icons/fi'
import { setCredentials } from '../store/slices/authSlice'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      
      if (data.user?.role !== 'admin' && data.role !== 'admin') {
        toast.error('Unauthorized: Admin access required.')
        setLoading(false)
        return
      }

      dispatch(setCredentials(data))
      toast.success('Admin authentication successful')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-900">
      {/* Background orbs */}
      <div className="glow-orb w-96 h-96 top-[-100px] left-[-100px]" style={{ background: 'rgba(239,68,68,0.15)' }} />
      <div className="glow-orb w-64 h-64 bottom-0 right-[-50px]" style={{ background: 'rgba(245,158,11,0.12)' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="glass-card p-8 md:p-10 border-red-500/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center mb-4 shadow-glow-md">
              <FiShield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black font-poppins text-white">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-2">Restricted Area</p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="email"
                placeholder="Admin Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-glass pl-11 text-white bg-slate-800/50 border-slate-700 focus:border-red-500/50"
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
                className="input-glass pl-11 pr-11 text-white bg-slate-800/50 border-slate-700 focus:border-red-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 flex items-center justify-center gap-2 mt-6 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 transition-all shadow-glow-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Secure Login'
              )}
            </motion.button>
            
            <button
              type="button"
              onClick={() => {
                dispatch(setCredentials({
                  token: "demo-token",
                  user: { _id: "1", name: "Demo Admin", email: "admin@electrostore.com", role: "admin" }
                }))
                toast.success('Logged in as Demo Admin')
                navigate('/admin')
              }}
              className="btn-outline w-full py-3 text-xs border-red-500/50 hover:bg-red-500/10 mt-2 text-slate-300"
            >
              Mock Admin Login (No Server)
            </button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  )
}
