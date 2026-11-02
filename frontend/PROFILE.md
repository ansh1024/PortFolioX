# Profile workspace

/dashboard/profile is available from Topbar and the shared sidebar. ProfilePage uses reusable ProfilePanel/ProfileFields, a section rail and existing tokens. It displays only backend-supported name, email, userId, role, creationTime and lastLogin. Initials come only from a loaded name. There are no fabricated people, photos, contact/address fields, edit buttons, password controls or account deletion actions.

Backend inspection found GET /users/{userId}, GET /risk-profiles/me and no user update endpoint. createProfileApi validates the requested identity against the returned userId. Profile role is display-only; it grants no frontend permissions. latestRisk reuses the existing risk validation/sorting and trusts the returned category, including safeguards.

The real route uses useAuth but intentionally passes no profile adapter/user identity. Login UI/identity integration is still pending; account and risk data therefore remain unavailable. This task does not add Phase 2 authentication or other dashboard API wiring. A future stable profile adapter plus authenticated user ID can be passed into the page. No arbitrary user selector or directory fetch is offered.

My profile shows account information and dates read-only. Account & security shows local auth status and tab-storage information, and calls the existing local logout only when authenticated. No tokens/passwords are rendered. Investment profile shows a returned risk category/status/date or genuine unavailable/empty states and links to assessment. Unsupported security features are disclosed as unavailable. Theme preference remains in the existing Topbar.

The loader aborts stale reads, clears data on 401, preserves available account information if risk loading fails, validates identity and exposes retry. Unauthenticated users make no account requests. Local logout clears the account view through enabled state. Current backend user access controls are not expanded or changed by this feature; they require independent review before deployment.

Tests: node --test tests/profile.test.js. Development-only /tests/profile-preview.html supplies clearly labelled synthetic account/risk responses and states; no live requests or credentials are used. The real application never imports this fixture.
