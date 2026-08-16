import React, { useState } from "react";
import { ProductItem } from "../types.js";
import {
  ExternalLink,
  Star,
  CheckCircle,
  Truck,
  Award,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldCheck,
} from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
  viewMode: "grid" | "list";
  isCompared: boolean;
  onToggleCompare: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  isCompared,
  onToggleCompare,
}) => {
  const [showReviewsDetail, setShowReviewsDetail] = useState(false);

  // Platform specific clean text badge styling (strictly monochrome)
  const getPlatformBadgeStyle = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "amazon":
        return "border-black bg-black text-white";
      case "flipkart":
        return "border-black bg-white text-black font-semibold";
      case "myntra":
        return "border-black bg-neutral-900 text-white";
      case "meesho":
        return "border-black bg-neutral-100 text-black";
      default:
        return "border-black bg-white text-black";
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className={`border-2 border-black bg-white flex flex-col justify-between transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
        viewMode === "list" ? "p-4 sm:p-5" : "p-4 sm:p-5"
      }`}
    >
      <div>
        {/* Top Header Row: Platform Badge, Badges, Compare Checkbox */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/10">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-mono uppercase px-2.5 py-0.5 border ${getPlatformBadgeStyle(
                product.platform
              )}`}
            >
              {product.platform}
            </span>

            {product.isBestSeller && (
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 bg-black text-white flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>#1 Best Seller</span>
              </span>
            )}

            {product.badge && !product.isBestSeller && (
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 border border-black/30 bg-neutral-50 text-black">
                {product.badge}
              </span>
            )}
          </div>

          {/* Compare toggle */}
          <button
            type="button"
            onClick={() => onToggleCompare(product)}
            className={`text-xs font-mono px-2 py-1 border transition-colors flex items-center gap-1.5 ${
              isCompared
                ? "bg-black text-white border-black font-medium"
                : "bg-white text-neutral-600 border-black/20 hover:border-black hover:text-black"
            }`}
            title="Add to side-by-side comparison"
          >
            <span className="w-3 h-3 border border-current flex items-center justify-center text-[9px]">
              {isCompared && "✓"}
            </span>
            <span className="hidden sm:inline">Compare</span>
          </button>
        </div>

        {/* Product Title */}
        <div className="mt-3">
          <h3 className="font-semibold text-base sm:text-lg text-black leading-snug tracking-tight line-clamp-2">
            {product.title}
          </h3>
        </div>

        {/* Price and Rating Row */}
        <div className="mt-3 flex items-baseline justify-between gap-2 flex-wrap pt-2 border-t border-black/5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold font-mono text-black tracking-tight">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through font-mono">
                {product.originalPrice}
              </span>
            )}
            {product.discount && (
              <span className="text-xs font-mono font-semibold text-black bg-neutral-100 px-1.5 py-0.5 border border-black/20">
                {product.discount}
              </span>
            )}
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 text-xs font-mono bg-neutral-50 px-2 py-1 border border-black/15">
            <Star className="w-3.5 h-3.5 fill-black text-black" />
            <span className="font-bold text-black">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-500">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Delivery & Seller Note */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-600 font-mono">
          {product.deliveryTime && (
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-black" />
              <span>{product.deliveryTime}</span>
            </div>
          )}
          {product.seller && (
            <div className="text-[11px] text-neutral-500 truncate max-w-[160px]">
              Sold by: <span className="text-black font-medium">{product.seller}</span>
            </div>
          )}
        </div>

        {/* Key Highlights / Specs */}
        {product.highlights && product.highlights.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-black/10">
            <div className="text-[11px] uppercase font-mono tracking-wider text-neutral-500 mb-1.5">
              Key Specifications:
            </div>
            <ul className="space-y-1 text-xs text-neutral-800">
              {product.highlights.map((spec, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="font-bold text-black leading-none mt-1">•</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Customer Review Summary Accordion (Pros & Cons) */}
        <div className="mt-3.5 pt-2 border-t border-black/10">
          <button
            type="button"
            onClick={() => setShowReviewsDetail(!showReviewsDetail)}
            className="w-full flex items-center justify-between text-xs font-mono text-neutral-700 hover:text-black py-1"
          >
            <span>Buyer Feedback Summary</span>
            {showReviewsDetail ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showReviewsDetail && (
            <div className="mt-2 p-2.5 bg-neutral-50 border border-black/15 text-xs space-y-2 font-normal">
              {product.pros && product.pros.length > 0 && (
                <div>
                  <span className="font-semibold text-black uppercase font-mono text-[10px] block mb-1">
                    ✓ What buyers liked:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-neutral-700 pl-1">
                    {product.pros.map((pro, pIdx) => (
                      <li key={pIdx}>{pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.cons && product.cons.length > 0 && (
                <div className="pt-1 border-t border-black/10">
                  <span className="font-semibold text-black uppercase font-mono text-[10px] block mb-1">
                    ✕ Things to consider:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-neutral-700 pl-1">
                    {product.cons.map((con, cIdx) => (
                      <li key={cIdx}>{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Downward Section: Direct Platform Link Button */}
      <div className="mt-5 pt-3.5 border-t-2 border-black">
        <a
          id={`buy-link-${product.id}`}
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-black text-white hover:bg-neutral-800 py-2.5 px-4 text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors uppercase font-mono"
        >
          <span>View on {product.platform}</span>
          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
        </a>
        <div className="mt-1 text-center">
          <span className="text-[10px] font-mono text-neutral-400">
            Opens direct live search / product page on {product.platform}
          </span>
        </div>
      </div>
    </div>
  );
};
