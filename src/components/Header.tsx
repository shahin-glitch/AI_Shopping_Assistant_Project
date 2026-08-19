import React from "react";
import { Sparkles, ShoppingBag, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onOpenCompare: () => void;
  compareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCompare,
  compareCount,
}) => {
  return (
    <header id="main-header" className="border-b border-black/10 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black text-white rounded-none flex items-center justify-center font-bold text-sm tracking-tighter">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-base sm:text-lg tracking-tight text-black leading-none">
                AI Shopping Assistant
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 border border-black/20 text-black/80">
                Live Compare
              </span>
            </div>
            <p className="text-xs text-neutral-500 hidden sm:block mt-0.5 font-normal">
              Live India comparison: Amazon • Flipkart
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-2.5 py-1.5 border border-black/20 text-xs font-mono bg-black text-white">₹ INR</span>

          {/* Compare Button if items selected */}
          {compareCount > 0 && (
            <button
              id="header-compare-btn"
              onClick={onOpenCompare}
              className="bg-black text-white px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
            >
              <span>Compare ({compareCount})</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
