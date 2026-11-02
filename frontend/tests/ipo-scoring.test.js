import test from 'node:test';
import assert from 'node:assert/strict';
import { createIpoScoringApi, loadScoringIpos } from '../src/features/ipo-scoring/ipoScoringApi.js';
import { factorBreakdown, filterScores, sessionSummary, validScore, filterCatalogue, factorExplanations } from '../src/features/ipo-scoring/ipoScoringModel.js';
const result = () => ({ scoreLogId: '101', ipoId: 1, companyName: 'Test IPO', totalScore: 50, gmpScore: 10, subscriptionScore: 0, fundamentalScore: 20, sectorScore: 10, historicalScore: 10, verdict: 'WATCH', calculatedAt: '2026-11-02T12:00:00' });
test('scoring adapter reuses exact existing GET catalogue and explicit POST, never requests nonexistent history', async () => {
  const calls = [];
  const api = createIpoScoringApi({ request: async (path, init) => { calls.push([path, init]); return []; } });
  await api.list(); await api.score(12);
  assert.deepEqual(calls.map(([path, init]) => [path, init.method || 'GET']), [['/ipos', 'GET'], ['/ipos/12/score', 'POST']]);
  assert.equal(calls[1][1].body, undefined);
  assert.equal(api.history, undefined);
});
test('breakdown keeps actual points and computes visual contribution shares, not factor weights', () => {
  const items = factorBreakdown(result());
  assert.deepEqual(items.map(item => item.value), [10, 0, 20, 10, 10]);
  assert.equal(items.reduce((sum, item) => sum + item.share, 0), 100);
  assert.ok(factorBreakdown({ ...result(), gmpScore: -1 }).every(item => item.share === null));
});
test('returned results do not impose unvalidated 100-point cap or derive a frontend verdict', () => {
  assert.equal(validScore({ ...result(), fundamentalScore: 90, totalScore: 120, verdict: 'APPLY' }), true);
  assert.equal(validScore({ ...result(), verdict: 'FAKE' }), false);
  assert.equal(validScore({ ...result(), totalScore: null }), false);
  assert.equal(validScore({ ...result(), sectorScore: undefined }), false);
});
test('session metrics and filters use only captured records, with deterministic score/date ordering', () => {
  assert.deepEqual(sessionSummary([]), { runs: 0, ipos: 0, average: null });
  const records = [result(), { ...result(), scoreLogId: '102', totalScore: 80, verdict: 'APPLY', calculatedAt: '2026-11-03T12:00:00' }];
  assert.deepEqual(sessionSummary(records), { runs: 2, ipos: 1, average: 65 });
  assert.equal(filterScores(records, { query: 'test', verdict: 'APPLY' }).length, 1);
  assert.equal(filterScores(records, { sort: 'totalScore', direction: 'desc' })[0].totalScore, 80);
  assert.equal(records[0].scoreLogId, '101');
});
test('scoring loader never turns a failure into an empty success', async () => {
  assert.equal((await loadScoringIpos(null)).status, 'blocked');
  assert.deepEqual((await loadScoringIpos({ list: async () => [] })).ipos, []);
  assert.equal((await loadScoringIpos({ list: async () => ({}) })).status, 'error');
  assert.equal((await loadScoringIpos({ list: async () => { throw { status: 403 }; } })).status, 'blocked');
});

test('catalogue filters real issue data and sorts numerically with missing prices last', () => {
  const ipos = [{ ipoId: 1, companyName: 'Cedar', price: 200, ipoStatus: 'OPEN' }, { ipoId: 2, companyName: 'Horizon', price: 30, ipoStatus: 'CLOSED' }, { ipoId: 3, companyName: 'Aspen', price: null }];
  assert.deepEqual(filterCatalogue(ipos, { sort: 'price' }).map(ipo => ipo.ipoId), [2, 1, 3]);
  assert.deepEqual(filterCatalogue(ipos, { query: 'CED', status: 'OPEN' }).map(ipo => ipo.ipoId), [1]);
  assert.equal(filterCatalogue(ipos, { query: 'ced', status: 'CLOSED' }).length, 0);
  assert.equal(ipos[0].ipoId, 1);
  assert.equal(Object.keys(factorExplanations).length, 5);
  assert.match(factorExplanations.fundamentalScore, /does not expose/);
});
test('catalogue rejects absent, duplicate or invalid identities rather than rendering unusable choices', async () => {
  for (const list of [[{}], [{ ipoId: 1, companyName: '' }], [{ ipoId: '1', companyName: 'Test' }], [{ ipoId: 1, companyName: 'A' }, { ipoId: 1, companyName: 'B' }]]) {
    assert.equal((await loadScoringIpos({ list: async () => list })).status, 'error');
  }
  assert.equal((await loadScoringIpos({ list: async () => [{ ipoId: 1, companyName: 'Test' }] })).status, 'ready');
});
