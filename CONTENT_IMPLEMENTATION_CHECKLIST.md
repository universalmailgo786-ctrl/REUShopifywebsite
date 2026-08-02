# REÚ — Content Implementation Checklist

Maps every section of `REU_Shopify_Website_Content_Brief.docx` to where it is implemented. ✅ = built with approved copy.

## Architecture (16 pages/templates)
| # | Page/template | Implementation |
|---|---|---|
| 1 | Home | ✅ `templates/index.json` (15 sections) |
| 2 | Shop All | ✅ `collection.json` → `main-collection` (all-products) |
| 3 | Collections Hub | ✅ `page.collections.json` → `collections-hub` |
| 4 | Pouch Collection | ✅ `main-collection` (collection: pouch) |
| 5 | Sachet Collection | ✅ `main-collection` (collection: sachet) |
| 6 | Product Template | ✅ `product.json` → `main-product` |
| 7 | About Us | ✅ `page.about.json` |
| 8 | Contact Us | ✅ `page.contact.json` → `contact-form` |
| 9 | FAQ | ✅ `page.faq.json` → `faq` (16 Q&As, categorised) |
| 10 | Blog Index | ✅ `blog.json` → `main-blog` |
| 11 | Blog Article | ✅ `article.json` → `main-article` |
| 12 | Quiz | ✅ `page.quiz.json` → `quiz` |
| 13 | Privacy Policy | ✅ `page.privacy-policy.json` |
| 14 | Refund Policy | ✅ `page.refund-policy.json` |
| 15 | Shipping Policy | ✅ `page.shipping-policy.json` |
| 16 | Terms & Conditions | ✅ `page.terms-conditions.json` |

## Functional states
Cart drawer ✅ · Cart page ✅ · Search + no-results ✅ · Predictive search ✅ · Customer login/register/account/order/addresses/reset/activate ✅ · 404 ✅ · Password ✅ · Gift card ✅ · Quiz results + safety branch ✅ · Newsletter success/error ✅ · Empty cart ✅ · Product unavailable/sold-out ✅ · Pre-order state ✅ · Async cart loading/success/error ✅

## Homepage sections (DOCX §05, in order)
Announcement bar ✅ · Hero (eyebrow/headline/CTAs/disclosure) ✅ · Trust strip ✅ · Shop by Goal ✅ · Featured Products ✅ · Quiz teaser + microcopy ✅ · Brand Benefits ✅ · Format Discovery ✅ · Lifestyle Story ✅ · Standards ✅ · Reviews (launch-state copy) ✅ · Journal ✅ · Pre-order Reassurance ✅ · Homepage FAQ ✅ · Newsletter + microcopy ✅ · Social (real-content only) ✅ · Footer (brand statement + link groups) ✅

## Product system (DOCX §07)
Breadcrumbs ✅ · Media gallery ✅ · Title + flavour ✅ · Verified rating **or** launch badge ✅ · Price + payment timing ✅ · Value proposition (metafield) ✅ · Format/variant selector ✅ · Quantity ✅ · Pre-Order button ✅ · Shipping + cancellation beside CTA ✅ · Sticky mobile bar ✅ · Payment/support reassurance ✅ · Accordions: Why you'll love it, How to Use, Benefits, Ingredients, Supplement Facts, Flavour & Format, Warnings & Allergens, Pre-Order & Shipping, Returns ✅ · Recommendations ✅ · Review app block ✅ · 9 product marketing descriptions → apply per product via `custom.short_description` (copy provided in brief).

## Quiz (DOCX §09)
All 8 questions ✅ · Safety branch copy ✅ · Progress/Back/Continue ✅ · Keyboard + focus ✅ · No marketing-consent gate ✅ · No storage by default ✅ · Goal→product mapping (merchant-configurable) ✅ · Result actions (Pre-Order My Match / See Why It Fits / Explore Another Goal) ✅ · Restart ✅ · No-JS fallback → Shop by Goal ✅

## Other pages
About: hero, story, mission, 5 values, closing CTA ✅ · Contact: intro, form fields + topics, consent, medical warning, success/error ✅ · FAQ: categories + FAQ schema ✅ · Journal: hero, categories, grid, article template w/ disclaimer ✅ · Policies: Shipping & Refund full drafts, Privacy & Terms required-section outlines + supplement disclaimer ✅

## Integrity rules
Pre-order honesty ✅ · No fabricated reviews/urgency/stock/facts ✅ · Supplement disclaimer in product/quiz/article/terms ✅ · Verified-claim gating ✅ · Placeholders isolated to `LAUNCH_BLOCKERS.md` + editor-only reminders ✅

## SEO (DOCX §16)
Editable titles/descriptions via Shopify ✅ · Canonical ✅ · Product JSON-LD (real data, PreOrder availability) ✅ · BreadcrumbList ✅ · FAQPage (visible content only) ✅ · BlogPosting ✅ · One H1/page ✅ · No fabricated AggregateRating ✅
