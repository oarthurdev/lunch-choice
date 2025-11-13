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
      <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Escolha seu Almoço</h1>
          <p className="text-gray-600">Selecione uma opção de cada categoria para montar seu prato</p>
        </div>

        {!canMakeOrder && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-md">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong className="font-bold">Passou do horário de solicitação do almoço!</strong>
              <p className="text-sm mt-1">Pedidos devem ser feitos até 10h.</p>
            </div>
          </div>
        )}

        {myOrder ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Seu Pedido de Hoje</h3>
                <p className="text-xl font-semibold text-green-700 mb-1">{myOrder.dishName}</p>
                <p className="text-sm text-gray-600">Pedido realizado às {new Date(myOrder.createdAt).toLocaleTimeString('pt-BR')}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {canMakeOrder && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 text-blue-800 px-6 py-4 rounded-xl mb-8 flex items-start gap-3 shadow-md">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">Você ainda não fez seu pedido de hoje. Escolha uma opção de cada categoria abaixo!</p>
              </div>
            )}

            {dishes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Nenhum prato disponível para hoje</h3>
                <p className="mt-2 text-sm text-gray-500">Entre em contato com o RH para mais informações.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {categories.map((category) => {
                  const categoryDishes = dishesByCategory[category]
                  if (categoryDishes.length === 0) return null

                  const categoryColors = {
                    'Carnes': 'from-red-500 to-red-600',
                    'Acompanhamentos': 'from-yellow-500 to-orange-500',
                    'Saladas': 'from-green-500 to-green-600',
                    'Bebidas': 'from-blue-500 to-blue-600'
                  }

                  return (
                    <div key={category} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                      <div className={`inline-block bg-gradient-to-r ${categoryColors[category]} text-white px-6 py-2 rounded-full mb-6 shadow-md`}>
                        <h2 className="text-2xl font-bold">{category}</h2>
                      </div>
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
                  <div className="flex justify-center mt-10 pb-6">
                    <button
                      onClick={handleOrder}
                      disabled={!selectedDish}
                      className={`px-12 py-4 rounded-2xl text-white font-bold text-xl shadow-2xl transform transition-all duration-200 ${
                        selectedDish
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {selectedDish ? (
                        <span className="flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Confirmar Pedido
                        </span>
                      ) : (
                        'Selecione uma opção'
                      )}
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
