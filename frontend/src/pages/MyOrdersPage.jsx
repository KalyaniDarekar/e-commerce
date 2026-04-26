import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiCalendar, FiDollarSign, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi'
import api from '../utils/api'

const getStatusColor = (status) => {
  switch (status) {
    case 'Processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    case 'Shipped': return 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20'
    case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20'
    default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'Processing': return <FiClock className="w-4 h-4" />
    case 'Shipped': return <FiTruck className="w-4 h-4" />
    case 'Delivered': return <FiCheckCircle className="w-4 h-4" />
    case 'Cancelled': return <FiXCircle className="w-4 h-4" />
    default: return null
  }
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders')
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-400">
          <FiPackage className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black font-poppins text-slate-900 dark:text-white mb-3">No Orders Yet</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          You haven't placed any orders yet. Start exploring our amazing collection of electronics!
        </p>
        <Link to="/products" className="btn-primary px-8 py-3">
          Start Shopping
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow-sm">
          <FiPackage className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black font-poppins text-slate-900 dark:text-white">Order History</h1>
          <p className="text-sm text-slate-500 mt-1">View and track your previous orders</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200/50 dark:border-white/10 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><FiPackage /> Order ID</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><FiCalendar /> Date Placed</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><FiDollarSign /> Total Amount</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                
                <div className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-5 sm:p-6 space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 dark:bg-white/5 flex-shrink-0 p-2 overflow-hidden border border-slate-200/50 dark:border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right sm:pl-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Footer */}
            <div className="bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-200/50 dark:border-white/10 p-4 sm:p-6 flex justify-between items-center text-sm">
              <span className="text-slate-500">Paid via <span className="font-semibold text-slate-700 dark:text-slate-300">{order.paymentMethod}</span></span>
              {order.deliveredAt && order.status === 'Delivered' && (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
