import React from "react";
import { ProductItem } from "../types.js";
import { X, ExternalLink, Star, Check, AlertCircle } from "lucide-react";

interface ComparisonMatrixProps {
  products: ProductItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (id: string) => void;
  onClearAll: () => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
  onClearAll,
}) => {
  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        id="comparison-modal"
        className="bg-white border-2 border-black max-w-5xl w-full max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-neutral-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-black flex items-center gap-2">
              <span>Side-by-Side Product Comparison</span>
              <span className="text-xs font-mono bg-black text-white px-2 py-0.5 font-normal">
                {products.length} Products Selected
              </span>
            </h2>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              Direct specs, pricing, and platform breakdown
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs font-mono underline text-neutral-600 hover:text-black"
            >
              Clear all
            </button>
            <button
              id="close-compare-modal-btn"
              onClick={onClose}
              className="p-1 border border-black hover:bg-black hover:text-white transition-colors"
              title="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-4 sm:p-6 flex-1">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="p-2 sm:p-3 font-mono uppercase text-neutral-500 w-36 sm:w-44">
                  Feature / Attribute
                </th>
                {products.map((p) => (
                  <th
                    key={p.id}
                    className="p-2 sm:p-3 font-semibold text-black min-w-[200px] sm:min-w-[240px] align-top"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block px-2 py-0.5 border border-black font-mono text-xs uppercase bg-neutral-100">
                        {p.platform}
                      </span>
                      <button
                        onClick={() => onRemoveProduct(p.id)}
                        className="text-neutral-400 hover:text-black p-0.5"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs line-clamp-2">{p.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 font-normal">
              {/* Price Row */}
              <tr>
                <td className="p-2 sm:p-3 font-mono font-medium text-neutral-700 bg-neutral-50">
                  Current Price
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-2 sm:p-3">
                    <div className="font-mono font-bold text-base text-black">
                      {p.price}
                    </div>
                    {p.discount && (
                      <span className="text-[11px] font-mono text-neutral-500">
                        {p.discount} ({p.originalPrice || ""})
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating & Reviews */}
              <tr>
                <td className="p-2 sm:p-3 font-mono font-medium text-neutral-700 bg-neutral-50">
                  Rating & Reviews
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-2 sm:p-3">
                    {p.rating > 0 ? (
                      <div className="flex items-center gap-1 font-mono">
                        <Star className="w-3.5 h-3.5 fill-black text-black" />
                        <span className="font-bold">{p.rating.toFixed(1)} / 5</span>
                      </div>
                    ) : <span className="font-mono text-neutral-500">Not supplied</span>}
                    <span className="text-[11px] text-neutral-500 font-mono block mt-0.5">
                      {p.reviewsCount}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Best Seller Status */}
              <tr>
                <td className="p-2 sm:p-3 font-mono font-medium text-neutral-700 bg-neutral-50">
                  Market Status
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-2 sm:p-3 font-mono text-xs">
                    {p.isBestSeller ? (
                      <span className="font-bold text-black bg-neutral-100 px-2 py-0.5 border border-black">
                        #1 Best Seller
                      </span>
                    ) : (
                      <span className="text-neutral-500">{p.badge || "Standard Choice"}</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Delivery Speed */}
              <tr>
                <td className="p-2 sm:p-3 font-mono font-medium text-neutral-700 bg-neutral-50">
                  Delivery Time
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-2 sm:p-3 font-mono text-xs text-neutral-800">
                    {p.deliveryTime || "Standard Shipping"}
                  </td>
                ))}
              </tr>

              {/* Verified Seller */}
              <tr>
                <td className="p-2 sm:p-3 font-mono font-medium text-neutral-700 bg-neutral-50">
                  Fulfillment / Seller
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-2 sm:p-3 text-xs text-neutral-700">
                    {p.seller || `${p.platform} Official`}
                  </td>
                ))}
              </tr>

              {/* Specs Highlights */}
              <tr>
                <td className="p-2 sm:p-3 font-mono font-medium text-neutral-700 bg-neutral-50">
                  Key Specs
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-2 sm:p-3 text-xs">
                    <ul className="space-y-1 text-neutral-800">
                      {p.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Pros / Highlights from Reviews */}
              <tr>
                <td className="p-2 sm:p-3 font-mono font-medium text-neutral-700 bg-neutral-50">
                  Pros & Feedback
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-2 sm:p-3 text-xs">
                    <ul className="space-y-1 text-neutral-800">
                      {p.pros.map((pro, i) => (
                        <li key={i} className="text-neutral-800">
                          ✓ {pro}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Outbound Link Button */}
              <tr>
                <td className="p-2 sm:p-3 font-mono font-medium text-neutral-700 bg-neutral-50">
                  Action
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-2 sm:p-3">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-black text-white hover:bg-neutral-800 py-2 px-3 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Buy on {p.platform}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t-2 border-black bg-neutral-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white text-xs font-mono hover:bg-neutral-800"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
