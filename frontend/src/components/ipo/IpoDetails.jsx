import { useEffect, useState } from 'react';
import { dateLabel, money, number, numericFields, text } from '../../features/ipo/ipoModel.js';
export default function IpoDetails({ record, api, isAdmin, onEdit, onDelete, onApply, onAuthFailure, busy, setBusy }) {
  const [detail, setDetail] = useState(record);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(null);
  const [scoreError, setScoreError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let live = true;
    api.getIpo(record.ipoId, { signal: controller.signal }).then(value => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid IPO detail response.');
      if (live) { setDetail(value); setLoading(false); }
    }).catch(problem => {
      if (live && problem.name !== 'AbortError') { setLoading(false); setError(problem.message); onAuthFailure(problem); }
    });
    return () => { live = false; controller.abort(); };
  }, [api, record.ipoId]);
  return <div className="ipo-details">
    {loading && <p role="status" className="ipo-muted">Refreshing IPO details…</p>}
    {error && <p role="alert" className="ipo-error">{error}</p>}
    <p className="ipo-muted">{detail.sector || 'Sector not recorded'} · IPO #{detail.ipoId}</p>
    <dl className="ipo-detail-grid">{[
      ['Recorded status', text(detail.ipoStatus)], ['Issue price', money(detail.price)], ['GMP', money(detail.gmp)],
      ['Open date', dateLabel(detail.openingDate)], ['Close date', dateLabel(detail.closingDate)], ['Allotment date', dateLabel(detail.allotmentDate)],
      ...numericFields.slice(2).map(([key, title]) => [title, `${number(detail[key])}${number(detail[key]) === '—' ? '' : '×'}`]),
    ].map(([title, value]) => <div key={title}><dt>{title}</dt><dd>{value}</dd></div>)}</dl>
    <p className="ipo-muted">Issue price is a single recorded price. IPO type, listing date and price band are not supplied. GMP is a recorded premium, not a guaranteed return.</p>
    <div className="ipo-actions"><button className="ipo-button ipo-button--primary" disabled={busy || loading || !!error} onClick={() => onApply(detail)}>Record application</button>{isAdmin && <><button className="ipo-button" disabled={busy || loading || !!error} onClick={() => onEdit(detail)}>Edit IPO</button><button className="ipo-button ipo-button--danger" disabled={busy || loading || !!error} onClick={() => onDelete(detail)}>Delete IPO</button></>}</div>
    <section className="ipo-score" aria-labelledby="ipo-score-title"><div className="ipo-section-heading"><h3 id="ipo-score-title">IPO score</h3><button className="ipo-button" disabled={busy || loading || !!error} onClick={async () => {
      setBusy(true); setScoreError(''); setScore(null);
      try { const result = await api.score(detail.ipoId); if (!result || typeof result !== 'object') throw new Error('Invalid score response.'); setScore(result); }
      catch (problem) { setScoreError(problem.message); onAuthFailure(problem); }
      finally { setBusy(false); }
    }}>{busy ? 'Working…' : 'Calculate & save score'}</button></div><p className="ipo-muted">This action creates a score log. Existing fundamental, sector and historical metrics are required.</p>
      {scoreError && <p className="ipo-error" role="alert">{scoreError}</p>}
      {score && <div role="status"><p className="ipo-score__total">{number(score.totalScore)} <span>{text(score.verdict)}</span></p><dl className="ipo-detail-grid">{[['GMP', score.gmpScore], ['Subscription', score.subscriptionScore], ['Fundamentals', score.fundamentalScore], ['Sector', score.sectorScore], ['Historical', score.historicalScore]].map(([title, value]) => <div key={title}><dt>{title}</dt><dd>{number(value)}</dd></div>)}</dl><p className="ipo-muted">Calculated: {score.calculatedAt || 'Not recorded'}. Backend scoring output; no market performance is implied.</p></div>}
    </section>
  </div>;
}
