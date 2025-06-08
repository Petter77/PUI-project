import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import SearchInput from "../components/SearchInput";
import RecipesSlider from "../components/RecipesSlider";
import RecipesAll from "../components/RecipesAll";
import RecipeFilter from "../components/RecipeFilter";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

function Dashboard() {
  // Stan dla danych
  const [popularRecipes, setPopularRecipes] = useState(null);
  const [highProteinRecipes, setHighProteinRecipes] = useState(null);
  const [easyRecipes, setEasyRecipes] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState(null);
  const [allRandomRecipes, setAllRandomRecipes] = useState(null);

  // Stany ładowania dla poszczególnych sekcji
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isLoadingHighProtein, setIsLoadingHighProtein] = useState(true);
  const [isLoadingEasy, setIsLoadingEasy] = useState(true);
  const [isLoadingRandom, setIsLoadingRandom] = useState(true);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // Globalny stan ładowania początkowego
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [buttonClicked, setButtonClicked] = useState(null);
  const [message, setMessage] = useState(null);

  const [randomRecipesPage, setRandomRecipesPage] = useState(1);
  const [totalRandomResults, setTotalRandomResults] = useState(0);
  const defaultRandomResultsPerPage = 28;

  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1);
  const [filteredTotalResults, setFilteredTotalResults] = useState(0);
  const filteredResultsPerPage = 20;

  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchTotalResults, setSearchTotalResults] = useState(0);
  const searchResultsPerPage = 20;

  const API_HEADERS = {
    headers: {
      "x-rapidapi-key": "9a7535fc55mshab722bde2e894fcp171d05jsn558fa1ebbdad",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  // Uogólniona funkcja do pobierania przepisów
  const fetchRecipes = useCallback(
    async (url, setter, label, includeTotalResults = false, totalSetter = null, setIsLoadingState, retries = 3) => {
      setIsLoadingState(true); // Ustawia ładowanie dla konkretnej sekcji
      try {
        const res = await axios.get(url, API_HEADERS);
        setter(res.data.results);
        if (includeTotalResults && totalSetter && res.data.totalResults !== undefined) {
          totalSetter(res.data.totalResults);
        }
        setMessage(null);
      } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return fetchRecipes(url, setter, label, includeTotalResults, totalSetter, setIsLoadingState, retries - 1);
        }
        console.error(`Błąd ładowania ${label}:`, error.response ? error.response.status : error.message, error);
        let errorMessage = `Błąd ładowania ${label}. `;
        if (error.response) {
          if (error.response.status === 429) {
            errorMessage += "Przekroczono limit zapytań do API. Spróbuj za chwilę.";
          } else {
            errorMessage += `Status: ${error.response.status} - ${error.response.statusText || "Nieznany błąd."}`;
          }
        } else {
          errorMessage += "Brak połączenia z internetem lub inny problem sieciowy.";
        }
        setMessage(errorMessage);
        setter([]);
        if (includeTotalResults && totalSetter) {
          totalSetter(0);
        }
      } finally {
        setIsLoadingState(false); // Zakończ ładowanie dla konkretnej sekcji
      }
    },
    []
  );

  // useEffect do początkowego, RÓWNOLEGŁEGO ładowania danych
  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true); // Rozpocznij globalne ładowanie

      const popularPromise = fetchRecipes(
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?sort=popularity&number=10",
        setPopularRecipes,
        "popularnych przepisów",
        false, null, setIsLoadingPopular
      );

      const highProteinPromise = fetchRecipes(
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?minProtein=30&number=10",
        setHighProteinRecipes,
        "przepisów wysokobiałkowych",
        false, null, setIsLoadingHighProtein
      );

      const easyPromise = fetchRecipes(
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?maxReadyTime=30&number=10",
        setEasyRecipes,
        "łatwych przepisów",
        false, null, setIsLoadingEasy
      );

      const randomPromise = fetchRecipes(
        `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?sort=random&number=${defaultRandomResultsPerPage}&offset=0`,
        setAllRandomRecipes,
        "wszystkich losowych przepisów",
        true, setTotalRandomResults, setIsLoadingRandom
      );

      await Promise.allSettled([popularPromise, highProteinPromise, easyPromise, randomPromise]);
      // Używamy Promise.allSettled, aby poczekać na wszystkie promise'y, nawet jeśli niektóre się nie powiodą.
      // Dzięki temu globalny loader zawsze zniknie.

      setIsInitialLoading(false); // Zakończ globalne ładowanie po załadowaniu wszystkich początkowych danych
    };

    loadInitialData();
  }, [fetchRecipes, defaultRandomResultsPerPage]);


  // Efekt dla ładowania kolejnych losowych przepisów
  useEffect(() => {
    if (randomRecipesPage > 1) {
      const offset = (randomRecipesPage - 1) * defaultRandomResultsPerPage;
      const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?sort=random&number=${defaultRandomResultsPerPage}&offset=${offset}`;
      fetchRecipes(
        url,
        (newRecipes) => {
          setAllRandomRecipes((prevRecipes) => [...(prevRecipes || []), ...newRecipes]);
        },
        `kolejnych losowych przepisów (strona ${randomRecipesPage})`,
        true,
        setTotalRandomResults,
        setIsLoadingRandom
      );
    }
  }, [randomRecipesPage, fetchRecipes, defaultRandomResultsPerPage]);

  // Efekt dla filtrowanych przepisów
  useEffect(() => {
    if (buttonClicked) {
      let filterUrl = "";
      let label = "";
      const offset = (filteredCurrentPage - 1) * filteredResultsPerPage;

      switch (buttonClicked) {
        case "Low Carb":
          filterUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?diet=low carb&number=${filteredResultsPerPage}&offset=${offset}`;
          label = "przepisów Low Carb";
          break;
        case "Vegetarian":
          filterUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?diet=vegetarian&number=${filteredResultsPerPage}&offset=${offset}`;
          label = "przepisów wegetariańskich";
          break;
        case "Vegan":
          filterUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?diet=vegan&number=${filteredResultsPerPage}&offset=${offset}`;
          label = "przepisów wegańskich";
          break;
        case "Gluten-Free":
          filterUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?diet=gluten free&number=${filteredResultsPerPage}&offset=${offset}`;
          label = "przepisów bezglutenowych";
          break;
        case "Desserts":
          filterUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?type=dessert&number=${filteredResultsPerPage}&offset=${offset}`;
          label = "deserów";
          break;
        case "Dietary Restrictions":
          setMessage("Wybierz bardziej szczegółowe ograniczenie dietetyczne.");
          setFilteredRecipes([]);
          setFilteredTotalResults(0);
          setIsLoadingFiltered(false);
          return;
        case "Popular recipes":
          filterUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?sort=popularity&number=${filteredResultsPerPage}&offset=${offset}`;
          label = "popularnych przepisów";
          break;
        case "High protein recipes":
          filterUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?minProtein=30&number=${filteredResultsPerPage}&offset=${offset}`;
          label = "przepisów wysokobiałkowych";
          break;
        case "Easy recipes":
          filterUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?maxReadyTime=30&number=${filteredResultsPerPage}&offset=${offset}`;
          label = "łatwych przepisów";
          break;
        default:
          setMessage("Nieznana kategoria filtra.");
          setFilteredRecipes([]);
          setFilteredTotalResults(0);
          setIsLoadingFiltered(false);
          return;
      }
      fetchRecipes(filterUrl, setFilteredRecipes, label, true, setFilteredTotalResults, setIsLoadingFiltered);
    }
  }, [buttonClicked, filteredCurrentPage, fetchRecipes, filteredResultsPerPage]);

  const handleFilteredPageChange = (page) => {
    setFilteredCurrentPage(page);
  };

  const handleLoadMoreRandomRecipes = () => {
    setRandomRecipesPage((prevPage) => prevPage + 1);
  };

  const handleSearch = async (query, page = 1) => {
    if (!query || query.trim() === "") {
      setMessage("Proszę wpisać zapytanie.");
      return;
    }
    setMessage(null);
    setSearchQuery(query);
    setButtonClicked(null);
    setFilteredRecipes(null);
    setFilteredCurrentPage(1);
    setSearchCurrentPage(page);

    const offset = (page - 1) * searchResultsPerPage;
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&number=${searchResultsPerPage}&offset=${offset}`;

    await fetchRecipes(url, setSearchResults, `wyników wyszukiwania dla "${query}"`, true, setSearchTotalResults, setIsLoadingSearch);
  };

  const handleSearchPageChange = (page) => {
    handleSearch(searchQuery, page);
  };

  const handleGoBack = () => {
    setSearchResults(null);
    setSearchQuery("");
    setSearchCurrentPage(1);
    setSearchTotalResults(0);
    setMessage(null);
    setButtonClicked(null);
  };

  // Helper do renderowania szkieletów (dla globalnego ładowania początkowego)
  const renderSkeletons = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <RecipeCardSkeleton key={index} />
    ));
  };

  // Komponent globalnego ładowania
  const GlobalLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-xl text-gray-700">Ładowanie wszystkich przepisów...</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 mt-8 w-full max-w-screen-xl">
        {renderSkeletons(20)} {/* Duża liczba szkieletów dla globalnego ekranu ładowania */}
      </div>
    </div>
  );

  return (
    <>
      {isInitialLoading && <GlobalLoadingSpinner />}

      {!isInitialLoading && ( // Renderuj całą zawartość dopiero po zakończeniu początkowego ładowania
        <>
          {message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Błąd: </strong>
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <SearchInput onSearch={handleSearch} />

          {searchResults ? (
            <>
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-xl font-bold">
                  Wyniki wyszukiwania dla: "{searchQuery}"
                </h2>
                <button
                  onClick={handleGoBack}
                  className="bg-green-500 text-white py-2 px-6 rounded-md text-lg hover:bg-green-600 transition duration-300"
                >
                  Go Back
                </button>
              </div>
              <RecipesAll
                allRecipes={searchResults}
                title={`Wyniki wyszukiwania: ${searchQuery}`}
                currentPage={searchCurrentPage}
                totalResults={searchTotalResults}
                resultsPerPage={searchResultsPerPage}
                onPageChange={handleSearchPageChange}
                showLoadMoreButton={false}
                isLoading={isLoadingSearch}
              />
            </>
          ) : buttonClicked && filteredRecipes ? (
            <>
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-xl font-bold">{buttonClicked}</h2>
                <button
                  onClick={() => {
                    setButtonClicked(null);
                    setFilteredRecipes(null);
                    setMessage(null);
                    setFilteredCurrentPage(1);
                    setFilteredTotalResults(0);
                  }}
                  className="bg-green-500 text-white py-2 px-6 rounded-md text-lg hover:bg-green-600 transition duration-300"
                >
                  Go Back
                </button>
              </div>
              <RecipesAll
                allRecipes={filteredRecipes}
                title={buttonClicked}
                currentPage={filteredCurrentPage}
                totalResults={filteredTotalResults}
                resultsPerPage={filteredResultsPerPage}
                onPageChange={handleFilteredPageChange}
                showLoadMoreButton={false}
                isLoading={isLoadingFiltered}
              />
            </>
          ) : (
            <>
              <RecipeFilter
                setButtonClicked={(category) => {
                  setSearchResults(null);
                  setSearchQuery("");
                  setSearchCurrentPage(1);
                  setSearchTotalResults(0);
                  setButtonClicked(category);
                  setFilteredCurrentPage(1);
                }}
                title="Popular filters"
                activeFilter={buttonClicked}
              />
              <RecipesSlider
                title="Popular recipes"
                results={popularRecipes}
                setButtonClicked={(title) => {
                  setSearchResults(null);
                  setSearchQuery("");
                  setSearchCurrentPage(1);
                  setSearchTotalResults(0);
                  setButtonClicked(title);
                  setFilteredCurrentPage(1);
                }}
                isLoading={isLoadingPopular}
              />
              <RecipesSlider
                title="High protein recipes"
                results={highProteinRecipes}
                setButtonClicked={(title) => {
                  setSearchResults(null);
                  setSearchQuery("");
                  setSearchCurrentPage(1);
                  setSearchTotalResults(0);
                  setButtonClicked(title);
                  setFilteredCurrentPage(1);
                }}
                isLoading={isLoadingHighProtein}
              />
              <RecipesSlider
                title="Easy recipes"
                results={easyRecipes}
                setButtonClicked={(title) => {
                  setSearchResults(null);
                  setSearchQuery("");
                  setSearchCurrentPage(1);
                  setSearchTotalResults(0);
                  setButtonClicked(title);
                  setFilteredCurrentPage(1);
                }}
                isLoading={isLoadingEasy}
              />

              <RecipesAll
                allRecipes={allRandomRecipes}
                title="All recipes"
                currentPage={randomRecipesPage}
                totalResults={totalRandomResults}
                resultsPerPage={defaultRandomResultsPerPage}
                onPageChange={handleLoadMoreRandomRecipes}
                showLoadMoreButton={true}
                isLoading={isLoadingRandom}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

export default Dashboard;