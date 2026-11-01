import { useEffect, useState, useCallback } from 'react';
import { loadFundWorkspace } from './mutualFundApi.js';

export default function useMutualFunds(api, sipApi = null) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ status: 'loading', funds: null, sips: null, sipStatus: 'unconnected' });
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', funds: null, sips: null, sipStatus: 'unconnected' });
    loadFundWorkspace(api, sipApi, controller.signal).then(next => {
      if (!controller.signal.aborted) setState(next);
    }).catch(error => {
      if (!controller.signal.aborted && error.name !== 'AbortError') {
        setState({ status: 'error', funds: null, sips: null, sipStatus: 'error', error: 'Could not load records. Please retry.' });
      }
    });
    return () => controller.abort();
  }, [api, sipApi, revision]);
  const reload = useCallback(() => setRevision(value => value + 1), []);
  const invalidate = useCallback(() => setState({ status: 'blocked', funds: null, sips: null, sipStatus: 'unconnected' }), []);
  return { ...state, reload, invalidate };
}
