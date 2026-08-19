import React, { useState, useEffect, useMemo } from "react";
import { ProductItem, SearchResponse } from "./types.js";
import { Header } from "./components/Header.js";
import { SearchBar } from "./components/SearchBar.js";
import { AIVerdict } from "./components/AIVerdict.js";
import { PlatformFilters } from "./components/PlatformFilters.js";
import { ProductCard } from "./components/ProductCard.js";
import { ComparisonMatrix } from "./components/ComparisonMatrix.js";
import {
  ShoppingBag,
  Search,
  Sparkles,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  Layers,
} from "lucide-react";

export default function App() {
  const [query, setQuery] = useState<string>("Gaming Laptop");
  const [currency, setCurrency] = useState<string>("INR");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);

  // Filter & Sort States
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [bestSellersOnly, setBestSellersOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Comparison State
  const [comparedProducts, setComparedProducts] = useState<ProductItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Perform search API call
  const handleSearch = async (searchQuery: string, currentCurr = currency) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          currency: currentCurr,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed with status ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      setSearchData(data);
      setComparedProducts([]);
      // Reset filter on new search
      setSelectedPlatform("All");
    } catch (err: any) {
      console.error("Search fetch failed:", err);
      setError(err.message || "Failed to fetch product data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search on mount
  useEffect(() => {
    handleSearch("Gaming Laptop", "INR");
  }, []);

  // Handle currency change
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    handleSearch(query, newCurrency);
  };

  // Handle comparison toggle
  const handleToggleCompare = (product: ProductItem) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          alert("You can compare up to 4 products at a time.");
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const handleRemoveCompare = (id: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCompare = () => {
    setComparedProducts([]);
    setIsCompareOpen(false);
  };

  // Platform count aggregation
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Amazon: 0,
      Flipkart: 0,
      Myntra: 0,
      Meesho: 0,
    };
    if (searchData?.products) {
      searchData.products.forEach((p) => {
        if (counts[p.platform] !== undefined) {
          counts[p.platform]++;
        } else {
          counts[p.platform] = (counts[p.platform] || 0) + 1;
        }
      });
    }
    return counts;
  }, [searchData]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!searchData?.products) return [];

    let items = [...searchData.products];

    // Filter by platform
    if (selectedPlatform !== "All") {
      items = items.filter(
        (p) => p.platform.toLowerCase() === selectedPlatform.toLowerCase()
      );
    }

    // Filter by Best Sellers
    if (bestSellersOnly) {
      items = items.filter((p) => p.isBestSeller);
    }

    // Sorting logic
    switch (sortBy) {
      case "price-asc":
        items.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case "price-desc":
        items.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      case "rating":
        items.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        items.sort((a, b) => {
          const discountA = parseInt(a.discount?.replace(/\D/g, "") || "0", 10);
          const discountB = parseInt(b.discount?.replace(/\D/g, "") || "0", 10);
          return discountB - discountA;
        });
        break;
      case "recommended":
      default:
        // Default AI balance: Best Sellers & Best Value first
        items.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }

    return items;
  }, [searchData, selectedPlatform, bestSellersOnly, sortBy]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Sticky Minimalist Header */}
      <Header
        onOpenCompare={() => setIsCompareOpen(true)}
        compareCount={comparedProducts.length}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Search Bar Section */}
        <SearchBar
          onSearch={(q) => handleSearch(q, currency)}
          isLoading={isLoading}
          currentQuery={query}
        />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-4 py-8">
            <div className="border-2 border-black p-6 bg-white animate-pulse space-y-3">
              <div className="h-5 bg-neutral-200 w-1/3"></div>
              <div className="h-4 bg-neutral-100 w-full"></div>
              <div className="h-4 bg-neutral-100 w-4/5"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="h-16 bg-neutral-100"></div>
                <div className="h-16 bg-neutral-100"></div>
                <div className="h-16 bg-neutral-100"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="border-2 border-black/30 p-5 bg-white space-y-3 animate-pulse"
                >
                  <div className="h-4 bg-neutral-200 w-1/4"></div>
                  <div className="h-6 bg-neutral-300 w-3/4"></div>
                  <div className="h-8 bg-neutral-200 w-1/2"></div>
                  <div className="h-16 bg-neutral-100 w-full"></div>
                  <div className="h-10 bg-neutral-300 w-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && !isLoading && (
          <div className="border-2 border-black bg-neutral-50 p-4 sm:p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-semibold uppercase tracking-tight text-black">
                Search Notice
              </p>
              <p className="text-neutral-700 mt-1">{error}</p>
              <button
                onClick={() => handleSearch(query, currency)}
                className="mt-3 px-3 py-1.5 bg-black text-white text-xs font-mono flex items-center gap-1.5 hover:bg-neutral-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchData && (
          <>
            {/* AI Verdict & Executive Summary */}
            <AIVerdict
              verdict={searchData.verdict}
              totalProducts={searchData.products.length}
            />

            {/* Platform Filters, Sorting, and View Modes */}
            <PlatformFilters
              selectedPlatform={selectedPlatform}
              onSelectPlatform={setSelectedPlatform}
              sortBy={sortBy}
              onSortChange={setSortBy}
              bestSellersOnly={bestSellersOnly}
              onToggleBestSellers={() => setBestSellersOnly(!bestSellersOnly)}
              platformCounts={platformCounts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Products Listing Grid / List */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2"
                    : "flex flex-col space-y-4 pt-2"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    isCompared={comparedProducts.some((p) => p.id === product.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="border-2 border-black p-8 text-center bg-neutral-50 my-6 space-y-2">
                <p className="font-mono text-sm font-semibold uppercase">
                  No products matched the active filter
                </p>
                <p className="text-xs text-neutral-600">
                  Try switching platforms or clearing the "Best Sellers Only" toggle.
                </p>
                <button
                  onClick={() => {
                    setSelectedPlatform("All");
                    setBestSellersOnly(false);
                  }}
                  className="mt-2 px-3 py-1.5 bg-black text-white text-xs font-mono"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Compare Bar (if items selected) */}
      {comparedProducts.length > 0 && !isCompareOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-black text-white px-4 sm:px-6 py-3 border-2 border-white shadow-2xl flex items-center gap-4 text-xs font-mono max-w-[90vw]">
          <div className="flex items-center gap-2">
            <span className="font-bold">{comparedProducts.length}</span>
            <span className="text-neutral-300">
              product{comparedProducts.length > 1 ? "s" : ""} selected for comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="bg-white text-black font-semibold px-3 py-1 hover:bg-neutral-200 transition-colors uppercase text-[11px]"
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={handleClearCompare}
              className="text-neutral-400 hover:text-white underline text-[11px]"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Comparison Matrix Modal */}
      <ComparisonMatrix
        products={comparedProducts}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemoveProduct={handleRemoveCompare}
        onClearAll={handleClearCompare}
      />

      {/* Minimalist Footer */}
      <footer className="border-t border-black/10 mt-16 py-8 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="text-black font-medium">
            AI Shopping Assistant — Official marketplace data only
          </p>
          <p className="text-[11px]">
            Amazon and Flipkart listings are shown only when their official API returns them. Other marketplaces are not yet connected.
          </p>
        </div>
      </footer>
    </div>
  );
}
