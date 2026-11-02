import { useCallback, useEffect, useState } from 'react';
import { loadScoringIpos } from './ipoScoringApi.js';
export default function useIpoScoring(api) {
  const [state, setState] = useState({ status: 'loading', ipos: null });
  const [records, setRecords] = useState([]);
  const [revision, setRevision] = useState(0);
  useEffect(() => { setRecords([]); }, [api]);
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', ipos: null });
    loadScoringIpos(api, controller.signal).then(next => {
      if (!controller.signal.aborted) { setState(next); if (next.status === 'blocked') setRecords([]); }
    }).catch(error => { if (!controller.signal.aborted && error.name !== 'AbortError') setState({ status: 'error', ipos: null, error: 'Could not load IPOs.' }); });
    return () => controller.abort();
  }, [api, revision]);
  const reload = useCallback(() => setRevision(value => value + 1), []);
  const accept = useCallback(record => setRecords(previous => [record, ...previous.filter(item => item.scoreLogId !== record.scoreLogId)]), []);
  const invalidate = useCallback(() => { setState({ status: 'blocked', ipos: null }); setRecords([]); }, []);
  return { ...state, records, reload, accept, invalidate };
}
