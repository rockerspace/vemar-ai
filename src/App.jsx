import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Detect from './pages/Detect'
import Behavioral from './pages/Behavioral'
import Identity from './pages/Identity'
import Chat from './pages/Chat'
import Market from './pages/Market'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import ApiDocs from './pages/ApiDocs'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main id="main-content" tabIndex={-1} role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/behavioral" element={<Behavioral />} />
          <Route path="/identity" element={<Identity />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/market" element={<Market />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/api-docs" element={<ApiDocs />} />
        </Routes>
      </main>
    </>
  )
}
