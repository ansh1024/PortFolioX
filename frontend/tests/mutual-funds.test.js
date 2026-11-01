import test from 'node:test';import assert from 'node:assert/strict';

import {initial,validate,payload,selectFunds,percent,categoryDistribution,catalogueSummary,associatedHoldings} from '../src/features/mutual-funds/mutualFundModel.js';import {createMutualFundApi,loadFunds,loadFundWorkspace} from '../src/features/mutual-funds/mutualFundApi.js';

test('fund validation preserves nullable decimals and rejects unsafe AUM',()=>{const v={...initial(),fundId:' F1 ',fundName:' Test ',amc:' House ',category:'EQUITY',aum:'0'};assert.deepEqual(validate(v),{});assert.equal(payload(v).nav,null);assert.equal(payload(v).fundId,'F1');assert.ok(validate({...v,aum:'9007199254740992'}).aum);assert.ok(validate({...v,nav:'-1'}).nav);assert.ok(validate({...v,return1Year:'Infinity'}).return1Year);assert.equal(percent(null),'—');assert.equal(percent(-2),'-2%');});

test('fund filters combine category, search, AMC and numeric sorting without mutation',()=>{const funds=[{fundId:'1',fundName:'Beta',category:'EQUITY',amc:'A',nav:100},{fundId:'2',fundName:'Alpha',category:'DEBT',amc:'B',nav:20},{fundId:'3',fundName:'Absent',nav:null}];assert.deepEqual(selectFunds(funds,{sort:'nav'}).map(f=>f.fundId),['2','1','3']);assert.equal(selectFunds(funds,{query:'alp',category:'DEBT',amc:'B'}).length,1);assert.equal(funds[0].fundId,'1');});

test('fund adapter matches CRUD contract and encodes identifiers',async()=>{const calls=[];const api=createMutualFundApi({request:async(path,init)=>{calls.push([path,init.method||'GET',init.body]);return [];}});await api.list();await api.get('a/b');await api.create({fundId:'x'});await api.update('x',{});await api.remove('x');assert.deepEqual(calls.map(c=>c.slice(0,2)),[['/mutual-funds','GET'],['/mutual-funds/a%2Fb','GET'],['/mutual-funds','POST'],['/mutual-funds/x','PUT'],['/mutual-funds/x','DELETE']]);});

test('loader distinguishes blocked, empty, malformed, error and authentication failure',async()=>{assert.equal((await loadFunds(null)).status,'blocked');assert.deepEqual((await loadFunds({list:async()=>[]})).funds,[]);assert.equal((await loadFunds({list:async()=>({})})).status,'error');assert.equal((await loadFunds({list:async()=>{throw {status:401};}})).status,'blocked');await assert.rejects(loadFunds({list:async()=>{throw new DOMException('Aborted','AbortError');}}),{name:'AbortError'});});


test('catalogue metrics and distribution never count masters as investments', () => {
  assert.deepEqual(catalogueSummary(null), { total: null, categories: null, houses: null });
  assert.deepEqual(catalogueSummary([]), { total: 0, categories: 0, houses: 0 });
  const funds = [{ category: 'EQUITY', amc: 'A' }, { category: 'DEBT', amc: 'A' }, { category: null, amc: null }];
  assert.deepEqual(catalogueSummary(funds), { total: 3, categories: 2, houses: 1 });
  const distribution = categoryDistribution(funds);
  assert.equal(distribution.reduce((sum, item) => sum + item.count, 0), 3);
  assert.equal(distribution.at(-1).category, 'UNRECORDED');
  assert.equal(categoryDistribution(null), null);
  assert.equal(selectFunds(funds, { category: 'UNRECORDED' }).length, 1);
});
test('category sorting, missing values and direction remain deterministic', () => {
  const funds = [{ fundId: '3', category: null, nav: null }, { fundId: '2', category: 'EQUITY', nav: 100 }, { fundId: '1', category: 'DEBT', nav: 20 }];
  assert.deepEqual(selectFunds(funds, { sort: 'category' }).map(fund => fund.fundId), ['1', '2', '3']);
  assert.deepEqual(selectFunds(funds, { sort: 'nav', direction: 'desc' }).map(fund => fund.fundId), ['2', '1', '3']);
});
test('SIP association uses IDs, distinguishes unconnected from zero and scopes records to supplied account data', () => {
  const sips = [{ holdingId: '101', mutualFundId: 'F1' }, { holdingId: '102', mutualFundId: 'F2' }];
  assert.deepEqual(associatedHoldings(sips, 'F1'), [sips[0]]);
  assert.deepEqual(associatedHoldings(sips, 'F3'), []);
  assert.equal(associatedHoldings(null, 'F1'), null);
});
test('workspace preserves catalogue after SIP network failure but clears account records on authentication failure', async () => {
  const api = { list: async () => [{ fundId: 'F1' }] };
  const partial = await loadFundWorkspace(api, { list: async () => { throw new Error('Offline'); } });
  assert.equal(partial.funds.length, 1); assert.equal(partial.sips, null); assert.equal(partial.sipStatus, 'error');
  assert.ok(partial.fetchedAt);
  const denied = await loadFundWorkspace(api, { list: async () => { throw { status: 401 }; } });
  assert.equal(denied.funds, null); assert.equal(denied.sips, null); assert.equal(denied.status, 'blocked');
  assert.equal((await loadFundWorkspace(null, { list: () => assert.fail('must not request without catalogue connection') })).status, 'blocked');
  const ready = await loadFundWorkspace(api, { list: async () => [] });
  assert.deepEqual(ready.sips, []);
  await assert.rejects(loadFundWorkspace({ list: async () => { throw new DOMException('Aborted', 'AbortError'); } }, null), { name: 'AbortError' });
});
