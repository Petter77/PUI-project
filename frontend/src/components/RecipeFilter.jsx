import React from 'react';

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
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-6">
        {title}
      </h1>

      {/* KLUCZOWA ZMIANA TUTAJ: Zwiększono gap i dodano padding pionowy */}
      {/* Dodano `py-2` do tego div-a, aby dać przestrzeń na powiększenie */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 overflow-x-auto px-2 py-3 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleButtonClick(category)}
            className={`
              relative flex items-center justify-center
              py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out
              text-sm font-semibold whitespace-nowrap
              h-10 w-auto min-w-[8rem] max-w-[10rem]
              transform hover:-translate-y-0.5 hover:scale-105 /* Zmniejszono translate-y, aby mniej "wyskakiwało" */
              focus:outline-none focus:ring-4 focus:ring-opacity-75
              
              ${activeFilter === category
                ? "bg-gradient-to-br from-green-500 to-green-700 text-white shadow-green-500/50 focus:ring-green-300"
                : "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-400/50 hover:from-blue-500 hover:to-blue-700 focus:ring-blue-300"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipeFilter;