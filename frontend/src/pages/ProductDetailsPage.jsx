import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiArrowLeft, FiPlus, FiMinus, FiCheck } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import StarRating from '../components/StarRating'
import api from '../utils/api'
import toast from 'react-hot-toast'

const MOCK_PRODUCTS = {
  '1': { _id: '1', name: 'iPhone 15 Pro', brand: 'Apple', price: 134900, category: 'Mobiles', rating: 4.8, numReviews: 1240, discount: 5, stock: 20, description: 'The iPhone 15 Pro features a titanium design, the powerful A17 Pro chip, a 48MP camera system, and a customizable Action button. Experience pro-level performance with exceptional battery life and the latest iOS features.', images: ['https://images.unsplash.com/photo-1668363958849-b22a6d5c47d7?w=600&q=80', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'] },
  '2': { _id: '2', name: 'MacBook Pro 16"', brand: 'Apple', price: 249900, category: 'Laptops', rating: 4.9, numReviews: 890, discount: 0, stock: 10, description: 'The MacBook Pro 16" with M3 Max chip delivers unprecedented performance for professionals. Featuring a stunning Liquid Retina XDR display, up to 22 hours battery life, and the fastest Mac CPU ever.', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'] },
  '3': { _id: '3', name: 'Sony WH-1000XM5', brand: 'Sony', price: 29990, category: 'Audio', rating: 4.7, numReviews: 2100, discount: 15, stock: 50, description: 'Industry-leading noise cancellation with eight microphones, 30-hour battery, and exceptional sound quality. The most comfortable headphones Sony has ever made, perfect for travel and work.', images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'] },
}

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`)
        setProduct(data)
      } catch {
        setProduct(MOCK_PRODUCTS[id] || MOCK_PRODUCTS['1'])
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addToCart({ ...product, quantity }))
    toast.success(`${product.name} added to cart!`)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
        whileHover={{ x: -4 }}
      >
        <FiArrowLeft /> Back to Products
      </motion.button>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Main Image */}
          <div
            className="relative overflow-hidden rounded-3xl glass-card mb-4 cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            style={{ height: '420px' }}
          >
            <motion.img
              key={selectedImage}
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.15 : 1 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/30 to-transparent pointer-events-none" />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 badge text-sm">-{product.discount}%</div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-primary-500' : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt="" className="w-20 h-16 object-cover" />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div>
            <span className="badge mb-3 inline-flex">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-black font-poppins text-slate-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-slate-400 font-medium">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} numReviews={product.numReviews} />
            <span className="text-sm text-slate-400">
              {product.rating?.toFixed(1)} out of 5
            </span>
          </div>

          {/* Price */}
          <div className="glass-card p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-slate-500 line-through">
                    ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-green-400 font-semibold">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">About this product</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  <FiMinus />
                </button>
                <span className="px-6 py-3 text-slate-900 dark:text-white font-semibold border-x border-slate-200 dark:border-white/10 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  <FiPlus />
                </button>
              </div>
              <span className="text-sm text-slate-500">{product.stock} in stock</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={handleAddToCart}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="added"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <FiCheck /> Added!
                  </motion.span>
                ) : (
                  <motion.span key="add" className="flex items-center gap-2">
                    <FiShoppingCart /> Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {['Free Delivery', 'Easy Returns', '1 Year Warranty'].map((badge) => (
              <div key={badge} className="glass-card p-3 text-center">
                <p className="text-xs text-slate-400">{badge}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
