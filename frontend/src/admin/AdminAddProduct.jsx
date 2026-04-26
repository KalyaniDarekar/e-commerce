import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowLeft, FiCheck, FiUpload, FiX,
  FiDollarSign, FiTag, FiPackage, FiToggleLeft, FiToggleRight
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { CATEGORIES, EMPTY_FORM } from './mockData'

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 ${checked ? 'bg-gradient-to-r from-primary-600 to-accent-600' : 'bg-white/10'}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow-md"
      />
    </div>
    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
  </label>
)

export default function AdminAddProduct({ editingProduct, setEditingProduct, products, setProducts, setActiveTab }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const isEditing = !!editingProduct

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || '',
        brand: editingProduct.brand || '',
        description: editingProduct.description || '',
        category: editingProduct.category || 'Mobiles',
        price: editingProduct.price || '',
        discountPrice: editingProduct.discountPrice || '',
        stock: editingProduct.stock || '',
        onSale: editingProduct.onSale || false,
        outOfStock: editingProduct.outOfStock || false,
        discount: editingProduct.discount || 0,
        images: editingProduct.images || [],
      })
      setImagePreviews(editingProduct.images || [])
    } else {
      setForm(EMPTY_FORM)
      setImagePreviews([])
    }
  }, [editingProduct])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (i) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const calcDiscount = () => {
    if (form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price)) {
      return Math.round((1 - form.discountPrice / form.price) * 100)
    }
    return 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return toast.error('Product name and price are required')
    setLoading(true)

    const discountPct = calcDiscount()
    const newProduct = {
      ...form,
      price: Number(form.price),
      discountPrice: form.onSale && form.discountPrice ? Number(form.discountPrice) : Number(form.price),
      stock: Number(form.stock) || 0,
      discount: discountPct,
      rating: editingProduct?.rating || 4.5,
      numReviews: editingProduct?.numReviews || 0,
      images: imagePreviews.length ? imagePreviews : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80'],
    }

    try {
      if (isEditing) {
        const { data } = await api.put(`/products/${editingProduct._id}`, newProduct)
        setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? data : p)))
        toast.success('Product updated successfully!')
      } else {
        const { data } = await api.post('/products', newProduct)
        setProducts((prev) => [data, ...prev])
        toast.success('Product added successfully!')
      }

      setEditingProduct(null)
      setActiveTab('products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          onClick={() => { setEditingProduct(null); setActiveTab('products') }}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black font-poppins gradient-text">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {isEditing ? `Editing: ${editingProduct.name}` : 'Fill in the product details below'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white font-poppins mb-5 flex items-center gap-2">
                <FiTag className="text-primary-400" /> Basic Information
              </h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block font-medium">Product Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-glass w-full"
                      placeholder="e.g. iPhone 15 Pro"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block font-medium">Brand</label>
                    <input
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="input-glass w-full"
                      placeholder="e.g. Apple"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-glass w-full cursor-pointer"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-dark-800">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-glass w-full resize-none"
                    rows={4}
                    placeholder="Describe the product features, specifications..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white font-poppins mb-5 flex items-center gap-2">
                <FiDollarSign className="text-emerald-400" /> Pricing
              </h2>
              <div className="space-y-5">
                <Toggle
                  checked={form.onSale}
                  onChange={() => setForm({ ...form, onSale: !form.onSale })}
                  label="Mark as On Sale"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block font-medium">Original Price (₹) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="input-glass w-full"
                      placeholder="99999"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block font-medium">
                      Discount Price (₹)
                      {form.onSale && form.price && form.discountPrice && (
                        <span className="ml-2 text-emerald-400 font-bold">{calcDiscount()}% OFF</span>
                      )}
                    </label>
                    <input
                      type="number"
                      value={form.discountPrice}
                      onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                      className={`input-glass w-full ${!form.onSale ? 'opacity-50 pointer-events-none' : ''}`}
                      placeholder="89999"
                      disabled={!form.onSale}
                    />
                  </div>
                </div>

                {/* Price Preview */}
                <AnimatePresence>
                  {form.onSale && form.price && form.discountPrice && calcDiscount() > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-emerald-400/10 border border-emerald-400/20"
                    >
                      <p className="text-xs text-slate-400 mb-1">Price Preview</p>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-white">₹{Number(form.discountPrice).toLocaleString('en-IN')}</span>
                        <span className="text-sm line-through text-slate-500">₹{Number(form.price).toLocaleString('en-IN')}</span>
                        <span className="text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 px-2 py-0.5 rounded-lg">
                          {calcDiscount()}% OFF
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Stock */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white font-poppins mb-5 flex items-center gap-2">
                <FiPackage className="text-blue-400" /> Stock & Inventory
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className={`input-glass w-full sm:w-48 ${form.outOfStock ? 'opacity-50 pointer-events-none' : ''}`}
                    placeholder="50"
                    disabled={form.outOfStock}
                  />
                  {form.stock > 0 && form.stock < 5 && !form.outOfStock && (
                    <p className="text-xs text-amber-400 mt-1.5 flex items-center gap-1">⚠ Low stock warning will show for buyers</p>
                  )}
                </div>
                <Toggle
                  checked={form.outOfStock}
                  onChange={() => setForm({ ...form, outOfStock: !form.outOfStock })}
                  label="Mark as Out of Stock"
                />
              </div>
            </div>
          </div>

          {/* Right Column — Images */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-white font-poppins mb-5 flex items-center gap-2">
                <FiUpload className="text-accent-400" /> Product Images
              </h2>

              {/* Upload Zone */}
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-primary-500/50 hover:bg-primary-500/5 transition-all">
                  <FiUpload className="w-8 h-8 mx-auto mb-3 text-slate-500" />
                  <p className="text-sm text-slate-400">Click or drag images here</p>
                  <p className="text-xs text-slate-600 mt-1">PNG, JPG, WEBP up to 5MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Previews */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <AnimatePresence>
                  {imagePreviews.map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group rounded-xl overflow-hidden aspect-square bg-dark-600"
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded-md font-medium">Main</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  {isEditing ? 'Update Product' : 'Add Product'}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
