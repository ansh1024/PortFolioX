import { authSession } from './authSession.js';
const defaultBaseUrl = import.meta.env?.VITE_API_BASE_URL ?? '/api';
export class ApiError extends Error {
  constructor(message, status = 0, fields = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

// The external session store avoids React imports and supplies the latest token per request.
export async function requestJson(path, { baseUrl = defaultBaseUrl, headers = {}, signal, fetcher = fetch, method = 'GET', body, auth = true, session = authSession } = {}) {
  const publicRequest = auth === false || path === '/auth/login';
  const requestSession = publicRequest ? null : session.getRequestSession();
  const suppliedHeaders = Object.fromEntries(new Headers(headers).entries());
  const automaticToken = !publicRequest && !('authorization' in suppliedHeaders) ? requestSession.token : null;
  if(publicRequest) delete suppliedHeaders.authorization;
  const response = await fetcher(`${baseUrl.replace(/\/$/, '')}${path}`, {
    method, headers: { Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...suppliedHeaders, ...(automaticToken ? { Authorization: `Bearer ${automaticToken}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    credentials: 'omit', cache: 'no-store', signal,
  });
  if (!response.ok) {
    if(response.status === 401 && automaticToken) session.invalidate(requestSession.revision);
    let payload;
    try {
      payload = response.headers?.get('content-type')?.includes('text/')
        ? await response.text() : await response.json();
    } catch (error) { if (error.name === 'AbortError') throw error; }
    const fields = payload && typeof payload === 'object'
      ? Object.fromEntries(Object.entries(payload).filter(([key, value]) => typeof value === 'string' && !['timestamp', 'path', 'trace', 'error'].includes(key))) : {};
    const fallback = { 401: publicRequest ? 'Invalid email or password.' : 'Your session is unavailable. Account connection is required.', 403: 'You do not have permission for this action.', 404: 'This record is no longer available.', 409: 'This change conflicts with an existing record.' }[response.status] || 'The request could not be completed. Please try again.';
    const message = response.status === 400 && typeof payload === 'string' && !payload.includes('<')
      ? payload.slice(0, 300) : response.status === 400 && typeof payload?.message === 'string' ? payload.message.slice(0, 300) : fallback;
    throw new ApiError(message, response.status, fields);
  }
  if (response.status === 204) return null;
  try { return await response.json(); }
  catch (error) { if (error.name === 'AbortError') throw error; throw new ApiError('The server returned an invalid response.', response.status); }
}

export function getJson(path, options) { return requestJson(path, { ...options, method: 'GET' }); }
