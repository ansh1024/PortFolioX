import { validTimestamp } from '../risk-assessment/riskAssessmentModel.js';
export const validJournal = r => !!r && typeof r === 'object' && typeof r.journalId === 'string' && !!r.journalId.trim() && Number.isSafeInteger(r.ipoId) && r.ipoId > 0 && typeof r.companyName === 'string' && (r.content === null || typeof r.content === 'string');
export function journalPayload(content) {
  if (typeof content !== 'string' || !content.trim()) throw new Error('Write your decision before saving.');
  return { content: content.trim() };
}
export function filterJournals(entries, { query = '', sort = 'latest' } = {}) {
  const q = query.trim().toLowerCase();
  return entries.filter(r => `${r.companyName} ${r.content || ''}`.toLowerCase().includes(q)).sort((a,b) => {
    if (sort === 'company') return a.companyName.localeCompare(b.companyName, 'en-IN', { sensitivity:'base' });
    const x = validTimestamp(a.updatedAt) ? a.updatedAt : '', y = validTimestamp(b.updatedAt) ? b.updatedAt : '';
    if (!x || !y) return x === y ? 0 : x ? -1 : 1;
    return x.localeCompare(y) * (sort === 'oldest' ? 1 : -1);
  });
}
export const journalPreview = content => (content || '').replace(/\s+/g, ' ').trim();
export function journalSummary(entries) {
  if (!entries) return { total: null, ipos: null, latest: null };
  return { total: entries.length, ipos: new Set(entries.map(r => r.ipoId)).size, latest: filterJournals(entries).find(r => validTimestamp(r.updatedAt))?.updatedAt || null };
}
export const existingJournal = (entries, ipoId) => (entries || []).find(r => String(r.ipoId) === String(ipoId));
