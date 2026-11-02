import { filterIpos } from '../ipo/ipoModel.js';
export const verdicts = ['APPLY', 'WATCH', 'SKIP'];
// Explanations of the inspected service, never a second scoring implementation.
export const factorExplanations = {
  gmpScore: 'The service compares GMP with the issue price. GMP of 0% or less earns 0 points; below 10% earns 5; below 25% earns 10; below 50% earns 15; 50% or above earns 20.',
  subscriptionScore: 'The service averages finite, nonnegative QIB, small HNI, big HNI, retail and employee subscriptions. Below 1× earns 0 points; below 3× earns 5; below 5× earns 10; below 10× earns 15; 10× or above earns 20. With no valid subscriptions, it returns 0.',
  fundamentalScore: 'Read directly from the stored IPO metrics. The API does not expose the underlying financial ratios, methodology or a written rationale.',
  sectorScore: 'Read directly from the stored IPO metrics. The API does not expose sector benchmarks, evaluation criteria or a written rationale.',
  historicalScore: 'Read directly from the stored IPO metrics. The API does not expose the reference IPOs, historical sample or a written rationale.',
};
export const filterCatalogue = (ipos, filters) => filterIpos(ipos, { ...filters, direction: 'asc' });
export const validCatalogueIpo = ipo => ipo && typeof ipo === 'object' && !Array.isArray(ipo)
  && Number.isSafeInteger(ipo.ipoId) && ipo.ipoId > 0 && typeof ipo.companyName === 'string' && !!ipo.companyName.trim();
export const factors = [['gmpScore', 'GMP'], ['subscriptionScore', 'Subscription'], ['fundamentalScore', 'Fundamentals'], ['sectorScore', 'Sector'], ['historicalScore', 'Historical']];
export const scoreNumber = value => value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value));
export const verdictLabel = value => verdicts.includes(value) ? value.charAt(0) + value.slice(1).toLowerCase() : 'Not recorded';
export function validScore(record) {
  return record && typeof record === 'object' && !Array.isArray(record) && typeof record.scoreLogId === 'string'
    && record.ipoId !== null && record.ipoId !== undefined && scoreNumber(record.totalScore) && verdicts.includes(record.verdict)
    && factors.every(([key]) => scoreNumber(record[key]));
}
export function filterScores(records, { query = '', verdict = '', sort = 'calculatedAt', direction = 'desc' } = {}) {
  return records.filter(item => (item.companyName || '').toLowerCase().includes(query.trim().toLowerCase()) && (!verdict || item.verdict === verdict))
    .sort((a, b) => {
      if (a[sort] == null || b[sort] == null) return a[sort] == null ? b[sort] == null ? 0 : 1 : -1;
      const comparison = sort === 'totalScore' ? Number(a[sort]) - Number(b[sort]) : String(a[sort]).localeCompare(String(b[sort]));
      return comparison * (direction === 'asc' ? 1 : -1);
    });
}
export function sessionSummary(records) {
  return { runs: records.length, ipos: new Set(records.map(record => String(record.ipoId))).size,
    average: records.length && records.every(record => scoreNumber(record.totalScore)) ? records.reduce((sum, record) => sum + Number(record.totalScore), 0) / records.length : null };
}
export function factorBreakdown(record) {
  const sum = factors.reduce((value, [key]) => value + Number(record[key]), 0);
  const canCompare = Number.isFinite(sum) && sum > 0 && factors.every(([key]) => scoreNumber(record[key]) && Number(record[key]) >= 0);
  return factors.map(([key, label]) => ({ key, label, value: record[key], share: canCompare ? Number(record[key]) / sum * 100 : null }));
}
