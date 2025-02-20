import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './app/page'
import LoginPage from './app/login/page'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
