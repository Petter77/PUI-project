import React from 'react';

function SkeletonCard() {
  return (
    <div className="keen-slider__slide animate-pulse bg-white rounded-lg shadow m-4 space-y-4">
      <div className="w-full h-40 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

export default SkeletonCard;

