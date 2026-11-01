import { requestJson, ApiError } from '../../api/client.js';
export function createMutualFundApi(options={}) {
 const request=options.request||((path,init)=>requestJson(path,{...options,...init}));
 const path=id=>`/mutual-funds/${encodeURIComponent(id)}`;
 return {list:signal=>request('/mutual-funds',{signal}), get:(id,signal)=>request(path(id),{signal}),create:body=>request('/mutual-funds',{method:'POST',body}),update:(id,body)=>request(path(id),{method:'PUT',body}),remove:id=>request(path(id),{method:'DELETE'})};
}
export async function loadFunds(api,signal) {
 if(!api)return {status:'blocked',funds:null};
 try {const funds=await api.list(signal);if(!Array.isArray(funds))throw new ApiError('Unexpected fund response.');return {status:'ready',funds};}
 catch(error){if(error.name==='AbortError')throw error;return {status:[401,403].includes(error.status)?'blocked':'error',funds:null,error:error.message||'Could not load funds.'};}
}
