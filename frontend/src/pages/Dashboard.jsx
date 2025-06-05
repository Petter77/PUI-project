import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import SearchInput from "../components/SearchInput";
import RecipesSlider from "../components/RecipesSlider";
import RecipesAll from "../components/RecipesAll";
import RecipeFilter from "../components/RecipeFilter";

function Dashboard() {
  const [popularRecipes, setPopularRecipes] = useState(null);
  const [highProteinRecipes, setHighProteinRecipes] = useState(null);
  const [easyRecipes, setEasyRecipes] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(null);
  const [message, setMessage] = useState(null);

  const [allRandomRecipes, setAllRandomRecipes] = useState(null);
  const [randomRecipesPage, setRandomRecipesPage] = useState(1);
  const [totalRandomResults, setTotalRandomResults] = useState(0);
  const defaultRandomResultsPerPage = 28;

  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1);
  const [filteredTotalResults, setFilteredTotalResults] = useState(0);
  const filteredResultsPerPage = 20;

  // Dodane do wyszukiwania
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

  const getRecipes = useCallback(
    async (
      url,
      setter,
      label,
      includeTotalResults = false,
      totalSetter = null,
      retries = 3
    ) => {
      try {
        const res = await axios.get(url, API_HEADERS);
        setter(res.data.results);
        setMessage(null);
        if (includeTotalResults && totalSetter && res.data.totalResults !== undefined) {
          totalSetter(res.data.totalResults);
        }
      } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return getRecipes(url, setter, label, includeTotalResults, totalSetter, retries - 1);
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
      }
    },
    []
  );

  useEffect(() => {
    const fetchInitialDataSequentially = async () => {
      await getRecipes(
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?sort=popularity&number=10",
        setPopularRecipes,
        "popularnych przepisów"
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await getRecipes(
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?minProtein=30&number=10",
        setHighProteinRecipes,
        "przepisów wysokobiałkowych"
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await getRecipes(
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?maxReadyTime=30&number=10",
        setEasyRecipes,
        "łatwych przepisów"
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const initialRandomUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?sort=random&number=${defaultRandomResultsPerPage}&offset=0`;
      getRecipes(initialRandomUrl, (newRecipes) => {
        setAllRandomRecipes(newRecipes);
      }, "wszystkich losowych przepisów", true, setTotalRandomResults);
    };
    fetchInitialDataSequentially();
  }, [getRecipes, defaultRandomResultsPerPage]);

  useEffect(() => {
    if (randomRecipesPage > 1) {
      const offset = (randomRecipesPage - 1) * defaultRandomResultsPerPage;
      const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?sort=random&number=${defaultRandomResultsPerPage}&offset=${offset}`;
      getRecipes(
        url,
        (newRecipes) => {
          setAllRandomRecipes((prevRecipes) => [...(prevRecipes || []), ...newRecipes]);
        },
        `kolejnych losowych przepisów (strona ${randomRecipesPage})`,
        true,
        setTotalRandomResults
      );
    }
  }, [randomRecipesPage, getRecipes, defaultRandomResultsPerPage]);

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
          return;
      }
      getRecipes(filterUrl, setFilteredRecipes, label, true, setFilteredTotalResults);
    }
  }, [buttonClicked, filteredCurrentPage, getRecipes, filteredResultsPerPage]);

  const handleFilteredPageChange = (page) => {
    setFilteredCurrentPage(page);
  };

  const handleLoadMoreRandomRecipes = () => {
    setRandomRecipesPage((prevPage) => prevPage + 1);
  };

  // Nowa funkcja wyszukiwania z paginacją
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

    await getRecipes(url, setSearchResults, `wyników wyszukiwania dla "${query}"`, true, setSearchTotalResults);
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
  };

  return (
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
          />
        </>
      ) : !buttonClicked || !filteredRecipes ? (
        <>
          <RecipeFilter
            setButtonClicked={(category) => {
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
              setButtonClicked(title);
              setFilteredCurrentPage(1);
            }}
          />
          <RecipesSlider
            title="High protein recipes"
            results={highProteinRecipes}
            setButtonClicked={(title) => {
              setButtonClicked(title);
              setFilteredCurrentPage(1);
            }}
          />
          <RecipesSlider
            title="Easy recipes"
            results={easyRecipes}
            setButtonClicked={(title) => {
              setButtonClicked(title);
              setFilteredCurrentPage(1);
            }}
          />

          <RecipesAll
            allRecipes={allRandomRecipes}
            title="All recipes"
            currentPage={randomRecipesPage}
            totalResults={totalRandomResults}
            resultsPerPage={defaultRandomResultsPerPage}
            onPageChange={handleLoadMoreRandomRecipes}
            showLoadMoreButton={true}
          />
        </>
      ) : (
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
          />
        </>
      )}
    </>
  );
}

export default Dashboard;
