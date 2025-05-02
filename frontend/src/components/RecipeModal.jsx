import { useState, useEffect } from "react";
import { Heart, HeartOff, X } from "lucide-react"; // Importujemy ikony

const RecipeModal = ({ recipe, closeModal }) => {
  const [isFavorite, setIsFavorite] = useState(false); // Stan do przechowywania, czy przepis jest ulubiony

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Blokowanie przewijania strony
    // Nasłuchiwanie na naciśnięcie Escape
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal(); // Zamykanie modalu na Escape
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto"; // Przywracanie przewijania strony po zamknięciu modala
    };
  }, [closeModal]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Zmiana stanu ulubionego przepisu
    // Możesz tu dodać dodatkową logikę, np. zapisać stan w localStorage lub wysłać do backendu
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={closeModal} // Zamknięcie modalu po kliknięciu w tło
    >
      <div
        className="relative bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()} // Zapobieganie zamknięciu modalu po kliknięciu w zawartość
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>

        {/* Calories and Time */}
        <div className="text-sm text-gray-600 mb-4 flex flex-col sm:flex-row gap-4">
          <p><strong>Calories:</strong> {recipe.calories}</p>
          <p><strong>Time:</strong> {recipe.readyInMinutes} minutes</p>
        </div>

        {/* Instructions */}
        <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line select-text">
          <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
          <p>{recipe.instructions}</p>
        </div>

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute bottom-4 right-4 text-white p-3 bg-blue-500 hover:bg-blue-600 rounded-full"
        >
          {isFavorite ? <Heart fill="currentColor" /> : <HeartOff />}
        </button>
      </div>
    </div>
  );
};

export default RecipeModal;
