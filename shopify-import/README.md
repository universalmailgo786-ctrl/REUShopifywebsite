# REÚ Shopify Import Pack

## Structure
- **18 products** — 9 pouch products + 9 sachet products (separate listings)
- **2 collections only**
  - Pouch Collection (automated by tag `Pouch`)
  - Sachet Collection (automated by tag `Sachet`)

## Files
- `reu-products.csv` — import products (each format is its own product)
- `reu-collections.csv` — 2 collections only
- `reu-collection-product-map.csv` — product → collection map
- `reu-products-link-collections.csv` — handles + collection titles

## Import order
1. Import `reu-products.csv` (Products → Import)
2. Create/update Automated Collections:
   - Pouch Collection → Product tag equals `Pouch`
   - Sachet Collection → Product tag equals `Sachet`
3. Or use Matrixify with the collection CSVs

## Notes
- Delete old combined Format-variant products and goal collections if they already exist in Shopify.
- Prices are `0.00` drafts until launch pricing is confirmed.
