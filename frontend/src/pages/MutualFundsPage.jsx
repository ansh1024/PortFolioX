import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutIcon from '../components/layout/LayoutIcon.jsx';
import MutualFundDialog from '../components/mutual-funds/MutualFundDialog.jsx';
import MutualFundOverview from '../components/mutual-funds/MutualFundOverview.jsx';
import MutualFundCatalogue from '../components/mutual-funds/MutualFundCatalogue.jsx';
import MutualFundFilters from '../components/mutual-funds/MutualFundFilters.jsx';
import MutualFundForm from '../components/mutual-funds/MutualFundForm.jsx';
import MutualFundDetails from '../components/mutual-funds/MutualFundDetails.jsx';
import useMutualFunds from '../features/mutual-funds/useMutualFunds.js';
import { categories, defaultFilters, selectFunds, label, numeric } from '../features/mutual-funds/mutualFundModel.js';
import '../styles/ipo.css';
import '../styles/mutual-funds.css';

const PAGE_SIZE = 10;

export default function MutualFundsPage({ api = null, role = null, sipApi = null }) {
  const state = useMutualFunds(api, sipApi);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [view, setView] = useState('table');
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [error, setError] = useState('');
  const [serverFields, setServerFields] = useState({});
  const [notice, setNotice] = useState(null);
  const writing = useRef(false);
  const formContainer = useRef(null);
  const funds = state.funds;
  const loading = state.status === 'loading';
  const blocked = state.status === 'blocked';
  const admin = role === 'ADMIN';
  const enabled = !!api && admin && state.status === 'ready';
  const filtered = useMemo(() => selectFunds(funds || [], filters), [funds, filters]);
  const amcs = useMemo(() => [...new Set((funds || []).map(fund => fund.amc).filter(Boolean))].sort(), [funds]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const activeCount = [filters.query.trim(), filters.category, filters.amc].filter(Boolean).length;

  function filter(key, value) { setFilters(previous => ({ ...previous, [key]: value })); setPage(1); }
  function clearFilters() { setFilters(previous => ({ ...previous, query: '', category: '', amc: '' })); setPage(1); }
  function sortBy(key) {
    setFilters(previous => ({ ...previous, sort: key, direction: previous.sort === key && previous.direction === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  }
  function open(value) { setError(''); setServerFields({}); setDirty(false); setDiscard(false); setModal(value); }
  function close() {
    if (writing.current) return;
    if (modal?.type === 'form' && dirty) { setDiscard(true); return; }
    setModal(null);
  }
  function denied(problem) {
    state.invalidate(); setModal(null); setDirty(false);
    setNotice({ kind: 'error', message: problem.message || 'Account connection is required.' });
  }
  async function save(operation, message) {
    if (!enabled || writing.current) return;
    writing.current = true;
    setBusy(true); setError(''); setServerFields({});
    try {
      await operation(); setModal(null); setDirty(false); setNotice({ kind: 'success', message }); state.reload();
    } catch (problem) {
      if ([401, 403].includes(problem.status)) denied(problem);
      else { setError(problem.message || 'Could not save the change.'); setServerFields(problem.fields || {}); }
    } finally { writing.current = false; setBusy(false); }
  }
  function submitFund(body) {
    if (!modal.record && funds?.some(fund => fund.fundId === body.fundId)) {
      setError('A fund with this ID already exists.'); setServerFields({ fundId: 'Use a unique fund ID.' }); return;
    }
    save(() => modal.record ? api.update(modal.record.fundId, body) : api.create(body), modal.record ? 'Fund changes saved.' : 'Fund added to the catalogue.');
  }

  return <div className="mf-page">
    <header className="mf-heading">
      <div><p className="mf-overline">RESEARCH / FUND CATALOGUE</p><h2>Mutual funds<span>.</span></h2><p>The scheme, the source, the detail. A clearer place to research.</p></div>
      <div className="mf-header-actions"><div className="mf-sync"><i data-ready={state.status === 'ready'} /><span>{loading ? 'Loading catalogue' : blocked ? 'Account not connected' : state.status === 'error' ? 'Connection unavailable' : <span>Loaded <time dateTime={state.fetchedAt}>{new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(state.fetchedAt))}</time></span>}</span></div><div className="ipo-actions"><button className="ipo-button" disabled={loading || blocked} onClick={state.reload}>↻ Refresh</button>{(admin || !api) && <button className="ipo-button ipo-button--primary" onClick={() => open({ type: 'form' })}>＋ {enabled ? 'Add mutual fund' : 'Preview fund form'}</button>}</div></div>
    </header>
    {blocked && <div className="mf-account-note" role="status"><LayoutIcon name="profile" size={18} /><p>Your research workspace is ready. Connect your account to load the private fund catalogue.</p><Link to="/login">Sign-in preview ↗</Link></div>}
    {notice && <div className={`mf-alert mf-alert--${notice.kind}`} role={notice.kind === 'error' ? 'alert' : 'status'}><p>{notice.message}</p><button aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button></div>}
    {state.status === 'error' && <div className="mf-alert mf-alert--error" role="alert"><p>{state.error}</p><button className="ipo-button" onClick={state.reload}>Retry catalogue</button></div>}
    {state.sipStatus === 'error' && <div className="mf-alert" role="status"><p>The catalogue is available, but your SIP records could not be loaded.</p><button className="ipo-button" onClick={state.reload}>Retry records</button></div>}

    <MutualFundOverview funds={funds} sips={state.sips} loading={loading} onCategory={value => filter('category', value)} />

    <section className="mf-catalogue" aria-labelledby="mf-catalogue-title" aria-busy={loading}>
      <header><div className="mf-catalogue-title"><h3 id="mf-catalogue-title">Scheme directory</h3><span>{funds ? `${numeric(funds.length)} records` : 'No records loaded'}</span></div><div className="mf-view-switch" role="group" aria-label="Catalogue view"><button aria-pressed={view === 'table'} onClick={() => setView('table')}><LayoutIcon name="menu" size={14} />Table</button><button aria-pressed={view === 'cards'} onClick={() => setView('cards')}><LayoutIcon name="overview" size={14} />Cards</button></div></header>
      <div className="mf-category-tabs" role="group" aria-label="Fund category">{[['', 'All funds'], ...categories.map(category => [category, label(category)])].map(([value, name]) => <button key={value} aria-pressed={filters.category === value} onClick={() => filter('category', value)}>{name}</button>)}</div>
      <div className="mf-toolbar"><div className="mf-search"><label className="ipo-sr-only" htmlFor="mf-search">Search schemes</label><span aria-hidden="true">⌕</span><input id="mf-search" type="search" placeholder="Search scheme names…" value={filters.query} onChange={event => filter('query', event.target.value)} />{filters.query && <button aria-label="Clear search" onClick={() => filter('query', '')}>×</button>}</div><div className="mf-desktop-filters"><MutualFundFilters filters={filters} amcs={amcs} onChange={filter} /></div><button className="ipo-button mf-mobile-filter" onClick={() => open({ type: 'filters' })}><LayoutIcon name="menu" size={15} />Filters{activeCount ? ` (${activeCount})` : ''}</button></div>
      {activeCount > 0 && <div className="mf-active-filters" aria-label="Active filters">{filters.query.trim() && <button onClick={() => filter('query', '')}>Search: {filters.query} <span aria-hidden="true">×</span></button>}{filters.category && <button onClick={() => filter('category', '')}>{label(filters.category === 'UNRECORDED' ? null : filters.category)} <span aria-hidden="true">×</span></button>}{filters.amc && <button onClick={() => filter('amc', '')}>{filters.amc} <span aria-hidden="true">×</span></button>}<button className="mf-clear-filters" onClick={clearFilters}>Clear all</button></div>}
      <div className="mf-result-context"><span>{funds ? `${numeric(filtered.length)} matching schemes` : loading ? 'Retrieving records…' : 'Awaiting account connection'}</span><span>NAV / AUM · recorded units</span></div>
      {loading ? <div className="mf-loading" role="status" aria-label="Loading funds">{[0, 1, 2, 3].map(index => <div className="mf-skeleton-row" key={index}><i /><span /><span /><span /></div>)}<span className="ipo-sr-only">Loading fund catalogue…</span></div>
        : rows.length ? <MutualFundCatalogue key={view} rows={rows} view={view} sips={state.sips} isAdmin={enabled} onDetails={record => open({ type: 'details', record })} onEdit={record => open({ type: 'form', record })} onDelete={record => open({ type: 'delete', record })} onSort={sortBy} filters={filters} />
          : <div className="mf-empty"><span className="mf-empty-symbol"><LayoutIcon name="funds" size={28} /></span><span className="mf-overline">{funds?.length ? 'REFINE THE SEARCH' : 'YOUR RESEARCH STARTS HERE'}</span><h3>{state.status === 'error' ? 'The catalogue is unavailable.' : !funds ? 'Bring your fund universe into focus.' : funds.length ? 'No schemes match these filters.' : 'A clean slate for your catalogue.'}</h3><p>{state.status === 'error' ? 'Retry the request to retrieve your records.' : !funds ? 'Scheme identities, recorded snapshots and your associated SIPs — organised for a more considered decision.' : funds.length ? 'Try another scheme name, category or fund house.' : 'Add a verified fund master to begin building the collection.'}</p><div className="ipo-actions">{activeCount ? <button className="ipo-button" onClick={clearFilters}>Clear filters</button> : (admin || !api) && <button className="ipo-button" onClick={() => open({ type: 'form' })}>{enabled ? 'Add your first fund' : 'Explore the fund form'} ↗</button>}</div></div>}
      <footer className="mf-pagination"><span>{funds ? `${filtered.length ? (current - 1) * PAGE_SIZE + 1 : 0}–${Math.min(current * PAGE_SIZE, filtered.length)} of ${numeric(filtered.length)} schemes` : 'No records loaded'}<span className="mf-page-size"> · 10 per page</span></span><div><button className="ipo-button" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page">←</button><span>{current} / {pages}</span><button className="ipo-button" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Next page">→</button></div></footer>
    </section>
    <p className="mf-footnote"><LayoutIcon name="risk" size={15} /><span>Research records, not live market data. Currency, AUM scale and valuation dates are not supplied. No investment is placed from this page.</span></p>

    {modal && <MutualFundDialog title={modal.type === 'details' ? 'Fund research' : modal.type === 'delete' ? 'Delete fund?' : modal.type === 'filters' ? 'Catalogue filters' : modal.record ? 'Edit mutual fund' : 'Create mutual fund'} variant={modal.type === 'details' ? 'drawer' : undefined} busy={busy} onClose={close}>
      {discard && <div className="mf-discard" role="alert"><strong>Discard your unsaved changes?</strong><p>The saved fund record will stay as it is.</p><div className="ipo-actions"><button autoFocus className="ipo-button" onClick={() => { setDiscard(false); queueMicrotask(() => formContainer.current?.querySelector('input:not([readonly])')?.focus()); }}>Keep editing</button><button className="ipo-button mf-danger-text" onClick={() => { setModal(null); setDirty(false); setDiscard(false); }}>Discard changes</button></div></div>}
      {modal.type === 'details' ? <MutualFundDetails record={modal.record} api={api} isAdmin={enabled} sips={state.sips} sipStatus={state.sipStatus} onDenied={denied} onEdit={record => open({ type: 'form', record })} onDelete={record => open({ type: 'delete', record })} />
        : modal.type === 'form' ? <div ref={formContainer} inert={discard ? true : undefined}><MutualFundForm key={modal.record?.fundId || 'new'} record={modal.record} busy={busy} enabled={enabled} error={error} serverFields={serverFields} onDirtyChange={setDirty} onCancel={close} onSubmit={submitFund} /></div>
          : modal.type === 'filters' ? <div className="mf-mobile-filter-content"><p className="mf-muted">Changes apply immediately to the directory.</p><MutualFundFilters mobile filters={filters} amcs={amcs} onChange={filter} /><footer><button className="ipo-button" onClick={clearFilters}>Reset filters</button><button className="ipo-button ipo-button--primary" onClick={close}>Show {numeric(filtered.length)} {filtered.length === 1 ? 'scheme' : 'schemes'}</button></footer></div>
            : <div className="mf-delete"><span className="mf-overline">REMOVE CATALOGUE RECORD</span><h3>{modal.record.fundName}</h3><p>This removes the fund master and cannot be undone here. Associated SIP records may prevent deletion. A failed request leaves the record in place.</p>{error && <p role="alert" className="mf-alert mf-alert--error">{error}</p>}<div className="ipo-actions"><button className="ipo-button" disabled={busy} onClick={close}>Keep fund</button><button className="ipo-button mf-danger-text" disabled={busy || !enabled} onClick={() => save(() => api.remove(modal.record.fundId), 'Fund removed from the catalogue.')}>{busy ? 'Deleting…' : 'Delete fund'}</button></div></div>}
    </MutualFundDialog>}
  </div>;
}
