import { requestJson, ApiError } from '../../api/client.js';
import { createIpoApi } from '../ipo/ipoApi.js';
import { validCatalogueIpo } from '../ipo-scoring/ipoScoringModel.js';
import { validJournal, journalPayload } from './decisionJournalModel.js';
const journalPath = ipoId => {
  if (!/^\d+$/.test(String(ipoId)) || Number(ipoId) <= 0) throw new Error('Choose a recorded IPO.');
  return `/journal/${encodeURIComponent(String(ipoId))}`;
};
export function createDecisionJournalApi({ request, ...options } = {}) {
  const send = request || ((path, init) => requestJson(path, { ...options, ...init }));
  const ipo = createIpoApi({ request: send });
  return {
    list: signal => send('/journal/me', { signal }),
    ipos: signal => ipo.listIpos({ signal }),
    get: (ipoId, signal) => send(journalPath(ipoId), { signal }),
    create: (ipoId, content) => send(journalPath(ipoId), { method: 'POST', body: journalPayload(content) }),
    update: (ipoId, content) => send(journalPath(ipoId), { method: 'PUT', body: journalPayload(content) }),
  };
}
export async function loadDecisionJournal(api, signal) {
  if (!api) return { status: 'blocked', entries: null, ipos: null, errors: {} };
  const parts = await Promise.all([['entries','list',validJournal], ['ipos','ipos',validCatalogueIpo]].map(async ([key, method, valid]) => {
    try {
      const data = await api[method](signal);
      if (!Array.isArray(data) || !data.every(valid) || new Set(data.map(r => r.ipoId)).size !== data.length) throw new ApiError('The server returned an invalid journal workspace response.');
      return [key, data, null];
    } catch(e) { if(e.name === 'AbortError') throw e; return [key,null,e]; }
  }));
  if (parts.some(([, ,e]) => [401,403].includes(e?.status))) return { status:'blocked',entries:null,ipos:null,errors:{} };
  return { status: parts.every(([, ,e]) => e) ? 'error' : 'ready', ...Object.fromEntries(parts.map(([key,data]) => [key,data])), errors:Object.fromEntries(parts.filter(([, ,e]) => e).map(([key,,e]) => [key,e.message || 'Could not load data.'])) };
}
