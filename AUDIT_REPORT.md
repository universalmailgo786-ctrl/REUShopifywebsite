# REÚ Theme — Audit Report

Date: 2 August 2026. Theme: REÚ v1.0.0 (Online Store 2.0).

## 1. Shopify Theme Check
Engine: `@shopify/theme-check-node` 3.28.0, run against the full theme.

- **Result: 0 errors, 0 warnings.**
- Issues found and fixed during the build:
  - 2 × LiquidSyntaxError (filter piped inside `t`/`image_tag` argument lists) → precomputed variables.
  - 8 × ImgWidthAndHeight (missing width/height on fallback `<img>`) → intrinsic dimensions added (CLS prevention).
  - 2 × TranslationKeyExists (gift card) → added `gift_cards.issued.*` locale keys.
  - 1 × UndefinedObject (`form` in footer newsletter) → wrapped in `{% form 'customer' %}`.
  - 2 × UnusedAssign → removed dead variables.

## 2. Content / demo cleanup
Clean-build approach (no Isabel/Envato files carried over). Grep sweep across `.liquid/.json/.css/.js`:

- `isabel`, `votto`, `handbag`, `lorem`, `lpsum`, `dummyimage`, `UA-110326897`, "sold in the last", "loved by thousands" → **none found**.
- `href="#"`, `javascript:void`, empty `href` → **none** (quiz restart + login toggles converted to `<button>`).
- `console.log` in shipped JS → **none**.
- No wishlist, quick-view, deal modules, fake countdown, Amazon affiliate, or fake sold-count anywhere.

## 3. JSON / schema validation
- All 22 template JSON + 2 section-group JSON + `settings_schema.json` + `settings_data.json` + locale JSON → **valid**.
- All 39 section `{% schema %}` blocks → **valid JSON, within limits, presets defined**.
- Every section `type` referenced by a template resolves to an existing `sections/*.liquid` → **verified**.
- Every `{% render %}` snippet exists (`icon, price, product-card, facets, pagination, breadcrumbs, preorder-notice, supplement-disclaimer`) → **verified**.

## 4. Link / asset audit
- Fallback images (`assets/reu-*.jpg`) are real supplied REÚ mockups; logo is the supplied artwork.
- No missing referenced assets; `base.css`, `components.css`, `theme.js`, `quiz.js` all present and linked.
- Social links are unset (never point to generic login pages) — merchant-configured.
- Full crawl of live routes → **Pending (store required)**.

## 5. Functional checks
| Area | Status | Note |
|---|---|---|
| Section schemas / editor presets | Pass | Coherent REÚ preview with no demo branding |
| Cart AJAX add + drawer re-render (Section Rendering API) | Pass (code) / Pending (live) | Logic implemented; needs store to exercise |
| Pre-order labelling + disclosure | Pass | Honest, metafield/setting-driven, no invented dates |
| Sticky mobile pre-order bar sync | Pass (code) / Pending (live) | IntersectionObserver + variant sync |
| Quiz full path + safety branch + no-JS fallback | Pass (logic) / Pending (live) | Non-medical, stores nothing |
| Storefront filtering / sorting / pagination | Pass (code) / Pending (live) | Native `collection.filters`, not client-side fake |
| Contact / newsletter success + error states | Pass | Native Shopify forms |
| FAQ accordion + FAQ schema | Pass | Real buttons, `aria-expanded`/`aria-controls` |
| Customer login/register/account/order/addresses | Pass (code) / Pending (live) | Requires accounts enabled |
| Predictive search | Pass (code) / Pending (live) | Predictive Search API section |

## 6. Responsive viewport audit
**Pending — requires a live/preview store.** Rendered Liquid cannot be produced locally, and the sandbox browser blocks local file/localhost preview. Design system built mobile-first (360–430 px) with: no horizontal overflow (`overflow-x:hidden`, scroll-snap rows), ≥44px tap targets, ~16px min body, `clamp()` fluid headings, `env(safe-area-inset-bottom)` on sticky bar and drawers, responsive `image_tag` with width candidates. Capture screenshots at 320/360/375/390/430/768/1024/1280/1440 on a dev store before sign-off.

## 7. Accessibility
- Semantic landmarks (`header/main/footer/nav`), skip link, one H1 per template.
- Visible focus (`:focus-visible`), keyboard drawers with focus trap + Escape + return focus.
- Accordions/quiz use real buttons with correct ARIA; live region for cart announcements.
- Icon-only controls have `aria-label`; decorative SVGs `aria-hidden`.
- Palette meets AA for the documented combinations (deep green on cream/white; white on deep green/rose).
- `prefers-reduced-motion` respected. Screen-reader pass → **Pending (live)**.

## 8. Performance
- No jQuery/Bootstrap/Owl/Slick/Swiper/Isotope. Two small vanilla JS files, `defer`-loaded.
- Native scroll-snap carousels (no carousel library). Responsive CDN images; hero uses `fetchpriority="high"`, below-the-fold images `loading="lazy"` with explicit width/height.
- Lighthouse → **Pending (store required)**. No render-blocking duplicate fonts; single CSS system split into base + components.

## 9. Known limitations
- Licensed Althy / Helvetica Now webfonts not supplied → fallback stacks in use (launch blocker).
- Browser/store-dependent checks (live functional, responsive screenshots, Lighthouse, screen-reader) are **Pending** and must be completed on a Shopify dev/preview store — not claimed as passed.
- Product marketing copy, Supplement Facts, prices, dates, and contact details are intentionally not hardcoded; enter via product data, metafields, and settings (see `LAUNCH_BLOCKERS.md`).
