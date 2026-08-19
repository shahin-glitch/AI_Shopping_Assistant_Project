import { ProductItem } from "../../src/types.js";

type FlipkartPrice = { amount?: number; currency?: string };

function formatPrice(amount?: number, currency = "INR") {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return undefined;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function readAmount(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && typeof (value as FlipkartPrice).amount === "number") return (value as FlipkartPrice).amount;
  return undefined;
}

/** Searches Flipkart's official Affiliate API with server-only credentials. */
export async function searchFlipkartProducts(query: string): Promise<ProductItem[]> {
  const affiliateId = process.env.FLIPKART_AFFILIATE_ID;
  const affiliateToken = process.env.FLIPKART_AFFILIATE_TOKEN;
  if (!affiliateId || !affiliateToken) throw new Error("Flipkart API is not configured. Add FLIPKART_AFFILIATE_ID and FLIPKART_AFFILIATE_TOKEN.");

  const endpoint = new URL("https://affiliate-api.flipkart.net/affiliate/1.0/search.json");
  endpoint.searchParams.set("query", query);
  endpoint.searchParams.set("resultCount", "10");
  const response = await fetch(endpoint, {
    headers: { "Fk-Affiliate-Id": affiliateId, "Fk-Affiliate-Token": affiliateToken, Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Flipkart API returned ${response.status}.`);

  const payload = await response.json() as { productInfoList?: any[] };
  const updatedAt = new Date().toISOString();
  return (payload.productInfoList ?? []).map((entry): ProductItem | undefined => {
    const item = entry.productBaseInfoV1 ?? entry.productBaseInfo;
    if (!item || item.inStock === false || item.isAvailable === false) return undefined;
    const price = readAmount(item.flipkartSpecialPrice) ?? readAmount(item.flipkartSellingPrice) ?? readAmount(item.sellingPrice);
    if (!price || !item.title || !item.productUrl) return undefined;
    const mrp = readAmount(item.maximumRetailPrice) ?? readAmount(item.mrp);
    const highlights = Array.isArray(entry.categorySpecificInfoV1?.keySpecs)
      ? entry.categorySpecificInfoV1.keySpecs.slice(0, 4)
      : String(entry.categorySpecificInfoV1?.keySpecs ?? "").split("|").map((spec) => spec.trim()).filter(Boolean).slice(0, 4);
    const seller = entry.productShippingInfoV1?.sellerInfoList?.[0]?.sellerName ?? entry.productShippingBaseInfo?.shippingOptions?.[0]?.sellerName;
    return {
      id: `flipkart-${item.productId ?? item.title}`, title: item.title, platform: "Flipkart" as const,
      price: formatPrice(price)!, numericPrice: price, originalPrice: formatPrice(mrp),
      discount: mrp && mrp > price ? `${Math.round(((mrp - price) / mrp) * 100)}% off` : undefined,
      // The Affiliate search response does not supply a product rating. Never use seller rating as a product rating.
      rating: 0, reviewsCount: "Rating not supplied by API", isBestSeller: false,
      deliveryTime: entry.productShippingInfoV1?.shippingOptions?.[0]?.deliveryTime, seller, highlights, pros: [],
      url: item.productUrl, availability: "In stock", imageUrl: item.imageUrls?.["400x400"] ?? item.imageUrls?.["200x200"],
      dataSource: "official-api" as const, lastUpdated: updatedAt,
    } satisfies ProductItem;
  }).filter((item): item is ProductItem => Boolean(item));
}
