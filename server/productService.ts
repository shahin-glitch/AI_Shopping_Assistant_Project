import { ProductItem, SearchResponse } from "../src/types.js";
import { searchAmazonProducts } from "./marketplace/amazon.js";
import { searchFlipkartProducts } from "./marketplace/flipkart.js";
import { chooseRecommendation, recommendationReason } from "./scoring/productScorer.js";

export function getPlatformSearchUrl(platform: string, query: string): string {
  const cleanQuery = encodeURIComponent(query.trim());
  if (platform.toLowerCase() === "amazon") return `https://www.amazon.in/s?k=${cleanQuery}`;
  if (platform.toLowerCase() === "flipkart") return `https://www.flipkart.com/search?q=${cleanQuery}`;
  return `https://www.google.com/search?q=${cleanQuery}+buy+online`;
}

type ProviderResult = { platform: "Amazon" | "Flipkart"; products: ProductItem[]; error?: string };

/**
 * Marketplace records are the source of truth. The application must never
 * generate prices, ratings, sellers, reviews, or Best Seller claims.
 */
export async function searchProductsWithAI(query: string, currency = "INR"): Promise<SearchResponse> {
  if (currency !== "INR") throw new Error("This India-marketplace comparison currently supports INR only.");

  const outcomes = await Promise.allSettled([searchAmazonProducts(query), searchFlipkartProducts(query)]);
  const providerResults: ProviderResult[] = outcomes.map((outcome, index) => ({
    platform: index === 0 ? "Amazon" : "Flipkart",
    products: outcome.status === "fulfilled" ? outcome.value : [],
    error: outcome.status === "rejected" ? (outcome.reason instanceof Error ? outcome.reason.message : "Marketplace request failed.") : undefined,
  }));
  const products = providerResults.flatMap((provider) => provider.products);
  const recommended = chooseRecommendation(products);
  const recommendedProducts = products.map((product) => product.id === recommended?.id
    ? { ...product, isRecommended: true, recommendationReason: recommendationReason(product, products) }
    : product);
  const lowest = products.length ? [...products].sort((a, b) => a.numericPrice - b.numericPrice)[0] : undefined;
  const sourceSummary = providerResults.map((result) => result.error ? `${result.platform}: unavailable` : `${result.platform}: live`).join(" • ");

  return {
    query,
    timestamp: new Date().toISOString(),
    verdict: {
      summary: products.length
        ? `Showing ${products.length} live listings returned by the configured official marketplace APIs.`
        : "No live marketplace listings are available yet. Configure the official API credentials and search again.",
      bestPlatform: recommended?.platform ?? "Not available",
      lowestPricePlatform: lowest?.platform ?? "Not available",
      topRatedPlatform: "Not supplied by the configured APIs",
      priceDifferenceNote: lowest ? `Lowest verified listing: ${lowest.price} on ${lowest.platform}.` : "No verified price is available.",
      recommendation: recommended?.recommendationReason ?? "Do not present generated products as live data. Add valid Amazon and Flipkart credentials first.",
      searchQuery: query,
      dataNotice: sourceSummary,
    },
    products: recommendedProducts,
  };
}
