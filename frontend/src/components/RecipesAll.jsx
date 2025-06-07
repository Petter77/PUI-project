// RecipesAll.jsx
import React from 'react';
import RecipeCard from './RecipeCard';

function RecipesAll({ allRecipes, title, currentPage, totalResults, resultsPerPage, onPageChange, showLoadMoreButton = false }) {
  // Komunikat ładowania tylko dla tej sekcji
  if (!allRecipes) {
    return <p className="text-center mt-4">Ładowanie przepisów {title.toLowerCase()}...</p>;
  }

  if (allRecipes.length === 0 && totalResults === 0) {
    return <p className="text-center mt-4">Brak przepisów dla kategorii: {title}</p>;
  }

  const totalPages = Math.ceil(totalResults / resultsPerPage);
  // Sprawdź, czy są jeszcze przepisy do załadowania, ale tylko jeśli totalResults jest znane
  const hasMoreRecipes = totalResults > 0 && allRecipes.length < totalResults;

  return (
    <section className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-left text-black mb-6">{title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allRecipes.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>

      {showLoadMoreButton ? (
        hasMoreRecipes && (
          <div className="flex justify-center mt-12">
            <button
              onClick={onPageChange} // onPageChange już zwiększa stronę
              className="bg-blue-500 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-600 transition duration-300"
            >
              Pokaż więcej
            </button>
          </div>
        )
      ) : (
        totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Poprzednia
            </button>

            {(() => {
              const pageNumbers = [];
              const maxPageButtons = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
              let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

              if (endPage - startPage + 1 < maxPageButtons) {
                startPage = Math.max(1, endPage - maxPageButtons + 1);
              }

              if (startPage > 1) {
                pageNumbers.push(
                  <button key={1} onClick={() => onPageChange(1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">1</button>
                );
                if (startPage > 2) pageNumbers.push(<span key="ellipsis-start" className="text-gray-600">...</span>);
              }

              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                  <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-4 py-2 rounded-lg transition ${
                      i === currentPage
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              if (endPage < totalPages) {
                if (endPage < totalPages - 1) pageNumbers.push(<span key="ellipsis-end" className="text-gray-600">...</span>);
                pageNumbers.push(
                  <button key={totalPages} onClick={() => onPageChange(totalPages)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    {totalPages}
                  </button>
                );
              }
              return pageNumbers;
            })()}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Następna
            </button>
          </div>
        )
      )}
    </section>
  );
}

export default RecipesAll;