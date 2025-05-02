function RecipeModal({ recipe, closeModal }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
        <div className="relative bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
          
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 w-8 h-8 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
      
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
          
          <div className="text-sm text-gray-600 mb-4 flex flex-col sm:flex-row gap-4">
            <p><strong>Calories:</strong> {recipe.calories}</p>
            <p><strong>Time:</strong> {recipe.readyInMinutes} minutes</p>
          </div>
      
          <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
            <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      </div>
      
    );
  }
  
  export default RecipeModal;
  