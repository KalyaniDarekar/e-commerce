import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import themeReducer from './slices/themeSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  theme: themeReducer,
})

const persistConfig = {
  key: 'electrostore',
  storage,
  whitelist: ['auth', 'cart', 'theme'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store)
