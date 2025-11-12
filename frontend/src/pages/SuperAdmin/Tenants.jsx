import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getTenants, createTenant, updateTenant, deleteTenant } from '../../services/api'

const SuperAdminTenants = () => {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [formData, setFormData] = useState({ name: '', cnpj: '' })

  const navItems = [
    { path: '/super-admin', label: 'Dashboard' },
    { path: '/super-admin/empresas', label: 'Empresas' },
    { path: '/super-admin/pratos', label: 'Pratos do Dia' },
    { path: '/super-admin/relatorios', label: 'Relatórios' },
  ]

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      const data = await getTenants()
      setTenants(data)
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTenant) {
        await updateTenant(editingTenant.id, { ...formData, isActive: editingTenant.isActive })
      } else {
        await createTenant(formData)
      }
      loadTenants()
      setShowModal(false)
      setFormData({ name: '', cnpj: '' })
      setEditingTenant(null)
    } catch (error) {
      alert('Erro ao salvar empresa')
    }
  }

  const handleEdit = (tenant) => {
    setEditingTenant(tenant)
    setFormData({ name: tenant.name, cnpj: tenant.cnpj })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta empresa?')) {
      try {
        await deleteTenant(id)
        loadTenants()
      } catch (error) {
        alert('Erro ao excluir empresa')
      }
    }
  }

  if (loading) {
    return <Layout navItems={navItems}><div>Carregando...</div></Layout>
  }

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            + Nova Empresa
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <li key={tenant.id}>
                <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{tenant.name}</h3>
                    <p className="text-sm text-gray-500">CNPJ: {tenant.cnpj}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className={tenant.isActive ? 'text-green-600' : 'text-red-600'}>
                        {tenant.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(tenant)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(tenant.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingTenant ? 'Editar Empresa' : 'Nova Empresa'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                    <input
                      type="text"
                      required
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => { setShowModal(false); setEditingTenant(null); setFormData({ name: '', cnpj: '' }); }}
                      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                    >
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

export default SuperAdminTenants
