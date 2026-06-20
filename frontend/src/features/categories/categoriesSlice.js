import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchCategories = createAsyncThunk('categories/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await api.categories.list()
    return data.categories
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createCategory = createAsyncThunk('categories/create', async (body, { rejectWithValue }) => {
  try {
    const data = await api.categories.create(body)
    return data.category
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateCategory = createAsyncThunk('categories/update', async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const data = await api.categories.update(id, body)
    return data.category
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try {
    await api.categories.delete(id)
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false, saving: false, deleting: null, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createCategory.pending, (state) => { state.saving = true })
      .addCase(createCategory.fulfilled, (state, action) => { state.saving = false; state.items.push(action.payload) })
      .addCase(createCategory.rejected, (state) => { state.saving = false })
      .addCase(updateCategory.pending, (state) => { state.saving = true })
      .addCase(updateCategory.fulfilled, (state, action) => { state.saving = false; const idx = state.items.findIndex((c) => c.id === action.payload.id); if (idx >= 0) state.items[idx] = action.payload })
      .addCase(updateCategory.rejected, (state) => { state.saving = false })
      .addCase(deleteCategory.pending, (state, action) => { state.deleting = action.meta.arg })
      .addCase(deleteCategory.fulfilled, (state, action) => { state.deleting = null; state.items = state.items.filter((c) => c.id !== action.payload) })
      .addCase(deleteCategory.rejected, (state) => { state.deleting = null })
  },
})

export default categoriesSlice.reducer
