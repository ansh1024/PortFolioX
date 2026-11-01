import { requestJson, ApiError } from '../../api/client.js';
const id = value => encodeURIComponent(String(value));
// A future authenticated caller provides headers/baseUrl or an authenticated transport.
// Creating this adapter alone does not connect it to the real Tracker route.
export function createIpoApi({ request, ...options } = {}) {
  const send = request || ((path, init) => requestJson(path, { ...options, ...init }));
  return {
    listIpos: ({ signal } = {}) => send('/ipos', { signal }),
    listApplications: ({ signal } = {}) => send('/ipo-applications', { signal }),
    getIpo: (ipoId, { signal } = {}) => send(`/ipos/${id(ipoId)}`, { signal }),
    createIpo: body => send('/ipos', { method: 'POST', body }),
    updateIpo: (ipoId, body) => send(`/ipos/${id(ipoId)}`, { method: 'PUT', body }),
    deleteIpo: ipoId => send(`/ipos/${id(ipoId)}`, { method: 'DELETE' }),
    apply: (ipoId, lotsApplied) => send(`/ipo-applications?${new URLSearchParams({ ipoId, lotsApplied })}`, { method: 'POST' }),
    deleteApplication: applicationId => send(`/ipo-applications/${id(applicationId)}`, { method: 'DELETE' }),
    score: ipoId => send(`/ipos/${id(ipoId)}/score`, { method: 'POST' }),
  };
}
export async function loadTracker(api, signal) {
  if (!api) return { status: 'blocked', ipos: null, applications: null, errors: {} };
  const entries = await Promise.all([['ipos', 'listIpos'], ['applications', 'listApplications']].map(async ([key, method]) => {
    try {
      const data = await api[method]({ signal });
      if (!Array.isArray(data) || data.some(item => !item || typeof item !== 'object' || Array.isArray(item))) throw new ApiError('The server returned an unexpected record format.');
      return [key, data, null];
    } catch (error) { if (error.name === 'AbortError') throw error; return [key, null, error]; }
  }));
  if (entries.some(([, , error]) => [401, 403].includes(error?.status))) return { status: 'blocked', ipos: null, applications: null, errors: {} };
  return { status: entries.every(([, , error]) => error) ? 'error' : 'ready',
    ...Object.fromEntries(entries.map(([key, data]) => [key, data])),
    errors: Object.fromEntries(entries.filter(([, , error]) => error).map(([key, , error]) => [key, error.message])) };
}
