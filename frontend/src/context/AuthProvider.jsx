import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { AuthContext } from './AuthContext.js';
import { authSession, tokenExpiry } from '../api/authSession.js';
import { authApi } from '../api/authApi.js';
export default function AuthProvider({children}) {
  const state=useSyncExternalStore(authSession.subscribe,authSession.getSnapshot,authSession.getSnapshot);
  useEffect(()=>{
    let timer;
    function check() {
      authSession.checkExpiry();
      const token=authSession.getSnapshot().token;
      if(token)timer=setTimeout(check,Math.min(Math.max(1,tokenExpiry(token)-Date.now()),2147483647));
    }
    function resume(){clearTimeout(timer);check();}
    check();window.addEventListener('focus',resume);window.addEventListener('pageshow',resume);
    return()=>{clearTimeout(timer);window.removeEventListener('focus',resume);window.removeEventListener('pageshow',resume);};
  },[state.token]);
  const login=useCallback(credentials=>authSession.login(credentials,authApi.login),[]);
  const value=useMemo(()=>({token:state.token,status:state.status,isAuthenticated:state.status==='authenticated',login,logout:authSession.logout}),[state.token,state.status,login]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
