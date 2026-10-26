# PortfolioX frontend — landing page

This first frontend feature is a local React/Vite landing page, visually inspired by the user's Payless Bank reference and video. All artwork is built with CSS/SVG for PortfolioX; reference screenshots, branding, customer logos and claims are not embedded in the site.

## Run

From this directory:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the localhost URL printed by Vite. To create a production build:

```powershell
npm.cmd run build
npm.cmd run preview
```

Use `npm.cmd ci` instead of install when reproducing the committed lockfile. Node 24.14.0 was used for verification.

## Included in this step

- Responsive landing page, dark grid/ticket panels and overlapping investment-card artwork.
- Self-hosted Manrope and DM Sans fonts.
- Mobile navigation, anchor links, product-preview tabs with arrow-key navigation, native FAQ disclosures and a keyboard-accessible preview dialog.
- Reduced-motion support and an animation pause control.
- Temporary preview content isolated in `src/pages/landingPreviewData.js`; hero example values are labelled illustrative and are not real portfolio data.

## Deliberately deferred

No authentication forms, API requests, financial calculations, router, dashboard, other feature pages or charts library have been added. The sign-in/get-started buttons open an honest preview notice. No account information is collected. Existing backend code and tests are unchanged.

The React entry is `src/main.jsx`, composition is `src/app/App.jsx`, and landing-page UI is `src/pages/LandingPage.jsx`. Palette/spacing/type tokens live in `src/styles/tokens.css`; layout and responsive styles live in `src/styles/globals.css`.

Verified with a production build and browser checks at 320, 375, 414, 768 pixels and desktop. The visual reference is [Payless Bank by Irfanaffian / One Week Wonders](https://dribbble.com/shots/19567832-Payless-Bank-Finance-Landing-Page).
