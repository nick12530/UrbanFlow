import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Transport from './pages/Transport'
import Food from './pages/Food'
import Navbar from './components/Navbar'
import Success from './pages/Success'


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/food" element={<Food />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  )
}

export default App