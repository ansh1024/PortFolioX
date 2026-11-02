# IPO Scoring module

## Implemented scope

/dashboard/ipo-scoring is a separate scoring desk within existing dashboard navigation. It provides a searchable, status-filtered and sortable IPO library with pagination, issue context and latest captured scores; explicit calculate/save; returned score cards; search/verdict filters/sorting; a factor-breakdown drawer with expandable source explanations; visit-only metrics and verdict distribution. Existing themes, icons, native dialogs and API infrastructure are reused without editing investment modules.

## Exact backend contract

- GET /ipos: authenticated IPO master catalogue used for company selection.
- POST /ipos/{ipoId}/score: authenticated, no request body, returns 201 ScoreLogResponseDTO and persists a new ScoreLog. The new adapter delegates to the existing createIpoApi rather than duplicating fetch/endpoint logic.
- Response: scoreLogId, ipoId, companyName, gmpScore, subscriptionScore, fundamentalScore, sectorScore, historicalScore, totalScore, verdict, calculatedAt.
- Existing IpoMetrics is required. No metrics CRUD/read endpoint or score-history GET endpoint exists.
- ScoreLog relates to IpoMaster, not directly to a user. Do not interpret all persisted logs as an authenticated user's private score history.

## Engine rules inspected, not reimplemented

GMP points use GMP/issuePrice * 100: <=0 gives 0; below 10 gives 5; below 25 gives 10; below 50 gives 15; otherwise 20. Issue price must be positive. Subscription points use the mean of finite nonnegative QIB, small HNI, big HNI, retail and employee values: below 1 gives 0; below 3 gives 5; below 5 gives 10; below 10 gives 15; otherwise 20. No valid subscriptions gives 0.

Fundamental, sector and historical components are read from stored IpoMetrics. totalScore is their sum with GMP/subscription points. Verdict is APPLY at 75+, WATCH from 45 to below 75, SKIP below 45. The frontend displays the actual returned verdict and components; it never calculates a recommendation.

The service contains a component-validation helper, but it is not invoked in the active score path. Stored metric bounds therefore are not guaranteed by this code. The UI does not invent equal factor weights, a validated 100-point maximum, or a risk-profile-adjusted recommendation. Breakdown bars show each nonnegative returned contribution relative to the sum of returned components, not weights or expected returns. If contributions cannot be meaningfully compared, bars are omitted and raw points remain visible.

## History and session metrics

Every explicit score action saves a backend log. Because there is no GET history endpoint, the page cannot load old logs or display all-time counts/trends. Results from successful responses are captured only while this page is mounted. No browser persistence or fabricated history is used. Leaving/reloading clears the captured list. Reload IPOs refreshes the company catalogue only and is not presented as a history refresh.

IPOs evaluated counts distinct IPO IDs among captured responses; saved scoring runs counts captured log IDs; average uses returned totalScore values. Verdict counts likewise cover this visit only. Every metric is labelled accordingly. The IPO dropdown is the real master catalogue; a master record is never represented as already scored until a score response arrives here.

## Integration and limitations

The real route passes no adapter, sends no private requests and displays account connection pending. A stable api=createIpoScoringApi(options) with existing authenticated transport is required later. No login, JWT or security changes are part of this task. Backend ownership/authorization is not bypassed.

Explicit mutations use a synchronous pending guard, disable repeated submissions and verify returned IPO identity and required score fields. A malformed response is not shown as a successful score; the UI notes a log may already exist and does not retry automatically. Missing metrics/prerequisites and network/server errors are shown honestly. A 401/403 clears the catalogue, captured responses and inspected score. Missing IPO/metrics errors can be generic 500s with the unchanged exception handling. Backend max+1 ID generation/concurrency remains unchanged.

## Files

Created:
- src/pages/IpoScoringPage.jsx
- src/features/ipo-scoring/ipoScoringApi.js
- src/features/ipo-scoring/ipoScoringModel.js
- src/features/ipo-scoring/useIpoScoring.js
- src/components/ipo-scoring/IpoScoreCatalogue.jsx
- src/components/ipo-scoring/IpoScoreCard.jsx
- src/components/ipo-scoring/IpoScoreDetails.jsx
- src/components/ipo-scoring/ScoringBreakdown.jsx
- src/styles/ipo-scoring.css
- tests/ipo-scoring.test.js
- IPO_SCORING.md

Shared integration edits: src/app/App.jsx and src/app/dashboardSections.js. Shared test-only files: tests/intelligence-preview.html and tests/intelligence-preview.jsx. No backend, database, security, IPO Tracker, Mutual Funds, SIP Holdings, Overview, landing or login implementation was edited. No dependencies were added.

## Verification (2026-11-02)

All 53 frontend tests pass, including 7 focused scoring tests. Production build passes. Browser checks cover company search plus status filtering, clear filters, selecting from the library, returned issue price/GMP/dates, successful explicit scoring, five returned factors, expandable source explanations, visit totals, empty/loading/error/denied states, missing metrics and malformed score responses. Console has no warnings/errors. Responsive checks at 320/375/414/768 and desktop 1440 show document scroll width equal to client width. Light and dark themes checked. No real backend writes were performed; all mutation checks use the clearly labelled isolated fixture harness.

Live scoring remains blocked until an authenticated API is supplied. History, backend comparison, explicit weights, stored-metric methodology and full rationale are unavailable. Comparison is documented rather than simulated. App routing and navigation were already wired in the working tree; this pass preserves the existing sidebar layout (the checkout does not currently use horizontal navigation). No new dependency or backend change.

## Exact staging scope for a feature commit

Stage these paths individually after review (do not use `git add .`):

```
frontend/IPO_SCORING.md
frontend/src/pages/IpoScoringPage.jsx
frontend/src/components/ipo-scoring/IpoScoreCatalogue.jsx
frontend/src/components/ipo-scoring/IpoScoreCard.jsx
frontend/src/components/ipo-scoring/IpoScoreDetails.jsx
frontend/src/components/ipo-scoring/ScoringBreakdown.jsx
frontend/src/features/ipo-scoring/ipoScoringApi.js
frontend/src/features/ipo-scoring/ipoScoringModel.js
frontend/src/features/ipo-scoring/useIpoScoring.js
frontend/src/styles/ipo-scoring.css
frontend/tests/ipo-scoring.test.js
frontend/tests/intelligence-preview.html
frontend/tests/intelligence-preview.jsx
```

Use `git add -p` for only IPO Scoring integration hunks in `frontend/src/app/App.jsx` (import and route branch) and `frontend/src/app/dashboardSections.js` (IPO Scoring entry). Both files already contain unrelated Risk Assessment edits; do not stage them wholesale. The shared preview includes existing Risk Assessment fixtures; retain those but review the diff. `.hallmark/log.json` is optional local design metadata. Existing unrelated modifications and untracked files remain untouched. Nothing has been staged, committed or pushed.
