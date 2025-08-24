import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Transport from './pages/Transport'
import Food from './pages/Food'
import Navbar from './components/Navbar'
import Success from './pages/Success'
import Assistant from './pages/Assistant'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transport" element={<RequireAuth><Transport /></RequireAuth>} />
        <Route path="/food" element={<RequireAuth><Food /></RequireAuth>} />
        <Route path="/success" element={<Success />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/login" element={<Login />} />
        {/* Add a catch-all route for better UX */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App