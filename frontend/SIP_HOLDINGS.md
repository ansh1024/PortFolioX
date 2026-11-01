# SIP Holdings implementation

## Contract verified from source

GET /sip-holdings: current user's holdings. GET /sip-holdings/{holdingId}: owner-scoped detail. POST /sip-holdings: create (201). PUT /sip-holdings/{holdingId}: full update (200). DELETE /sip-holdings/{holdingId}: owner-scoped delete (204). Security requires authentication. The service takes user identity from the authenticated principal; the frontend never submits user IDs.

Request whitelist: mutualFundId, units, investedAmount, startDate, sipAmount, frequency. Response additionally contains holdingId, mutualFundName, currentValue, xirr. Server generates numeric string IDs using max+1, starting at 101; concurrency safety remains backend work, unchanged here. A unique constraint allows one holding per user/fund. No status field exists. Frequencies: MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY, LUMPSUM.

Fund selection uses GET /mutual-funds through the existing createMutualFundApi adapter. Supply stable api=createSipHoldingApi(options) and fundApi=createMutualFundApi(options) instances to SipHoldingsPage when authenticated transport is ready. No token storage or login integration was added. Real route passes neither adapter and makes no private calls. Fund loading failure preserves loaded holdings but disables saving; authentication failures clear all account records.

The UI requires a selected fund, valid calendar start date, supported frequency and positive Java-int SIP amount. Units and invested amount are optional nonnegative finite decimals, sent as strings to preserve entered precision; blanks become null. DTO/controller have no validation annotations; UI checks are additional safeguards. Duplicate loaded fund associations are disabled and validated, with database uniqueness remaining authoritative. Edit preserves fund association unless explicitly changed.

## Financial display

Total invested sums persisted investedAmount only and becomes unavailable if any amount is missing or invalid. Empty authenticated results give zero; disconnected results give dashes. Monthly SIP amounts sum MONTHLY records only; quarterly, half-yearly, yearly and lump sum are excluded, with no active-status claim. Frequency breakdown counts actual records. JavaScript numeric summaries use normal display precision, not an accounting ledger.

The service neither calculates nor populates currentValue/xirr on create, and has no valuation source or payment history, so those values, P/L, projected returns, schedules and active/inactive counts are omitted. No payment is executed, scheduled or cancelled by this UI.

## Files

Modified src/app/App.jsx: SIP placeholder replaced only; navigation configuration reused unchanged.
Added src/pages/SipHoldingsPage.jsx.
Added src/components/sip-holdings/SipHoldingForm.jsx and SipHoldingDetails.jsx.
Added src/features/sip-holdings/sipHoldingApi.js, sipHoldingModel.js, useSipHoldings.js.
Added src/styles/sip-holdings.css.
Added tests/sip-holdings.test.js, tests/sip-preview.html and tests/sip-preview.jsx.
Added this document. Existing shared transport, formatting helpers, dialog and IPO control styles reused without editing them. No backend, Overview, IPO Tracker or Mutual Funds changes.

## Verification

Production build passed. All 36 tests passed (5 SIP, 4 mutual fund, 13 IPO, 14 Overview). Isolated, clearly labelled development-only fixture harness tested CRUD, fund association, required validation, server errors, search, frequency filter, sort, details, loading/empty/error/denied states and both themes. No document overflow at 320, 375, 414, 768 or 1440 pixels. Browser console clean. The test harness never contacts the backend and is not a production entry. Live authenticated CRUD remains unverified until account integration is implemented. No commit or push performed.

## Visual refinement

SIP-only redesign replaces the repeated summary-card structure with a dark portfolio feature panel, CSS coin sculpture, live record-count frequency dial, larger coloured-cover holding cards and an illustrated onboarding state. The sculpture is decorative and has no financial scale. Dial legend buttons filter the existing holding collection; unknown frequencies are explicitly counted. Entry and hover transitions respect reduced motion. Source edits are limited to SipHoldingsPage.jsx and sip-holdings.css, plus this note. Financial contracts, adapters and CRUD remain unchanged. Browser checks covered light/dark modes, 320/375/414/768/1440 widths, dial filtering, details/edit, and unavailable states.
