import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchProducts = createAsyncThunk('products/fetch', async (category, { rejectWithValue }) => {
  try {
    const data = await api.products.list(category)
    return data.products
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createProduct = createAsyncThunk('products/create', async (body, { rejectWithValue }) => {
  try {
    const data = await api.products.create(body)
    return data.product
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const data = await api.products.update(id, body)
    return data.product
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.products.delete(id)
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, saving: false, deleting: null, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createProduct.pending, (state) => { state.saving = true })
      .addCase(createProduct.fulfilled, (state, action) => { state.saving = false; state.items.push(action.payload) })
      .addCase(createProduct.rejected, (state) => { state.saving = false })
      .addCase(updateProduct.pending, (state) => { state.saving = true })
      .addCase(updateProduct.fulfilled, (state, action) => { state.saving = false; const idx = state.items.findIndex((p) => p.id === action.payload.id); if (idx >= 0) state.items[idx] = action.payload })
      .addCase(updateProduct.rejected, (state) => { state.saving = false })
      .addCase(deleteProduct.pending, (state, action) => { state.deleting = action.meta.arg })
      .addCase(deleteProduct.fulfilled, (state, action) => { state.deleting = null; state.items = state.items.filter((p) => p.id !== action.payload) })
      .addCase(deleteProduct.rejected, (state) => { state.deleting = null })
  },
})

export default productsSlice.reducer
