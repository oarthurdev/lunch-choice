import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth()

  console.log('PrivateRoute - User:', user)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default PrivateRoute
