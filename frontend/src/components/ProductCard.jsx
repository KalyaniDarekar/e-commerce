import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import StarRating from './StarRating'

const PLACEHOLDER_IMAGES = {
  Mobiles: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  Laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  Accessories: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  Audio: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  Tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  Cameras: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400&q=80',
}

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ ...product, _id: product._id }))
    toast.success(`${product.name} added to cart!`)
  }

  const imageUrl =
    product.images?.[0] || PLACEHOLDER_IMAGES[product.category] || PLACEHOLDER_IMAGES.Accessories

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/products/${product._id}`}>
        <motion.div
          className="glass-card overflow-hidden group cursor-pointer h-full"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 4 + (index % 3) * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.3,
          }}
          whileHover={{
            scale: 1.03,
            rotateX: 3,
            rotateY: -3,
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Image */}
          <div className="relative overflow-hidden bg-slate-100 dark:bg-gradient-to-br dark:from-dark-700 dark:to-dark-600 h-52">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            {product.discount > 0 && (
              <div className="absolute top-3 left-3 badge">-{product.discount}%</div>
            )}
            {product.featured && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-accent-600/80 text-white">
                Featured
              </div>
            )}

            {/* Wishlist */}
            <button
              onClick={(e) => e.preventDefault()}
              className="absolute top-3 right-3 p-2 rounded-xl glass-card text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <FiHeart className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary-500 dark:text-primary-400 font-medium mb-1">{product.brand}</p>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate font-poppins">{product.name}</h3>
              </div>
            </div>

            <StarRating rating={product.rating} numReviews={product.numReviews} size="sm" />

            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.discount > 0 && (
                  <span className="text-xs text-slate-500 line-through ml-2">
                    ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <motion.button
              onClick={handleAddToCart}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
