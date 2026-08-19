# AI Shopping Assistant

An India-focused shopping comparison app for Smart India Hackathon. It searches the configured official Amazon India and Flipkart affiliate/catalog APIs and recommends one result from the live listings returned.

## Important data rule

Prices, availability, sellers, product titles, and badges must come from marketplace responses. The app intentionally does **not** make up products when an API is unavailable. It also shows `Rating unavailable` when the API does not provide a product rating, rather than displaying an invented rating.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add credentials for either or both marketplaces.
3. Run `npm install` and `npm run dev`.

### Amazon India (official Creators API)

Amazon Product Advertising API was retired in May 2026. This project uses its official replacement, Amazon Creators API, with the `SearchItems` endpoint for `www.amazon.in`.

You need an Amazon Associates account, approved Creators API access, a valid India partner tag, and API client credentials. Amazon requires at least ten qualifying sales in the preceding 30 days to use the API. Put the client ID, client secret, credential version, and partner tag in `.env.local`.

### Flipkart (official Affiliate API)

Register for the Flipkart Affiliate Program, generate an Affiliate Tracking ID and API Token, then add them to `.env.local`. The backend calls the official `GET /affiliate/1.0/search.json` endpoint with server-only `Fk-Affiliate-Id` and `Fk-Affiliate-Token` headers.

## Recommendation badge

The green **Best Recommended** badge is selected deterministically from returned live listings using price, information completeness, seller data, and Amazon Buy Box status when supplied. It is not the marketplace's own “Best Seller” badge.

## Marketplace coverage

Myntra, Meesho, Ajio, and Croma are intentionally not shown as live sources yet: this codebase has no official public product-search API credentials configured for them. Add a permitted partner/API integration for each before claiming live comparison coverage.
