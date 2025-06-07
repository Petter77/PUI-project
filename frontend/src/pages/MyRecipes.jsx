import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";

const MyRecipes = () => {
  const [user, setUser] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("user");

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

  const handleDeleteRecipe = async (recipeId) => {
    console.log(recipeId)
    try {
      await axios.delete(`http://localhost:3000/recipes/delete/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Usuń przepis z lokalnego stanu
      setSavedRecipes((prev) => prev.filter((r) => r.ApiRecipeID !== recipeId));
    } catch (error) {
      console.error("Błąd usuwania przepisu:", error);
    }
  };

  if (loading) return <p>Ładowanie...</p>;

  if (!savedRecipes.length) return <p>Brak zapisanych przepisów</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {savedRecipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          source="saved"
          showDelete={true}
          onDelete={() => handleDeleteRecipe(recipe.ApiRecipeID)}
        />
      ))}
    </div>
  );
};

export default MyRecipes;
