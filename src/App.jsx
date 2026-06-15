import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import Home from './pages/Home'
import Products from './pages/Products'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}
