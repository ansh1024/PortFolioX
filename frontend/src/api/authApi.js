import { requestJson, ApiError } from './client.js';
import { tokenExpiry } from './authSession.js';
export function createAuthApi({ request = requestJson } = {}) {
  return { async login({email,password}) {
    if(typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password.trim()) throw new ApiError('Email and password are required.',400);
    const response=await request('/auth/login',{method:'POST',auth:false,body:{email:email.trim(),password}});
    if((tokenExpiry(response?.token) ?? 0)<=Date.now())throw new ApiError('The server returned an invalid or expired session token.');
    return { token:response.token };
  } };
}
export const authApi = createAuthApi();
