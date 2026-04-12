import { Routes, Route } from 'react-router-dom'
import Navbar     from './components/Navbar'
import Footer     from './components/Footer'
import Home       from './pages/Home'
import Results    from './pages/Results'
import HowItWorks from './pages/HowItWorks'

export default function App() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <div style={{ flex:1 }}>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/how"     element={<HowItWorks />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}