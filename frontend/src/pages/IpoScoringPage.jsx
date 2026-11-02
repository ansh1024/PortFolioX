import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import IpoDialog from '../components/ipo/IpoDialog.jsx';
import LayoutIcon from '../components/layout/LayoutIcon.jsx';
import IpoScoreCatalogue from '../components/ipo-scoring/IpoScoreCatalogue.jsx';
import IpoScoreCard from '../components/ipo-scoring/IpoScoreCard.jsx';
import IpoScoreDetails from '../components/ipo-scoring/IpoScoreDetails.jsx';
import useIpoScoring from '../features/ipo-scoring/useIpoScoring.js';
import { filterScores, sessionSummary, validScore, verdicts } from '../features/ipo-scoring/ipoScoringModel.js';
import { dateLabel, money, number } from '../features/ipo/ipoModel.js';
import { dashboardSections, sectionUrl } from '../app/dashboardSections.js';
import '../styles/ipo.css';
import '../styles/ipo-scoring.css';

const destination = path => sectionUrl(dashboardSections.find(section => section.path === path));
export default function IpoScoringPage({ api = null }) {
  const state = useIpoScoring(api);
  const [selectedId, setSelectedId] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [filters, setFilters] = useState({ query: '', verdict: '', sort: 'calculatedAt', direction: 'desc' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [inspect, setInspect] = useState(null);
  const writing = useRef(false);
  const loading = state.status === 'loading';
  const blocked = state.status === 'blocked';
  const summary = sessionSummary(state.records);
  const records = useMemo(() => filterScores(state.records, filters), [state.records, filters]);
  const selectedIpo = state.ipos?.find(ipo => String(ipo.ipoId) === selectedId);
  const evaluationPanel = useRef(null);
  function selectIpo(id) { setSelectedId(id); setError(''); evaluationPanel.current?.focus(); }
  const choices = (state.ipos || []).filter(ipo => String(ipo.ipoId) === selectedId || (ipo.companyName || '').toLowerCase().includes(companySearch.trim().toLowerCase()));
  useEffect(() => { if (blocked) setInspect(null); }, [blocked]);
  useEffect(() => { setInspect(null); setSelectedId(''); setCompanySearch(''); }, [api]);
  function filter(key, value) { setFilters(previous => ({ ...previous, [key]: value })); }
  async function score(event) {
    event.preventDefault();
    if (writing.current || !api || state.status !== 'ready') return;
    if (!selectedId || !state.ipos.some(ipo => String(ipo.ipoId) === selectedId)) { setError('Choose a recorded IPO before scoring.'); return; }
    writing.current = true; setBusy(true); setError('');
    try {
      const result = await api.score(selectedId);
      if (!validScore(result) || String(result.ipoId) !== selectedId) throw new Error('The score response could not be verified. A log may have been saved; do not automatically retry.');
      state.accept(result); setInspect(result);
    } catch (problem) {
      if ([401, 403].includes(problem.status)) { state.invalidate(); setInspect(null); }
      setError(problem.message || 'Scoring failed. The IPO may not have stored metrics.');
    } finally { writing.current = false; setBusy(false); }
  }
  return <div className="sc-page">
    <header className="sc-page-heading"><div><p className="sc-overline">INVESTMENT INTELLIGENCE / IPO SCORING</p><h2>The IPO research desk<span>.</span></h2><p>Explore the issue. Inspect the evidence. Keep the final call yours.</p></div><div className="ipo-actions"><Link className="ipo-button" to={destination('risk-assessment')}>Your risk profile ↗</Link><button className="ipo-button" disabled={loading || blocked || busy} onClick={state.reload}>↻ Reload IPOs</button></div></header>
    {blocked && <div className="sc-notice" role="status"><LayoutIcon name="profile" size={17} /><p>Account connection is pending. Scoring requires authentication and existing IPO metrics.</p><Link to="/login">Sign-in preview ↗</Link></div>}
    {state.status === 'error' && <div className="sc-alert" role="alert"><p>{state.error}</p><button className="ipo-button" onClick={state.reload}>Retry catalogue</button></div>}
    <section className="sc-summary-strip" aria-label="Scoring overview">{[['Available IPOs', state.ipos?.length ?? null, 'Current catalogue'], ['IPOs evaluated', summary.ipos, 'Distinct IPOs this visit'], ['Saved scoring runs', summary.runs, 'Responses this visit'], ['Average score', summary.average, 'Returned totals this visit']].map(([label, value, note]) => <div key={label}><span>{label}</span><strong>{number(value)}</strong><small>{note}</small></div>)}</section>
    <div className="sc-top-grid"><section className="sc-run-panel" ref={evaluationPanel} tabIndex={-1} aria-label="Evaluate selected IPO"><header><span className="sc-overline"><LayoutIcon name="ipo" size={16} /> SCORE AN OPPORTUNITY</span><span>Backend engine</span></header><h3>One issue.<br />Five perspectives.</h3><form onSubmit={score} noValidate><div className="ipo-field"><label htmlFor="sc-company-search">Find a company</label><input id="sc-company-search" type="search" value={companySearch} onChange={event => setCompanySearch(event.target.value)} placeholder="Search recorded IPOs" /></div><div className="ipo-field"><label htmlFor="sc-ipo">IPO to evaluate</label><select id="sc-ipo" value={selectedId} disabled={loading || blocked || busy} onChange={event => { setSelectedId(event.target.value); setError(''); }}><option value="">{loading ? 'Loading IPOs…' : 'Choose a recorded IPO'}</option>{choices.map(ipo => <option key={ipo.ipoId} value={ipo.ipoId}>{ipo.companyName} · #{ipo.ipoId}</option>)}</select></div>{selectedIpo && <dl className="sc-selected-issue"><div><dt>Issue price</dt><dd>{money(selectedIpo.price)}</dd></div><div><dt>GMP</dt><dd>{money(selectedIpo.gmp)}</dd></div><div><dt>Closes</dt><dd>{dateLabel(selectedIpo.closingDate)}</dd></div><div><dt>Sector</dt><dd>{selectedIpo.sector || 'Not recorded'}</dd></div></dl>}{state.ipos && !choices.length && <p className="sc-muted">No companies match this search.</p>}{error && <p className="sc-alert" role="alert">{error}</p>}<button className="ipo-button ipo-button--primary" disabled={!api || state.status !== 'ready' || busy || !state.ipos?.length} aria-busy={busy}>{busy ? 'Calculating…' : 'Calculate & save score'} ↗</button><p className="sc-run-note">This action saves a new score log. Fundamental, sector and historical metrics must already exist on the backend.</p></form></section>
      <aside className="sc-visit-panel"><span className="sc-overline">RETURNED VERDICTS / THIS VISIT</span><h3>A view of the decisions.</h3><p>Each run adds its returned verdict to this view. There is no forecast or assumed score.</p><div className="sc-verdict-ledger">{verdicts.map(verdict => { const count = state.records.filter(record => record.verdict === verdict).length; return <div key={verdict}><span className="sc-verdict" data-verdict={verdict}>{verdict}</span><span className="sc-distribution-track" aria-hidden="true"><i data-verdict={verdict} style={{ width: `${state.records.length ? count / state.records.length * 100 : 0}%` }} /></span><strong>{count}</strong></div>; })}</div><div className="sc-session-note"><LayoutIcon name="journal" size={19} /><p>{state.records.length ? 'These are scoring runs captured during this visit, including repeated evaluations.' : 'No scoring responses captured yet. Run an evaluation to see the breakdown here.'}</p></div><p>All-time totals and earlier scores are unavailable because the backend has no score-history read endpoint.</p></aside></div>
    <IpoScoreCatalogue ipos={state.ipos} records={state.records} status={state.status} selectedId={selectedId} onSelect={selectIpo} onDetails={setInspect} busy={busy} />
    <section className="sc-results"><header><div><span className="sc-overline">SAVED BY THE SERVICE / CAPTURED HERE</span><h3>Results from this visit.</h3></div><span>{state.records.length} returned logs</span></header><div className="sc-filters"><div className="ipo-field"><label htmlFor="sc-search">Search scored companies</label><input id="sc-search" type="search" value={filters.query} onChange={event => filter('query', event.target.value)} placeholder="Company name" /></div><div className="ipo-field"><label htmlFor="sc-verdict">Verdict</label><select id="sc-verdict" value={filters.verdict} onChange={event => filter('verdict', event.target.value)}><option value="">All verdicts</option>{verdicts.map(verdict => <option key={verdict}>{verdict}</option>)}</select></div><div className="ipo-field"><label htmlFor="sc-sort">Sort by</label><select id="sc-sort" value={filters.sort} onChange={event => filter('sort', event.target.value)}><option value="calculatedAt">Scoring date</option><option value="totalScore">Total score</option><option value="companyName">Company name</option></select></div><button className="ipo-button" onClick={() => filter('direction', filters.direction === 'asc' ? 'desc' : 'asc')}>{filters.direction === 'asc' ? '↑ Ascending' : '↓ Descending'}</button></div>
      {loading ? <div className="sc-skeleton" role="status">Loading IPO catalogue…</div> : records.length ? <div className="sc-score-grid">{records.map(record => <IpoScoreCard key={record.scoreLogId} record={record} onDetails={setInspect} />)}</div> : <div className="sc-empty"><span><LayoutIcon name="ipo" size={30} /></span><h4>{state.records.length ? 'No results match these filters.' : blocked ? 'Your scoring workspace is ready.' : state.status === 'error' ? 'Scoring is waiting for the catalogue.' : 'No scoring runs yet.'}</h4><p>{state.records.length ? 'Try another company name or verdict.' : blocked ? 'Connect your account to evaluate recorded IPOs. No live scores are shown.' : 'Select a company from the library, then calculate and save its score. Results appear here only after the service responds.'}</p>{(filters.query || filters.verdict) && <button className="ipo-button" onClick={() => setFilters({ ...filters, query: '', verdict: '' })}>Clear filters</button>}</div>}
    </section>
    <div className="sc-bottom-grid"><section className="sc-rules"><span className="sc-overline">THE ENGINE’S VERDICT RULES</span><h3>Understand the label.</h3><dl>{[['APPLY', '75 and above'], ['WATCH', '45 to below 75'], ['SKIP', 'Below 45']].map(([verdict, range]) => <div key={verdict}><dt className="sc-verdict" data-verdict={verdict}>{verdict}</dt><dd>{range}</dd></div>)}</dl><p>The UI displays the returned verdict. These rules explain the backend label; they are not a personalised recommendation or guaranteed outcome.</p></section><section className="sc-history-note"><LayoutIcon name="journal" size={24} /><span className="sc-overline">PREVIOUS SCORING</span><h3>History & comparison</h3><p>Scoring runs are saved by the service, but earlier logs cannot be loaded here yet. The results above cover this visit only and clear when you leave or reload this page. A comparison endpoint is also unavailable, so no comparison metrics are generated here.</p><Link to={destination('ipo-tracker')}>Open IPO Tracker ↗</Link></section></div>
    {inspect && <IpoDialog title="IPO score breakdown" variant="drawer" busy={busy} onClose={() => setInspect(null)}><IpoScoreDetails record={inspect} /></IpoDialog>}
  </div>;
}
