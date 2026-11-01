# IPO Tracker contract and implementation

The real `/dashboard/ipo-tracker` route passes no API or role until authentication is implemented. It sends no private requests and shows an explicit account-connection blocker. Forms can be previewed, but cannot save without a connected administrator. No JWT handling, backend changes or fake records are included in the real page.

## Source-verified backend contract

| Method and path | Request | Response / permission |
| --- | --- | --- |
| GET `/ipos` | None | `IpoMaster[]`; authenticated |
| GET `/ipos/{ipoId}` | None | `IpoMaster`; 404 if missing; authenticated |
| POST `/ipos` | JSON master fields | 201 master; ADMIN |
| PUT `/ipos/{ipoId}` | JSON master fields | 200 master, 404 if missing; ADMIN |
| DELETE `/ipos/{ipoId}` | None | 204, 404 if missing; ADMIN |
| GET `/ipo-applications` | None | Current user's `IpoApplicationResponseDTO[]` |
| GET `/ipo-applications/{applicationId}` | None | Owner-scoped DTO, 404 if absent; list already supplies the displayed fields |
| POST `/ipo-applications?ipoId=…&lotsApplied=…` | Query parameters, no JSON body | 201 application DTO; owner taken from authentication |
| DELETE `/ipo-applications/{applicationId}` | None | Owner-scoped delete, 204/404 |
| POST `/ipos/{ipoId}/score` | No body | 201 score log; authenticated; existing `IpoMetrics` required |

Master whitelist: `companyName`, `sector`, `openingDate`, `closingDate`, `allotmentDate`, `price`, `gmp`, `subscriptionQib`, `subscriptionShni`, `subscriptionBhni`, `subscriptionRetail`, `subscriptionEmployee`, `ipoStatus`. Generated IDs are never submitted. Updates send the complete editable record because the service replaces all these fields.

Backend validation requires nonblank company name, opening/closing dates, `price > 0`, `gmp >= 0`, and closing date on/after opening date. Valid status values: OPEN, CLOSED, UPCOMING, ALLOTMENT, LISTED; status and allotment date are nullable. UI additionally checks valid calendar dates, finite float range, nonnegative subscription ratios, column-length limits, and positive whole-number application lots within Java int range. Blank primitive numeric fields other than price become 0, matching backend defaults. Allotment date is not incorrectly restricted by the UI beyond being a valid date.

Application DTO: `applicationId`, `ipoId`, `companyName`, `userId`, `lotsApplied`, `lotsAllotted`, `applicationStatus`, `allotmentStatus`. There is no PUT/PATCH application endpoint. Editing applications is deliberately unavailable. Quantity, application amount and dates are absent; lot size is not stored, so amounts cannot be calculated as lots × issue price. IPO type, listing date and price band are absent and have no fabricated filters/values.

Open counts require OPEN status and today's Indian date inside the inclusive issue window. Upcoming counts require UPCOMING status and a future opening date. Listing filters operate on recorded status; counts use the entire loaded catalogue, not search results.

The catalogue includes company initials, sector context and clearer status/price styling. A responsive context rail shows the next four valid recorded opening, closing or allotment dates from today onward, plus counts by recorded allotment status. Calendar company links open details; the application shortcut switches the existing view. Details use a right-side drawer on desktop and a centred dialog on smaller screens; create/edit forms remain centred. Dialog dismissal returns keyboard focus to its opener. No new endpoints or dependencies are needed for these additions.

Score response displays GMP/subscription/fundamental/sector/historical components, total, verdict and calculatedAt. Scoring explicitly saves a new log and never runs automatically. Missing metrics may produce a generic 500 because the backend has no matching IllegalArgumentException handler. Master delete may also fail if referenced records prevent deletion; the UI reports the failed request and does not invent a successful result.

## Future authenticated connection

Supply a stable `api = createIpoApi({ baseUrl, headers })` or `createIpoApi({ request: authenticatedRequest })` to `IpoTrackerPage`, and a trusted `role` of ADMIN/USER. The custom transport receives `(path, {method, body, signal})`, where body is an object; `requestJson` handles JSON serialization. Role gates are UI affordances; backend authorization and ownership remain authoritative. No role is inferred from arbitrary local storage or supplied user IDs. A same-origin gateway or permitted backend CORS/proxy is still required for direct connectivity; this task does not alter those settings.

Read loading uses cancellation, distinguishes empty from unavailable records, retains independent successful resources after non-auth failures, and clears both resources after 401/403. Writes show server field errors, pending state, successful completion feedback and refresh the lists. Mutations are not retried automatically. Native dialogs support focus management, Escape, backdrop dismissal and focus return; destructive actions have a confirmation view. Writes cannot be submitted twice while pending.

## Verification

Run `npm run build` and `node --test tests/ipo.test.js tests/overview.test.js`. `/tests/ipo-preview.html` is an isolated development-only harness with synthetic, clearly labelled fixtures and an in-memory transport; it never contacts the backend and is not a production build entry. It covers admin/user permissions, search/filter/sort, details/scoring, master create/edit/delete, application create/delete, validation, write errors, empty/error/denied/unconnected states, responsive layouts and both themes. Live authenticated API writes remain unverified until authentication is implemented.

Browser checks passed for the listed workflows, native dialog Escape/focus handling, and contained horizontal table scrolling. No document overflow at 320, 375, 414, 768, 1280 or 1440 pixels. The calendar links, desktop drawer, mobile dialog, centred edit form and application shortcut were also verified in the development harness, along with rail loading/empty/error/denied states. Production build and all 27 tests (13 IPO/transport tests plus 14 existing Overview tests) passed. The real page remains account-blocked with no fixture values.

## File inventory

- Modified `src/app/App.jsx`: replaces only the IPO placeholder route.
- Modified `src/api/client.js`: shared JSON write transport, field errors, cancellation and 204 handling; existing getJson remains available.
- Added `src/pages/IpoTrackerPage.jsx` and `src/styles/ipo.css`.
- Added `src/components/ipo/IpoDialog.jsx`, `IpoMasterForm.jsx`, `IpoApplicationForm.jsx`, `IpoDetails.jsx`, `IpoTrackerRail.jsx`.
- Added `src/features/ipo/ipoModel.js`, `ipoApi.js`, `useIpoTracker.js`.
- Added `tests/ipo.test.js`, `tests/ipo-preview.html`, `tests/ipo-preview.jsx`, and this contract note.
- No Overview, landing, Login, shared navigation/theme, backend, database or security files were changed by this feature.
