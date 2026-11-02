// Reuse the IPO adapter: scoring is a POST that saves a log, never a history read.
import { createIpoApi } from '../ipo/ipoApi.js';
import { ApiError } from '../../api/client.js';
import { validCatalogueIpo } from './ipoScoringModel.js';
export function createIpoScoringApi(options = {}) {
  const ipo = createIpoApi(options);
  return { list: signal => ipo.listIpos({ signal }), score: ipoId => ipo.score(ipoId) };
}
export async function loadScoringIpos(api, signal) {
  if (!api) return { status: 'blocked', ipos: null };
  try {
    const ipos = await api.list(signal);
    if (!Array.isArray(ipos) || !ipos.every(validCatalogueIpo) || new Set(ipos.map(ipo => ipo.ipoId)).size !== ipos.length) throw new ApiError('The server returned an invalid IPO catalogue.');
    return { status: 'ready', ipos };
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    return { status: [401, 403].includes(error.status) ? 'blocked' : 'error', ipos: null, error: error.message || 'Could not load the IPO catalogue.' };
  }
}
