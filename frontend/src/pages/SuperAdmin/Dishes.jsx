import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getDishes, createDish, getTenants } from '../../services/api'

const SuperAdminDishes = () => {
  const [dishes, setDishes] = useState([])
  const [tenants, setTenants] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    category: 'Carnes',
    imageUrl: '',
    availableDate: '', 
    tenantId: '' 
  })

  const categories = ['Carnes', 'Acompanhamentos', 'Saladas', 'Bebidas']

  const navItems = [
    { path: '/super-admin', label: 'Dashboard' },
    { path: '/super-admin/empresas', label: 'Empresas' },
    { path: '/super-admin/pratos', label: 'Pratos do Dia' },
    { path: '/super-admin/relatorios', label: 'Relatórios' },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dishesData, tenantsData] = await Promise.all([getDishes(), getTenants()])
      setDishes(dishesData)
      setTenants(tenantsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        availableDate: new Date(formData.availableDate).toISOString(),
        tenantId: formData.tenantId || null
      }
      await createDish(data)
      loadData()
      setShowModal(false)
      setFormData({ name: '', description: '', category: 'Carnes', imageUrl: '', availableDate: '', tenantId: '' })
    } catch (error) {
      alert('Erro ao salvar prato')
    }
  }

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pratos do Dia</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            + Novo Prato
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {dishes.map((dish) => (
              <li key={dish.id} className="px-4 py-4 sm:px-6 flex gap-4">
                {dish.imageUrl && (
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900">{dish.name}</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {dish.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{dish.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Data: {new Date(dish.availableDate).toLocaleDateString('pt-BR')} | 
                    {dish.tenantName === 'Global' ? ' Disponível para todas empresas' : ` ${dish.tenantName}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
              <div className="inline-block bg-white rounded-lg p-6 max-w-lg w-full">
                <h3 className="text-lg font-medium mb-4">Novo Prato</h3>
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
                    <label className="block text-sm font-medium">Descrição</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Categoria</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">URL da Imagem (opcional)</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Data Disponível</label>
                    <input
                      type="date"
                      required
                      value={formData.availableDate}
                      onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Empresa (deixe em branco para global)</label>
                    <select
                      value={formData.tenantId}
                      onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    >
                      <option value="">Global</option>
                      {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                      ))}
                    </select>
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
                      Salvar
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

export default SuperAdminDishes
