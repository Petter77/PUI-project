import RecipeCard from "./RecipeCard";

function RecipesAll({ allRecipes, title, message }) {
  if (!allRecipes) return <p>Ładowanie...</p>;
  if (message) return <p>{message}</p>;

  return (
    <section className="py-6 px-4">
      <h1 className="text-2xl font-extrabold text-left text-black mb-6">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {allRecipes.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </section>
  );
}

export default RecipesAll;
