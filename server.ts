import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { searchProductsWithAI } from "./server/productService.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "ai-shopping-assistant" });
  });

  // Product Search & Comparison Endpoint
  app.post("/api/search", async (req, res) => {
    try {
      const { query, currency = "INR" } = req.body;
      if (!query || typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ error: "Product search query is required." });
      }

      console.log(`[Search] Query: "${query}", Currency: "${currency}"`);
      const result = await searchProductsWithAI(query.trim(), currency);
      return res.json(result);
    } catch (error: any) {
      console.error("[Search Error]", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch product comparisons",
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: 3000 },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Shopping Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
