import { useEffect, useState } from 'react';
import { loadOverview } from './overviewData.js';

export default function useOverviewData(loader = loadOverview) {
  const [state, setState] = useState({ status: 'loading', resources: {} });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', resources: {} });
    Promise.resolve().then(() => loader({ signal: controller.signal })).then(result => {
      if (!controller.signal.aborted) setState({ ...result, fetchedAt: result.status === 'ready' ? new Date().toISOString() : null });
    }).catch(error => {
      if (!controller.signal.aborted && error.name !== 'AbortError') setState({ status: 'error', resources: {} });
    });
    return () => controller.abort();
  }, [loader, revision]);
  return { ...state, reload: () => setRevision(value => value + 1) };
}
