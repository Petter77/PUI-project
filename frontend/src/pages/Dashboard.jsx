import axios from "axios";
import SearchInput from "../components/SearchInput";
import { useEffect, useState } from "react";
import RecipesSlider from "../components/RecipesSlider";
import RecipesAll from "../components/RecipesAll";
import RecipeFilter from "../components/RecipeFilter";

function Dashboard() {
  const [popularRecipes, setPopularRecipes] = useState(null);
  const [highProteinRecipes, setHighProteinRecipes] = useState(null);
  const [easyRecipes, setEasyRecipes] = useState(null);
  const [message, setMessage] = useState(null);
  const [allRecipes, setAllRecipes] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(null);

  const getPopularRecipes = async () => {
    await axios
      .get("/popularRecipes.json")
      .then((response) => {
        setPopularRecipes(response.data.results);
      })
      .catch((error) => {
        console.error("Error loading recipes:", error);
        setMessage("Error loading recipes");
      });
  };

  const getHighProteinRecipes = async () => {
    await axios
      .get("/highProteinRecipes.json")
      .then((response) => {
        setHighProteinRecipes(response.data.results);
      })
      .catch((error) => {
        setMessage("Error loading recipes");
      });
  };

  const getEasyRecipes = async () => {
    await axios
      .get("/easyRecipes.json")
      .then((response) => {
        setEasyRecipes(response.data.results);
      })
      .catch((error) => {
        console.error("Error loading recipes:", error);
        setMessage("Error loading recipes");
      });
  };

  const getAllRecipes = async () => {
    await axios
      .get("/allRecipes.json")
      .then((response) => {
        setAllRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error loading recipes:", error);
        setMessage("Error loading recipes");
      });
  };

  const getFilteredRecipes = async () => {
    let fetchUrl = null;

    switch (buttonClicked) {
      case "Popular recipes":
        fetchUrl = "allPopularRecipes.json";
        break;
      case "High protein recipes":
        fetchUrl = "allHighProteinRecipes.json";
        break;
      case "Easy recipes":
        fetchUrl = "allEasyRecipes.json";
        break;
      default:
        return;
    }

    try {
      const response = await axios.get(fetchUrl);
      setFilteredRecipes(response.data.results);
      setMessage(null);
    } catch (error) {
      console.error("Error loading recipes:", error);
      setMessage("Error loading recipes");
    }
  };

  useEffect(() => {
    getPopularRecipes();
    getHighProteinRecipes();
    getEasyRecipes();
    getAllRecipes();
  }, []);

  useEffect(() => {
    if (buttonClicked) {
      getFilteredRecipes();
    }
  }, [buttonClicked]);

  return (
    <>
      {(!buttonClicked || !filteredRecipes) ? (
        <>
          <SearchInput />
          <RecipeFilter setButtonClicked={setButtonClicked} title="Popular filters"/>
          <RecipesSlider
            title="Popular recipes"
            results={popularRecipes}
            message={message}
            setButtonClicked={setButtonClicked}
          />
          <RecipesSlider
            title="High protein recipes"
            results={highProteinRecipes}
            message={message}
            setButtonClicked={setButtonClicked}
          />
          <RecipesSlider
            title="Easy recipes"
            results={easyRecipes}
            message={message}
            setButtonClicked={setButtonClicked}
          />
          <RecipesAll 
            allRecipes={allRecipes} 
            title="All recipes" 
            message={message} />
        </>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setButtonClicked(null);
                setFilteredRecipes(null);
              }}
              className="bg-green-500 text-white py-2 px-6 rounded-md text-lg hover:bg-green-600 transition duration-300"
            >
              Go Back
            </button>
          </div>
          <RecipesAll allRecipes={filteredRecipes} title={buttonClicked} message={message} />
        </>
      )}
    </>
  );
}

export default Dashboard;
