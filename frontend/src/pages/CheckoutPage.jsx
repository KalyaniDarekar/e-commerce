import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi'
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice'
import api from '../utils/api'
import toast from 'react-hot-toast'

const INPUT_CLASS = 'input-glass'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartTotal)
  const shipping = subtotal > 50000 ? 0 : 499
  const tax = Math.round(subtotal * 0.18)
  const grand = subtotal + shipping + tax

  const [step, setStep] = useState(1)
  const [placed, setPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '' })
  const [payment, setPayment] = useState('COD')

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    if (Object.values(address).some((v) => !v)) return toast.error('Please fill all fields')
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      await api.post('/orders', {
        items: items.map((i) => {
          // Force valid ObjectId for stale mock data in user's localStorage
          let productId = String(i._id);
          if (productId.length < 24) productId = productId.padStart(24, '0');
          else if (productId.length > 24) productId = productId.substring(0, 24);

          return {
            product: productId,
            name: i.name,
          image: i.images?.[0] || i.image || 'https://via.placeholder.com/150',
          price: i.price,
          quantity: i.quantity,
        }; }),
        shippingAddress: address,
        paymentMethod: payment,
        totalPrice: grand,
      })
      dispatch(clearCart())
      setPlaced(true)
    } catch (error) {
      console.error('Checkout Error:', error.response?.data || error)
      toast.error(error.response?.data?.message || error.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (placed) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6"
      >
        <FiCheck className="w-10 h-10 text-white" />
      </motion.div>
      <h2 className="text-3xl font-black font-poppins text-slate-900 dark:text-white mb-3">Order Placed!</h2>
      <p className="text-slate-400 mb-8">Thank you for your order. We'll send you a confirmation email shortly.</p>
      <div className="flex gap-4">
        <button onClick={() => navigate('/my-orders')} className="btn-primary px-8 py-3">View My Orders</button>
        <button onClick={() => navigate('/')} className="btn-outline px-8 py-3">Continue Shopping</button>
      </div>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      <h1 className="text-4xl font-black font-poppins gradient-text mb-10">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-10">
        {['Shipping', 'Payment'].map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'
            }`}>
              {step > i + 1 ? <FiCheck /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{s}</span>
            {i < 1 && <div className={`flex-1 h-px mx-2 ${step > 1 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/10'}`} style={{ width: '60px' }} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <motion.form
              key="address"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleAddressSubmit}
              className="glass-card p-8 space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary-600/20 text-primary-400"><FiMapPin /></div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-poppins">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="John Doe"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Address</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="123, Street Name, Area"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">City</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="Mumbai"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">State</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="Maharashtra"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Pincode</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="400001"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Phone</label>
                  <input
                    className={INPUT_CLASS}
                    placeholder="+91 9876543210"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                className="btn-primary w-full py-4 mt-4"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Payment
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary-600/20 text-primary-400"><FiCreditCard /></div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-poppins">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  { id: 'Card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { id: 'UPI', label: 'UPI', desc: 'PhonePe, GPay, Paytm' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      payment === opt.id ? 'border-primary-500 bg-primary-500/10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={payment === opt.id}
                      onChange={() => setPayment(opt.id)}
                      className="accent-primary-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1 py-3"
                >
                  Back
                </button>
                <motion.button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Place Order ₹{grand.toLocaleString('en-IN')}</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 h-fit sticky top-24"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 font-poppins">Order Summary</h3>
          <div className="space-y-3 mb-5">
            {items.map((item) => (
              <div key={item._id} className="flex gap-3 items-center">
                <img src={item.images?.[0] || item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-dark-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200/50 dark:border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Shipping</span><span className={shipping === 0 ? 'text-green-500 dark:text-green-400' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200/50 dark:border-white/10 mt-2">
              <span className="text-slate-900 dark:text-white">Total</span>
              <span className="gradient-text">₹{grand.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
