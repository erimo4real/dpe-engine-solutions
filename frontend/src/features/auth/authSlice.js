import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await api.auth.login(credentials)
    return data
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.auth.logout()
})

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const data = await api.auth.me()
    return data
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, checking: true },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.checking = false; state.user = action.payload.user })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.checking = false })
      .addCase(logout.rejected, (state) => { state.user = null; state.checking = false })
      .addCase(checkAuth.pending, (state) => { state.checking = true })
      .addCase(checkAuth.fulfilled, (state, action) => { state.user = action.payload.user; state.checking = false })
      .addCase(checkAuth.rejected, (state) => { state.user = null; state.checking = false })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
