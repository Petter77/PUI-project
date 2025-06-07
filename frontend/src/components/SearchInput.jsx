import { useState } from "react";

function SearchInput({ onSearch }) {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-4 max-w-xl mx-auto mb-20"
    >
      <input
        type="text"
        placeholder="Search for recipes..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <input
        type="submit"
        value="Search"
        className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition cursor-pointer"
      />
    </form>
  );
}

export default SearchInput;
