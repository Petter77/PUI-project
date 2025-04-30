function AllRecipes({ results, setButtonClicked, buttonClicked, message }) {

    if (!results) return <p>Ładowanie...</p>;
    if (message) return <p>{message}</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-white">All {buttonClicked}</h1>
                <button
                    onClick={() => setButtonClicked(null)}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                    Go back
                </button>
            </div>

            {/* Grid container */}
            <div className="grid grid-cols-4 gap-6">
                {results.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="bg-[#1a1a1e] rounded-xl shadow-md flex flex-col items-center hover:scale-105 transition-transform duration-300"
                    >
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-32 object-cover rounded-t-md"
                        />
                        <h2 className="text-lg font-bold text-white px-3 py-2 line-clamp-2 text-center">
                            {recipe.title}
                        </h2>
                        <div className="flex justify-between w-full px-3 mt-auto pb-3">
                            <p className="text-base text-gray-300">Calories: {recipe.calories}</p>
                            <p className="text-base text-gray-300">Time: {recipe.readyInMinutes} min</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllRecipes;
