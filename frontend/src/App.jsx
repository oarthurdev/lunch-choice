import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard'
import SuperAdminTenants from './pages/SuperAdmin/Tenants'
import SuperAdminDishes from './pages/SuperAdmin/Dishes'
import SuperAdminReports from './pages/SuperAdmin/Reports'
import RHDashboard from './pages/RH/Dashboard'
import RHEmployees from './pages/RH/Employees'
import RHOrders from './pages/RH/Orders'
import EmployeeDashboard from './pages/Employee/Dashboard'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          
          <Route path="/super-admin" element={<PrivateRoute allowedRoles={['SuperAdmin']} />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="empresas" element={<SuperAdminTenants />} />
            <Route path="pratos" element={<SuperAdminDishes />} />
            <Route path="relatorios" element={<SuperAdminReports />} />
          </Route>
          
          <Route path="/rh" element={<PrivateRoute allowedRoles={['HR']} />}>
            <Route index element={<RHDashboard />} />
            <Route path="funcionarios" element={<RHEmployees />} />
            <Route path="pedidos" element={<RHOrders />} />
          </Route>
          
          <Route path="/funcionario" element={<PrivateRoute allowedRoles={['Employee']} />}>
            <Route index element={<EmployeeDashboard />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
