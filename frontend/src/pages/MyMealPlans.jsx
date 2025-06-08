import { useEffect, useState } from "react";
import MealPlanSelectList from "../components/MealPlanSelectList";
import axios from "axios";

function MyMealPlans() {
    const token = sessionStorage.getItem("user");

    const [dailyMealPlan, setDailyMealPlan] = useState([]);
    const [isShowSelectList, setIsShowSelectList] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMealType, setSelectedMealType] = useState(null);
    const [user, setUser] = useState(null);
    const [activeRecipe, setActiveRecipe] = useState(null);

    const handleAddToMealPlan = async (recipe) => {
        if (!selectedDay || !selectedMealType) return;

        const enrichedRecipe = { ...recipe, day: selectedDay, meal_type: selectedMealType };

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
                // Rzuć błąd, który zostanie złapany i wyświetlony użytkownikowi
                throw new Error(errorData.error || "Błąd podczas dodawania do planu posiłków");
            }

            const data = await response.json();
            console.log("Dodano do planu:", data);
            // Po udanym dodaniu, odśwież plan posiłków, aby pobrać rekord z poprawnym ID z bazy danych
            await handleGetMealsPlan();
        } catch (error) {
            console.error("Błąd:", error.message);
            alert(error.message); // Wyświetl błąd użytkownikowi
        }

        setIsShowSelectList(false);
        setSelectedDay(null);
        setSelectedMealType(null);
    };

    const handleGetMealsPlan = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/meals/plan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDailyMealPlan(response.data);
            console.log("Pobrany plan posiłków:", response.data);
        } catch (error) {
            console.error("Błąd pobierania zapisanych przepisów:", error);
        }
    };

    const getLoggedUser = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/logged", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Błąd pobierania danych użytkownika:", error);
            setUser(null);
        }
    };

    const handleRemoveFromMealPlan = async (recipeDbId) => {
        try {
            const response = await fetch(`http://localhost:3000/meals/plan/${recipeDbId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Błąd podczas usuwania przepisu z planu.");
            }

            setDailyMealPlan((prev) =>
                prev.filter((r) => r.id !== recipeDbId)
            );

            if (activeRecipe && activeRecipe.id === recipeDbId) {
                setActiveRecipe(null);
            }

            console.log("Przepis usunięty z planu.");
        } catch (error) {
            console.error("Błąd podczas usuwania z planu:", error.message);
            alert(error.message); // Wyświetl błąd użytkownikowi
        }
    };

    const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
    const mealTypes = ["Śniadanie", "I-danie", "II-danie", "Kolacja"];

    useEffect(() => {
        getLoggedUser();
        handleGetMealsPlan();
    }, []);

    return (
        <>
            {isShowSelectList && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => {
                        setIsShowSelectList(false);
                        setSelectedDay(null);
                        setSelectedMealType(null);
                    }}
                >
                    <div
                        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                setIsShowSelectList(false);
                                setSelectedDay(null);
                                setSelectedMealType(null);
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <MealPlanSelectList handleAddToMealPlan={handleAddToMealPlan} />
                    </div>
                </div>
            )}

            {activeRecipe && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setActiveRecipe(null)}
                >
                    <div
                        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setActiveRecipe(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold mb-4">{activeRecipe.title || activeRecipe.name}</h2>
                        {activeRecipe.image && (
                            <img
                                src={activeRecipe.image}
                                alt={activeRecipe.title || activeRecipe.name}
                                className="w-full max-h-64 object-cover rounded mb-4"
                            />
                        )}
                        <p><strong>Instrukcje:</strong></p>
                        <p className="whitespace-pre-wrap mb-4">{activeRecipe.instructions}</p>
                        <p><strong>Składniki:</strong></p>
                        <ul className="list-disc list-inside mb-4">
                            {activeRecipe.ingredients?.map((ing, idx) => (
                                <li key={idx}>{ing.name || ing}</li>
                            ))}
                        </ul>
                        <p><strong>Czas przygotowania:</strong> {activeRecipe.prepTime || "brak danych"} min</p>
                        <p><strong>Porcje:</strong> {activeRecipe.servings || "brak danych"}</p>
                        <p><strong>Kalorie:</strong> {activeRecipe.calories || "brak danych"}</p>
                        <p><strong>Health Score:</strong> {activeRecipe.healthScore || "brak danych"}</p>
                    </div>
                </div>
            )}

            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Twój plan posiłków:</h2>

                <ul>
                    {days.map((day) => (
                        <li key={day} className="mb-6">
                            <strong className="text-lg">{day}</strong>
                            <ul className="ml-4 mt-2 space-y-4">
                                {mealTypes.map((mealType) => {
                                    const hasRecipe = dailyMealPlan.some(
                                        (r) => r.day === day && r.meal_type === mealType
                                    );
                                    return (
                                        <li key={mealType}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold">{mealType}</span>
                                                <button
                                                    className={`px-2 py-1 text-white rounded text-sm ${
                                                        hasRecipe
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-blue-600 hover:bg-blue-700"
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedDay(day);
                                                        setSelectedMealType(mealType);
                                                        setIsShowSelectList(true);
                                                    }}
                                                    disabled={hasRecipe} // Dezaktywuj, jeśli już jest przepis
                                                >
                                                    {hasRecipe ? "Przepis dodany" : "Dodaj przepis"}
                                                </button>
                                            </div>

                                            <ul className="ml-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {dailyMealPlan
                                                    .filter((r) => r.day === day && r.meal_type === mealType)
                                                    .map((r) => (
                                                        <li
                                                            key={r.id}
                                                            className="bg-gray-100 p-3 rounded cursor-pointer hover:bg-gray-200 flex justify-between items-center"
                                                            onClick={() => setActiveRecipe(r)}
                                                        >
                                                            <span>{r.title || r.name}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveFromMealPlan(r.id);
                                                                }}
                                                                className="text-red-600 hover:underline text-sm ml-2"
                                                            >
                                                                Usuń
                                                            </button>
                                                        </li>
                                                    ))}
                                                {!hasRecipe && ( // Wyświetl "Brak przepisów" tylko jeśli nie ma żadnego
                                                    <li className="text-gray-500 italic col-span-full">Brak przepisów</li>
                                                )}
                                            </ul>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default MyMealPlans;