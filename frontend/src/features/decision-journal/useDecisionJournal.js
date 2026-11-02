import { useEffect, useState, useCallback } from 'react';
import { loadDecisionJournal } from './decisionJournalApi.js';
export default function useDecisionJournal(api) {
  const [data,setData] = useState({ status:'loading',entries:null,ipos:null,errors:{} });
  const [revision,setRevision] = useState(0);
  useEffect(() => {
    const c = new AbortController();
    setData({ status:'loading',entries:null,ipos:null,errors:{} });
    loadDecisionJournal(api,c.signal).then(next => { if(!c.signal.aborted) setData(next); }).catch(e => { if(!c.signal.aborted && e.name !== 'AbortError') setData({status:'error',entries:null,ipos:null,errors:{entries:'Could not load journal.'}}); });
    return () => c.abort();
  },[api,revision]);
  return { ...data, reload:useCallback(() => setRevision(r=>r+1),[]), invalidate:useCallback(()=>setData({status:'blocked',entries:null,ipos:null,errors:{}}),[]) };
}
