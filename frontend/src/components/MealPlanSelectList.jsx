import axios from 'axios';
import React, { useEffect, useState } from 'react'
import RecipeCard from './RecipeCard';

function MealPlanSelectList({handleAddToMealPlan, onClose}) {

  const [user, setUser] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("user");

    const handleSelectRecipe = (recipe) => {
    handleAddToMealPlan(recipe);
    if (onClose) onClose(); // zamknij modal po wyborze
  };

  const getLoggedUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/logged", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Błąd pobierania danych użytkownika:", error);
      setUser(null);
      setLoading(false);
    }
  };

  const getSavedRecipes = async () => {
    const userId = user.userId;
    try {
      const response = await axios.get(
        `http://localhost:3000/recipes/saved-recipes/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedRecipes(response.data);
    } catch (error) {
      console.error("Błąd pobierania zapisanych przepisów:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLoggedUser();
  }, []);

  useEffect(() => {
    if (user) {
      getSavedRecipes();
    }
  }, [user]);

  if (loading) return <p>Ładowanie...</p>;

  if (!savedRecipes.length) return <p>Brak zapisanych przepisów</p>;

  console.log(savedRecipes)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Wybierz przepis do planu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {savedRecipes.map((recipe) => (
        <div
          key={recipe.id}
          className="cursor-pointer"
          onClick={() => handleSelectRecipe(recipe)}
        >
          <RecipeCard recipe={recipe} source="mealPlan" />
          <button onClick={() => handleSelectRecipe(recipe)}>Dodaj do planu</button>
        </div>
      ))}
        </div>
      </div>
    </div>
  );
}

export default MealPlanSelectList;
