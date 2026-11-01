# Overview dashboard

The real `/dashboard` route contains no fixture financial data. It currently shows **Account not connected** because Login has no authenticated session. No private requests are sent, no tokens are read/stored, and no backend/security files are changed.

## Read endpoints prepared for future authenticated integration

| Endpoint | Scope and supported display |
| --- | --- |
| `GET /ipo-applications` | Current user's applications: count, company, applied/allotted lots, application/allotment status. No submission date. |
| `GET /sip-holdings` | Current user's holdings: sum of recorded `investedAmount`, distinct `mutualFundId` count, holding count, `sipAmount` totals grouped by `frequency`. |
| `GET /journal/me` | Current user's decisions ordered by actual `updatedAt`/`createdAt`; null/empty notes allowed by the UI. Only dated entries enter the timeline. |
| `GET /risk-profiles/me` | Latest dated assessment and recorded category. |

`GET /ipos` supplies catalogue price but has no lot size/share count or historical cost basis. `GET /mutual-funds` is a catalogue, not user holdings. Neither is counted as personal investment. `POST /ipos/{ipoId}/score` writes a score; Overview never calls it. `/users/` is not used as an account identity source. `/auth/login` returns a token, but integration is explicitly deferred.

## Financial limits

- **Total invested across the portfolio:** unavailable; SIP invested is a clearly scoped subtotal, not a portfolio total. IPO applied lots are not treated as money invested.
- **Current portfolio value, P/L, return percentages and XIRR:** omitted. The SIP response has `currentValue` and `xirr`, but creation/update services do not populate them, and there is no valuation timestamp or reliable valuation pipeline.
- **IPO versus mutual fund allocation:** unavailable because comparable costs are missing. The decorative orbit is hidden from assistive technology and has no wedges or percentages. Recharts is deliberately not installed until an actual monetary allocation is supported.
- **SIP commitments:** kept separate per backend frequency. Weekly/quarterly amounts are never labelled monthly.
- **Recent activity:** dated journals only. IPO applications have no submission timestamp, so their statuses appear separately without invented chronology.
- Failed/missing amounts are `—`; only verified empty holding lists yield ₹0. A partial error retains other verified resources. Any 401/403 discards partial account responses.

## Future connection

Overview refinements: allotment chips count `PENDING`, `ALLOTTED` and `NOT_ALLOTTED` from application records; missing/unrecognised statuses are listed separately. Top fund holdings combine records by fund ID, rank by invested cost and show up to three funds. Rankings are withheld if any cost or fund ID is incomplete. The latest dated journal decision is labelled in the existing activity panel. SIP, IPO and fund summary cards link to their existing routes.

Refresh reuses the existing loader and is disabled during loading or when authentication is unconnected. A fetched time appears only after a successful resource load; partial success is explicitly labelled. It is a fetch time, not a market-price valuation timestamp. Authentication/error states clear it. The development harness includes clearly labelled synthetic populated records and an empty loader for verifying refresh without account requests. The real Overview route contains no fixtures. All 14 data tests pass.

Use `getJson` from `src/api/client.js` with the future approved authenticated headers and backend base URL. Pass a stable loader to `OverviewPage`, e.g. `options => loadOverview({ ...options, request: authenticatedGet })`. The caller owns authentication; this layer does not implement it. Configure a same-origin gateway or permitted CORS/proxy when backend connectivity is introduced; current Vite config has no backend proxy. Do not send these relative endpoint paths to Vite itself.

## Verification

- `npm run build`
- `node --test tests/overview.test.js` (synthetic records isolated to tests)
- Development-only `/tests/overview-preview.html`: loading, verified empty, error/retry and blocked UI states. This is not an application route or production build entry, and uses no sample balances.
- Verify `/dashboard`, quick actions, desktop/mobile layouts and both themes in the running frontend.

Verified 27 October 2026: production build passed; all 11 Node tests passed; browser checked loading, empty, error/retry and account-blocked states. All four quick actions and browser back/forward worked. Light/dark, mobile drawer, Login and landing navigation were checked. No horizontal overflow at 320, 375, 414, 768 or 1280 pixels; desktop also reviewed at 1440 pixels. No browser console warnings/errors observed. `git diff --check` passed. Live authenticated responses remain unverified because authentication is deferred.
