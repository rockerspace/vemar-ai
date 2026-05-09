import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Detect from './pages/Detect'
import Behavioral from './pages/Behavioral'
import Identity from './pages/Identity'
import Chat from './Chat'
import Market from './pages/Market'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from './pages/Auth';


function PrivateRoute({ children }) {
  return getUser() ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    
      <><Navbar /><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/behavioral" element={<Behavioral />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/market" element={<Market />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth" element={<Auth />} />
        {/* catch-all: redirect unknown paths to home */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes></>
    
  )
}
