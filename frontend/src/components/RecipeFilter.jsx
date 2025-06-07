 const RecipeFilter = ({ setButtonClicked, title, activeFilter }) => {
  const handleButtonClick = (category) => {
   setButtonClicked(category);
  };

  const categories = [
   "Low Carb",
   "Vegetarian",
   "Vegan",
   "Gluten-Free",
   "Desserts",
  ];

  return (
   <div className="px-4 mb-20">
    <h1 className="text-2xl font-extrabold text-left text-black">{title}</h1>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-6">
     {categories.map((category) => (
      <button
       key={category}
       onClick={() => handleButtonClick(category)}
       className={`py-1 px-2 rounded-full shadow-sm transition duration-300 text-sm w-auto
                      ${activeFilter === category
         ? "bg-green-600 text-white"
         : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
       {category}
      </button>
     ))}
    </div>
   </div>
  );
 };

 export default RecipeFilter;