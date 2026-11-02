// Token decoding is a local expiry/shape check, NOT signature verification.
export const sessionKey = 'portfoliox-session-token';
export function tokenExpiry(token) {
  try {
    if (typeof token !== 'string' || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) return null;
    const decode = part => JSON.parse(atob(part.replaceAll('-', '+').replaceAll('_', '/')));
    const [header, payload] = token.split('.').map((part,i) => i < 2 ? decode(part) : null);
    if (!['HS256','HS384','HS512'].includes(header.alg) || typeof payload.sub !== 'string' || !payload.sub || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) return null;
    return payload.exp * 1000;
  } catch { return null; }
}
export function createAuthSession({ storage, now = Date.now } = {}) {
  let revision = 0;
  let state = { token:null, status:'unauthenticated', revision };
  const listeners = new Set();
  const persist = token => { try { if(token) storage?.setItem(sessionKey,token); else storage?.removeItem(sessionKey); } catch { /* Memory-only session when storage is unavailable. */ } };
  const publish = (token,status) => { state = { token,status,revision:++revision }; listeners.forEach(fn=>fn()); };
  const valid = token => (tokenExpiry(token) ?? 0) > now();
  function restore() {
    let token; try { token=storage?.getItem(sessionKey); } catch { return; }
    if(!valid(token)) { persist(null); token=null; }
    publish(token || null,token?'authenticated':'unauthenticated');
  }
  function logout() { persist(null);publish(null,'unauthenticated'); }
  function checkExpiry() { if(state.token && !valid(state.token)) logout(); }
  restore();
  return {
    getSnapshot:()=>state,
    subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},
    logout, checkExpiry,
    getRequestSession(){checkExpiry();return state;},
    invalidate(expectedRevision){if(state.revision===expectedRevision)logout();},
    async login(credentials, authenticate) {
      persist(null);publish(null,'authenticating');const attempt=state.revision;
      try {
        const result=await authenticate(credentials);
        if(state.revision!==attempt)throw new Error('Sign-in was superseded by a newer session action.');
        if(!valid(result?.token))throw new Error('The server returned an invalid or expired session token.');
        persist(result.token);publish(result.token,'authenticated');
        return result;
      } catch(e) { if(state.revision===attempt)logout();throw e; }
    },
  };
}
let storage;
try { storage=globalThis.sessionStorage; } catch { /* Storage can be blocked. */ }
export const authSession = createAuthSession({storage});
