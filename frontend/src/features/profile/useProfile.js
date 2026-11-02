import {useEffect,useState} from 'react';
import {loadProfile} from './profileApi.js';
export default function useProfile(api,userId,enabled) {
  const [state,setState]=useState({status:'loading',user:null,profiles:null,errors:{}}),[revision,setRevision]=useState(0);
  useEffect(()=>{const c=new AbortController();setState({status:enabled?'loading':'unauthenticated',user:null,profiles:null,errors:{}});if(enabled)loadProfile(api,userId,c.signal).then(next=>{if(!c.signal.aborted)setState(next);}).catch(e=>{if(!c.signal.aborted)setState({status:'error',user:null,profiles:null,errors:{user:e.message}});});return()=>c.abort();},[api,userId,enabled,revision]);
  return {...state,reload:()=>setRevision(r=>r+1)};
}
