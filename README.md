# AvaStar / آوااستار

A Persian-first astronomy homepage, built with React, strict TypeScript, Vite, and locally bundled Vazirmatn typography. Includes English LTR, dark/light/system themes, original astronomy imagery, product previews, learning and tour highlights, editorial content, and an interactive discovery journey.

## Run, test, build

Use Node.js 22.13+ LTS (or 24+) and npm.

```sh
npm ci
npm run dev
npx playwright install chromium
npm test
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run preview
# Run the same browser suite against the production build:
TEST_PRODUCTION=1 npm test
```

The dev server is at http://127.0.0.1:5173. The production build is in `dist/`. Deploy as a static SPA with a fallback to `index.html`; future destination paths will show a coming-soon dialog when opened directly.

## Structure and behavior

- `src/locales.ts`: complete Persian/English interface and sample copy.
- `src/data.ts`: production route definitions, campaign configuration, destination metadata, sample products, and journey steps.
- `src/preferences.ts`: persisted locale/theme, system preference listener, translated metadata. Inline initialization in `index.html` applies theme and direction before rendering to prevent incorrect-theme flash.
- `src/components/`: focused header, hero/discovery, products, experiences/editorial, journey/footer, and overlay components.
- `src/styles.css`: responsive design tokens, RTL/LTR, theme variants, restrained CSS motion and reduced-motion support.
- `tests/landing.spec.ts`: browser integration tests, all four requested viewport widths, keyboard focus, preferences, account demo, image galleries, search, support, journey, and axe accessibility checks.
- `public/images/`: optimized responsive WebP assets. See `ASSET_CREDITS.md` for provenance and licenses.

The account panel offers a local demo login; no credentials or personal information are requested. Search filters destination suggestions locally and explicitly describes future unified search. Chat presents clearly unavailable AI and customer-support options without simulating a conversation. All future links retain their intended route URLs but intercept clicks to show an accessible native modal dialog. Escape closes dialogs; focus is contained and returned to the trigger.

The campaign expires on December 1, 2026 and dismissal persists per campaign ID. All products, prices, stock statuses, instructors, and programs are labeled demo content. Product images include an explicit close-up carousel. Dates and prices are localized; all prices are in Iranian rials, not tomans. Preferences gracefully fall back if storage is unavailable.

## Deferred integrations

This phase implements only the homepage. Store, courses, tour bookings, magazine articles, authentication, checkout, account data, live search, support/AI chat, CMS/API content, legal pages, contact channels, and social accounts remain unconnected. Their links have an explicit coming-soon treatment. Replace preview data and generated generic product visuals with approved catalog/content assets before commerce launch. Configure the public origin and an absolute Open Graph image URL when a deployment domain exists.

## Verification

See `IMPLEMENTATION_REPORT.md` for completed checks and browser inspection results. Screenshots are in `artifacts/`.

## Scroll storytelling and touch

The existing CSS/Intersection Observer stack now uses native scroll timelines for hero depth, tour-image movement, and an editorial crop crossfade. On spacious desktop screens, the existing magazine image briefly stays in place as its copy passes beside it; mobile, short screens, and reduced-motion mode use the normal document flow. No wheel interception or scroll snapping is used.

Language and theme controls crossfade the current viewport with the View Transition API when supported. Reduced motion bypasses snapshots and decorative scroll effects. Unsupported browsers retain the original section entrances/static imagery, with a passive, frame-coalesced progress-bar fallback. Horizontal touch swipes change product images in the active reading direction; vertical pan and pinch zoom remain native, and visible previous/next buttons remain available.

To repeat the optional local scroll performance comparison against a production build:

```sh
PERF_PROBE=local TEST_PRODUCTION=1 npm test -- tests/performance.spec.ts
```

This Chromium probe uses 4× CPU throttling and records frame timing and scroll layout shifts in `artifacts/`. It is a local regression indicator, not a substitute for field Core Web Vitals.
