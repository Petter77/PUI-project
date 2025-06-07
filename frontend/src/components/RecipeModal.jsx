import { useState, useEffect } from "react";
import { Heart, HeartOff, X } from "lucide-react";
import axios from "axios";

const RecipeModal = ({ recipeID, closeModal, source = "api", savedRecipe = null }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const token = sessionStorage.getItem("user");

  const API_HEADERS = {
    headers: {
      "x-rapidapi-key": "9a7535fc55mshab722bde2e894fcp171d05jsn558fa1ebbdad",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  const getDetailsRecipe = async () => {
    setLoading(true);
    try {
      if (source === "saved" && savedRecipe) {
        // Dane są już w propsie, więc nie fetchujemy
        setRecipe(savedRecipe);
      } else {
        // Fetch z API 
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
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
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
    }
  };

  const toggleFavorite = async () => {
    setFavLoading(true);
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
    } finally {
      setFavLoading(false);
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
      checkIfFavorite();
    }
  }, [recipeID]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-xl shadow-md">Loading...</div>
      </div>
    );
  }

  if (!recipe) return null;

  const ingredients =
    source === "saved"
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
              <li key={ing.id || idx}>
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

        {source !== "saved" && (
                  <button
          disabled={favLoading}
          onClick={toggleFavorite}
          className={`w-full py-2 rounded-lg font-semibold ${
            isFavorite
              ? "bg-gray-300 hover:bg-gray-400 text-gray-700"
              : "bg-red-500  hover:bg-red-600 text-white"
          } transition-colors duration-300`}
        >
          {isFavorite ? (
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
        )}

      </div>
    </div>
  );
};

export default RecipeModal;
