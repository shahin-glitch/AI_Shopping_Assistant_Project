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
}

export interface ComparisonVerdict {
  summary: string;
  bestPlatform: string;
  lowestPricePlatform: string;
  topRatedPlatform: string;
  priceDifferenceNote: string;
  recommendation: string;
  searchQuery: string;
}

export interface SearchResponse {
  query: string;
  category?: string;
  timestamp: string;
  verdict: ComparisonVerdict;
  products: ProductItem[];
}
