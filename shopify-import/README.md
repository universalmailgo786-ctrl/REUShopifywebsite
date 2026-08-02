# REÚ Shopify Import Pack

## Files
- `reu-products.csv` — Shopify Admin product import (9 products × Format Pouch/Sachet)
- `reu-collections.csv` — Smart collections (Matrixify / Excelify compatible)
- `reu-collections-manual-setup.csv` — Same collections as a simple checklist for manual Automated Collections in Shopify Admin

## Image hosting
Product and collection images are on GitHub (public raw URLs):

`https://raw.githubusercontent.com/universalmailgo786-ctrl/REUShopifywebsite/main/product-images/...`

Shopify fetches `Image Src` during product import. The repository must remain **public** (or images otherwise publicly reachable) for auto-fetch to work.

## Import order
1. Push / confirm images are live on GitHub (already in `/product-images`).
2. Shopify Admin → **Products → Import** → upload `reu-products.csv`.
3. Create collections:
   - With **Matrixify**: import `reu-collections.csv`, or
   - Manually: Products → Collections → Create **Automated** collection using rules from `reu-collections-manual-setup.csv`, then paste each Image Src into the collection image field (or download from the URL).

## Important blanks (update before publish)
- **Variant Price** is `0.00` placeholder — replace with real retail prices.
- Products are **draft** / unpublished.
- No invented Supplement Facts, allergens, weights, barcodes, or ship dates.
- After import, add product metafields (`custom.short_description`, `custom.flavor`, `custom.goal`, `custom.format`, etc.) in bulk if desired.
