import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, requestJson } from '../src/api/client.js';
import { createIpoApi, loadTracker } from '../src/features/ipo/ipoApi.js';
import { validDate, initialMaster, validateMaster, masterPayload, validateApplication, filterIpos, summarize, issueEvents, initials } from '../src/features/ipo/ipoModel.js';
const valid = () => ({ ...initialMaster(), companyName: 'Test company', openingDate: '2026-11-01', closingDate: '2026-11-03', price: '100' });

test('calendar uses only valid recorded dates from today onward, without inventing listing dates', () => {
  const events = issueEvents([
    { ipoId: 1, companyName: 'Test A', openingDate: '2026-10-01', closingDate: '2026-11-01', allotmentDate: '2026-11-04' },
    { ipoId: 2, companyName: 'Test B', openingDate: '2026-11-02', closingDate: '2026-02-30' },
  ], '2026-11-01');
  assert.deepEqual(events.map(item => [item.date, item.label]), [['2026-11-01', 'Closes'], ['2026-11-02', 'Opens'], ['2026-11-04', 'Allotment']]);
  assert.equal(issueEvents(null), null); assert.deepEqual(issueEvents([]), []);
  assert.deepEqual(issueEvents([{ ipoId: 3, companyName: 'Same day', openingDate: '2026-11-01', closingDate: '2026-11-01' }], '2026-11-01').map(item => item.label), ['Opens', 'Closes']);
  assert.equal(initials('Test Horizon Industries'), 'TH'); assert.equal(initials(''), 'IP');
});

test('master requires company, dates and strictly positive finite price', () => {
  assert.deepEqual(Object.keys(validateMaster(initialMaster())).sort(), ['closingDate', 'companyName', 'openingDate', 'price']);
  for (const price of ['0', '-1', 'Infinity', '4e38', '1e-50']) assert.ok(validateMaster({ ...valid(), price }).price);
  assert.deepEqual(validateMaster(valid()), {});
});
test('calendar dates reject impossible dates, allow equal issue dates and optional allotment', () => {
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2024-02-29'), true);
  assert.ok(validateMaster({ ...valid(), closingDate: '2026-10-30' }).closingDate);
  assert.equal(validateMaster({ ...valid(), closingDate: '2026-11-01' }).closingDate, undefined);
  assert.ok(validateMaster({ ...valid(), allotmentDate: 'bad' }).allotmentDate);
});
test('master payload whitelists fields and mirrors primitive defaults, with all subscriptions preserved', () => {
  const payload = masterPayload({ ...valid(), companyName: ' Test ', subscriptionQib: '2.5', ipoId: 999, userId: 123 });
  assert.equal(payload.companyName, 'Test'); assert.equal(payload.gmp, 0);
  assert.equal(payload.subscriptionQib, 2.5); assert.equal(payload.allotmentDate, null);
  assert.equal(payload.ipoId, undefined); assert.equal(payload.userId, undefined);
  assert.ok(validateMaster({ ...valid(), gmp: '-1' }).gmp);
  assert.ok(validateMaster({ ...valid(), ipoStatus: 'FAKE' }).ipoStatus);
});
test('application lots require a positive Java int, never decimal or blank', () => {
  for (const lotsApplied of ['', '0', '-1', '1.5', '2147483648', 'NaN']) assert.ok(validateApplication({ ipoId: '1', lotsApplied }).lotsApplied);
  assert.deepEqual(validateApplication({ ipoId: '1', lotsApplied: '2' }), {});
  assert.ok(validateApplication({ ipoId: '', lotsApplied: '2' }).ipoId);
});
test('IPO filters combine search/status, sort price numerically and do not mutate API data', () => {
  const ipos = [{ ipoId: 1, companyName: 'Test Alpha', price: 100, ipoStatus: 'OPEN' }, { ipoId: 2, companyName: 'Test Beta', price: 20, ipoStatus: 'CLOSED' }, { ipoId: 3, companyName: 'Test Alpine', price: 50, ipoStatus: 'OPEN' }];
  assert.deepEqual(filterIpos(ipos, { query: ' AL ', status: 'OPEN', sort: 'price' }).map(item => item.ipoId), [3, 1]);
  assert.deepEqual(filterIpos(ipos, { sort: 'price', direction: 'desc' }).map(item => item.ipoId), [1, 3, 2]);
  assert.deepEqual(ipos.map(item => item.ipoId), [1, 2, 3]);
});
test('open/upcoming metrics require consistent recorded status and dates; missing lists stay unknown', () => {
  const ipos = [
    { ipoStatus: 'OPEN', openingDate: '2026-11-01', closingDate: '2026-11-01' },
    { ipoStatus: 'OPEN', openingDate: '2025-01-01', closingDate: '2025-01-02' },
    { ipoStatus: 'UPCOMING', openingDate: '2026-11-02' },
    { ipoStatus: 'LISTED', openingDate: '2026-11-02' },
  ];
  assert.deepEqual(summarize(ipos, [], '2026-11-01'), { total: 4, open: 1, upcoming: 1, applications: 0 });
  assert.equal(summarize(null, null).total, null);
});
test('API adapter uses exact paths/methods, query parameters for applications, and no update application', async () => {
  const calls = [];
  const api = createIpoApi({ request: async (path, options) => { calls.push([path, options]); return {}; } });
  const body = masterPayload(valid());
  await api.createIpo(body); await api.updateIpo(2, body); await api.deleteIpo(2);
  await api.apply(2, 3); await api.deleteApplication('101'); await api.score(2); await api.getIpo(2);
  assert.deepEqual(calls.map(([path, init]) => [path, init.method || 'GET']), [
    ['/ipos', 'POST'], ['/ipos/2', 'PUT'], ['/ipos/2', 'DELETE'], ['/ipo-applications?ipoId=2&lotsApplied=3', 'POST'],
    ['/ipo-applications/101', 'DELETE'], ['/ipos/2/score', 'POST'], ['/ipos/2', 'GET'],
  ]);
  assert.equal(calls[3][1].body, undefined); assert.equal(api.updateApplication, undefined);
});
test('shared transport serializes JSON writes and accepts empty 204 responses', async () => {
  const response = await requestJson('/ipos', { method: 'POST', body: { companyName: 'Test' }, fetcher: async (url, init) => {
    assert.equal(init.method, 'POST'); assert.equal(init.body, '{"companyName":"Test"}');
    assert.equal(init.headers['Content-Type'], 'application/json'); assert.equal(init.credentials, 'omit');
    return { ok: true, status: 204 };
  } });
  assert.equal(response, null);
});
test('shared transport exposes 400 field errors, handles text responses and propagates abort', async () => {
  await assert.rejects(requestJson('/ipos', { fetcher: async () => ({ ok: false, status: 400, json: async () => ({ price: 'must be positive' }) }) }), error => error.status === 400 && error.fields.price === 'must be positive');
  await assert.rejects(requestJson('/ipos', { fetcher: async () => ({ ok: false, status: 400, headers: { get: () => 'text/plain' }, text: async () => 'Invalid issue' }) }), { message: 'Invalid issue' });
  await assert.rejects(requestJson('/ipos', { fetcher: async () => { throw new DOMException('Aborted', 'AbortError'); } }), { name: 'AbortError' });
});
test('blocked loader sends no requests; valid empty lists are distinguishable', async () => {
  assert.equal((await loadTracker(null)).status, 'blocked');
  const loaded = await loadTracker({ listIpos: async () => [], listApplications: async () => [] });
  assert.equal(loaded.status, 'ready'); assert.deepEqual(loaded.ipos, []);
});
test('partial load keeps other resource; authentication denial clears all account records', async () => {
  const api = { listIpos: async () => [{ ipoId: 1 }], listApplications: async () => { throw new ApiError('Failed', 500); } };
  assert.equal((await loadTracker(api)).ipos.length, 1);
  api.listApplications = async () => { throw new ApiError('Denied', 401); };
  assert.deepEqual(await loadTracker(api), { status: 'blocked', ipos: null, applications: null, errors: {} });
});
test('unexpected formats and network errors never become empty success', async () => {
  const result = await loadTracker({ listIpos: async () => ({}), listApplications: async () => { throw new TypeError('Network'); } });
  assert.equal(result.status, 'error'); assert.equal(result.ipos, null);
});
