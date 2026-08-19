import React from "react";
import { SlidersHorizontal, ArrowDownUp, Check, LayoutGrid, List } from "lucide-react";

interface PlatformFiltersProps {
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  bestSellersOnly: boolean;
  onToggleBestSellers: () => void;
  platformCounts: Record<string, number>;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const PLATFORMS = ["All", "Amazon", "Flipkart"];

export const PlatformFilters: React.FC<PlatformFiltersProps> = ({
  selectedPlatform,
  onSelectPlatform,
  sortBy,
  onSortChange,
  bestSellersOnly,
  onToggleBestSellers,
  platformCounts,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div
      id="filters-section"
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-black/10 text-xs"
    >
      {/* Platform Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PLATFORMS.map((platform) => {
          const count =
            platform === "All"
              ? Object.values(platformCounts).reduce((a: number, b: number) => a + b, 0)
              : platformCounts[platform] || 0;

          const isSelected = selectedPlatform === platform;

          return (
            <button
              key={platform}
              id={`filter-platform-${platform.toLowerCase()}`}
              onClick={() => onSelectPlatform(platform)}
              className={`px-3 py-1.5 border font-mono transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? "bg-black text-white border-black font-semibold"
                  : "bg-white text-black border-black/20 hover:border-black"
              }`}
            >
              <span>{platform}</span>
              <span
                className={`text-[10px] px-1 py-0.2 ${
                  isSelected ? "bg-white text-black" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Actions: Best Sellers Toggle, Sort Dropdown & View Mode */}
      <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-between md:justify-end">
        {/* Best Sellers Filter */}
        <button
          id="filter-bestsellers-btn"
          onClick={onToggleBestSellers}
          className={`px-2.5 py-1.5 border flex items-center gap-1.5 transition-colors font-mono ${
            bestSellersOnly
              ? "bg-black text-white border-black font-medium"
              : "bg-white text-black border-black/20 hover:border-black"
          }`}
        >
          <span className="w-3 h-3 border border-current flex items-center justify-center text-[10px]">
            {bestSellersOnly && "✓"}
          </span>
          <span>Best Sellers Only</span>
        </button>

        {/* Sort Select */}
        <div className="flex items-center border border-black/20 bg-white px-2 py-1">
          <ArrowDownUp className="w-3.5 h-3.5 mr-1.5 text-neutral-600" />
          <select
            id="sort-select-dropdown"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-xs font-mono text-black outline-none cursor-pointer pr-1"
          >
            <option value="recommended">Sort: AI Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        {/* Grid vs List View */}
        <div className="hidden sm:flex items-center border border-black/20">
          <button
            id="view-mode-grid-btn"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 ${
              viewMode === "grid"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-neutral-100"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            id="view-mode-list-btn"
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 border-l border-black/20 ${
              viewMode === "list"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-neutral-100"
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
