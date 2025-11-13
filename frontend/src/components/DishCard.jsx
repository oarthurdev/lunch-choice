const DishCard = ({ dish, isSelected, onSelect, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onSelect(dish.id)}
      className={`relative bg-white border-2 border-black rounded-3xl p-4 cursor-pointer transition-all ${
        isSelected ? 'ring-4 ring-blue-500' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
    >
      <div className="flex flex-col items-center">
        <div className="w-full h-32 mb-3 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          {dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-2">
              <span className="text-lg font-semibold text-gray-700">{dish.name}</span>
              {dish.description && (
                <span className="text-xs text-gray-500 mt-1">{dish.description}</span>
              )}
            </div>
          )}
        </div>

        {dish.imageUrl && (
          <div className="text-center mb-3 w-full">
            <p className="text-sm font-semibold text-gray-800">{dish.name}</p>
          </div>
        )}

        <div
          className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${
            isSelected ? 'bg-black' : 'bg-white'
          }`}
        >
          {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}
        </div>
      </div>
    </div>
  )
}

export default DishCard
