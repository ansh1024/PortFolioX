# Risk Assessment module

## Implemented scope and design

/dashboard/risk-assessment uses the existing dashboard/navigation and light/dark tokens. The reference image inspired the profile gauge, adjacent context/configuration panels and organised framework/history sections. Light mode uses light surfaces; no dark accent panel is forced into it. The SVG gauge displays an actual returned 0–100 risk score, never an estimate. Existing native dialogs, API transport, icons and formatting helpers are reused.

## Exact backend contract

- GET /risk-profiles/me: authenticated current user's saved RiskProfileResponseDTO array, ordered by calculatedAt descending by the service/repository.
- POST /risk-profiles/me: authenticated assessment/save; 201 RiskProfileResponseDTO.
- Request: lossReaction, lossTolerance, emergencySavings, essentialExpenseDependency, debtManageability, investmentHorizon, investmentExperience, investmentObjective. Every value must be an integer 0–3.
- Response: riskProfileId, riskScore, riskCategory, calculatedAt. No user ID is submitted; identity comes from the security principal.
- Answers and question text are not stored in or returned with saved profiles. Retaking creates a new profile; there is no update/delete route here.

The unchanged RiskAssessmentService maps codes to 0/3/7/10 points, reverses essentialExpenseDependency via 3-answer, sums eight inputs, scales rawScore * 100 / 80 and rounds half-up to two decimals. Categories: LOW below 25, MODERATE below 50, HIGH below 75, VERY_HIGH otherwise. emergencySavings=0, essentialExpenseDependency=3 or debtManageability=0 caps HIGH/VERY_HIGH to MODERATE without changing the numeric score. The UI trusts the returned category rather than deriving it from the numeric score.

## Configured questionnaire

All eight exact prompts and 32 answer labels are centralized in src/features/risk-assessment/riskQuestionnaire.js. UI state retains the supplied integer capacity codes 0–3. Each step requires one radio choice, preserves answers on back/change navigation and shows the answer text on review. Incomplete or non-integer answers cannot form a request.

Backend direction was checked against RiskAssessmentService. All codes match except essentialExpenseDependency: the legacy service reverses it and treats wire code 3 as heavy dependency. answerPayload converts only this field with 3 - UI code at the request boundary. Heavy dependence (UI 0) therefore becomes wire 3; no dependence (UI 3) becomes wire 0. UI state and labels are unchanged. No backend scoring logic or frontend category formula was added.

The real route permits answering and review, but saving remains disabled until account integration provides an authenticated API. Existing backend results remain authoritative.

## Behaviour and limitations

The real route passes no API, makes no private requests and explicitly shows account connection pending. Profile loading, valid empty results, errors and unauthorized responses are distinct. Reads abort on unmount. Post failures preserve entered answers; synchronous write guards prevent duplicate submission. Accepted results come only from a validated response. 401/403 clears account records and inspected results. No JWT, backend, schema or security changes were made.

Saved profile history can be loaded from the existing GET route and inspected. Original answers and detailed personal characteristics cannot be reconstructed from the response. Server timestamps have no timezone; date labels preserve the supplied calendar date. Backend IllegalArgumentException validation may surface as generic 500 responses because field-level validation annotations/handling are absent. Max+1 numeric ID generation remains a backend concurrency limitation, unchanged here.

## Files

Created:
- src/pages/RiskAssessmentPage.jsx
- src/features/risk-assessment/riskAssessmentApi.js
- src/features/risk-assessment/riskAssessmentModel.js
- src/features/risk-assessment/useRiskAssessment.js
- src/components/risk-assessment/RiskProfileCard.jsx
- src/components/risk-assessment/RiskAssessmentWizard.jsx
- src/components/risk-assessment/RiskAssessmentResult.jsx (saved result history/review)
- src/styles/risk-assessment.css
- tests/risk-assessment.test.js
- RISK_ASSESSMENT.md

Shared integration edits: src/app/App.jsx and src/app/dashboardSections.js. The latter adds IPO Scoring and refreshes Risk Assessment metadata. tests/intelligence-preview.html/.jsx is a clearly labelled development-only fixture harness for both modules and never enters the production route or build entry. No other feature page or existing API client was modified.

## Verification

Questionnaire model tests cover complete metadata, valid integer selections, request field whitelisting, every dependency conversion and refusal of incomplete answers. Existing API and profile tests remain in place. Live authenticated submission remains blocked by account integration; the development harness uses explicitly synthetic responses only. No commits or pushes.
