import { useEffect, useState, useRef } from "react";
import SearchInput from "../components/SearchInput";
import SwiperRecipes from "../components/SwiperRecipes";
import axios from "axios";
import AllRecipes from "../components/allRecipes";

function Dashboard() {
    const [searchResults, setSearchResults] = useState(null);
    const [popularRecipes, setPopularRecipes] = useState(null);
    const [highProteinRecipes, setHighProteinRecipes] = useState(null);
    const [easyRecipes, setEasyRecipes] = useState(null);
    const [allRecipes, setAllRecipes] = useState(null);
    const [message, setMessage] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(false);


    const recipesContainerRef = useRef(null);  // Ref for the recipes container
    const scrollToTopRef = useRef(null); // Ref for the top of the page to scroll to

    const getPopularRecipes = async () => {
        await axios.get('/popularRecipes.json')
            .then(response => {
                setPopularRecipes(response.data.results);
            })
            .catch(error => {
                console.error('Error loading recipes:', error);
                setMessage('Error loading recipes:', error);
            });
    };

    const getHighProteinRecipes = async () => {
        await axios.get('/highProteinRecipes.json')
            .then(response => {
                setHighProteinRecipes(response.data.results);
            })
            .catch(error => {
                setMessage('Error loading recipes:', error);
            });
    };

    const getEasyRecipes = async () => {
        await axios.get('/easyRecipes.json')
            .then(response => {
                setEasyRecipes(response.data.results);
            })
            .catch(error => {
                console.error('Error loading recipes:', error);
                setMessage('Error loading recipes:', error);
            });
    };

    const getAllRecipesForCategory = async (category) => {
        let url = null;
        switch (category) {
            case 'Popular recipes':
                url = '/allPopularRecipes.json';
                break;
            case 'High protein recipes':
                url = '/allHighProteinRecipes.json';
                break;
            case 'Quick and easy recipes':
                url = '/allEasyRecipes.json';
                break;
            case 'all':
                url = '/allRecipes.json';
                break;
            default:
                return;
        }

        await axios.get(url)
            .then(response => {
                setAllRecipes(response.data.results);
                setButtonClicked(true); // Set buttonClicked to true after the recipes are fetched
            })
            .catch(error => {
                console.error('Error loading recipes:', error);
                setMessage('Error loading recipes:', error);
            });
    };

    useEffect(() => {
        getPopularRecipes();
        getHighProteinRecipes();
        getEasyRecipes();
    }, []);

    useEffect(() => {
        // Check if the ref exists before trying to scroll
        if (buttonClicked && scrollToTopRef.current) {
            console.log("Attempting to scroll to the top...");
            scrollToTopRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [buttonClicked]);  // Trigger scroll when buttonClicked changes

    return (
        <div>
            {/* Ref for the scroll target */}
            <div ref={scrollToTopRef}></div>

            {/* Conditionally render SearchInput only if the "Show All" button hasn't been clicked */}
            {!buttonClicked && <SearchInput setSearchResults={setSearchResults} />}

            {(allRecipes && buttonClicked) ? (
                <AllRecipes
                    buttonClicked={buttonClicked}
                    setButtonClicked={setButtonClicked}
                    results={allRecipes}
                    message={message}
                />
            ) : (
                <div key={buttonClicked ? 'showAllClicked' : 'initial'} ref={recipesContainerRef}>
                    <SwiperRecipes
                        title="Popular recipes"
                        results={popularRecipes}
                        message={message}
                        setButtonClicked={setButtonClicked}
                        getAllRecipesForCategory={getAllRecipesForCategory}
                    />
                    <SwiperRecipes
                        title="High protein recipes"
                        results={highProteinRecipes}
                        message={message}
                        setButtonClicked={setButtonClicked}
                        getAllRecipesForCategory={getAllRecipesForCategory}
                    />
                    <SwiperRecipes
                        title="Quick and easy recipes"
                        results={easyRecipes}
                        message={message}
                        setButtonClicked={setButtonClicked}
                        getAllRecipesForCategory={getAllRecipesForCategory}
                    />
                    
                    {/* Centered and wider Show All button */}
                    <button
                        onClick={() => getAllRecipesForCategory('all')}
                        className="mt-8 py-3 px-12 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors mx-auto block w-64"
                    >
                        Show all
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
