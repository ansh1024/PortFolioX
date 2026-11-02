import { requestJson, ApiError } from '../../api/client.js';
export function createMutualFundApi(options={}) {
 const request=options.request||((path,init)=>requestJson(path,{...options,...init}));
 const path=id=>`/mutual-funds/${encodeURIComponent(id)}`;
 return {list:signal=>request('/mutual-funds',{signal}), get:(id,signal)=>request(path(id),{signal}),create:body=>request('/mutual-funds',{method:'POST',body}),update:(id,body)=>request(path(id),{method:'PUT',body}),remove:id=>request(path(id),{method:'DELETE'})};
}
export async function loadFunds(api,signal) {
 if(!api)return {status:'blocked',funds:null};
 try {const funds=await api.list(signal);if(!Array.isArray(funds) || !funds.every(f => f && typeof f === 'object' && typeof f.fundId === 'string' && !!f.fundId && (f.fundName == null || typeof f.fundName === 'string')))throw new ApiError('Unexpected fund response.');return {status:'ready',funds};}
 catch(error){if(error.name==='AbortError')throw error;return {status:[401,403].includes(error.status)?'blocked':'error',funds:null,error:error.message||'Could not load funds.'};}
}

// SIP adapter is supplied separately; neither module's endpoint or hook is duplicated.
export async function loadFundWorkspace(api, sipApi, signal) {
  if (!api) return { status: 'blocked', funds: null, sips: null, sipStatus: 'unconnected' };
  const [catalogue, holdings] = await Promise.allSettled([
    loadFunds(api, signal), sipApi ? sipApi.list(signal) : Promise.resolve(null),
  ]);
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  for (const result of [catalogue, holdings]) {
    if (result.status === 'rejected' && result.reason?.name === 'AbortError') throw result.reason;
  }
  if ((catalogue.status === 'fulfilled' && catalogue.value.status === 'blocked')
    || (holdings.status === 'rejected' && [401, 403].includes(holdings.reason?.status))) {
    return { status: 'blocked', funds: null, sips: null, sipStatus: 'unconnected' };
  }
  const state = catalogue.status === 'fulfilled' ? catalogue.value : { status: 'error', funds: null, error: 'Could not load the catalogue.' };
  const sips = holdings.status === 'fulfilled' && Array.isArray(holdings.value) && holdings.value.every(h => h && typeof h.holdingId === 'string' && typeof h.mutualFundId === 'string') ? holdings.value : null;
  return { ...state, sips, sipStatus: !sipApi ? 'unconnected' : sips ? 'ready' : 'error',
    fetchedAt: state.status === 'ready' ? new Date().toISOString() : null };
}
