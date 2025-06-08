import { useState, useEffect } from "react";
import { Heart, HeartOff, X } from "lucide-react";
import axios from "axios";
import RecipeModalSkeleton from "./RecipeModalSkeleton"; // Zaimportuj nowy komponent szkieletu

const RecipeModal = ({ recipeID, closeModal, source = "api", savedRecipe = null, handleAddToMealPlan }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false); // Stan ładowania dla akcji ulubionych

  const token = sessionStorage.getItem("user");

  const API_HEADERS = {
    headers: {
      "x-rapidapi-key": "9a7535fc55mshab722bde2e894fcp171d05jsn558fa1ebbdad",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  const getDetailsRecipe = async () => {
    setLoading(true); // Rozpoczynamy ładowanie
    try {
      if ((source === "saved" || source === "mealPlan") && savedRecipe) {
        // Jeśli mamy przepis w propsie (zapisany lub z planu posiłków), używamy go bez fetchowania
        setRecipe(savedRecipe);
      } else {
        // Fetch z API dla innych przypadków (np. source === "api")
        const response = await fetch(
          `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/information`,
          API_HEADERS
        );
        if (!response.ok) throw new Error("Failed to fetch recipe details");
        const data = await response.json();
        setRecipe(data);
      }
    } catch (error) {
      console.error("Błąd pobierania przepisu:", error);
      setRecipe(null); // Ustaw przepis na null w przypadku błędu
    } finally {
      setLoading(false); // Kończymy ładowanie
    }
  };


  const checkIfFavorite = async () => {
    // Nie wpływa na główny stan ładowania modala, tylko na stan przycisku
    try {
      const response = await axios.get(
        `http://localhost:3000/recipes/isFavorite/${recipeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error("Błąd sprawdzania ulubionych:", error);
      setIsFavorite(false); // Domyślnie nie jest ulubiony w przypadku błędu
    }
  };

  const saveRecipe = async () => {
    if (!recipe) return;
    const recipeData = {
      recipeId: recipe.id || recipe.ApiRecipeID,
      title: recipe.title,
      instructions: recipe.instructions || recipe.instruction || "",
      calories: recipe.calories ?? null,
      prepTime: recipe.readyInMinutes ?? recipe.prepTime ?? null,
      servings: recipe.servings ?? null,
      image: recipe.image,
      healthScore: recipe.healthScore ?? null,
      ingredients:
        (recipe.extendedIngredients
          ? recipe.extendedIngredients.map((ing) => ({
              name: ing.name,
              amount: `${ing.amount} ${ing.unit}`.trim(),
            }))
          : recipe.ingredients) || [],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/recipes/save",
        recipeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dodano do ulubionych:", response.data.message);
    } catch (error) {
      console.error("Błąd dodawania:", error.response?.data || error.message);
      throw error; // Propaguj błąd, aby toggleFavorite mógł go obsłużyć
    }
  };

  const deleteRecipe = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/recipes/delete/${recipeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Usunięto z ulubionych:", response.data.message);
    } catch (error) {
      console.error("Błąd usuwania:", error.response?.data || error.message);
      throw error; // Propaguj błąd
    }
  };

  const toggleFavorite = async () => {
    setFavLoading(true); // Rozpoczynamy ładowanie dla przycisku
    try {
      if (isFavorite) {
        await deleteRecipe();
        setIsFavorite(false);
      } else {
        await saveRecipe();
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("toggleFavorite error:", error);
      // Możesz dodać tutaj jakiś komunikat dla użytkownika
    } finally {
      setFavLoading(false); // Kończymy ładowanie dla przycisku
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [closeModal]);

  useEffect(() => {
    if (recipeID) {
      getDetailsRecipe();
      // Sprawdzaj status ulubionych tylko, jeśli użytkownik jest zalogowany
      // i to nie jest przepis z "saved" ani "mealPlan", bo dla nich już wiemy
      if (token && source !== "saved" && source !== "mealPlan") {
          checkIfFavorite();
      } else if (source === "saved" || source === "mealPlan") {
          // Jeśli source to "saved" lub "mealPlan", to z definicji jest to ulubiony przepis
          setIsFavorite(true);
      } else {
          setIsFavorite(false); // Jeśli nie ma tokena, to nie jest ulubiony
      }
    }
  }, [recipeID, source, token]); // Dodano source i token do zależności

  // Renderuj szkielet, jeśli loading jest true
  if (loading) {
    return <RecipeModalSkeleton />;
  }

  // Jeśli nie ma przepisu po załadowaniu (np. błąd API), zwróć null
  if (!recipe) return null;

  const ingredients =
    source === "saved" || source === "mealPlan" // Ujednolicona logika dla zapisanych i planów
      ? recipe.ingredients || []
      : recipe.extendedIngredients || [];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={closeModal}
    >
      <div
        className="relative bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full rounded-xl mb-4"
          />
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>

        <div className="text-sm text-gray-600 mb-4 flex flex-col sm:flex-row gap-4">
          <p>
            <strong>Prep time:</strong>{" "}
            {recipe.readyInMinutes ?? recipe.prepTime ?? "N/A"} minutes
          </p>
          <p>
            <strong>Servings:</strong> {recipe.servings ?? "N/A"}
          </p>
          <p>
            <strong>Health Score:</strong> {recipe.healthScore ?? "N/A"}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {ingredients.map((ing, idx) => (
              <li key={ing.id || ing.name || idx}> {/* Dodano ing.name do klucza */}
                {ing.name}{" "}
                {ing.amount
                  ? `- ${ing.amount}`
                  : ing.measures
                  ? `- ${ing.measures.metric.amount} ${ing.measures.metric.unitShort}`
                  : ""}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
          <p
            className="text-gray-700 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: recipe.instructions || "Brak instrukcji" }}
          />
        </div>

        {source === "mealPlan" ? (
          <button
            onClick={() => { handleAddToMealPlan && handleAddToMealPlan(recipe) }}
            className="w-full py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
          >
            Dodaj do planu żywieniowego
          </button>
        ) : (
          source !== "saved" && ( // Przycisk ulubionych nie jest widoczny dla source="saved"
            <button
              disabled={favLoading}
              onClick={toggleFavorite}
              className={`w-full py-2 rounded-lg font-semibold ${
                isFavorite
                  ? "bg-gray-300 hover:bg-gray-400 text-gray-700"
                  : "bg-red-500 hover:bg-red-600 text-white"
              } transition-colors duration-300 ${favLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {favLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isFavorite ? "Usuwanie..." : "Dodawanie..."}
                </div>
              ) : isFavorite ? (
                <div className="flex items-center justify-center gap-2">
                  <HeartOff size={20} />
                  Usuń z ulubionych
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Heart size={20} />
                  Dodaj do ulubionych
                </div>
              )}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeModal;