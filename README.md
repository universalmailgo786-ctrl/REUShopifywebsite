# REÚ — Shopify Online Store 2.0 Theme

Premium women's wellness supplement theme for **REÚ** — *Live Better. Every Day.*
Built clean (no Envato/Isabel demo residue), mobile-first, pre-order-honest, and accessible.

---

## 1. Project overview

- **Architecture:** Online Store 2.0 (JSON templates + section groups + app-block support).
- **No hardcoded** product handles, collection handles, prices, dates, reviews, or contact info — everything is driven by Shopify data, metafields, section settings, and navigation menus.
- **Pre-order first:** honest "Pre-Order" labelling across cards, product page, cart, and disclosures. No fake urgency, fake reviews, fake stock, or invented supplement facts.
- **Passes Shopify Theme Check** with 0 errors / 0 warnings (engine `@shopify/theme-check-node` 3.28).

## 2. Install / upload

1. Zip the theme so the folders (`assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`) are at the **root** of the zip — use the provided `REU-Shopify-Theme.zip`.
2. Shopify admin → **Online Store → Themes → Add theme → Upload zip file**.
3. Click **Customize** to open the Theme Editor. Do not publish until the launch blockers (below and in `LAUNCH_BLOCKERS.md`) are resolved.

## 3. GitHub connection (later)

The theme folder is Git-ready (no credentials, OS metadata, demo CSVs, or archives inside).
When ready: create a repo, commit the contents of `reu-shopify-theme/`, then in Shopify use **Themes → Add theme → Connect from GitHub**. *(Not done here — owner will handle.)*

## 4. Required navigation menus

Create these in **Navigation** (handles matter — they are referenced by the theme):

| Handle | Used by | Suggested links |
|---|---|---|
| `main-menu` | Header | Shop → /collections/all · Shop by Goal (dropdown of goal collections) · Collections → /pages/collections · About REÚ → /pages/about-us · Journal → /blogs/news · Take the Quiz → /pages/quiz |
| `footer-shop` | Footer col 1 | Shop All · Pouches · Sachets · Shop by Goal · Take the Quiz |
| `footer-learn` | Footer col 2 | About · FAQ · Journal |
| `footer-support` | Footer col 3 | Contact · Shipping Policy · Refund Policy · Privacy Policy · Terms |

## 5. Required pages / templates

Create these **Pages** in admin and assign the matching template suffix:

| Page (handle) | Template |
|---|---|
| `about-us` | `page.about` |
| `contact-us` (or `contact`) | `page.contact` |
| `faq` | `page.faq` |
| `quiz` | `page.quiz` |
| `collections` | `page.collections` |
| `shipping-policy` | `page.shipping-policy` |
| `refund-policy` | `page.refund-policy` |
| `privacy-policy` | `page.privacy-policy` |
| `terms-conditions` | `page.terms-conditions` |

Blog: create a blog with handle `news` (default) for the Journal. Home/product/collection/cart/search/404/password/gift-card/customer templates are automatic.

## 6. Collections & products

- Create collections **Pouch Collection** (`pouch-collection`) and **Sachet Collection** (`sachet-collection`).
- Create the 9 product families (see `../product-images-for-upload/`). You may build them as **9 products with a Format variant (Pouch/Sachet)** or **18 separate products** — the theme supports either. Use automated collections by tag/metafield or manual collections.
- Recommended **Shop by Goal** collections (tag-based): Hydration, Beauty & Collagen, Daily Wellness, Greens & Nutrition, Energy & Performance, Weight Management, Protein & Recovery.
- Upload real product photos from `product-images-for-upload/`. The theme's homepage/section fallback images live in `assets/reu-*.jpg` and are only used until you select images in the editor.

## 7. Metafield definitions (product)

Define these (Settings → Custom data → Products). All optional — empty rows/accordions hide automatically.

| Namespace.key | Type | Product-page use |
|---|---|---|
| `custom.short_description` | Single line text | One-sentence value proposition |
| `custom.goal` | Single line text | Shown by title, quiz mapping |
| `custom.flavor` | Single line text | Card + title meta |
| `custom.format` | Single line text | Card meta (Pouch/Sachet) |
| `custom.preorder_ship_window` | Single line text | Ship estimate beside CTA (overrides global) |
| `custom.key_benefits` | Rich text | "Why you'll love it" accordion |
| `custom.how_to_use` | Rich text | "How to Use" accordion |
| `custom.ingredients` | Rich text | "Ingredients" accordion |
| `custom.supplement_facts` | Rich text | "Supplement Facts" accordion |
| `custom.warnings_allergens` | Rich text | "Warnings & Allergens" accordion |
| `custom.format_details` | Rich text | "Flavour & Format" accordion |

Review rating (optional, only shows when present): `reviews.rating` (rating type) + `reviews.rating_count` (integer) — matches the Shopify Product Reviews / Judge.me convention.

## 8. Pre-order configuration

1. Install a Shopify-compatible **pre-order app** (or use native selling plans/purchase options). Add its app block on the product page if it provides one.
2. Theme Settings → **Pre-order**: keep *Store is in pre-order launch mode* on. Set **Estimated shipping window** and **Support email** only once confirmed in writing (leave blank otherwise — the theme shows honest fallback copy and an editor-only reminder).
3. Set `custom.preorder_ship_window` per product when windows differ.
4. The theme never captures payment itself and never shows "In Stock" for pre-orders. Accelerated checkout should be disabled in your pre-order app if unsupported.

## 9. Reviews / live chat / social app blocks

- **Reviews:** add your app's block to the homepage *Reviews* section and the product *Reviews (app)* section. Until real reviews exist, the launch message "Be among the first to experience REÚ." shows.
- **Live chat:** install as a Shopify app embed. The sticky mobile pre-order bar respects `env(safe-area-inset-bottom)` and won't cover a launcher.
- **Social feed:** add real images or a feed app block to the *Social feed* section; it stays hidden on the live site until real content is added.

## 10. Fonts & licensing

Brand fonts are **Althy Regular** (display) and **Helvetica Now** (body). No licensed webfont files were supplied, so the theme uses tasteful fallbacks (editorial serif + system sans). To self-host once licensed:
1. Add `.woff2` files to `assets/`.
2. Add `@font-face` rules (a commented template is noted in `theme.liquid`).
3. Update **Theme Settings → Typography** stacks to lead with the real family names.
See `LAUNCH_BLOCKERS.md`.

## 11. Quiz configuration

The quiz page (`page.quiz`) works out of the box (non-medical, stores nothing). To wire recommendations, open the **Quiz** section and, for each goal result block, pick a **Primary** and **Secondary** product and an **Explore** link. Unmapped goals fall back gracefully to Shop by Goal.

## 12. Image replacement guidance

- Homepage sections use `assets/reu-*.jpg` as fallbacks so the preview is branded immediately. Replace them by choosing real images in each section.
- Product images: upload from `product-images-for-upload/`.
- Keep alt text meaningful; decorative images use empty alt.

## 13. Theme structure

```
assets/      base.css, components.css, theme.js, quiz.js, reu-*.jpg, reu-logo.png
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid, gift_card.liquid
locales/     en.default.json
sections/    header/footer groups + all page & homepage sections
snippets/    icon, price, product-card, facets, pagination, breadcrumbs, preorder-notice, supplement-disclaimer
templates/   index.json + all page/product/collection/blog/customer templates
```
