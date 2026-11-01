import { useEffect, useState } from 'react';
import { initials, label, numeric, percent, periods } from '../../features/mutual-funds/mutualFundModel.js';
import MutualFundSipLinks from './MutualFundSipLinks.jsx';

export default function MutualFundDetails({ record, api, isAdmin, onEdit, onDelete, onDenied, sips, sipStatus }) {
  const [state, setState] = useState({ loading: true });
  const [revision, setRevision] = useState(0);
  const [tab, setTab] = useState('facts');
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true });
    api.get(record.fundId, controller.signal).then(fund => {
      if (!controller.signal.aborted) {
        if (!fund || typeof fund !== 'object' || Array.isArray(fund)) throw new Error('Invalid fund response.');
        setState({ fund });
      }
    }).catch(error => {
      if (!controller.signal.aborted) {
        if ([401, 403].includes(error.status)) onDenied(error);
        else setState({ error: error.message });
      }
    });
    return () => controller.abort();
  }, [record.fundId, api, revision]);
  if (state.loading) return <div className="mf-skeleton" role="status">Loading source record…</div>;
  if (state.error) return <div className="mf-alert mf-alert--error" role="alert"><p>{state.error}</p><button className="ipo-button" onClick={() => setRevision(value => value + 1)}>Retry details</button></div>;
  const fund = state.fund;
  return <div className="mf-details">
    <header className="mf-research-identity"><span className="mf-monogram">{initials(fund.amc || fund.fundName)}</span><div><span className="mf-overline">SCHEME RESEARCH</span><h3>{fund.fundName || 'Unnamed fund'}</h3><p>{fund.amc || 'AMC not recorded'}</p></div></header>
    <div className="mf-research-meta"><span className="mf-tag" data-category={fund.category}>{label(fund.category)}</span><span>Fund ID <strong>{fund.fundId}</strong></span></div>
    <div className="mf-detail-stats"><div><span>Recorded NAV</span><strong>{numeric(fund.nav)}</strong></div><div><span>Recorded AUM</span><strong>{numeric(fund.aum)}</strong></div></div>
    <div className="mf-research-tabs" role="group" aria-label="Research sections">{[['facts', 'Scheme facts'], ['returns', 'Recorded returns'], ['sips', 'My SIP records']].map(([key, name]) => <button key={key} aria-pressed={tab === key} onClick={() => setTab(key)}>{name}</button>)}</div>
    {tab === 'facts' && <section className="mf-research-section"><h3>Inside the scheme</h3><dl className="mf-definition">{[['Scheme name', fund.fundName], ['Fund house / AMC', fund.amc], ['Category', label(fund.category)], ['Fund ID', fund.fundId]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value || 'Not recorded'}</dd></div>)}</dl><p className="mf-disclosure">Fund type, expense ratio, ratings and underlying assets are not supplied by this record.</p></section>}
    {tab === 'returns' && <section className="mf-research-section"><h3>Recorded return periods</h3><div className="mf-return-grid">{periods.map(([key, name]) => <div key={key}><span>{name}</span><strong data-negative={Number(fund[key]) < 0}>{percent(fund[key])}</strong></div>)}</div><p className="mf-disclosure">These are persisted figures, not verified live performance. Methodology and valuation dates are not supplied. Separate periods cannot form a historical NAV chart.</p></section>}
    {tab === 'sips' && <MutualFundSipLinks fundId={fund.fundId} holdings={sips} status={sipStatus} />}
    <div className="mf-research-source"><span aria-hidden="true">ⓘ</span><p>Source: saved fund master. NAV and AUM use recorded units; currency and AUM scale are unspecified.</p></div>
    {isAdmin && <footer className="mf-research-actions"><button className="ipo-button" onClick={() => onEdit(fund)}>Edit fund</button><button className="ipo-button mf-danger-text" onClick={() => onDelete(fund)}>Delete fund</button></footer>}
  </div>;
}
