import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
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
  { _id: '60d5ecb8b392d700153ee009', name: 'OnePlus 12R', brand: 'OnePlus', price: 39999, category: 'Mobiles', rating: 4.4, numReviews: 980, featured: false, discount: 12, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee010', name: 'Asus ROG Strix G16', brand: 'Asus', price: 169990, category: 'Laptops', rating: 4.6, numReviews: 215, featured: false, discount: 5, images: ['https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee011', name: 'Bose QuietComfort 45', brand: 'Bose', price: 31990, category: 'Audio', rating: 4.5, numReviews: 1450, featured: false, discount: 20, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'] },
  { _id: '60d5ecb8b392d700153ee012', name: 'Canon EOS R6 Mark II', brand: 'Canon', price: 239990, category: 'Cameras', rating: 4.8, numReviews: 185, featured: false, discount: 0, images: ['https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400&q=80'] },
]

const CATEGORIES = ['Mobiles', 'Laptops', 'Audio', 'Cameras', 'Tablets', 'Accessories']
const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '',
    minPrice: searchParams.get('minPrice') || 0,
    maxPrice: searchParams.get('maxPrice') || 300000,
    rating: searchParams.get('rating') || 0,
  })

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.search) params.set('search', filters.search)
        if (filters.category) params.set('category', filters.category)
        if (filters.sort) params.set('sort', filters.sort)
        if (filters.minPrice) params.set('minPrice', filters.minPrice)
        if (filters.maxPrice < 300000) params.set('maxPrice', filters.maxPrice)
        if (filters.rating > 0) params.set('rating', filters.rating)
        const { data } = await api.get(`/products?${params}`)
        if (data?.length) setProducts(data)
      } catch {
        // use mock data
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filters])

  // Client-side filtering on mock data
  const displayProducts = products.filter((p) => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.category && p.category !== filters.category) return false
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false
    if (filters.rating > 0 && p.rating < filters.rating) return false
    return true
  }).sort((a, b) => {
    if (filters.sort === 'price_asc') return a.price - b.price
    if (filters.sort === 'price_desc') return b.price - a.price
    if (filters.sort === 'rating') return b.rating - a.rating
    return 0
  })

  const clearFilters = () =>
    setFilters({ search: '', category: '', sort: '', minPrice: 0, maxPrice: 300000, rating: 0 })

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => setFilters((f) => ({ ...f, category: '' }))}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              !filters.category ? 'bg-primary-50 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters((f) => ({ ...f, category: cat }))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                filters.category === cat ? 'bg-primary-50 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
          Price Range <span className="text-primary-600 dark:text-primary-400">₹{Number(filters.maxPrice).toLocaleString('en-IN')}</span>
        </h3>
        <input
          type="range"
          min={0}
          max={300000}
          step={5000}
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>₹0</span><span>₹3,00,000</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Min Rating</h3>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, rating: r }))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                Number(filters.rating) === r ? 'bg-primary-50 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {r === 0 ? 'All Ratings' : `${r}★ & above`}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full btn-outline text-sm py-2"
      >
        Clear Filters
      </button>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black font-poppins gradient-text mb-2">All Products</h1>
        <p className="text-slate-400 text-sm">{displayProducts.length} products found</p>
      </motion.div>

      {/* Top Bar */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="input-glass pl-10 w-full"
          />
        </div>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="input-glass w-48 cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-white dark:bg-dark-800">
              {o.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-3 glass-card rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <FiFilter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Desktop */}
        <motion.aside
          className="hidden lg:block w-64 flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-6 font-poppins">Filters</h2>
            <Sidebar />
          </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              className="absolute left-0 top-0 bottom-0 w-72 glass-card rounded-none p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-slate-800 dark:text-white">Filters</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <FiX className="text-slate-400 w-5 h-5" />
                </button>
              </div>
              <Sidebar />
            </motion.div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card h-72 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No products found matching your filters.</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
