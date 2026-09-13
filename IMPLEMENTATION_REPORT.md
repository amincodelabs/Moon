# AvaStar landing page implementation

Completed the main homepage in the previously empty repository. Preview: http://127.0.0.1:5173.

## Decisions and implementation

- React 19, strict TypeScript, Vite, Lucide, and self-hosted Vazirmatn Variable. CSS tokens support midnight navy/gold dark mode and a warm neutral light mode.
- Original cinematic hero, four image-led destination features, three sample products with working detail-image galleries, education/tour previews, magazine feature, interactive four-step journey, support preview, and footer.
- Full Persian RTL and English LTR copy, localized metadata, persistent language and dark/light/system preferences, and early theme initialization.
- Dismissible configured campaign, search suggestions, mobile navigation, demo login/logout, and honest coming-soon destinations. Native dialogs include explicit keyboard wrapping, Escape dismissal, and restoration to the original trigger even when one panel opens another.
- Six original image-generation outputs, optimized into responsive local WebP variants totaling approximately 624 KB. Assets and prompts: `public/images/`, `ASSET_CREDITS.md`, and `scripts/asset-prompts.json`. Original assets were created using the built-in image generation tool; no Celestron assets were reused.

## Files added

- App entry and configuration: `index.html`, `package.json`, lockfile, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `playwright.config.ts`, `.gitignore`, and `.prettierignore`.
- Page implementation: `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/locales.ts`, `src/data.ts`, `src/preferences.ts`, and focused files in `src/components/`.
- Assets: `public/images/`, favicon, robots file, and font/icon license copies.
- Verification and documentation: `tests/landing.spec.ts`, `tests/visual.spec.ts`, `artifacts/`, `scripts/`, `README.md`, `ASSET_CREDITS.md`, and this report.

## Verification results

| Command / check                       | Result                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run format:check`                | Passed                                                                                                                               |
| `npm run lint`                        | Passed                                                                                                                               |
| `npm run typecheck`                   | Passed                                                                                                                               |
| `npm run build`                       | Passed; production output in `dist/`                                                                                                 |
| `npm test`                            | 16 passed against development server                                                                                                 |
| `TEST_PRODUCTION=1 npm test`          | Final production build: 16 passed in 9.9 seconds                                                                                     |
| axe WCAG A/AA scan                    | No violations in Persian/English, dark/light, or tested search overlay                                                               |
| Browser layout and asset checks       | Passed at 360, 768, 1024, and 1440 px in both locales; no horizontal overflow, broken image requests, page errors, or console errors |
| Dependency audit after patching Sharp | Zero vulnerabilities reported                                                                                                        |

Inspected full-page Chromium screenshots in Persian dark and English light, plus the mobile first viewport. Captures of all four requested widths, English desktop/mobile, and the mobile search dialog are in `artifacts/`. Fixed theme color inheritance, footer contrast, keyboard focus wrapping, and mobile hero cropping/account-label visibility during verification.

Production application JavaScript is approximately 82.7 KB gzip; CSS is 6.6 KB gzip. Only the hero is image-preloaded, other images are lazy-loaded, fonts are local, and reduced motion removes nonessential animation. Lighthouse was not installed locally, so no Lighthouse score or field Core Web Vitals claim is made. Browser validation was performed in Chromium; Safari/Firefox and real-device field performance remain release-environment checks.

## Deliberately deferred

Only the landing page is implemented. Live authentication, product/catalog APIs, checkout, course delivery, bookings, magazine content pages, CMS, cross-platform search, AI chat/customer support, and actual contact/legal/social destinations await future integration. All relevant entry points clearly expose their preview or coming-soon state. Sample products, prices, availability, instructor, and itinerary are explicitly labeled. Before public deployment, set the absolute Open Graph asset URL for the chosen domain and configure SPA fallback routing.

## Account dashboard demo

Branch: `feature/user-panel-demo`, based on the merged `develop` branch.

Added an authenticated, UI-only account dashboard that keeps the existing AvaStar visual language while giving the account entry point a complete product surface: overview with coins and latest order, orders, wishlist, addresses, returns, and profile settings. The panel is responsive with a desktop navigation rail and mobile tab strip, localized Persian RTL and English LTR copy, and in-place language/theme controls. Empty states explain the demo scope and provide a clear route back to the store. No real authentication, customer data, or API calls were introduced.

Added `tests/user-panel.spec.ts` for dashboard rendering, tab transitions, preference changes, Escape dismissal, and keyboard focus containment. Static checks and the production build pass; the dedicated production browser suite passes all four tests.

## Full storefront demo

The store is now a separate route and React experience at `/store`; landing-page store links perform real navigation instead of opening a coming-soon modal. The storefront implements the product and customer purchasing scope from the supplied requirements as a coherent local demo: six products with multiple card/detail images, price/discount/availability, category and curated collections, free-text search, brand/price/stock filters, sorting, variants, product specifications, box contents, warranty and return policies, downloadable manuals, ratings/reviews, similar/compatible products, and content links to Tours, Education, and Magazine.

The purchasing flow includes a local anonymous cart with variant-aware quantities, removal and returnability conditions; `SKY10` voucher validation and expiry; AvaStar coin balance/eligibility/deduction; registration, sign-in, logout and recovery; editable saved addresses; standard/express delivery; online gateway and SnappPay payment simulations with success/failure/retry; order history, payment breakdowns, shipment-status copy, downloadable receipts; wishlist persistence; purchase-eligible reviews; and return request forms with request/refund statuses. A UI-only AI/support chat makes its disconnected state explicit. All state is stored in `localStorage` for the demo and all amounts are Iranian rials.

Merchandising collections are data-driven in `productCollections`: an admin can configure zero, one, or multiple ordered collections, each with its own title, description, and product IDs. Every configured collection appears sequentially above the full catalog. The full catalog applies the search, category, brand, price, availability, and sort controls and uses numbered pagination at six products per page; changing any filter resets the page to the first result page.

New files are under `src/store/` (`StoreApp`, catalog, account, purchase, model, context, UI and styles). `tests/store.spec.ts` covers deep-link navigation, browser history, filters, sorting, collections, image swipes, variants, cart persistence, voucher/coin calculations, authentication, address CRUD, both payment methods, receipt download, retry behavior, orders, reviews, returns, expiry, responsive RTL/LTR themes, reduced motion, keyboard interaction, chat, screenshots, and axe scans. Production verification: `npm run typecheck`, `npm run lint`, `npm run build`, and `TEST_PRODUCTION=1 npm test` passed with 36 tests (the opt-in performance probe remains skipped).

## Motion and sticky campaign update

The campaign and navigation now share a sticky masthead. A ResizeObserver tracks its actual height so anchor destinations stay clear of the header, including after campaign dismissal and on narrow screens. A scroll progress line is progressively enhanced where CSS scroll timelines are supported.

Added a staged hero entrance, decorative constellation tracing and orbital movement, individually staggered scroll reveals, card lift/image depth, navigation underlines, button glints, product-image transitions, refined dialog entrances, and a traveling orbital marker for journey selection. Motion lives in `src/motion.css` and `src/useLandingMotion.ts`, uses no animation dependency or continuous JavaScript scroll handler, and respects live reduced-motion changes.

Validation: formatting, ESLint, strict TypeScript/production build passed; `TEST_PRODUCTION=1 npm test` passed all **19 tests**. New regressions cover campaign/header visibility after scrolling at 360 and 1440 px, dismissal positioning, anchor clearance, reveal activation, journey movement, and live reduced-motion changes. Existing four-width layout, locale/theme, keyboard and accessibility checks also pass. Updated desktop/mobile screenshots were visually inspected. Production JavaScript is 83.2 KB gzip and CSS is 8.2 KB gzip.

## Immersive scroll storytelling

Branch: `feature/immersive-scroll-storytelling`, created from `develop`.

Preserved every existing section, all interface/content copy, and the visual identity. Reused the existing CSS/observer motion stack without installing packages. Added scroll-linked hero depth, tour-image movement, editorial image masking/scaling and a crossfade between two crops of the existing night-sky photograph. The existing two-column magazine feature now has a short sticky image hold on sufficiently wide/tall desktop viewports; normal flow remains on mobile, short screens, and with reduced motion.

Added viewport crossfades for theme and RTL/LTR changes, native touch swipe handling for product images, press/focus refinements, a progress fallback for browsers without scroll timelines, and suspension of atmospheric hero animations when offscreen. Focus and native vertical pan/pinch zoom are preserved. No content additions, imagery replacements, scroll hijacking, or dependencies were introduced.

Main changes: `src/scroll-story.css`, `src/preferenceTransition.ts`, `src/useImageSwipe.ts`, `src/useLandingMotion.ts`, preferences, and small hero/editorial/product markup changes. New behavior checks are in `tests/scroll-story.spec.ts`; the optional performance probe is in `tests/performance.spec.ts`. Motion-enabled desktop/mobile inspection captures are in `artifacts/motion-*.png`.

Verification: production browser suite passed 25 behavior/accessibility/capture tests, with the opt-in performance probe skipped in that run. The additional motion-enabled visual capture passed separately. Formatting, lint, strict TypeScript, and production build passed. Existing four-width checks reported no overflow, broken images, or page/console errors. New tests cover scroll-linked transforms, progress, sticky hold/release, image crossfade, keyboard focus after preference changes, missing-API fallbacks, native touch pan/swipe, and live reduced-motion behavior.

The before/after local Chromium probe used the same 1440 × 960 viewport and 4× CPU throttle: both recorded a **16.8 ms p95 frame interval, zero frames over 50 ms, and zero scroll CLS** over 149 sampled intervals. No regression was observed in this controlled comparison; it does not establish performance on every device. Production JS increased from 83.21 to 83.86 KB gzip; CSS from 8.16 to 9.00 KB gzip. The editorial crossfade reuses the existing 800 px hero variant: it is cached if already requested, or adds a lazy-loaded 39.5 KB request when the hero selected the larger variant.

Browser capability decisions follow the documented progressive availability of [CSS animation timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline) and the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition). Static fallbacks remain functional; real Safari/Firefox and physical-device profiling remain outside this local Chromium verification.

## Visible-motion follow-up

Verified that localhost:5173 is serving this feature branch. Strengthened the scroll treatment: the desktop hero holds for a short scroll interval and zooms up to 18%, while mobile keeps normal page flow; the existing editorial image holds longer, reveals through a clearer crop, and changes framing as the user scrolls. Section entrances are more legible and staggered.

Visual scene updates now run through `src/useScrollScenes.ts`, using a single requestAnimationFrame per scroll-event burst and only nearby scenes, with geometry reads batched before style writes. The effects no longer require CSS scroll-timeline support. Reduced-motion changes immediately clear scene progress and remove pinning. The native/fallback reading-progress implementation is unchanged.

The performance probe found that the enlarged hero could be scrolled internally by scrollIntoView. Changed its decorative overflow from hidden to clip, preventing that unintended scroll container. The final 4× CPU-throttled probe records a 16.7 ms p95 frame interval, zero frames over 50 ms, and zero scroll CLS. The regression suite includes the visible pinned-hero zoom, dismissal/anchor clearance, desktop/mobile views, keyboard, touch, reduced motion and accessibility checks. `artifacts/hero-scroll-start.png` and `artifacts/hero-scroll-zoom.png` show the same viewport before and during the opening scroll.
