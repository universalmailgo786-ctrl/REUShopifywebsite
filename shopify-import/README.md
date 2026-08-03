# REÚ Shopify CSV Import Pack

Ready-to-upload files for Shopify. Product images are hosted on GitHub and return HTTP 200.

## Folder on your Mac
`/Users/bstar/Desktop/REU-Shopify-CSV-Import`

## What you get
- **18 products** — separate Pouch and Sachet listings (same formula ≠ same product)
- **2 collections only**
  1. Pouch Collection — every pouch product
  2. Sachet Collection — every sachet product
- Cross-links: each product body includes **Also Available in Another Format** to its matching handle
- Missing business data is marked `[EDITABLE — …]` — nothing invented for price, barcode, weight, servings, ingredients, facts, directions, allergens, or ship dates

## Files to upload

### 1) Products (Shopify Admin → Products → Import)
**`REU-Products-Shopify-Import.csv`**
- Native Shopify product CSV
- Includes image URLs Shopify can fetch from GitHub
- Includes Collection column (creates/assigns Pouch Collection / Sachet Collection)
- Includes SEO title + meta description
- Includes SKU; price is `0.00` until you edit; barcode/weight left blank

### 2) Collections images + membership (optional Matrixify)
**`REU-Collections-Matrixify.csv`**
- Use with Matrixify if you want collection images + product membership in one pass
- Shopify Admin cannot import collection CSVs natively

### 3) Metafields (Matrixify recommended)
**`REU-Products-Matrixify-Metafields.csv`**
- Flavour, format, pre-order, also-available handle/label
- Editable placeholders for ingredients, Supplement Facts, usage, allergens, servings, ship window

## Image URLs (verified)
Example:
https://raw.githubusercontent.com/universalmailgo786-ctrl/REUShopifywebsite/main/product-images/pouch/03-hydration-watermelon-pouch.jpg
https://raw.githubusercontent.com/universalmailgo786-ctrl/REUShopifywebsite/main/product-images/sachet/03-hydration-watermelon-sachet.jpg
https://raw.githubusercontent.com/universalmailgo786-ctrl/REUShopifywebsite/main/product-images/collections/pouch-collection.jpg

## Before publishing checklist
1. Replace every `[EDITABLE — …]` value with verified supplier/label data
2. Set real prices, barcodes, and shipping weights
3. Confirm estimated shipping date window
4. Create metafield definitions listed in the theme README (custom.flavor, custom.format, custom.also_available_handle, etc.)
5. If old combined pouch/sachet variant products exist, archive/delete them first to avoid duplicates

## Import order
1. Import `REU-Products-Shopify-Import.csv` in Shopify Admin
2. Confirm images downloaded from GitHub on each product
3. Confirm only 2 collections exist and contain the right products
4. (Optional) Import Matrixify metafields CSV
5. Edit placeholder fields in Admin before going live
