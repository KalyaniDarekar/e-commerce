import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return adminOnly ? <Navigate to="/admin/login" replace /> : <Navigate to="/login" replace />
  }
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute
