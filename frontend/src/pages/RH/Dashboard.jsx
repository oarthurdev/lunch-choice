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
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pratos Disponíveis Hoje</h1>

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
