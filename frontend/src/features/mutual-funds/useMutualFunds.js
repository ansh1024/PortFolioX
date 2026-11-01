import {useEffect,useState,useCallback} from 'react';
import {loadFunds} from './mutualFundApi.js';
export default function useMutualFunds(api){
 const [revision,setRevision]=useState(0),[state,setState]=useState({status:'loading',funds:null});
 useEffect(()=>{const controller=new AbortController();setState({status:'loading',funds:null});loadFunds(api,controller.signal).then(next=>{if(!controller.signal.aborted)setState(next);}).catch(()=>{});return ()=>controller.abort();},[api,revision]);
 const reload=useCallback(()=>setRevision(v=>v+1),[]); const invalidate=useCallback(()=>setState({status:'blocked',funds:null}),[]);
 return {...state,reload,invalidate};
}
