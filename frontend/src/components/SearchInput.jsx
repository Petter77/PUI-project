import { useState } from "react";
import { Search } from "lucide-react"; // Importuj ikonę wyszukiwania

function SearchInput({ onSearch }) {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-4 max-w-xl mx-auto my-16 p-2 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]" // Dodano styl dla nowoczesnego kontenera
    >
      <input
        type="text"
        placeholder="Search for delicious recipes..." // Bardziej angażujący placeholder
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-grow px-4 py-3 bg-transparent text-lg text-gray-800 placeholder-gray-400 focus:outline-none" // Zwiększono padding i rozmiar fontu, usunięto widoczną ramkę
      />
      <button
        type="submit"
        className="
          flex items-center justify-center
          bg-gradient-to-br from-blue-500 to-blue-700 text-white
          px-6 py-3 rounded-xl shadow-md
          hover:from-blue-600 hover:to-blue-800
          transition-all duration-300 ease-in-out
          transform hover:scale-105 hover:shadow-lg
          focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75
          cursor-pointer
        " // Nowy styl dla przycisku
      >
        <Search className="w-6 h-6 mr-2" /> {/* Ikona lupki */}
        Search
      </button>
    </form>
  );
}

export default SearchInput;