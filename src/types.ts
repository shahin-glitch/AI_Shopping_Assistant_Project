export interface ProductItem {
  id: string;
  title: string;
  platform: 'Amazon' | 'Flipkart' | 'Myntra' | 'Meesho' | 'Croma' | 'Ajio' | 'Other';
  price: string;
  numericPrice: number;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviewsCount: string;
  isBestSeller?: boolean;
  badge?: 'Lowest Price' | 'Best Seller' | 'Top Rated' | 'Best Value' | 'Editor Pick' | string;
  deliveryTime?: string;
  seller?: string;
  highlights: string[];
  pros: string[];
  cons?: string[];
  url: string;
  availability?: string;
  imageUrl?: string;
  /** Whether this row came from a marketplace API rather than generated content. */
  dataSource?: 'official-api' | 'unavailable';
  /** Time at which the marketplace returned this listing. */
  lastUpdated?: string;
  /** The deterministic recommendation selected from the live results. */
  isRecommended?: boolean;
  /** A short, user-visible explanation for the recommendation. */
  recommendationReason?: string;
}

export interface ComparisonVerdict {
  summary: string;
  bestPlatform: string;
  lowestPricePlatform: string;
  topRatedPlatform: string;
  priceDifferenceNote: string;
  recommendation: string;
  searchQuery: string;
  dataNotice?: string;
}

export interface SearchResponse {
  query: string;
  category?: string;
  timestamp: string;
  verdict: ComparisonVerdict;
  products: ProductItem[];
}
