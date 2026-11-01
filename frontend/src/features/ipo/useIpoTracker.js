import { useEffect, useState, useCallback } from 'react';
import { loadTracker } from './ipoApi.js';
export default function useIpoTracker(api) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ status: 'loading', ipos: null, applications: null, errors: {} });
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', ipos: null, applications: null, errors: {} });
    loadTracker(api, controller.signal).then(result => { if (!controller.signal.aborted) setState(result); }).catch(error => {
      if (!controller.signal.aborted && error.name !== 'AbortError') setState({ status: 'error', ipos: null, applications: null, errors: { ipos: 'Could not load records.' } });
    });
    return () => controller.abort();
  }, [api, revision]);
  const reload = useCallback(() => setRevision(value => value + 1), []);
  const invalidate = useCallback(() => setState({ status: 'blocked', ipos: null, applications: null, errors: {} }), []);
  return { ...state, reload, invalidate };
}
