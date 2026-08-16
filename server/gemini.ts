import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export const productSearchResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Brief 2-3 sentence overview of the products found across platforms and price variance.",
    },
    bestPlatform: {
      type: Type.STRING,
      description: "Name of the best overall platform to buy from (e.g., Amazon, Flipkart, Myntra, or Meesho).",
    },
    lowestPricePlatform: {
      type: Type.STRING,
      description: "Platform with the absolute lowest price found.",
    },
    topRatedPlatform: {
      type: Type.STRING,
      description: "Platform with highest average customer rating & reviews.",
    },
    priceDifferenceNote: {
      type: Type.STRING,
      description: "Clear statement of potential savings (e.g., 'Save up to ₹4,500 by purchasing on Flipkart').",
    },
    recommendation: {
      type: Type.STRING,
      description: "Actionable buying advice for the user based on warranty, delivery, reviews, and value.",
    },
    products: {
      type: Type.ARRAY,
      description: "List of 4 to 8 product comparison items across Flipkart, Amazon, Myntra, and Meesho (and Croma/Ajio if relevant).",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Clear and descriptive product title including model, variant, and specs.",
          },
          platform: {
            type: Type.STRING,
            description: "Platform name: 'Amazon', 'Flipkart', 'Myntra', 'Meesho', or 'Croma'.",
          },
          price: {
            type: Type.STRING,
            description: "Current selling price with currency symbol (e.g., '₹54,990' or '$699').",
          },
          numericPrice: {
            type: Type.NUMBER,
            description: "Clean numerical price for sorting (e.g., 54990 or 699).",
          },
          originalPrice: {
            type: Type.STRING,
            description: "MRP or original strikethrough price (e.g., '₹72,990').",
          },
          discount: {
            type: Type.STRING,
            description: "Discount percentage or tag (e.g., '25% off').",
          },
          rating: {
            type: Type.NUMBER,
            description: "Customer star rating out of 5 (e.g., 4.4).",
          },
          reviewsCount: {
            type: Type.STRING,
            description: "Total user reviews/ratings count (e.g., '18,450 ratings').",
          },
          isBestSeller: {
            type: Type.BOOLEAN,
            description: "True if this product is a Best Seller or #1 Choice on that platform.",
          },
          badge: {
            type: Type.STRING,
            description: "Optional badge like 'Lowest Price', 'Best Seller', 'Top Rated', 'Best Value', 'Fast Delivery'.",
          },
          deliveryTime: {
            type: Type.STRING,
            description: "Delivery estimate (e.g., 'Tomorrow by 9 PM' or '2-3 Days Free Delivery').",
          },
          seller: {
            type: Type.STRING,
            description: "Key seller or official store name (e.g., 'Appario Retail', 'RetailNet', 'Brand Store').",
          },
          highlights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 to 4 key technical or functional specifications.",
          },
          pros: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2 to 3 main positive takeaways from customer reviews.",
          },
          cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "1 or 2 potential drawbacks or caveats mentioned by buyers.",
          },
          url: {
            type: Type.STRING,
            description: "Direct URL to product or search query on the specific platform.",
          },
        },
        required: [
          "title",
          "platform",
          "price",
          "numericPrice",
          "rating",
          "reviewsCount",
          "highlights",
          "pros",
        ],
      },
    },
  },
  required: [
    "summary",
    "bestPlatform",
    "lowestPricePlatform",
    "topRatedPlatform",
    "recommendation",
    "products",
  ],
};
