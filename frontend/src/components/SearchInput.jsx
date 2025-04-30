import { useState } from "react";

function SearchInput() {

    const [inputValue, setInputValue] = useState(null)

    const handleSearch = async () =>{

    }

    return ( 
        <form className="mb-20">
            <input type="text" placeholder="Search for recipes..."/>
            <input type="submit" value="Search" />
        </form>
     );
}

export default SearchInput;