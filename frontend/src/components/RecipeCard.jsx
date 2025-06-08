import React, { useState } from "react";
import { Heart, HeartOff, Trash2 } from "lucide-react"; // Importuj Trash2
import RecipeModal from "./RecipeModal";

const RecipeCard = ({ recipe, source, showDelete, onDelete, isFavoriteProp }) => {
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp !== undefined ? isFavoriteProp : (source === "saved" || source === "mealPlan"));

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Tutaj możesz wywołać funkcję z propsów, jeśli RecipeCard ma obsługiwać logikę ulubionych
    // np. onToggleFavorite(recipe.id, !isFavorite);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Zapobiega otwarciu modala po kliknięciu przycisku usuwania
    // Wywołaj funkcję onDelete bezpośrednio, bez alertu
    onDelete(recipe.ApiRecipeID || recipe.id); // Upewnij się, że przekazujesz odpowiednie ID
  };

  return (
    <>
      <div
        className="keen-slider__slide flex justify-center cursor-pointer relative p-2"
        onClick={openModal} // Otwórz modal po kliknięciu na kartę
      >
        <div className="w-full max-w-[15rem] h-[18rem] bg-white rounded-2xl shadow-lg flex flex-col items-center overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          {/* Obrazek przepisu */}
          <img
            src={recipe.image || "https://via.placeholder.com/150"} // Domyślny obrazek
            alt={recipe.title}
            className="w-full h-36 object-cover rounded-t-2xl"
          />

          {/* Tytuł przepisu */}
          <div className="flex flex-col flex-grow items-start justify-between p-3 w-full">
            <h3 className="text-lg font-semibold text-gray-800 text-left mb-2 line-clamp-2">
              {recipe.title}
            </h3>
          </div>
        </div>

        {/* Przyciski akcji (ulubione, usuń) - pozycjonowane absolutnie na karcie */}
        <div className="absolute top-4 right-4 flex gap-2">


          {/* Przycisk usuwania (jeśli showDelete jest true) */}
          {showDelete && (
            <button
              onClick={handleDeleteClick} // Wywołaj nową funkcję handleDeleteClick
              className="p-2 rounded-full bg-red-500 text-white shadow-md hover:cursor-pointer hover:bg-red-600 transition-colors duration-300"
            >
              <Trash2 size={20} /> {/* Ikona kosza */}
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <RecipeModal
          recipeID={recipe.ApiRecipeID || recipe.id} // Użyj ApiRecipeID dla zapisanych, id dla API
          closeModal={closeModal}
          source={source}
          savedRecipe={source === "saved" ? recipe : null} // Przekaż cały obiekt przepisu dla 'saved'
        />
      )}
    </>
  );
};

export default RecipeCard;