import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import productsReducer from '../features/products/productsSlice'
import categoriesReducer from '../features/categories/categoriesSlice'
import inquiriesReducer from '../features/inquiries/inquiriesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    categories: categoriesReducer,
    inquiries: inquiriesReducer,
  },
})
