import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getDishesToday, getMyOrder, canOrder, createOrder } from '../../services/api'

const EmployeeDashboard = () => {
  const [dishes, setDishes] = useState([])
  const [myOrder, setMyOrder] = useState(null)
  const [canMakeOrder, setCanMakeOrder] = useState(true)
  const [message, setMessage] = useState('')

  const navItems = [
    { path: '/funcionario', label: 'Meu Pedido' },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dishesData, orderStatus] = await Promise.all([
        getDishesToday(),
        canOrder()
      ])
      setDishes(dishesData)
      setCanMakeOrder(orderStatus.canOrder)
      setMessage(orderStatus.message)

      try {
        const orderData = await getMyOrder()
        setMyOrder(orderData)
      } catch (error) {
        setMyOrder(null)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleOrder = async (dishId) => {
    if (!canMakeOrder) {
      alert('Passou do horário de solicitação do almoço!')
      return
    }

    try {
      await createOrder(dishId)
      loadData()
      alert('Pedido realizado com sucesso!')
    } catch (error) {
      alert('Erro ao fazer pedido. Você pode já ter feito um pedido hoje.')
    }
  }

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Escolha seu Almoço</h1>

        {!canMakeOrder && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Passou do horário de solicitação do almoço!</strong>
            <p className="text-sm">Pedidos devem ser feitos até 10h.</p>
          </div>
        )}

        {myOrder ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <h3 className="text-lg font-medium">Seu Pedido de Hoje</h3>
            <p className="text-lg font-bold">{myOrder.dishName}</p>
            <p className="text-sm">Pedido realizado às {new Date(myOrder.createdAt).toLocaleTimeString('pt-BR')}</p>
          </div>
        ) : (
          <>
            {canMakeOrder && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                <p>Você ainda não fez seu pedido de hoje. Escolha um prato abaixo!</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish) => (
                <div key={dish.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900">{dish.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{dish.description}</p>
                    {canMakeOrder && (
                      <button
                        onClick={() => handleOrder(dish.id)}
                        className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                      >
                        Escolher este prato
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {dishes.length === 0 && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p>Nenhum prato disponível para hoje.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default EmployeeDashboard
