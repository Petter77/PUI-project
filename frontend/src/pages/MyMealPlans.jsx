import { useEffect, useState, useMemo } from "react";
import MealPlanSelectList from "../components/MealPlanSelectList";
import axios from "axios";

function MyMealPlans() {
    const token = sessionStorage.getItem("user");
    const [dailyMealPlan, setDailyMealPlan] = useState([]);
    const [isShowSelectList, setIsShowSelectList] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMealType, setSelectedMealType] = useState(null);
    const [activeRecipe, setActiveRecipe] = useState(null);

    // Funkcja do zamykania modala (będzie przekazywana)
    const closeMealPlanSelectModal = () => {
        setIsShowSelectList(false);
        setSelectedDay(null); // Resetowanie wybranych danych po zamknięciu
        setSelectedMealType(null);
    };

    // Dodano sobotę i niedzielę
    const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
    const mealTypes = ["Śniadanie", "I-danie", "II-danie", "Kolacja"];

    const calculateAverageHealthScore = (recipes) => {
        if (!recipes.length) return 0;
        const total = recipes.reduce((sum, r) => sum + (r.healthScore || 0), 0);
        return (total / recipes.length).toFixed(1);
    };

    const dailyHealthScores = useMemo(() => {
        return days.map((day) => {
            const recipes = dailyMealPlan.filter((r) => r.day === day);
            return { day, average: calculateAverageHealthScore(recipes) };
        });
    }, [dailyMealPlan, days]);

    const weeklyAverageHealthScore = useMemo(() => {
        return calculateAverageHealthScore(dailyMealPlan);
    }, [dailyMealPlan]);

    const handleAddToMealPlan = async (recipe) => {
        if (!selectedDay || !selectedMealType) return;
        
        const enrichedRecipe = { 
            ...recipe, 
            day: selectedDay, 
            meal_type: selectedMealType,
            // Fallback for instructions, image, calories, healthScore, prepTime, servings
            instructions: recipe.instructions || "Brak szczegółowych instrukcji dla tego przepisu.",
            image: recipe.image || "https://via.placeholder.com/400x250.png?text=Brak+zdjęcia",
            calories: recipe.calories || 0,
            healthScore: recipe.healthScore || 0,
            prepTime: recipe.prepTime || "brak danych",
            servings: recipe.servings || "brak danych"
        };

        try {
            const response = await fetch("http://localhost:3000/meals/plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(enrichedRecipe),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Błąd podczas dodawania do planu posiłków");
            }

            await handleGetMealsPlan();
        } catch (error) {
            console.error("Błąd:", error.message);
        }

        // closeMealPlanSelectModal(); // Zamykamy modal po dodaniu przepisu
        // UWAGA: Ta linia będzie przeniesiona do handleSelectRecipe w MealPlanSelectList
        // tak aby zamykanie modalu nastąpiło tylko po faktycznym wyborze przepisu.
        // Jeśli chcemy, żeby modal zamykał się zawsze, nawet jak nie dodamy,
        // to można pozostawić to tutaj, ale lepiej obsłużyć w child komponencie.
    };

    const handleGetMealsPlan = async () => {
        try {
            const response = await axios.get("http://localhost:3000/meals/plan", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDailyMealPlan(response.data);
        } catch (error) {
            console.error("Błąd pobierania planu:", error);
        }
    };

    const handleRemoveFromMealPlan = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/meals/plan/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Błąd podczas usuwania przepisu z planu.");
            }

            setDailyMealPlan((prev) => prev.filter((r) => r.id !== id));
            if (activeRecipe?.id === id) setActiveRecipe(null);
        } catch (error) {
            console.error("Błąd usuwania przepisu:", error.message);
        }
    };

    useEffect(() => {
        handleGetMealsPlan();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Twój <span className="text-blue-600">tygodniowy</span> plan posiłków
            </h2>

            {/* HealthScore summary */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Podsumowanie HealthScore</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                    {dailyHealthScores.map(({ day, average }) => (
                        <div key={day} className="bg-blue-50 rounded-xl p-4 text-center shadow-sm">
                            <p className="text-sm font-semibold text-gray-600">{day}</p>
                            <p className="text-2xl font-bold text-blue-600">{average} / 100</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 text-center text-lg font-semibold bg-blue-600 text-white py-3 rounded-xl shadow">
                    Średni HealthScore tygodnia: {weeklyAverageHealthScore} / 100
                </div>
            </div>

            {/* Główny układ gridu */}
            <div 
                className="grid gap-6" 
                style={{ 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' 
                }}
            >
                {days.map((day) => (
                    <div key={day} className="bg-white shadow rounded-2xl p-4 flex flex-col">
                        <h3 className="text-center font-bold text-gray-700 text-lg mb-3">{day}</h3>
                        {mealTypes.map((mealType) => {
                            const recipe = dailyMealPlan.find(
                                (r) => r.day === day && r.meal_type === mealType
                            );
                            return (
                                <div key={mealType} className="mb-3">
                                    {!recipe ? (
                                        <button
                                            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600 py-2 rounded-xl text-sm font-medium"
                                            onClick={() => {
                                                setSelectedDay(day);
                                                setSelectedMealType(mealType);
                                                setIsShowSelectList(true);
                                            }}
                                        >
                                            + Dodaj {mealType.toLowerCase()}
                                        </button>
                                    ) : (
                                        <div
                                            onClick={() => setActiveRecipe(recipe)}
                                            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl shadow-sm cursor-pointer transition-all group"
                                        >
                                            <p className="font-semibold text-gray-800 group-hover:text-blue-700 truncate">
                                                {recipe.title || recipe.name}
                                            </p>
                                            <div className="flex justify-between mt-1 text-sm text-gray-600">
                                                {/* Wyświetlanie kalorii w skróconym widoku */}
                                                <span>{recipe.calories ? `${Math.round(recipe.calories)} kcal` : 'N/A kcal'}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFromMealPlan(recipe.id);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 font-medium"
                                                >
                                                    Usuń
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Modal: Add recipe - ZMIANY TUTAJ */}
            {isShowSelectList && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
                    onClick={closeMealPlanSelectModal} 
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Przycisk zamknięcia w tym modalu również powinien używać closeMealPlanSelectModal */}
                        <button
                            onClick={closeMealPlanSelectModal}
                            className="absolute top-4 right-4 text-gray-500 text-2xl"
                        >
                            &times;
                        </button>
                        {/* Przekazujemy handleAddToMealPlan i closeMealPlanSelectModal do MealPlanSelectList */}
                        <MealPlanSelectList 
                            handleAddToMealPlan={handleAddToMealPlan} 
                            onClose={closeMealPlanSelectModal} 
                        />
                    </div>
                </div>
            )}

            {/* Modal: Recipe detail - BEZ ZMIAN W ZAMYKANIU */}
            {activeRecipe && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
                    onClick={() => setActiveRecipe(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Przycisk zamykania - przywrócono pierwotne klasy */}
                        <button
                            onClick={() => setActiveRecipe(null)} // Ten modal zamyka się przez setActiveRecipe(null)
                            className="absolute top-0 right-0 text-gray-800 text-4xl" // Poprawiłem na text-gray-800
                        >
                            &times;
                        </button>

                        {/* Zdjęcie przepisu */}
                        {activeRecipe.image ? (
                            <img
                                src={activeRecipe.image}
                                alt={activeRecipe.title || "Zdjęcie przepisu"}
                                className="w-full h-64 object-cover rounded-xl mb-4" 
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-gray-500 font-semibold text-lg">
                                Brak dostępnego zdjęcia
                            </div>
                        )}

                        {/* Tytuł i opis - przywrócono niebieski kolor tytułu */}
                        <h3 className="text-2xl font-bold mb-2 text-blue-600"> {/* Zmieniłem text-black-600 na text-blue-600 */}
                            {activeRecipe.title || activeRecipe.name || "Brak tytułu"}
                        </h3>
                        <p className="mb-4 text-gray-700 whitespace-pre-line">
                            {activeRecipe.instructions || "Brak szczegółowych instrukcji dla tego przepisu."}
                        </p>

                        {/* Składniki */}
                        <h4 className="text-lg font-semibold mb-2 text-gray-800">Składniki:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                            {activeRecipe.ingredients && activeRecipe.ingredients.length > 0 ? (
                                activeRecipe.ingredients.map((ing, idx) => (
                                    <li key={idx}>{ing.name || ing}</li>
                                ))
                            ) : (
                                <li>Brak dostępnych składników.</li>
                            )}
                        </ul>

                        {/* Szczegóły dodatkowe - przywrócono format listy */}
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li><strong>Kalorie:</strong> {Math.round(activeRecipe.calories || 0)} kcal</li>
                            <li><strong>HealthScore:</strong> {activeRecipe.healthScore || "Brak"} / 100</li>
                            <li><strong>Czas przygotowania:</strong> {activeRecipe.prepTime || "brak danych"} min</li>
                            <li><strong>Porcje:</strong> {activeRecipe.servings || "brak danych"}</li>
                            <li><strong>Typ posiłku:</strong> {activeRecipe.meal_type || "brak danych"}</li>
                            <li><strong>Dzień:</strong> {activeRecipe.day || "brak danych"}</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyMealPlans;