import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Detect from './pages/Detect'
import Behavioral from './pages/Behavioral'
import Identity from './pages/Identity'
import Chat from './Chat'
import Market from './pages/Market'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar'
import { getUser } from './pages/Auth'
 
function PrivateRoute({ children }) {
  return getUser() ? children : <Navigate to="/auth" replace />
}
 
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/detect" element={<PrivateRoute><Detect /></PrivateRoute>} />
        <Route path="/behavioral" element={<PrivateRoute><Behavioral /></PrivateRoute>} />
        <Route path="/identity" element={<PrivateRoute><Identity /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/market" element={<Market />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
 
