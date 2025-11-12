import Layout from '../../components/Layout'

const RHDashboard = () => {
  const navItems = [
    { path: '/rh', label: 'Dashboard' },
    { path: '/rh/funcionarios', label: 'Funcionários' },
    { path: '/rh/pedidos', label: 'Pedidos' },
  ]

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard - RH</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Bem-vindo ao Sistema de RH</h3>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie funcionários e visualize pedidos de almoço da sua empresa.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default RHDashboard
