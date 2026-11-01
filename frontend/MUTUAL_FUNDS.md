# Mutual Funds research workspace

## Design direction

A restrained research directory replaces the former generic catalogue. The page separates master-record counts from personal holdings, combines a dark fund-universe summary with category composition, and gives the dense scheme directory visual priority. Existing PortFolioX typography, violet/lime accents and light/dark tokens are retained. No other module is redesigned.

The directory includes category tabs, category/AMC filters, instant scheme-name search, individually removable filter chips, alphabetical/category/NAV/AUM sorting, sortable table headings and ten-record pagination. Table/card views preserve filters; mobile uses cards and a native filter dialog. Row actions are consolidated into keyboard-operable native disclosure menus. Research has separate scheme-fact, recorded-return and personal-SIP sections. Create/edit forms group identity, snapshot and optional returns, protect unsaved changes on cancellation and block duplicate writes while pending.

## Source-verified backend contract

| Method | Path | Permission / result |
| --- | --- | --- |
| GET | /mutual-funds | USER or ADMIN; response DTO array |
| GET | /mutual-funds/{fundId} | USER or ADMIN; DTO or 404 |
| POST | /mutual-funds | ADMIN; full request DTO; 201 |
| PUT | /mutual-funds/{fundId} | ADMIN; full request DTO; 200 or 404 |
| DELETE | /mutual-funds/{fundId} | ADMIN; 204 or 404 |
| GET | /sip-holdings | Authenticated user's SIP records only; existing SIP adapter reused |

Request/response fields remain fundId, fundName, amc, category, nav, aum, return1Day, return1Month, return6Month, return1Year, return3Year, return5Year. Categories are EQUITY, DEBT, HYBRID and OTHERS. All values are persisted; this service calculates none of them. Fund masters are a shared catalogue. SIP holdings reference mutualFundId, are user-owned and have a unique user/fund relationship.

ID is supplied on create and immutable in the edit UI. PUT sends the complete record. Decimal inputs remain strings for Java BigDecimal precision; blank decimal fields become null. AUM is a nonnegative safe integer. The unchanged backend DTO has no validation annotations and controller lacks @Valid. UI safeguards require ID/name/AMC/category/AUM, limit text to 255 characters, validate finite decimals/nonnegative NAV and reject a duplicate ID in the loaded catalogue. Backend POST may upsert an existing ID; the loaded-ID check cannot guarantee uniqueness under concurrent writes. Delete errors, including foreign-key restrictions, are surfaced without workarounds.

## Data integrity and analytics

- Catalogue summary: record count, distinct valid categories and distinct recorded AMCs.
- Recharts horizontal category distribution counts actual master records; it is not portfolio allocation. Unknown categories are explicitly grouped as not recorded. Empty/unavailable data uses a useful information panel. The chart includes a tooltip, accessible count description and category-filter buttons with counts.
- Recharts is loaded in a separate lazy chunk only when a populated catalogue needs a chart. Chart animations are disabled; page transitions respect prefers-reduced-motion.
- My SIP records and per-fund association counts derive solely from the supplied authenticated account response. Absent data is a dash, not zero. Detail lists identify associated holding IDs and frequencies and link to the existing SIP Holdings route. Navigation opens that page normally; no unsupported fund-filter behaviour is implied or added there.
- Loaded time is the successful client fetch timestamp, not a market valuation/as-of date.
- NAV and AUM use recorded units because currency and AUM scale are unspecified. Returns appear only in the research panel as persisted, unverified figures. No price history, performance curve, portfolio valuation, CAGR/XIRR calculation or cost/return estimate is invented.
- Type, ratings, expense ratio, fund manager, asset breakdown and valuation dates are absent, so no corresponding filters or fabricated sections are shown.

## Account connection

The real route remains account-blocked and makes no private requests. Supply stable api=createMutualFundApi(options), trusted ADMIN/USER role, and optional sipApi=createSipHoldingApi(options) when authentication is implemented. The existing shared requestJson transport and existing SIP adapter are reused; neither stores credentials. No login/JWT, CORS/security or database changes are included.

A non-auth SIP failure preserves the fund catalogue and shows a separate retry message. A 401/403 from either resource clears both resources. Reads abort on unmount; unavailable, empty, malformed and failed responses stay distinct. Native dialogs support Escape and focus return. Unsaved-change confirmation keeps the form mounted; save/delete pending states prevent closing and duplicate submissions.

## Redesign file inventory

Modified:
- src/pages/MutualFundsPage.jsx: workspace orchestration, view/filter state, safe mutations and cancellation.
- src/components/mutual-funds/MutualFundForm.jsx: grouped fields, helper copy, busy and dirty handling.
- src/components/mutual-funds/MutualFundDetails.jsx: fresh-read research panel with retry and SIP association.
- src/features/mutual-funds/mutualFundModel.js: category distribution, association helpers and deterministic sorting.
- src/features/mutual-funds/mutualFundApi.js: existing CRUD unchanged; optional parallel SIP loading added.
- src/features/mutual-funds/useMutualFunds.js: abortable workspace loading, client load time and account invalidation.
- src/styles/mutual-funds.css: module-scoped desktop/tablet/mobile styling and shared-dialog overrides scoped with :has(.mf-dialog-content).
- tests/mutual-funds.test.js: focused distribution, sorting, association and partial/auth-failure tests.
- tests/mutual-funds-preview.jsx: existing isolated synthetic test harness extended for errors, SIP associations and pagination. No test records enter the real page.
- package.json and package-lock.json: Recharts 3.10.1 and its dependencies; existing changes preserved.
- MUTUAL_FUNDS.md and .hallmark/log.json: implementation and design notes.

Created:
- src/components/mutual-funds/MutualFundOverview.jsx
- src/components/mutual-funds/MutualFundCategoryChart.jsx
- src/components/mutual-funds/MutualFundCatalogue.jsx
- src/components/mutual-funds/MutualFundFilters.jsx
- src/components/mutual-funds/MutualFundDialog.jsx
- src/components/mutual-funds/MutualFundSipLinks.jsx

No files removed. App routing, shared dialog/transport, SIP Holdings, Overview, IPO Tracker, landing, login, theme tokens and backend files were not edited for this redesign. Unrelated existing working-tree changes were preserved.

## Verification and limits

Production build passes without chunk-size warnings. All 40 tests pass: 8 Mutual Funds, 5 SIP, 13 IPO and 14 Overview. npm reported no dependency vulnerabilities after installation.

Browser harness checks passed: search/clear, AMC/category filters and chips, numeric sorting, table/card switching with preserved search, page 2 of 14 metadata records, research facts/returns/SIP sections, create/edit/delete, required validation, backend field errors, safe cancellation/retained values/discard, keyboard Escape/focus return, read retry, USER permissions, empty/loading/error/denied and partial SIP failure states, chart tooltip, and light/dark rendering. Browser console clean.

No document overflow at 320, 375, 414, 768, 1280 and 1440 pixels. Mobile card, native filter dialog, grouped form and research dialog were inspected. Reduced-motion disabling rules were confirmed in the rendered stylesheet and chart animations are disabled; the browser's current system preference was not changed. Existing Overview, IPO Tracker and SIP Holdings routes were navigated successfully.

Live authenticated CRUD remains unverified until account integration exists. No backend, schema or security changes were made. No commit or push performed.
