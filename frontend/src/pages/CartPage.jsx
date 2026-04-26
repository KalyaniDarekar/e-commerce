import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi'
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id))
    toast.success(`${name} removed from cart`)
  }

  const handleQtyChange = (id, qty) => {
    dispatch(updateQuantity({ id, quantity: qty }))
  }

  const shipping = total > 50000 ? 0 : 499
  const tax = Math.round(total * 0.18)
  const grandTotal = total + shipping + tax

  if (items.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FiShoppingCart className="w-20 h-20 text-primary-400/40 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-8">Add some awesome products to get started!</p>
        <Link to="/products" className="btn-primary flex items-center gap-2">
          Start Shopping <FiArrowRight />
        </Link>
      </motion.div>
    )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-black font-poppins gradient-text mb-10"
      >
        Shopping Cart
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40, height: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex gap-5">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl bg-dark-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary-400 font-medium">{item.brand}</p>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-white truncate">{item.name}</h3>
                      </div>
                      <button
                        onClick={() => handleRemove(item._id, item.name)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors ml-2"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center glass-card rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQtyChange(item._id, item.quantity - 1)}
                          className="px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="px-4 py-2 text-slate-900 dark:text-white text-sm font-semibold border-x border-slate-200/50 dark:border-white/10 min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item._id, item.quantity + 1)}
                          className="px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-slate-500">₹{item.price?.toLocaleString('en-IN')} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 h-fit sticky top-24"
        >
          <h2 className="text-lg font-bold font-poppins text-slate-900 dark:text-white mb-6">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Subtotal ({items.length} items)</span>
              <span className="text-slate-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-900 dark:text-white'}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax (18% GST)</span>
              <span className="text-slate-900 dark:text-white">₹{tax.toLocaleString('en-IN')}</span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-green-400/80 bg-green-400/10 px-3 py-2 rounded-lg">
                🎉 You qualify for free shipping!
              </p>
            )}
            <div className="border-t border-slate-200/50 dark:border-white/10 pt-3 flex justify-between font-bold text-base">
              <span className="text-slate-900 dark:text-white">Grand Total</span>
              <span className="gradient-text">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <motion.button
            onClick={() => navigate('/checkout')}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-6 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Proceed to Checkout <FiArrowRight />
          </motion.button>

          <Link to="/products" className="block text-center text-sm text-slate-500 hover:text-primary-400 mt-4 transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
