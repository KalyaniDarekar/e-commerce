import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2,
  FiAlertTriangle, FiCheck, FiX, FiFilter
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/api'

const FILTER_OPTIONS = ['All', 'In Stock', 'Out of Stock', 'On Sale']

export default function AdminProducts({ products, setProducts, setActiveTab, setEditingProduct }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'All' ? true :
      filter === 'In Stock' ? (!p.outOfStock && p.stock > 0) :
      filter === 'Out of Stock' ? p.outOfStock :
      filter === 'On Sale' ? p.onSale : true
    return matchSearch && matchFilter
  })

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setDeleteConfirm(null)
      toast.success(`"${name}" deleted`)
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setActiveTab('add-product')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black font-poppins gradient-text">Products</h1>
          <p className="text-slate-400 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <motion.button
          onClick={() => { setEditingProduct(null); setActiveTab('add-product') }}
          className="btn-primary flex items-center gap-2 py-2.5 px-5"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          <FiPlus className="w-4 h-4" /> Add Product
        </motion.button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass pl-9 py-2.5 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter className="text-slate-500 w-4 h-4" />
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-primary-600/30 text-primary-400 border border-primary-500/40'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10">
                {['Product', 'Category', 'Original Price', 'Sale Price', 'Stock', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                    className="group hover:bg-white/4 transition-colors"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-dark-600 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.brand}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="badge text-xs">{p.category}</span>
                    </td>

                    {/* Original Price */}
                    <td className="px-5 py-4">
                      <span className={`text-sm ${p.onSale ? 'line-through text-slate-500' : 'text-white font-semibold'}`}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Sale Price */}
                    <td className="px-5 py-4">
                      {p.onSale ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-emerald-400">
                            ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 px-1.5 py-0.5 rounded-md">
                            {p.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      {p.outOfStock ? (
                        <span className="text-xs font-semibold text-red-400 bg-red-400/10 px-2 py-1 rounded-full">Out of Stock</span>
                      ) : p.stock < 5 ? (
                        <div className="flex items-center gap-1.5">
                          <FiAlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-semibold text-amber-400">{p.stock} left</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                          {p.stock} in stock
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleEdit(p)}
                          className="p-2 rounded-xl text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 transition-all"
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => setDeleteConfirm(p)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <FiSearch className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No products match your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="glass-card p-8 w-full max-w-sm text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-poppins mb-2">Delete Product?</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to delete <span className="text-white font-semibold">"{deleteConfirm.name}"</span>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1 py-2.5 flex items-center justify-center gap-2">
                  <FiX className="w-4 h-4" /> Cancel
                </button>
                <motion.button
                  onClick={() => handleDelete(deleteConfirm._id, deleteConfirm.name)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  <FiCheck className="w-4 h-4" /> Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
