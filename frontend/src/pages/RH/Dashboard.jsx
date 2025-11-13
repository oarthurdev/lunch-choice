import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import DishCard from '../../components/DishCard'
import { getDishesToday } from '../../services/api'

const RHDashboard = () => {
  const [dishes, setDishes] = useState([])
  const categories = ['Carnes', 'Acompanhamentos', 'Saladas', 'Bebidas']

  const navItems = [
    { path: '/rh', label: 'Dashboard' },
    { path: '/rh/funcionarios', label: 'Funcionários' },
    { path: '/rh/pedidos', label: 'Pedidos' },
  ]

  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = async () => {
    try {
      const dishesData = await getDishesToday()
      setDishes(dishesData)
    } catch (error) {
      console.error('Erro ao carregar pratos:', error)
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cardápio de Hoje</h1>
          <p className="text-gray-600">Visualize os pratos disponíveis para os funcionários</p>
        </div>

        {dishes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Nenhum prato disponível para hoje</h3>
            <p className="mt-2 text-sm text-gray-500">Entre em contato com o administrador para cadastrar pratos.</p>
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
                        isSelected={false}
                        onSelect={() => {}}
                        disabled={true}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default RHDashboard
