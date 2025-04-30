import React from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

function SwiperRecipes({ title, results, message, setButtonClicked, getAllRecipesForCategory }) {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 4,
      spacing: 16,
    },
    breakpoints: {
      '(max-width: 1024px)': {
        slides: { perView: 3, spacing: 12 },
      },
      '(max-width: 640px)': {
        slides: { perView: 1.5, spacing: 10 },
      },
      '(min-width: 1400px)': {
        slides: { perView: 5, spacing: 18 },
      }
    },
  });

  if (!results) return <p>Ładowanie...</p>;
  if (message) return <p>{message}</p>;

  return (
    <section className="w-full max-w-screen-xl mx-auto px-4 relative">
      {/* Title and button container */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-left text-white">{title}</h1>
        <button
          className="text-sm font-semibold text-blue-400 hover:text-blue-500 transition"
          onClick={() => {
            setButtonClicked(title);
            getAllRecipesForCategory(title);
          }}
        >
          Show All →
        </button>
      </div>

      <div ref={sliderRef} className="keen-slider overflow-hidden">
        {results.map((recipe) => (
          <div
            key={recipe.id}
            className="keen-slider__slide flex justify-center"
          >
            <div className="w-full max-w-[14rem] mb-20 sm:max-w-[15rem] md:max-w-[16rem] h-[14rem] sm:h-[16rem] md:h-[18rem] bg-[#1a1a1e] rounded-xl shadow-md flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-bold text-white text-left px-2 py-1 mb-2 line-clamp-2">
                {recipe.title}
              </h2>
              <div className="flex justify-between w-full mt-auto">
                <p className="text-base text-gray-300 ml-2 mb-1">
                  Calories: {recipe.calories}
                </p>
                <p className="text-base text-gray-300 mr-2 mb-1 text-right">
                  Time: {recipe.readyInMinutes} minutes
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SwiperRecipes;
