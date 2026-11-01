import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, getJson } from '../src/api/client.js';
import { loadOverview, deriveOverview, overviewEndpoints, formatMoney } from '../src/features/overview/overviewData.js';

const ready = data => ({ status: 'ready', data });
const emptyResources = () => Object.fromEntries(Object.keys(overviewEndpoints).map(key => [key, ready([])]));

test('IPO status counts distinguish unavailable, empty, known and missing statuses', () => {
  assert.deepEqual(deriveOverview().ipoStatuses.map(item => item.count), [null, null, null]);
  assert.deepEqual(deriveOverview(emptyResources()).ipoStatuses.map(item => item.count), [0, 0, 0]);
  const model = deriveOverview({ applications: ready([
    { allotmentStatus: 'PENDING' }, { allotmentStatus: 'ALLOTTED' },
    { allotmentStatus: 'ALLOTTED' }, { allotmentStatus: 'NOT_ALLOTTED' }, {},
  ]) });
  assert.deepEqual(model.ipoStatuses.map(item => item.count), [1, 2, 1]);
  assert.equal(model.otherStatusCount, 1);
});
test('top funds aggregate duplicate holdings, rank recorded cost and cap at three', () => {
  const holdings = [
    { mutualFundId: 'a', mutualFundName: 'Fund A', investedAmount: '100.50' },
    { mutualFundId: 'b', mutualFundName: 'Fund B', investedAmount: 200 },
    { mutualFundId: 'a', mutualFundName: 'Fund A', investedAmount: 150 },
    { mutualFundId: 'c', mutualFundName: 'Fund C', investedAmount: 30 },
    { mutualFundId: 'd', mutualFundName: 'Fund D', investedAmount: 10 },
  ];
  const snapshot = JSON.stringify(holdings);
  const top = deriveOverview({ holdings: ready(holdings) }).topHoldings;
  assert.deepEqual(top.map(item => item.id), ['a', 'b', 'c']);
  assert.equal(top[0].invested, 250.5);
  assert.equal(JSON.stringify(holdings), snapshot);
});
test('incomplete fund costs or IDs suppress ranking instead of understating holdings', () => {
  assert.equal(deriveOverview().topHoldings, null);
  assert.deepEqual(deriveOverview(emptyResources()).topHoldings, []);
  for (const record of [{ mutualFundId: 'a', investedAmount: null }, { investedAmount: 500 }]) {
    assert.equal(deriveOverview({ holdings: ready([record]) }).topHoldings, null);
  }
});

test('unconnected account makes no requests and is not an empty portfolio', async () => {
  const result = await loadOverview();
  assert.equal(result.status, 'blocked');
  assert.equal(deriveOverview(result.resources).empty, false);
  assert.equal(deriveOverview(result.resources).sipInvested, null);
});
test('verified empty responses produce zero counts and zero recorded SIP cost', async () => {
  const paths = [];
  const result = await loadOverview({ request: async path => { paths.push(path); return []; } });
  assert.deepEqual(paths.sort(), Object.values(overviewEndpoints).sort());
  const model = deriveOverview(result.resources);
  assert.equal(model.empty, true);
  assert.equal(model.applicationCount, 0);
  assert.equal(model.sipInvested, 0);
  assert.equal(model.fundCount, 0);
});
test('SIP cost and distinct funds use records, and different contribution frequencies stay separate', () => {
  const resources = emptyResources();
  resources.holdings = ready([
    { mutualFundId: '101', investedAmount: '1250.50', sipAmount: 500, frequency: 'MONTHLY' },
    { mutualFundId: '101', investedAmount: 750, sipAmount: 100, frequency: 'WEEKLY' },
  ]);
  const model = deriveOverview(resources);
  assert.equal(model.sipInvested, 2000.5);
  assert.equal(model.fundCount, 1);
  assert.equal(model.holdingCount, 2);
  assert.deepEqual(model.contributions, [{ frequency: 'MONTHLY', amount: 500 }, { frequency: 'WEEKLY', amount: 100 }]);
  assert.match(formatMoney(123456.5), /1,23,456.50/);
});
test('missing, blank, negative and non-finite amounts cannot silently become zero', () => {
  for (const value of [null, undefined, '', ' ', -1, Infinity, 'oops']) {
    assert.equal(deriveOverview({ holdings: ready([{ investedAmount: value }]) }).sipInvested, null);
  }
});
test('partial error keeps verified data and does not imply an empty portfolio', async () => {
  const result = await loadOverview({ request: async path => {
    if (path === '/sip-holdings') throw new ApiError('Unavailable', 500);
    return [];
  } });
  assert.equal(result.status, 'ready');
  const model = deriveOverview(result.resources);
  assert.equal(model.applicationCount, 0);
  assert.equal(model.sipInvested, null);
  assert.equal(model.empty, false);
});
test('401/403 discards partial account data', async () => {
  for (const status of [401, 403]) {
    const result = await loadOverview({ request: async path => {
      if (path === '/journal/me') throw new ApiError('Denied', status);
      return [{ applicationId: 'test' }];
    } });
    assert.deepEqual(result, { status: 'blocked', resources: {} });
  }
});
test('network failure and malformed lists are errors, not empty success', async () => {
  for (const request of [async () => { throw new TypeError('Network'); }, async () => ({}), async () => [null]]) {
    assert.equal((await loadOverview({ request })).status, 'error');
  }
});
test('abort propagates so unmounted requests cannot update state', async () => {
  await assert.rejects(loadOverview({ request: async () => { throw new DOMException('Aborted', 'AbortError'); } }), { name: 'AbortError' });
});
test('timeline sorts actual journal timestamps and tolerates null content', () => {
  const model = deriveOverview({ journals: ready([
    { journalId: 'old', createdAt: '2025-01-01T10:00:00', content: '' },
    { journalId: 'new', updatedAt: '2026-01-01T10:00:00', content: null },
    { journalId: 'undated', content: 'No fabricated date' },
  ]) });
  assert.deepEqual(model.activity.map(item => item.id), ['new', 'old']);
  assert.equal(model.activity[0].description, 'No note recorded.');
});
test('latest dated risk profile selected without mutating response', () => {
  const profiles = [{ riskCategory: 'LOW', calculatedAt: '2025-01-01T12:00:00' }, { riskCategory: 'HIGH', calculatedAt: '2026-01-01T12:00:00' }];
  assert.equal(deriveOverview({ profiles: ready(profiles) }).risk.riskCategory, 'HIGH');
  assert.equal(profiles[0].riskCategory, 'LOW');
});
test('API transport passes cancellation, never persists credentials, rejects non-success', async () => {
  const signal = new AbortController().signal;
  await getJson('/sip-holdings', { signal, baseUrl: 'http://localhost:8080/', fetcher: async (url, options) => {
    assert.equal(url, 'http://localhost:8080/sip-holdings');
    assert.equal(options.signal, signal);
    assert.equal(options.credentials, 'omit');
    assert.equal(options.headers.Authorization, undefined);
    return { ok: true, json: async () => [] };
  } });
  await assert.rejects(getJson('/journal/me', { fetcher: async () => ({ ok: false, status: 401 }) }), { status: 401 });
});
