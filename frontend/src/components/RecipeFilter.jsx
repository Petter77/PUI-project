const RecipeFilter = ({ setButtonClicked, title }) => {
  const categories = [
    "Low Carb",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Desserts",
    "Dietary Restrictions",
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 relative mb-20">
      <h1 className="text-2xl font-extrabold text-left text-black">{title}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setButtonClicked(category)}
            className="bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-blue-600 shadow-sm transition duration-300 text-sm w-auto"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipeFilter;

