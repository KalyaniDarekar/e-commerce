import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiShoppingBag, FiStar, FiTrendingUp } from 'react-icons/fi'
import { MdOutlineSmartphone, MdOutlineLaptop, MdOutlineHeadphones } from 'react-icons/md'
import { TbCamera, TbDeviceTablet } from 'react-icons/tb'
import api from '../utils/api'
import ProductCard from '../components/ProductCard'

const MOCK_PRODUCTS = [
  { _id: '60d5ecb8b392d700153ee001', name: 'iPhone 15 Pro', brand: 'Apple', price: 134900, category: 'Mobiles', rating: 4.8, numReviews: 1240, featured: true, discount: 5, images: ['https://images.unsplash.com/photo-1668363958849-b22a6d5c47d7?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee002', name: 'MacBook Pro 16"', brand: 'Apple', price: 249900, category: 'Laptops', rating: 4.9, numReviews: 890, featured: true, discount: 0, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee003', name: 'Sony WH-1000XM5', brand: 'Sony', price: 29990, category: 'Audio', rating: 4.7, numReviews: 2100, featured: true, discount: 15, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee004', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 129999, category: 'Mobiles', rating: 4.6, numReviews: 760, featured: true, discount: 10, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee005', name: 'Dell XPS 15', brand: 'Dell', price: 159900, category: 'Laptops', rating: 4.5, numReviews: 430, featured: false, discount: 8, images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee006', name: 'AirPods Pro 2nd Gen', brand: 'Apple', price: 24900, category: 'Audio', rating: 4.8, numReviews: 3200, featured: false, discount: 0, images: ['https://images.unsplash.com/photo-1675525587760-81b7e26ede33?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee007', name: 'iPad Pro 12.9"', brand: 'Apple', price: 112900, category: 'Tablets', rating: 4.7, numReviews: 540, featured: false, discount: 5, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee008', name: 'Sony A7 IV Camera', brand: 'Sony', price: 199990, category: 'Cameras', rating: 4.9, numReviews: 310, featured: false, discount: 0, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80'] },
]

const CATEGORIES = [
  { name: 'Mobiles', icon: MdOutlineSmartphone, color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', glow: 'rgba(59,130,246,0.3)' },
  { name: 'Laptops', icon: MdOutlineLaptop, color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', glow: 'rgba(139,92,246,0.3)' },
  { name: 'Audio', icon: MdOutlineHeadphones, color: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/30', glow: 'rgba(236,72,153,0.3)' },
  { name: 'Cameras', icon: TbCamera, color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', glow: 'rgba(245,158,11,0.3)' },
  { name: 'Tablets', icon: TbDeviceTablet, color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', glow: 'rgba(34,197,94,0.3)' },
]

const FloatingOrb = ({ style }) => (
  <div className="glow-orb" style={style} />
)

export default function HomePage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/products/featured')
        if (data?.length) setProducts(data)
      } catch {}
    }
    fetch()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ======== HERO SECTION ======== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background orbs */}
        <FloatingOrb style={{ width: 600, height: 600, background: 'rgba(79,70,229,0.15)', top: -100, left: -200 }} />
        <FloatingOrb style={{ width: 400, height: 400, background: 'rgba(168,85,247,0.12)', bottom: -50, right: -100 }} />
        <FloatingOrb style={{ width: 200, height: 200, background: 'rgba(96,165,250,0.1)', top: '30%', left: '50%' }} />

        {/* Particle dots */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="badge mb-6 inline-flex"
            >
              <FiTrendingUp className="mr-2" /> Next-generation electronics
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-black font-poppins leading-tight mb-6"
            >
              Next-Gen{' '}
              <span className="gradient-text text-shadow-glow">Electronics</span>{' '}
              Store
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-slate-400 mb-10 max-w-md leading-relaxed"
            >
              Experience the Future of Technology. Premium gadgets, unbeatable prices,
              delivered to your doorstep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products">
                <motion.button
                  className="btn-primary flex items-center gap-2 text-base px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  Shop Now
                  <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <motion.button
                className="btn-outline text-base px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Collection
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-8 mt-14"
            >
              {[
                { value: '50K+', label: 'Happy Customers' },
                { value: '1000+', label: 'Products' },
                { value: '4.9★', label: 'Avg Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold font-poppins gradient-text">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Floating Products */}
          <div className="relative flex items-center justify-center h-[500px]">
            {/* Central glow */}
            <div
              className="absolute w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(30px)' }}
            />

            {/* Floating Phone */}
            <motion.div
              className="absolute glass-card p-4 rounded-3xl shadow-glow-md z-20"
              style={{ left: '10%', top: '10%' }}
              animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.1, zIndex: 30 }}
            >
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80"
                alt="Phone"
                className="w-28 h-40 object-cover rounded-2xl"
              />
              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">iPhone 15 Pro</p>
                <p className="text-xs gradient-text font-bold">₹1,34,900</p>
              </div>
            </motion.div>

            {/* Floating Laptop */}
            <motion.div
              className="absolute glass-card p-4 rounded-3xl shadow-glow-purple z-10"
              style={{ right: '5%', top: '25%' }}
              animate={{ y: [0, -15, 0], rotate: [3, -3, 3] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              whileHover={{ scale: 1.1, zIndex: 30 }}
            >
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80"
                alt="Laptop"
                className="w-36 h-28 object-cover rounded-2xl"
              />
              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">MacBook Pro</p>
                <p className="text-xs gradient-text font-bold">₹2,49,900</p>
              </div>
            </motion.div>

            {/* Floating Headphones */}
            <motion.div
              className="absolute glass-card p-4 rounded-3xl z-30"
              style={{ left: '25%', bottom: '10%' }}
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              whileHover={{ scale: 1.1, zIndex: 40 }}
            >
              <img
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80"
                alt="Headphones"
                className="w-24 h-24 object-cover rounded-2xl"
              />
              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">Sony XM5</p>
                <p className="text-xs gradient-text font-bold">₹29,990</p>
              </div>
            </motion.div>

            {/* Orbiting ring */}
            <motion.div
              className="absolute w-72 h-72 rounded-full border border-primary-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary-400 shadow-glow-sm" />
            </motion.div>
            <motion.div
              className="absolute w-40 h-40 rounded-full border border-accent-500/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-400 shadow-glow-purple" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-slate-600">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary-500 to-transparent" />
        </motion.div>
      </section>

      {/* ======== CATEGORIES SECTION ======== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge mb-4 inline-flex">Browse by Category</span>
          <h2 className="section-title">
            Shop by <span className="gradient-text">Category</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/products?category=${cat.name}`}>
                <motion.div
                  className={`glass-card p-6 text-center cursor-pointer border ${cat.border} bg-gradient-to-br ${cat.color} group`}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  style={{ boxShadow: 'none' }}
                  whileHover={{ scale: 1.07, y: -6, boxShadow: `0 10px 40px ${cat.glow}` }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border}`}>
                      <cat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                    {cat.name}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======== FEATURED PRODUCTS ======== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <span className="badge mb-3 inline-flex">Best Sellers</span>
            <h2 className="section-title">
              Featured <span className="gradient-text">Products</span>
            </h2>
          </div>
          <Link to="/products" className="btn-outline text-sm hidden sm:flex items-center gap-2">
            View All <FiArrowRight />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link to="/products" className="btn-outline inline-flex items-center gap-2">
            View All Products <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ======== BANNER / PROMO ======== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(124,58,237,0.3) 50%, rgba(59,130,246,0.2) 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2), transparent 70%)' }}
          />
          <FiStar className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h2 className="text-4xl font-black font-poppins gradient-text mb-4">Special Offers Await</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Get up to 40% off on top brands. Limited time offers on the latest gadgets.
          </p>
          <Link to="/products">
            <motion.button
              className="btn-primary text-lg px-10 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Deals
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </motion.div>
  )
}
