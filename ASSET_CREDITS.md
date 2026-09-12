# AvaStar asset credits

All raster visuals in `public/images/` are original AI-generated imagery created with the built-in OpenAI image generation tool on 2026-09-12. No Celestron photographs, logos, wording, or graphics were reused. Generated scenes are illustrative, not documentary location photographs; equipment depicts generic sample products, not named manufacturer models. The galaxy image is an artistic rendering, not scientific observation data.

| Assets (WebP variants)                | Creation / use                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| `hero-800`, `hero-1600`               | Original desert Milky Way scene with observer and telescope. Homepage hero.      |
| `sky-400`, `sky-800`                  | Optimized crop of the hero sky. Learning and observing editorial.                |
| `telescope-*`, `telescope-detail-*`   | Original unbranded refractor studio photograph-style visual and detail crop.     |
| `binoculars-*`, `binoculars-detail-*` | Original unbranded binoculars studio visual and detail crop.                     |
| `eyepiece-*`, `eyepiece-detail-*`     | Original unbranded eyepiece studio visual and detail crop.                       |
| `tour-400`, `tour-800`                | Original desert stargazing group scene. No factual location claim for the image. |
| `galaxy-400`, `galaxy-800`            | Original Andromeda galaxy visualization for the magazine destination.            |

Images are locally served, converted to WebP with responsive sizes. Product gallery second images are detail crops, not invented alternate product angles. Generation prompts are preserved in `scripts/asset-prompts.json`. The optimization script accepts a directory of the original PNG outputs; the original files remain in the generating session’s asset directory. Committed WebP files are sufficient to run/build the site.

## Non-generated assets

- **Vazirmatn Variable** — The Vazirmatn Project Authors, originally led by Saber Rastikerdar. Source: https://github.com/rastikerdar/vazirmatn. Distribution: https://fontsource.org/fonts/vazirmatn. License: SIL Open Font License 1.1, copied to `public/licenses/vazirmatn-OFL.txt`. Fonts are bundled locally through `@fontsource-variable/vazirmatn`.
- **Lucide icons** — Lucide Contributors. Source: https://lucide.dev / https://github.com/lucide-icons/lucide. ISC license, copied to `public/licenses/lucide.txt`. Bundled locally through `lucide-react`.
- **Favicon and wordmark composition** — Original project SVG and typography composition. The wordmark’s sparkle uses Lucide.

## Information architecture reference

https://www.celestron.com/ was inspected on 2026-09-12 for discoverable category navigation, promotional features, learning paths, and support entry points. AvaStar’s layout, copy, brand composition, and visual assets are original.
