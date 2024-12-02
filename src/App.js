import { useState } from "react";
import MovieList from "./components/MovieList";
import useDebounce from "./utils/hooks/useDebounce";

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedSearchTerm = useDebounce(query, 500);

  return (
    <div>
      <header className="bg-gray-800 p-4 flex justify-center flex-col gap-6 content-center flex-wrap">
        <h1 className="text-2xl font-bold text-white text-center">
          Movie Explorer
        </h1>
        <input
          type="text"
          value={query}
          placeholder="Search movies..."
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 flex-grow bg-gray-700 rounded text-white md:w-1/2 w-2/3"
        />
      </header>
      <MovieList query={debouncedSearchTerm} />
    </div>
  );
}
