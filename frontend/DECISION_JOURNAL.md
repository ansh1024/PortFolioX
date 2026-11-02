# Decision Journal

## Architecture and visual direction

The existing /dashboard/decision-journal route now renders DecisionJournalPage within DashboardLayout. Existing sidebar, Topbar, mobile drawer and theme system are unchanged. The supplied journal.mp4 was inspected as local video frames: its large centered headline, pink glow, rounded journal board and staggered card reveal informed the journal canvas. The implementation uses existing pink/violet/lime tokens, with restrained dark surfaces, native dialogs and reduced-motion support. There are no invented journal entries in production.

Page state delegates to useDecisionJournal and decisionJournalApi. JournalCard renders text safely as React text. JournalEditor loads the latest note before editing, uses a plain-text textarea, shows available IPO context and provides optional writing guidance. Notes are not interpreted as HTML, markdown, structured outcomes or tags. No draft is persisted to browser storage.

## API contract

- GET /journal/me: authenticated user's array, ordered by updatedAt descending.
- GET /journal/{ipoId}: current user's single IPO-linked note.
- POST /journal/{ipoId}: create, 201 response.
- PUT /journal/{ipoId}: update.
- GET /ipos: actual IPO masters for selection/context, delegated to existing IPO adapter.

Writes submit only {content: trimmedString}. IDs in journal paths are IPO master IDs, never journal IDs. Identity comes from the existing authenticated transport. Response fields: journalId, ipoId, companyName, content, createdAt, updatedAt. Malformed response/identity checks prevent displaying an unverified save as success.

## Workflows and state

Actual loaded journal records drive counts, distinct IPOs and latest activity. Search covers company and note content; ordering supports latest/oldest update and company A–Z. Legacy null content displays safely, but blank new/edited content is rejected to match the current service. Original calendar dates are preserved because backend LocalDateTime has no timezone.

The editor offers only recorded IPOs. Known existing entries disable creation and offer Open existing entry. Unexpected 409 conflicts preserve the draft and offer GET of the existing entry. Reads abort on close/unmount, duplicate writes are guarded synchronously, late mutation responses are ignored after unmount, and 401/403 clears private workspace data. Cancel/backdrop/Escape ask before discarding changed text. Successful writes close the editor and refetch the workspace; partial catalogue failure retains readable journal data while disabling creation. API failures preserve unsaved content.

## Integration blocker and backend limitations

The shared client is transport-only; login/JWT integration remains incomplete. The real route therefore passes no API, performs no private requests and explicitly displays account connection pending. A future stable createDecisionJournalApi({request}) or adapter configured with authenticated headers/baseUrl can connect it. No new authentication mechanism, public endpoint or security change was added.

The backend supports one note per user per IPO, nonblank content and create/update timestamps only. No delete, non-IPO associations, separate rationale/outcome fields, review dates/reminders/status, attachments/tags or persistent revision history. No autosave, revision timeline or other unsupported controls are offered. Concurrent creation may hit the existing max+1 ID generation limitation. Some invalid-content or missing-IPO errors surface as generic backend errors; unchanged here.

## Verification

Run from frontend:

```
node --test tests/*.test.js
npm.cmd run build
```

All 59 tests and production build pass. Six focused tests cover normalization, integer IPO identity, payload trimming, search/order, summary, exact API paths/methods, duplicate conflict propagation, blocked/empty/partial/error/auth states. Browser fixture checks cover required content, create, fresh GET before edit, cancellation with draft protection, update/refetch, text search, 409 open-existing recovery, save failure, empty/loading/error/denied states. Responsive checks at 320/375/414/768 and desktop 1440 have no document overflow; light/dark checked. Browser console clean. Live authenticated writes were not tested.

Open /tests/journal-preview.html on the development server for an isolated, explicitly labelled synthetic transport. This harness is never imported by the production route or build entry. It makes no backend requests.

## Exact staging scope

New files:
- frontend/DECISION_JOURNAL.md
- frontend/src/pages/DecisionJournalPage.jsx
- frontend/src/components/decision-journal/JournalCard.jsx
- frontend/src/components/decision-journal/JournalEditor.jsx
- frontend/src/features/decision-journal/decisionJournalApi.js
- frontend/src/features/decision-journal/decisionJournalModel.js
- frontend/src/features/decision-journal/useDecisionJournal.js
- frontend/src/styles/decision-journal.css
- frontend/tests/decision-journal.test.js
- frontend/tests/journal-preview.html
- frontend/tests/journal-preview.jsx

Modified: frontend/src/app/App.jsx (page import and journal route branch only). No navigation metadata edit was necessary. Optional local design memory: frontend/.hallmark/log.json. Preserve all pre-existing unrelated changes. Nothing staged, committed or pushed; backend and shared authentication untouched.
