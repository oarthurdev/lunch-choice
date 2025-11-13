const DishCard = ({ dish, isSelected, onSelect, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onSelect(dish.id)}
      className={`relative bg-white border-4 rounded-3xl p-3 transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 shadow-xl ring-4 ring-blue-300 scale-105' 
          : 'border-gray-800 shadow-md'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl hover:scale-105'}`}
    >
      <div className="flex flex-col items-center">
        <div className="w-full aspect-square mb-3 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-gray-200">
          {dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-2">
              <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-bold text-gray-700 leading-tight">{dish.name}</span>
            </div>
          )}
        </div>

        {dish.imageUrl && (
          <div className="text-center mb-3 w-full px-1">
            <p className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">{dish.name}</p>
          </div>
        )}

        <div
          className={`w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all ${
            isSelected 
              ? 'bg-blue-500 border-blue-600 shadow-lg' 
              : 'bg-white border-gray-800'
          }`}
        >
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

export default DishCard
