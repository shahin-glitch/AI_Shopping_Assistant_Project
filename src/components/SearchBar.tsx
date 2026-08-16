import React, { useState } from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  currentQuery: string;
}

const POPULAR_SEARCHES = [
  "Gaming Laptop",
  "Wireless Earbuds",
  "Running Shoes",
  "Cotton Kurta",
  "Smartwatch AMOLED",
  "Air Fryer 4L",
  "Mechanical Keyboard",
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  currentQuery,
}) => {
  const [inputValue, setInputValue] = useState(currentQuery || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleChipClick = (term: string) => {
    setInputValue(term);
    onSearch(term);
  };

  const handleClear = () => {
    setInputValue("");
  };

  return (
    <section id="search-section" className="w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center border-2 border-black bg-white shadow-none transition-all">
          <div className="pl-3.5 sm:pl-4 text-black flex items-center justify-center">
            <Search className="w-5 h-5 text-black stroke-[2.2]" />
          </div>

          <input
            id="product-search-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search any product (e.g. laptop, running shoes, headphones, kurta)..."
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 pl-3 pr-24 sm:pr-28 text-sm sm:text-base text-black bg-transparent outline-none placeholder:text-neutral-400 font-normal"
            autoComplete="off"
          />

          <div className="absolute right-1.5 flex items-center gap-1.5">
            {inputValue && !isLoading && (
              <button
                type="button"
                id="clear-search-btn"
                onClick={handleClear}
                className="p-1.5 text-neutral-500 hover:text-black transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="search-submit-btn"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Quick Searches */}
      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-mono uppercase text-neutral-500 tracking-wider mr-1">
          Try:
        </span>
        {POPULAR_SEARCHES.map((tag) => (
          <button
            key={tag}
            id={`popular-chip-${tag.toLowerCase().replace(/\s+/g, "-")}`}
            type="button"
            onClick={() => handleChipClick(tag)}
            disabled={isLoading}
            className={`text-xs px-2.5 py-1 border transition-colors ${
              inputValue.toLowerCase() === tag.toLowerCase()
                ? "border-black bg-black text-white font-medium"
                : "border-neutral-300 bg-white text-black hover:border-black hover:bg-neutral-50"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
};
