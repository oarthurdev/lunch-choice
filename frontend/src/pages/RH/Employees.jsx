import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getUsers, createUser } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const RHEmployees = () => {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const navItems = [
    { path: '/rh', label: 'Dashboard' },
    { path: '/rh/funcionarios', label: 'Funcionários' },
    { path: '/rh/pedidos', label: 'Pedidos' },
  ]

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const data = await getUsers()
      setEmployees(data.filter(u => u.role === 'Employee'))
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUser({
        ...formData,
        role: 2,
        tenantId: user.tenantId
      })
      loadEmployees()
      setShowModal(false)
      setFormData({ name: '', email: '', password: '' })
    } catch (error) {
      alert('Erro ao cadastrar funcionário')
    }
  }

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            + Novo Funcionário
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <li key={employee.id} className="px-4 py-4 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-500">{employee.email}</p>
                <p className="text-sm text-gray-500">
                  Status: <span className={employee.isActive ? 'text-green-600' : 'text-red-600'}>
                    {employee.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
              <div className="inline-block bg-white rounded-lg p-6 max-w-lg w-full">
                <h3 className="text-lg font-medium mb-4">Novo Funcionário</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Nome</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">E-mail</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Senha</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-200 px-4 py-2 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md">
                      Cadastrar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default RHEmployees
