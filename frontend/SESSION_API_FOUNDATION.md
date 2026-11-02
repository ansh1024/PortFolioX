# Phase 1: session and API foundation

The UI remains intentionally unconnected. No login page handler, protected routes, account-role retrieval or dashboard adapters were added. Existing feature-module behaviour is unchanged.

## Session architecture

AuthProvider uses useSyncExternalStore over api/authSession.js. The client reads that store at request dispatch, avoiding circular React/client dependencies and stale closures. useAuth throws outside AuthProvider and exposes token, status (unauthenticated/authenticating/authenticated), isAuthenticated, login and logout. Login consumes only the existing {token} response from POST /auth/login, submitting {email,password}. No credentials are persisted. Overlapping sign-ins and logout invalidate older login attempts. Request revision snapshots prevent an older 401 from destroying a newer session. 403 does not clear the central session. Feature-local 403 handling is unchanged until its later integration phase.

sessionStorage was chosen to retain sessions across tab refreshes without intentionally persisting across browser restarts. localStorage persists longer and shares changes across tabs; sessionStorage is normally tab-scoped, although opening/duplicating a tab can initially copy it and browser restore behaviour varies. Both are JavaScript-readable and exposed to XSS. No storage choice here is claimed fully secure. Storage failures fall back to memory-only authentication, which cannot survive refresh.

JWT decoding checks shape, supported HMAC algorithm, subject and expiry, but does not verify the signature or establish trusted identity/role. The backend is authoritative and may reject any restored token. Expired/malformed tokens are removed on restoration; timers, focus/pageshow events and request dispatch recheck expiry. No refresh-token functionality exists. Provider effects clean up timers/listeners for StrictMode. Logout is local; there is no backend token revocation endpoint.

## API routing

Browser default VITE_API_BASE_URL is /api. See .env.example. Vite development proxies /api to API_PROXY_TARGET (default http://127.0.0.1:8080), stripping the prefix, so /api/auth/login becomes /auth/login on Spring Boot. The destination is configured once, not in feature code. Restart Vite after configuration changes. API_PROXY_TARGET is server-only; do not put secrets in VITE_ variables, which are compiled into browser assets.

Production MUST provide equivalent same-origin /api reverse proxy routing or explicitly configure a supported destination at build time. Vite dev proxy is not a production deployment configuration; vite preview is also not configured as an API proxy. Cross-origin direct calls still require deployment-supported CORS. No backend CORS/security changes are made or assumed.

requestJson preserves explicit baseUrl, custom headers, fetch injection, cancellation, JSON body/204/error conventions. Protected calls attach the latest valid central token unless the caller supplies Authorization. auth:false and /auth/login omit authorization and do not invalidate the session on a credential-rejection 401. Missing tokens produce no Bearer header. Backend authentication errors become ApiError; 401 invalidates only the central token actually used by that request, 403 remains permission denied. Custom Authorization is caller-managed.

## Validation

Run node --test tests/*.test.js and npm run build from frontend. New auth tests exercise public login contracts, token validation, storage restore/failure, login/logout, expiry, concurrent sign-ins, missing-token behaviour, authorization attachment, 401/403 distinctions and delayed-401 safety. Existing tests remain unchanged. No live login is performed: backend login updates lastLogin, so it is deliberately excluded from frontend-only verification. Core store logic is unit tested; mounted React provider/browser interaction tests remain future work.
