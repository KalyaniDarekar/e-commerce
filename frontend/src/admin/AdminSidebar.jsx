import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiZap, FiGrid, FiBox, FiPlusCircle, FiTruck,
  FiBarChart2, FiSettings, FiLogOut, FiX, FiChevronRight
} from 'react-icons/fi'
import { logout } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { id: 'overview',     icon: FiGrid,       label: 'Dashboard' },
  { id: 'products',     icon: FiBox,        label: 'Products' },
  { id: 'add-product',  icon: FiPlusCircle, label: 'Add Product' },
  { id: 'orders',       icon: FiTruck,      label: 'Orders / Delivery' },
  { id: 'analytics',    icon: FiBarChart2,  label: 'Analytics' },
  { id: 'settings',     icon: FiSettings,   label: 'Settings' },
]

export default function AdminSidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out')
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 mb-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-glow-sm flex-shrink-0">
          <FiZap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold font-poppins text-white">ElectroStore</p>
          <p className="text-xs text-primary-400">Admin Panel</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileOpen(false) }}
              className={`relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ x: active ? 0 : 3 }}
              whileTap={{ scale: 0.98 }}
            >
              {active && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.35), rgba(124,58,237,0.25))' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-primary-400 to-accent-400" />
              )}
              <item.icon className={`w-5 h-5 relative z-10 flex-shrink-0 ${active ? 'text-primary-300' : ''}`} />
              <span className="relative z-10">{item.label}</span>
              {active && <FiChevronRight className="w-4 h-4 ml-auto relative z-10 text-primary-400" />}
            </motion.button>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/10 mt-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2 bg-white/3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@electrostore.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <FiLogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 border-r border-white/10"
        style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden flex flex-col"
              style={{ background: 'rgba(10,15,30,0.98)', backdropFilter: 'blur(20px)' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <FiX className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
