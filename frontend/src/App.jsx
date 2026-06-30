import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import ChatWidget from './components/ChatWidget'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminCategories from './pages/AdminCategories'
import AdminInquiries from './pages/AdminInquiries'
import AdminUsers from './pages/AdminUsers'
import AdminProfile from './pages/AdminProfile'
import AdminSettings from './pages/AdminSettings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-[var(--color-primary)]">404</h1>
        <p className="mb-6 text-lg text-[#525f7f]">Page not found</p>
        <Link to="/" className="inline-block rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)]">Go Home</Link>
      </div>
    </div>
  )
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <WhatsAppFab />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  )
}
