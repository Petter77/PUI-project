import React from 'react';

function RecipeCardSkeleton() {
  return (
    // Użyj tych samych klas co w RecipeCard, aby zachować spójny rozmiar
    // Dodaj klasy 'animate-pulse' z Tailwind CSS dla efektu fali
    <div className="keen-slider__slide flex justify-center cursor-pointer relative p-2">
      <div className="w-full max-w-[15rem] h-[18rem] bg-gray-200 rounded-2xl shadow-lg flex flex-col items-center overflow-hidden animate-pulse">
        {/* Symulacja obrazka */}
        <div className="w-full h-36 bg-gray-300 rounded-t-2xl"></div>
        
        {/* Symulacja kontenera na tekst */}
        <div className="flex flex-col flex-grow items-start justify-between p-3 w-full">
          {/* Symulacja tytułu */}
          <div className="h-4 bg-gray-300 rounded w-4/5 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/5 mb-4"></div> {/* Druga linia tytułu */}

          {/* Symulacja informacji dodatkowych */}
          <div className="flex justify-between items-center w-full text-sm font-medium">
            <div className="h-5 bg-gray-300 rounded-full w-1/4"></div>
            <div className="h-5 bg-gray-300 rounded-full w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCardSkeleton;