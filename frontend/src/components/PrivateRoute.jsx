import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Componente de rota protegida
 * @param {Array<number>} allowedRoles - array de roles permitidos (ex: [0, 1])
 */
const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth()

  // Enquanto carrega dados do usuário
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700 animate-pulse">Carregando...</div>
      </div>
    )
  }

  // Se não está logado → redireciona pro login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Se há restrição de roles e o usuário não tem permissão → bloqueia
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Aqui você pode redirecionar para uma página específica de "acesso negado"
    // ou simplesmente voltar pro login
    return <Navigate to="/login" replace />
  }

  // Caso contrário, permite o acesso
  return <Outlet />
}

export default PrivateRoute
