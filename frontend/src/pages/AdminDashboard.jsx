import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBarChart2, FiSettings, FiTrendingUp, FiShield } from 'react-icons/fi'
import api from '../utils/api'
import AdminSidebar from '../admin/AdminSidebar'
import AdminTopBar from '../admin/AdminTopBar'
import AdminOverview from '../admin/AdminOverview'
import AdminProducts from '../admin/AdminProducts'
import AdminAddProduct from '../admin/AdminAddProduct'
import AdminOrders from '../admin/AdminOrders'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

function AnalyticsPlaceholder() {
  const bars = [65, 82, 54, 90, 73, 88, 61, 95, 78, 66, 84, 92]
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="mb-8">
        <h1 className="text-2xl font-black font-poppins gradient-text">Analytics</h1>
        <p className="text-slate-400 text-sm mt-0.5">Revenue &amp; performance overview</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Monthly Growth',  value: '+24%',  color: 'text-emerald-400' },
          { label: 'Conversion Rate', value: '3.8%',  color: 'text-blue-400' },
          { label: 'Avg Order Value', value: '₹8,420', color: 'text-accent-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5">
            <p className={`text-2xl font-black font-poppins ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white font-poppins">Monthly Revenue</h2>
          <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
            <FiTrendingUp className="w-4 h-4" /> +18% vs last year
          </div>
        </div>
        <div className="flex items-end gap-2 h-40">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-primary-600 to-accent-500 min-w-0"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ opacity: 0.8 }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-3">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
            <span key={m} className="text-xs text-slate-600 flex-1 text-center">{m}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SettingsPlaceholder() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="mb-8">
        <h1 className="text-2xl font-black font-poppins gradient-text">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage store preferences</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: FiSettings,  title: 'Store Settings',  desc: 'Update store name, currency, timezone and locale preferences.' },
          { icon: FiShield,    title: 'Security',         desc: 'Manage admin passwords, 2FA, and session policies.' },
          { icon: FiBarChart2, title: 'Notifications',    desc: 'Configure email alerts for orders, low stock and refunds.' },
          { icon: FiTrendingUp,title: 'Integrations',     desc: 'Connect payment gateways, shipping APIs and analytics tools.' },
        ].map((item) => (
          <motion.div
            key={item.title}
            className="glass-card p-6 hover:border-primary-500/30 transition-all cursor-pointer group"
            whileHover={{ y: -3 }}
          >
            <div className="p-3 rounded-xl bg-primary-600/20 w-fit mb-4 group-hover:bg-primary-600/30 transition-all">
              <item.icon className="w-5 h-5 text-primary-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab]       = useState('overview')
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const [products, setProducts]         = useState([])
  const [orders, setOrders]             = useState([])
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders')
        ])
        setProducts(prodRes.data || [])
        setOrders(orderRes.data || [])
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      }
    }
    fetchAdminData()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview setActiveTab={setActiveTab} products={products} orders={orders} />
      case 'products':
        return (
          <AdminProducts
            products={products}
            setProducts={setProducts}
            setActiveTab={setActiveTab}
            setEditingProduct={setEditingProduct}
          />
        )
      case 'add-product':
        return (
          <AdminAddProduct
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            products={products}
            setProducts={setProducts}
            setActiveTab={setActiveTab}
          />
        )
      case 'orders':
        return <AdminOrders orders={orders} setOrders={setOrders} />
      case 'analytics':
        return <AnalyticsPlaceholder />
      case 'settings':
        return <SettingsPlaceholder />
      default:
        return null
    }
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#050816] transition-colors duration-300"
    >
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopBar
          activeTab={activeTab}
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
