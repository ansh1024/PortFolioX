# Mutual Funds module

The real /dashboard/mutual-funds route is intentionally account-blocked until an authenticated API and trusted role are provided. It makes no private requests without that connection. No JWT/login changes, SIP Holdings, backend changes or invented fund records are included.

## Source-verified contract

GET /mutual-funds and GET /mutual-funds/{fundId}: USER or ADMIN. POST /mutual-funds, PUT /mutual-funds/{fundId}, DELETE /mutual-funds/{fundId}: ADMIN. POST returns 201, PUT returns 200, DELETE returns 204; missing records return 404. Funds are a shared catalogue, not user-owned holdings.

Request/response fields: fundId, fundName, amc, category, nav, aum, return1Day, return1Month, return6Month, return1Year, return3Year, return5Year. Categories: EQUITY, DEBT, HYBRID, OTHERS. ID is supplied on create and immutable in the UI on edit. PUT sends the complete record. Decimal values are sent as strings to preserve entered precision for Java BigDecimal; blank decimal fields become null. AUM is a nonnegative safe integer, matching the primitive long transport while avoiding JavaScript precision loss.

The backend DTO has no validation annotations and controller lacks @Valid. UI requires ID/name/AMC/category/AUM, limits text to 255 characters, validates finite decimals/nonnegative NAV, and rejects duplicate loaded IDs. Backend save may upsert an existing ID on POST: the frontend duplicate check cannot guarantee uniqueness under concurrent changes; server enforcement remains future work. Deletion errors, including foreign-key restrictions, are reported without workarounds.

NAV/AUM currency, AUM scale, return methodology, valuation dates, ratings, risk meter, expense ratio, asset breakdown and NAV history are absent. No chart is fabricated from independent return periods. Details display all persisted fields; unavailable returns are dashes. Metrics count loaded records, distinct recorded categories and AMCs only.

## Files

- src/app/App.jsx: replaces only the Mutual Funds placeholder.
- src/pages/MutualFundsPage.jsx: summary, category/AMC/search filters, sorting, pagination, details and admin CRUD orchestration.
- src/components/mutual-funds/MutualFundForm.jsx: full DTO form and validation errors.
- src/components/mutual-funds/MutualFundDetails.jsx: fresh detail read, performance periods and scheme dossier.
- src/features/mutual-funds/mutualFundModel.js: validation, payloads, formatting and filters.
- src/features/mutual-funds/mutualFundApi.js: shared requestJson adapter and loader.
- src/features/mutual-funds/useMutualFunds.js: abortable loading and refresh state.
- src/styles/mutual-funds.css: scoped existing-token styling; existing IPO dialog and control styles reused without edits.
- tests/mutual-funds.test.js: model, API and unavailable-data tests.
- tests/mutual-funds-preview.html and .jsx: isolated development-only synthetic harness, excluded from production entry.

## Verification

Production build and 31 tests (4 fund tests, 13 IPO tests, 14 Overview tests) pass. Browser harness checks: search/category/sort, details, prefilled edit, invalid required fields, create/edit/delete, USER permissions, loading/empty/error/denied states, both themes, Escape and responsive layouts at 320/375/414/768. No browser console warnings/errors. Live authenticated CRUD remains unverified. No commits or pushes.

## Future connection

Supply stable api=createMutualFundApi({baseUrl,headers}) or a custom authenticated request adapter, plus a trusted ADMIN/USER role. Backend remains authoritative. Direct connectivity also needs existing permitted CORS/proxy configuration; this task does not change security. No credentials are stored by this module.
