import { ProductItem } from "../../src/types.js";

export function chooseRecommendation(products: ProductItem[]): ProductItem | undefined {
  if (!products.length) return undefined;
  const lowestPrice = Math.min(...products.map((product) => product.numericPrice).filter(Boolean));
  return [...products].sort((a, b) => recommendationScore(b, lowestPrice) - recommendationScore(a, lowestPrice) || a.numericPrice - b.numericPrice)[0];
}

function recommendationScore(product: ProductItem, lowestPrice: number) {
  const priceScore = lowestPrice > 0 ? Math.min(45, (lowestPrice / product.numericPrice) * 45) : 0;
  const infoScore = Math.min(25, product.highlights.length * 6);
  const sellerScore = product.seller ? 10 : 0;
  const buyBoxScore = product.badge === "Buy Box Winner" ? 15 : 0;
  return priceScore + infoScore + sellerScore + buyBoxScore;
}

export function recommendationReason(product: ProductItem, products: ProductItem[]) {
  const lowestPrice = Math.min(...products.map((item) => item.numericPrice));
  if (product.numericPrice === lowestPrice) return "Lowest live price among the verified listings returned.";
  if (product.badge === "Buy Box Winner") return "Amazon Buy Box winner with live official listing data.";
  return "Best balance of live price and product details returned by the official APIs.";
}
