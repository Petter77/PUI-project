import { useState, useEffect } from "react";
import RecipeModal from "./RecipeModal";

function RecipeCard({ recipe, source = "api", onDelete }) {
  const [isCardClicked, setIsCardClicked] = useState(false);

  const closeModal = () => {
    setIsCardClicked(false);
  };

  useEffect(() => {
    document.body.style.overflow = isCardClicked ? "hidden" : "auto";
  }, [isCardClicked]);

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // zapobiega otwarciu modala
    if (onDelete) {
      onDelete(recipe.ApiRecipeID);
    }
  };

  return (
    <>
      <div
        key={recipe.id || recipe.ApiRecipeID}
        className="keen-slider__slide flex justify-center cursor-pointer relative"
        onClick={() => setIsCardClicked(true)}
      >
        {source === "saved" && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 left-2 z-10 bg-white rounded-full p-1 shadow hover:bg-red-100"
            aria-label="Usuń przepis"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="w-full max-w-[14rem] sm:max-w-[15rem] md:max-w-[16rem] h-[14rem] sm:h-[16rem] md:h-[18rem] bg-white rounded-xl shadow-md flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-32 object-cover rounded-md mb-2"
          />
          <h2 className="text-lg font-bold text-black text-left px-2 py-1 mb-2 line-clamp-2">
            {recipe.title}
          </h2>
        </div>
      </div>

      {isCardClicked && (
        <RecipeModal
          recipeID={recipe.id || recipe.ApiRecipeID}
          closeModal={closeModal}
          source={source}
          savedRecipe={source === "saved" ? recipe : null}
        />
      )}
    </>
  );
}

export default RecipeCard;
