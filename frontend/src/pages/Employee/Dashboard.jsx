import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import DishCard from '../../components/DishCard'
import { getDishesToday, getMyOrder, canOrder, createOrder } from '../../services/api'

const EmployeeDashboard = () => {
  const [dishes, setDishes] = useState([])
  const [myOrder, setMyOrder] = useState(null)
  const [canMakeOrder, setCanMakeOrder] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedDish, setSelectedDish] = useState(null)

  const categories = ['Carnes', 'Acompanhamentos', 'Saladas', 'Bebidas']

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

  const handleOrder = async () => {
    if (!canMakeOrder) {
      alert('Passou do horário de solicitação do almoço!')
      return
    }

    if (!selectedDish) {
      alert('Por favor, selecione um prato!')
      return
    }

    try {
      await createOrder(selectedDish)
      loadData()
      setSelectedDish(null)
      alert('Pedido realizado com sucesso!')
    } catch (error) {
      alert('Erro ao fazer pedido. Você pode já ter feito um pedido hoje.')
    }
  }

  const dishesByCategory = categories.reduce((acc, category) => {
    acc[category] = dishes.filter(dish => dish.category === category)
    return acc
  }, {})

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
                <p>Você ainda não fez seu pedido de hoje. Escolha um item de cada categoria abaixo!</p>
              </div>
            )}

            {dishes.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p>Nenhum prato disponível para hoje.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => {
                  const categoryDishes = dishesByCategory[category]
                  if (categoryDishes.length === 0) return null

                  return (
                    <div key={category}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categoryDishes.map((dish) => (
                          <DishCard
                            key={dish.id}
                            dish={dish}
                            isSelected={selectedDish === dish.id}
                            onSelect={setSelectedDish}
                            disabled={!canMakeOrder}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}

                {canMakeOrder && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleOrder}
                      disabled={!selectedDish}
                      className={`px-8 py-3 rounded-lg text-white font-semibold text-lg ${
                        selectedDish
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Confirmar Pedido
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default EmployeeDashboard
