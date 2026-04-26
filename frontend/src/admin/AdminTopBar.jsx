import { motion } from 'framer-motion'
import { FiSearch, FiBell, FiMenu, FiHome } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const TAB_LABELS = {
  overview: 'Dashboard',
  products: 'Products',
  'add-product': 'Add Product',
  orders: 'Orders & Deliveries',
  analytics: 'Analytics',
  settings: 'Settings',
}

export default function AdminTopBar({ activeTab, setMobileOpen, searchQuery, setSearchQuery }) {
  const { user } = useSelector((s) => s.auth)

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-16 border-b border-white/10 flex-shrink-0"
      style={{ background: 'rgba(5,8,22,0.9)', backdropFilter: 'blur(20px)' }}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Page Title */}
      <div className="flex items-center gap-2 mr-auto">
        <span className="text-xs text-slate-600 hidden sm:block">Admin</span>
        <span className="text-xs text-slate-600 hidden sm:block">/</span>
        <h1 className="text-sm font-semibold text-white">{TAB_LABELS[activeTab] || 'Dashboard'}</h1>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-glass pl-9 pr-4 py-2 text-sm w-52 !rounded-xl"
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
        <FiBell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
      </button>

      {/* Back to store */}
      <Link
        to="/"
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-primary-400 hover:bg-white/5 transition-all border border-white/10"
      >
        <FiHome className="w-3.5 h-3.5" /> Store
      </Link>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
        {user?.name?.charAt(0).toUpperCase() || 'A'}
      </div>
    </motion.header>
  )
}
