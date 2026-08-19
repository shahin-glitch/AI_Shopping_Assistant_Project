import { ProductItem } from "../../src/types.js";

let accessToken: { value: string; expiresAt: number } | undefined;

function formatPrice(amount?: number, currency = "INR") {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return undefined;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function amountFrom(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (value && typeof value === "object") {
    const candidate = value as { amount?: number; price?: { amount?: number }; displayAmount?: string };
    if (typeof candidate.amount === "number") return candidate.amount;
    if (typeof candidate.price?.amount === "number") return candidate.price.amount;
    if (candidate.displayAmount) {
      const numeric = Number(candidate.displayAmount.replace(/[^0-9.]/g, ""));
      return Number.isFinite(numeric) ? numeric : undefined;
    }
  }
  return undefined;
}

async function getAccessToken() {
  if (accessToken && accessToken.expiresAt > Date.now() + 60_000) return accessToken.value;
  const clientId = process.env.AMAZON_CREATORS_CLIENT_ID;
  const clientSecret = process.env.AMAZON_CREATORS_CLIENT_SECRET;
  const version = process.env.AMAZON_CREATORS_CREDENTIAL_VERSION ?? "3.2";
  if (!clientId || !clientSecret) throw new Error("Amazon Creators API is not configured. Add AMAZON_CREATORS_CLIENT_ID and AMAZON_CREATORS_CLIENT_SECRET.");
  const isV2 = version.startsWith("2.");
  const response = await fetch(isV2 ? "https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token" : "https://api.amazon.co.uk/auth/o2/token", {
    method: "POST", headers: { "Content-Type": isV2 ? "application/x-www-form-urlencoded" : "application/json" },
    body: isV2 ? new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret, scope: "creatorsapi/default" }) : JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret, scope: "creatorsapi::default" }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Amazon token request returned ${response.status}.`);
  const payload = await response.json() as { access_token?: string; expires_in?: number };
  if (!payload.access_token) throw new Error("Amazon token response did not contain an access token.");
  accessToken = { value: payload.access_token, expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000 };
  return accessToken.value;
}

/** Searches Amazon India's official Creators API, the PA-API replacement. */
export async function searchAmazonProducts(query: string): Promise<ProductItem[]> {
  const partnerTag = process.env.AMAZON_PARTNER_TAG;
  if (!partnerTag) throw new Error("Amazon Creators API is not configured. Add AMAZON_PARTNER_TAG.");
  const version = process.env.AMAZON_CREATORS_CREDENTIAL_VERSION ?? "3.2";
  const token = await getAccessToken();
  const response = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems", {
    method: "POST",
    headers: { Authorization: version.startsWith("2.") ? `Bearer ${token}, Version ${version}` : `Bearer ${token}`, "Content-Type": "application/json", "x-marketplace": "www.amazon.in" },
    body: JSON.stringify({ marketplace: "www.amazon.in", partnerTag, keywords: query, searchIndex: "All", itemCount: 10, availability: "Available", resources: ["images.primary.medium", "itemInfo.title", "itemInfo.features", "itemInfo.byLineInfo", "offersV2.listings.price", "offersV2.listings.availability", "offersV2.listings.isBuyBoxWinner", "offersV2.listings.merchantInfo", "offersV2.listings.dealDetails"] }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Amazon Creators API returned ${response.status}.`);
  const payload = await response.json() as { searchResult?: { items?: any[] } };
  const updatedAt = new Date().toISOString();
  return (payload.searchResult?.items ?? []).map((item): ProductItem | undefined => {
    const offer = item.offersV2?.listings?.[0];
    const price = amountFrom(offer?.price);
    const title = item.itemInfo?.title?.displayValue;
    if (!title || !price || !item.detailPageURL) return undefined;
    const saving = amountFrom(offer?.price?.savings) ?? amountFrom(offer?.dealDetails?.savings);
    const currency = offer?.price?.currency ?? "INR";
    const seller = offer?.merchantInfo?.name ?? item.itemInfo?.byLineInfo?.brand?.displayValue;
    const features = item.itemInfo?.features?.displayValues;
    return {
      id: `amazon-${item.asin ?? title}`, title, platform: "Amazon" as const, price: formatPrice(price, currency)!, numericPrice: price,
      discount: saving && saving > 0 ? `${formatPrice(saving, currency)} saving` : undefined,
      // Customer rating is not supplied in this official search response.
      rating: 0, reviewsCount: "Rating not supplied by API", isBestSeller: false, badge: offer?.isBuyBoxWinner ? "Buy Box Winner" : undefined,
      deliveryTime: offer?.availability?.message ?? undefined, seller, highlights: Array.isArray(features) ? features.slice(0, 4) : [], pros: [],
      url: item.detailPageURL, availability: "Available", imageUrl: item.images?.primary?.medium?.url,
      dataSource: "official-api" as const, lastUpdated: updatedAt,
    } satisfies ProductItem;
  }).filter((item): item is ProductItem => Boolean(item));
}
