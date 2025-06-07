// RecipeSkeletonCard.jsx
import React from 'react';

function RecipeSkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-md overflow-hidden">
      <div className="h-48 bg-gray-300/60 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300/50 rounded w-3/4" />
        <div className="h-4 bg-gray-300/50 rounded w-1/2" />
      </div>
    </div>
  );
}

export default RecipeSkeletonCard;

