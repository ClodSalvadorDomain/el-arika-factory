# El Arika Factory · website

Discount furniture megastore for an Algerian manufacturer (Blida factory, 8 showrooms), in English and Arabic (RTL), prices in Algerian dinars.

**Live:** https://clodsalvadordomain.github.io/el-arika-factory/

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/, deploy anywhere (relative paths)
npm run preview   # serve dist/ on http://localhost:4173
npm run build:standalone   # standalone/: each page as one self-contained file, opens by double-click
```

**Publish changes:** commit and push `main`, then `npm run deploy`. It builds the site and pushes it to the `gh-pages` branch, which GitHub Pages serves. It pushes as the `ClodSalvadorDomain` gh login (set `GH_ACCOUNT` to use another).

**No server?** Double-click `OPEN-WEBSITE.html`. It opens `standalone/index.html`, a copy that works straight from disk. Re-run `npm run build:standalone` after any edit, or the standalone copy stays out of date.

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage: hero carousel, room shortcuts, weekly offers + countdown, promo bento, featured kitchens (tabs), services, shoppable room ideas, 3D scroll act, store teaser, reviews, newsletter |
| `category.html?c=<id>` | Listing with filters (price range, width, colour, material, style, availability), sort, load more, SEO text. Also `?c=promotions`, `?c=wishlist`, `?q=search` |
| `product.html?id=<id>` | Gallery with zoom + live 360° 3D for sofas, financing calculator, colour/size, delivery & assembly options, in-store availability, tabs with technical drawing, two carousels, mobile sticky buy bar |
| `cart.html` | Cart and 4-step checkout (cart, delivery with wilaya/date, payment: cash on delivery, CIB/Edahabia, bank installments, confirmation) |
| `stores.html` | Store locator: OpenStreetMap (Leaflet), live open/closed status, near me, directions, call |
| `showroom.html` | The scroll experience (see below) |
| `styleguide.html` | Design tokens and every component with its states |

## How the requested skills are used

- **Liquid glass (liquid-glass-js)**: `src/styles/glass.css` + `src/js/glass.js`. The library's edge/rim/base refraction model is rebuilt as a live SVG displacement filter used through `backdrop-filter`, because the original's html2canvas snapshot cannot follow a scrolling page. Add `class="glass"` for frosted glass; add `data-liquid` for real edge refraction (Chromium; other browsers keep the frosted version).
- **Liquid logo**: `src/js/liquid-logo.js` is a WebGL2 port of the liquid-metal shader, used on the showroom's emblem. The bevel map `src/assets/emblem-bevel.png` was baked with the same Poisson solve as the original.
- **ShaderGradient**: `src/react/gradient.jsx`, the moving colour field behind the homepage and showroom heroes.
- **React Three Fiber**: `src/react/sofa.jsx`, a procedural sofa (no model file) that assembles under scroll and recolours live; the same scene is the product page's 360° view.
- **Scrollcraft**: `src/vendor/scrollcraft.*` (unmodified engine) drives the showroom acts and the homepage 3D act. Brief in `docs/BRIEF.md`.

## Editing content

- Catalog, categories, stores, reviews: `src/js/data.js`
- Arabic for page markup: `src/js/ar.js`; strings built in JavaScript: `STR` in `src/js/i18n.js`
- Colours, type, radius, spacing, shadows: `src/styles/tokens.css`
- Shared header/footer: `src/partials/` (inserted at build time)

## Before launch (placeholders to replace)

- Store addresses, phone numbers, coordinates, RC/NIF numbers, social links
- The 4.7 rating and the three reviews (layout placeholders, not real customers)
- Product claims (solid wood frame, hand-wrapped foam, warranty wording, 14-day returns, free delivery over 150 000 DA, trade-in bonus) must match the client's actual policies
- Photos are Unsplash (free licence) stand-ins; swap for the client's own product shots
- Arabic copy should be reviewed by a native Algerian copywriter
- Checkout is front-end only: connect orders, CIB/Edahabia payment (SATIM) and SMS to a back end

`tools/shot.mjs` is a dev-only screenshot helper (Playwright + local Chrome).
