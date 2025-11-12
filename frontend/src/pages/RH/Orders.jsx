import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getOrders, getDailyReport } from '../../services/api'

const RHOrders = () => {
  const [orders, setOrders] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const navItems = [
    { path: '/rh', label: 'Dashboard' },
    { path: '/rh/funcionarios', label: 'Funcionários' },
    { path: '/rh/pedidos', label: 'Pedidos' },
  ]

  useEffect(() => {
    loadOrders()
  }, [selectedDate])

  const loadOrders = async () => {
    try {
      const data = await getOrders(new Date(selectedDate))
      setOrders(data)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    }
  }

  const handleDownloadReport = async () => {
    try {
      const blob = await getDailyReport(new Date(selectedDate))
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Pedidos_${selectedDate}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Erro ao gerar relatório')
    }
  }

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pedidos de Almoço</h1>

        <div className="bg-white shadow sm:rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            <button
              onClick={handleDownloadReport}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Baixar PDF
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-3 bg-gray-50">
            <h3 className="text-lg font-medium">Total de Pedidos: {orders.length}</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="px-4 py-4 sm:px-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{order.userName}</h3>
                    <p className="text-sm text-gray-600">{order.dishName}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default RHOrders
