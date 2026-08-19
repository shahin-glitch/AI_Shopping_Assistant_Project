import React from "react";
import { ComparisonVerdict } from "../types.js";
import { Sparkles, TrendingDown, Star, CheckCircle2, AlertCircle } from "lucide-react";

interface AIVerdictProps {
  verdict: ComparisonVerdict;
  totalProducts: number;
}

export const AIVerdict: React.FC<AIVerdictProps> = ({ verdict, totalProducts }) => {
  return (
    <div
      id="ai-verdict-container"
      className="border-2 border-black bg-white p-4 sm:p-5 my-6 text-black"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/15">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-black text-white flex items-center justify-center text-xs font-mono font-bold">
            AI
          </div>
          <h2 className="text-sm sm:text-base font-semibold tracking-tight uppercase">
            AI Shopping Intelligence & Recommendation
          </h2>
        </div>
        <span className="text-xs font-mono text-neutral-600">
          Comparing {totalProducts} live items across configured marketplaces
        </span>
      </div>

      {/* Summary Narrative */}
      <p className="text-sm text-neutral-800 leading-relaxed mt-3 font-normal">
        {verdict.summary}
      </p>
      {verdict.dataNotice && (
        <p className="mt-2 text-[11px] font-mono text-neutral-600">Data source status: {verdict.dataNotice}</p>
      )}

      {/* 3 Quick Intelligence Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-black/10">
        {/* Lowest Price */}
        <div className="p-3 border border-black/20 bg-neutral-50/50">
          <div className="flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider text-neutral-600 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-black" />
            <span>Lowest Price</span>
          </div>
          <p className="text-sm font-semibold text-black">
            {verdict.lowestPricePlatform}
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Best direct promotional & card discounts
          </p>
        </div>

        {/* Top Rated */}
        <div className="p-3 border border-black/20 bg-neutral-50/50">
          <div className="flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider text-neutral-600 mb-1">
            <Star className="w-3.5 h-3.5 text-black" />
            <span>Ratings Source</span>
          </div>
          <p className="text-sm font-semibold text-black">
            {verdict.topRatedPlatform}
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Rating data returned by the marketplace API
          </p>
        </div>

        {/* Best Overall Value */}
        <div className="p-3 border border-black/20 bg-neutral-50/50">
          <div className="flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider text-neutral-600 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            <span>Best Overall Pick</span>
          </div>
          <p className="text-sm font-semibold text-black">
            {verdict.bestPlatform}
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Deterministic live-data recommendation
          </p>
        </div>
      </div>

      {/* Price Difference & Recommendation Advice */}
      <div className="mt-3.5 pt-3 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-700 bg-neutral-100 p-2.5">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-black shrink-0" />
          <span className="font-medium text-black">Smart Tip:</span>
          <span>{verdict.recommendation}</span>
        </div>
        {verdict.priceDifferenceNote && (
          <span className="font-mono text-[11px] bg-white px-2 py-0.5 border border-black/20 font-medium text-black">
            {verdict.priceDifferenceNote}
          </span>
        )}
      </div>
    </div>
  );
};
