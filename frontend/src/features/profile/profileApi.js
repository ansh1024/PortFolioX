import { requestJson, ApiError } from '../../api/client.js';
import { validUser } from './profileModel.js';
export function createProfileApi({request=requestJson}={}) { return {
  async user(userId,signal) {
    if(!/^\d+$/.test(String(userId)) || !Number.isSafeInteger(Number(userId)) || Number(userId)<1) throw new ApiError('Account identity is unavailable.');
    const result=await request(`/users/${encodeURIComponent(String(userId))}`,{signal});
    if(!validUser(result,userId))throw new ApiError('The account response could not be verified.');
    return result;
  },
  risk:signal=>request('/risk-profiles/me',{signal}),
}; }
export async function loadProfile(api,userId,signal) {
  if(!api || !userId)return {status:'unavailable',user:null,profiles:null,errors:{}};
  const results=await Promise.allSettled([api.user(userId,signal),api.risk(signal)]);
  if(signal?.aborted)throw new DOMException('Aborted','AbortError');
  if(results.some(r=>r.status==='rejected' && r.reason?.name==='AbortError'))throw new DOMException('Aborted','AbortError');
  if(results.some(r=>r.status==='rejected' && r.reason?.status===401))return {status:'unauthenticated',user:null,profiles:null,errors:{}};
  const [u,r]=results;
  const user=u.status==='fulfilled' && validUser(u.value,userId)?u.value:null;
  const profiles=r.status==='fulfilled' && Array.isArray(r.value)?r.value:null;
  return {status:user?'ready':'error',user,profiles,errors:{...(!user?{user:u.reason?.message || 'Account details could not be loaded.'}:{}),...(!profiles?{risk:r.reason?.message || 'Risk information could not be loaded.'}:{})}};
}
