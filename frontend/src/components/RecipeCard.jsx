function RecipeCard({recipe}) {
    return ( 
           <div
            key={recipe.id}
            className="keen-slider__slide flex justify-center"
          >
            <div className="w-full max-w-[14rem] sm:max-w-[15rem] md:max-w-[16rem] h-[14rem] sm:h-[16rem] md:h-[18rem] bg-white rounded-xl shadow-md flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-bold text-black text-left px-2 py-1 mb-2 line-clamp-2">
                {recipe.title}
              </h2>
              <div className="flex justify-between w-full mt-auto">
                <p className="text-base text-gray-600 ml-2 mb-1">
                  Calories: {recipe.calories}
                </p>
                <p className="text-base text-gray-600 mr-2 mb-1 text-right">
                  Time: {recipe.readyInMinutes} minutes
                </p>
              </div>
            </div>
          </div>
     );
}

export default RecipeCard;