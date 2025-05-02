const RecipeFilter = ({ setButtonClicked, title }) => {
    const handleButtonClick = (category) => {
      setButtonClicked(category);
    };
  
    return (
      <div className="px-4 mb-20">
        <h1 className="text-2xl font-extrabold text-left text-black">{title}</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-6">
          <button
            onClick={() => handleButtonClick("Low Carb")}
            className="bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-blue-600 shadow-sm transition duration-300 text-sm w-auto"
          >
            Low Carb
          </button>
          <button
            onClick={() => handleButtonClick("Vegetarian")}
            className="bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-blue-600 shadow-sm transition duration-300 text-sm w-auto"
          >
            Vegetarian
          </button>
          <button
            onClick={() => handleButtonClick("Vegan")}
            className="bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-blue-600 shadow-sm transition duration-300 text-sm w-auto"
          >
            Vegan
          </button>
          <button
            onClick={() => handleButtonClick("Gluten-Free")}
            className="bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-blue-600 shadow-sm transition duration-300 text-sm w-auto"
          >
            Gluten-Free
          </button>
          <button
            onClick={() => handleButtonClick("Desserts")}
            className="bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-blue-600 shadow-sm transition duration-300 text-sm w-auto"
          >
            Desserts
          </button>
          <button
            onClick={() => handleButtonClick("Dietary Restrictions")}
            className="bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-blue-600 shadow-sm transition duration-300 text-sm w-auto"
          >
            Dietary Restrictions
          </button>
        </div>
      </div>
    );
};
  
export default RecipeFilter;