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

## Motion and sticky campaign update

The campaign and navigation now share a sticky masthead. A ResizeObserver tracks its actual height so anchor destinations stay clear of the header, including after campaign dismissal and on narrow screens. A scroll progress line is progressively enhanced where CSS scroll timelines are supported.

Added a staged hero entrance, decorative constellation tracing and orbital movement, individually staggered scroll reveals, card lift/image depth, navigation underlines, button glints, product-image transitions, refined dialog entrances, and a traveling orbital marker for journey selection. Motion lives in `src/motion.css` and `src/useLandingMotion.ts`, uses no animation dependency or continuous JavaScript scroll handler, and respects live reduced-motion changes.

Validation: formatting, ESLint, strict TypeScript/production build passed; `TEST_PRODUCTION=1 npm test` passed all **19 tests**. New regressions cover campaign/header visibility after scrolling at 360 and 1440 px, dismissal positioning, anchor clearance, reveal activation, journey movement, and live reduced-motion changes. Existing four-width layout, locale/theme, keyboard and accessibility checks also pass. Updated desktop/mobile screenshots were visually inspected. Production JavaScript is 83.2 KB gzip and CSS is 8.2 KB gzip.
