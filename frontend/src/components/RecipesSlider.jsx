import React from 'react';
 import 'keen-slider/keen-slider.min.css';
 import { useKeenSlider } from 'keen-slider/react';
 import RecipeCard from './RecipeCard';

 function RecipesSlider({ title, results, message, setButtonClicked}) {
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
   <section className="w-full max-w-screen-xl mx-auto px-4 relative mb-20" >
    <div className="flex items-center justify-between mb-4">
     <h1 className="text-2xl font-extrabold text-left text-black">{title}</h1>
     <button
      className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition"
      onClick={() => setButtonClicked(title)} // Pass the title directly
     >
      Show More →
     </button>
    </div>

    <div ref={sliderRef} className="keen-slider overflow-hidden">
     {results.map((recipe) => (
      <RecipeCard recipe={recipe} key={recipe.id}/>
     ))}
    </div>
   </section>
  );
 }

 export default RecipesSlider;