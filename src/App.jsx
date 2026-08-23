import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AdminUsers from './pages/AdminUsers'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
    </Routes>
  )
}

export default App