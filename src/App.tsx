import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Home from './app/page'
import LoginPage from './app/login/page'

function App() {
  const { isSignedIn, isLoaded } = useAuth()

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            isSignedIn ? <Navigate to="/" replace /> : <LoginPage />
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
