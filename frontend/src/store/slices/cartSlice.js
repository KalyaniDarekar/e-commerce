import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existing = state.items.find((i) => i._id === item._id)
      if (existing) {
        existing.quantity += item.quantity || 1
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 })
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find((i) => i._id === id)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== id)
        }
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.quantity, 0)

export default cartSlice.reducer
