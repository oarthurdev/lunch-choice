import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getDishes, createDish, getTenants } from '../../services/api'

const SuperAdminDishes = () => {
  const [dishes, setDishes] = useState([])
  const [tenants, setTenants] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [filterCategory, setFilterCategory] = useState('Todos')
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    category: 'Carnes',
    imageUrl: '',
    availableDate: '', 
    tenantId: '' 
  })

  const categories = ['Carnes', 'Acompanhamentos', 'Saladas', 'Bebidas']
  const categoryColors = {
    'Carnes': 'bg-red-100 text-red-800 border-red-200',
    'Acompanhamentos': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Saladas': 'bg-green-100 text-green-800 border-green-200',
    'Bebidas': 'bg-blue-100 text-blue-800 border-blue-200'
  }

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

  const filteredDishes = filterCategory === 'Todos' 
    ? dishes 
    : dishes.filter(dish => dish.category === filterCategory)

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pratos do Dia</h1>
            <p className="text-gray-600 mt-1">Gerencie os pratos disponíveis no sistema</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Novo Prato
          </button>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory('Todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === 'Todos'
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Todos ({dishes.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {cat} ({dishes.filter(d => d.category === cat).length})
            </button>
          ))}
        </div>

        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum prato encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo prato.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <div key={dish.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                {dish.imageUrl ? (
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.name} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{dish.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${categoryColors[dish.category] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                      {dish.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dish.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(dish.availableDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {dish.tenantName === 'Global' ? 'Todas as empresas' : dish.tenantName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowModal(false)}></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full transform transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Novo Prato</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Prato</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="Ex: Frango Grelhado"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                      rows="3"
                      placeholder="Descreva o prato..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL da Imagem (opcional)</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data Disponível</label>
                      <input
                        type="date"
                        required
                        value={formData.availableDate}
                        onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa</label>
                      <select
                        value={formData.tenantId}
                        onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      >
                        <option value="">Global (Todas)</option>
                        {tenants.map((tenant) => (
                          <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                    >
                      Salvar Prato
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
