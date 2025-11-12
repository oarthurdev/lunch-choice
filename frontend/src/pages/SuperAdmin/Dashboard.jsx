import Layout from '../../components/Layout'

const SuperAdminDashboard = () => {
  const navItems = [
    { path: '/super-admin', label: 'Dashboard' },
    { path: '/super-admin/empresas', label: 'Empresas' },
    { path: '/super-admin/pratos', label: 'Pratos do Dia' },
    { path: '/super-admin/relatorios', label: 'Relatórios' },
  ]

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard - Super Admin</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-primary-500 rounded-md flex items-center justify-center text-white text-2xl">
                    🏢
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Empresas Cadastradas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Ver todas
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-green-500 rounded-md flex items-center justify-center text-white text-2xl">
                    🍽️
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pratos Cadastrados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Gerenciar pratos
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-purple-500 rounded-md flex items-center justify-center text-white text-2xl">
                    📊
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Relatórios
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Gerar relatórios
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Bem-vindo ao Sistema de Almoço Corporativo
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Como Super Admin, você tem acesso completo ao sistema.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-700">
              Utilize o menu acima para gerenciar empresas, pratos do dia e gerar relatórios.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SuperAdminDashboard
