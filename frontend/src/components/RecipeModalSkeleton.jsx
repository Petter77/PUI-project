import React from 'react';
import { X } from 'lucide-react'; // Nadal możemy użyć ikony zamknięcia, ale będzie nieaktywna

function RecipeModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div
        className="relative bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 animate-pulse"
      >
        {/* Przycisk zamknięcia (nieaktywny, tylko wizualny) */}
        <div className="absolute top-4 right-4 bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center">
          <X className="w-5 h-5 text-gray-400" />
        </div>

        {/* Symulacja obrazka */}
        <div className="w-full h-48 bg-gray-300 rounded-xl mb-4"></div>

        {/* Symulacja tytułu */}
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>

        {/* Symulacja informacji o czasie, porcjach, health score */}
        <div className="text-sm text-gray-400 mb-4 flex flex-col sm:flex-row gap-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>

        {/* Symulacja sekcji składników */}
        <div className="mb-4">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div> {/* Nagłówek Ingredients */}
          <ul className="list-disc list-inside">
            {/* Symulacja kilku pozycji składników */}
            <li className="h-4 bg-gray-300 rounded w-full mb-2"></li>
            <li className="h-4 bg-gray-300 rounded w-5/6 mb-2"></li>
            <li className="h-4 bg-gray-300 rounded w-3/4 mb-2"></li>
            <li className="h-4 bg-gray-300 rounded w-11/12 mb-2"></li>
          </ul>
        </div>

        {/* Symulacja sekcji instrukcji */}
        <div className="mb-4">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div> {/* Nagłówek Instructions */}
          {/* Symulacja kilku linii instrukcji */}
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5 mb-2"></div>
        </div>

        {/* Symulacja przycisku Dodaj do ulubionych / planu */}
        <div className="w-full py-2 rounded-lg bg-gray-300 h-12"></div>
      </div>
    </div>
  );
}

export default RecipeModalSkeleton;