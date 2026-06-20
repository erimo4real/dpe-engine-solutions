import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchInquiries = createAsyncThunk('inquiries/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await api.inquiries.list()
    return data.inquiries
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateInquiryStatus = createAsyncThunk('inquiries/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const data = await api.inquiries.update(id, { status })
    return data.inquiry
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteInquiry = createAsyncThunk('inquiries/delete', async (id, { rejectWithValue }) => {
  try {
    await api.inquiries.delete(id)
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchInquiries.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchInquiries.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload)
      })
  },
})

export default inquiriesSlice.reducer
