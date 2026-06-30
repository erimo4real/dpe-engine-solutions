const API_URL = import.meta.env.VITE_API_URL || ''

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const config = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...options.headers },
    ...options,
  }
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }
  if (config.body instanceof FormData) {
    delete config.headers['Content-Type']
  }
  const res = await fetch(url, config)
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}
  if (!res.ok) {
    if (res.status === 401 && !endpoint.includes('/auth/login')) {
      window.location.href = '/admin/login'
    }
    throw new Error(data.error || 'Request failed')
  }
  return data
}

export const api = {
  auth: {
    login: (body) => request('/api/auth/login', { method: 'POST', body }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    me: () => request('/api/auth/me'),
    changePassword: (body) => request('/api/auth/password', { method: 'PUT', body }),
    forgotPassword: (body) => request('/api/auth/forgot-password', { method: 'POST', body }),
    resetPassword: (body) => request('/api/auth/reset-password', { method: 'POST', body }),
  },
  products: {
    list: (category) => request(`/api/products${category ? `?category=${category}` : ''}`),
    search: (q) => request(`/api/products?search=${encodeURIComponent(q)}`),
    get: (id) => request(`/api/products/${id}`),
    create: (body) => request('/api/products', { method: 'POST', body }),
    update: (id, body) => request(`/api/products/${id}`, { method: 'PUT', body }),
    delete: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => request('/api/categories'),
    create: (body) => request('/api/categories', { method: 'POST', body }),
    update: (id, body) => request(`/api/categories/${id}`, { method: 'PUT', body }),
    delete: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),
  },
  inquiries: {
    submit: (body) => request('/api/inquiries', { method: 'POST', body }),
    list: () => request('/api/inquiries'),
    update: (id, body) => request(`/api/inquiries/${id}`, { method: 'PUT', body }),
    delete: (id) => request(`/api/inquiries/${id}`, { method: 'DELETE' }),
  },
  users: {
    list: () => request('/api/auth/users'),
    get: (id) => request(`/api/auth/users/${id}`),
    create: (body) => request('/api/auth/users', { method: 'POST', body }),
    update: (id, body) => request(`/api/auth/users/${id}`, { method: 'PUT', body }),
    delete: (id) => request(`/api/auth/users/${id}`, { method: 'DELETE' }),
    updateProfile: (body) => request('/api/auth/profile', { method: 'PUT', body }),
  },
  chat: {
    send: (message) => request('/api/chat', { method: 'POST', body: { message } }),
  },
  settings: {
    get: () => request('/api/settings'),
    update: (body) => request('/api/settings', { method: 'PUT', body }),
  },
  upload: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return request('/api/upload', { method: 'POST', body: formData })
  },
}
