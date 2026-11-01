import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutIcon from '../components/layout/LayoutIcon.jsx';
import IpoDialog from '../components/ipo/IpoDialog.jsx';
import IpoTrackerRail from '../components/ipo/IpoTrackerRail.jsx';
import IpoMasterForm from '../components/ipo/IpoMasterForm.jsx';
import IpoApplicationForm from '../components/ipo/IpoApplicationForm.jsx';
import IpoDetails from '../components/ipo/IpoDetails.jsx';
import useIpoTracker from '../features/ipo/useIpoTracker.js';
import { IPO_STATUSES, summarize, filterIpos, dateLabel, money, number, text, initials } from '../features/ipo/ipoModel.js';
import '../styles/ipo.css';

function Empty({ title, children }) {
  return <div className="ipo-empty"><span><LayoutIcon name="ipo" size={30} /></span><h3>{title}</h3><p>{children}</p></div>;
}
// API and trusted role are supplied by a future authentication layer, never inferred here.
export default function IpoTrackerPage({ api = null, role = null }) {
  const state = useIpoTracker(api);
  const [view, setView] = useState('catalogue');
  const [filters, setFilters] = useState({ query: '', status: '', sort: 'openingDate', direction: 'asc' });
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [serverFields, setServerFields] = useState({});
  const [notice, setNotice] = useState(null);
  const blocked = state.status === 'blocked';
  const loading = state.status === 'loading';
  const connected = !!api && !blocked && !loading;
  const isAdmin = role === 'ADMIN';
  const summary = summarize(state.ipos, state.applications);
  const records = useMemo(() => filterIpos(state.ipos || [], filters), [state.ipos, filters]);
  const open = value => { setActionError(''); setServerFields({}); setModal(value); };
  const authFailure = problem => {
    if ([401, 403].includes(problem.status)) {
      state.invalidate(); setModal(null); setNotice({ error: true, message: problem.message }); return true;
    }
    return false;
  };
  const run = async (operation, message) => {
    if (!connected || busy) return;
    setBusy(true); setActionError(''); setServerFields({});
    try { await operation(); setModal(null); setNotice({ message }); state.reload(); }
    catch (problem) { if (!authFailure(problem)) { setActionError(problem.message || 'The change could not be saved.'); setServerFields(problem.fields || {}); } }
    finally { setBusy(false); }
  };
  const unavailable = loading ? 'Loading records…' : blocked ? 'Account not connected' : 'Records unavailable';
  return <div className="ipo-page">
    <header className="ipo-intro"><div><p className="ipo-eyebrow">OPPORTUNITIES & APPLICATIONS</p><h2>IPO Tracker<span>.</span></h2><p>Explore the issue. Keep track of your application.</p></div><div className="ipo-actions"><button className="ipo-button" onClick={state.reload} disabled={loading || blocked}>↻ Refresh</button>{(isAdmin || !api) && <button className="ipo-button ipo-button--primary" onClick={() => open({ type: 'master' })} disabled={loading}>{connected && isAdmin ? '+ Add IPO' : 'Preview IPO form'}</button>}</div></header>
    {blocked && <div className="ipo-notice" role="status"><LayoutIcon name="profile" size={18} /><p>Account connection is pending. IPO records require authentication; no live records are shown.</p><Link to="/login">Sign-in preview ↗</Link></div>}
    {notice && <div className={notice.error ? 'ipo-error' : 'ipo-success'} role={notice.error ? 'alert' : 'status'}>{notice.message}<button className="ipo-icon-button" aria-label="Dismiss notification" onClick={() => setNotice(null)}><LayoutIcon name="close" size={16} /></button></div>}
    {state.status === 'error' && <div className="ipo-error" role="alert"><p>We couldn’t load the Tracker. Check the connection and try again.</p><button className="ipo-button" onClick={state.reload}>Retry</button></div>}
    {state.status !== 'error' && Object.keys(state.errors).length > 0 && <div className="ipo-error" role="alert"><p>{Object.entries(state.errors).map(([key, value]) => `${key === 'ipos' ? 'IPO catalogue' : 'Applications'}: ${value}`).join(' ')}</p><button className="ipo-button" onClick={state.reload}>Retry failed records</button></div>}

    <section className="ipo-summary" aria-label="IPO summary">{[['Total IPOs', summary.total, 'Recorded issues'], ['Currently open', summary.open, 'OPEN status & current issue dates'], ['Upcoming', summary.upcoming, 'UPCOMING status & future open date'], ['My applications', summary.applications, 'Your application records']].map(([title, value, note]) => <article key={title}><h3>{title}</h3><strong>{number(value)}</strong><p>{value === null ? unavailable : note}</p></article>)}</section>
    <div className="ipo-view-switch" role="group" aria-label="Tracker view"><button aria-pressed={view === 'catalogue'} aria-controls="ipo-catalogue" onClick={() => setView('catalogue')}>IPO catalogue <span>{number(summary.total)}</span></button><button aria-pressed={view === 'applications'} aria-controls="ipo-applications" onClick={() => setView('applications')}>My applications <span>{number(summary.applications)}</span></button></div>

    <div className="ipo-workspace">
    {view === 'catalogue' ? <section id="ipo-catalogue" className="ipo-panel" aria-labelledby="ipo-list-title"><div className="ipo-section-heading"><div><h3 id="ipo-list-title">Find your next opportunity</h3><p className="ipo-muted">Recorded issue prices, dates and subscription context.</p></div><span className="ipo-record-count">{state.ipos ? `${records.length} of ${state.ipos.length} issues` : 'No records loaded'}</span></div>
      <div className="ipo-filters"><div className="ipo-field ipo-search"><label htmlFor="ipo-search">Company</label><input id="ipo-search" type="search" placeholder="Search company name" value={filters.query} onChange={event => setFilters(current => ({ ...current, query: event.target.value }))} /></div><div className="ipo-field"><label htmlFor="ipo-status-filter">Status</label><select id="ipo-status-filter" value={filters.status} onChange={event => setFilters(current => ({ ...current, status: event.target.value }))}><option value="">All statuses</option>{IPO_STATUSES.map(value => <option key={value} value={value}>{text(value)}</option>)}</select></div><div className="ipo-field"><label htmlFor="ipo-sort">Sort by</label><select id="ipo-sort" value={filters.sort} onChange={event => setFilters(current => ({ ...current, sort: event.target.value }))}><option value="openingDate">Open date</option><option value="closingDate">Close date</option><option value="companyName">Company name</option><option value="price">Issue price</option></select></div><button className="ipo-button" aria-label={`Sort ${filters.direction === 'asc' ? 'descending' : 'ascending'}`} onClick={() => setFilters(current => ({ ...current, direction: current.direction === 'asc' ? 'desc' : 'asc' }))}>{filters.direction === 'asc' ? '↑ Ascending' : '↓ Descending'}</button></div>
      {loading ? <Empty title="Loading IPO records…">Your catalogue will appear here.</Empty> : !state.ipos ? <Empty title={blocked ? 'Your IPO workspace is ready.' : 'Catalogue unavailable'}>{blocked ? 'Explore company details, compare issue windows and keep your application records together.' : 'Use Retry to request the records again.'}</Empty> : !records.length ? <Empty title={state.ipos.length ? 'No matching IPOs' : 'No IPOs recorded yet'}>{state.ipos.length ? <button className="ipo-button" onClick={() => setFilters({ query: '', status: '', sort: 'openingDate', direction: 'asc' })}>Clear filters</button> : 'New issue records will appear here when an administrator adds them.'}</Empty> : <div className="ipo-table-wrap" role="region" aria-label="IPO catalogue table" tabIndex={0}><table><thead><tr><th>Company</th><th>Issue price</th><th>Open date</th><th>Close date</th><th>GMP</th><th>Status</th><th><span className="ipo-sr-only">Actions</span></th></tr></thead><tbody>{records.map(ipo => <tr key={ipo.ipoId} className={modal?.type === 'details' && modal.record.ipoId === ipo.ipoId ? 'ipo-row--selected' : undefined}><td><div className="ipo-company"><span className="ipo-company__avatar" aria-hidden="true">{initials(ipo.companyName)}</span><div><strong>{ipo.companyName}</strong><small>{ipo.sector || 'Sector not recorded'}</small></div></div></td><td className="ipo-price">{money(ipo.price)}</td><td>{dateLabel(ipo.openingDate)}</td><td>{dateLabel(ipo.closingDate)}</td><td>{money(ipo.gmp)}</td><td><span className="ipo-status" data-status={ipo.ipoStatus}>{text(ipo.ipoStatus)}</span></td><td><button className="ipo-button" onClick={() => open({ type: 'details', record: ipo })} aria-label={`View ${ipo.companyName}`}>Details ↗</button></td></tr>)}</tbody></table></div>}
      <p className="ipo-panel__foot">Open/upcoming counts use Indian calendar dates and recorded status together. IPO type and listing date are not recorded.</p>
    </section> : <section id="ipo-applications" className="ipo-panel" aria-labelledby="ipo-applications-title"><div className="ipo-section-heading"><div><h3 id="ipo-applications-title">My applications</h3><p className="ipo-muted">Track your lots, application status and allotment.</p></div><button className="ipo-button ipo-button--primary" disabled={!connected || !state.ipos?.length} onClick={() => open({ type: 'application' })}>+ Record application</button></div>
      {loading ? <Empty title="Loading applications…">Retrieving your records.</Empty> : !state.applications ? <Empty title={blocked ? 'Account connection required' : 'Applications unavailable'}>Only your authenticated account’s applications can be displayed.</Empty> : !state.applications.length ? <Empty title="No applications recorded">Choose an IPO and record the number of lots you applied for.</Empty> : <div className="ipo-table-wrap" role="region" aria-label="My IPO applications table" tabIndex={0}><table><thead><tr><th>Company</th><th>Applied lots</th><th>Allotted lots</th><th>Quantity</th><th>Amount</th><th>Application</th><th>Allotment</th><th>Actions</th></tr></thead><tbody>{state.applications.map(item => <tr key={item.applicationId}><td><strong>{item.companyName}</strong><small>#{item.applicationId}</small></td><td>{number(item.lotsApplied)}</td><td>{number(item.lotsAllotted)}</td><td title="Shares per lot are unavailable">—</td><td title="Quantity and cost basis are unavailable">—</td><td><span className="ipo-status">{text(item.applicationStatus)}</span></td><td>{text(item.allotmentStatus)}</td><td><button className="ipo-button ipo-button--danger" onClick={() => open({ type: 'deleteApplication', record: item })}>Delete</button></td></tr>)}</tbody></table></div>}
      <p className="ipo-panel__foot">Application records can be created or deleted; editing is not supported yet. Quantity and amount need recorded shares per lot.</p>
    </section>}
    <IpoTrackerRail ipos={state.ipos} applications={state.applications} loading={loading} onDetails={record => open({ type: 'details', record })} onApplications={() => setView('applications')} /></div>
    <p className="ipo-muted ipo-bottom-note">IPO masters are maintained by administrators. Application records belong to your account.</p>

    {modal && <IpoDialog variant={modal.type === 'details' ? 'drawer' : undefined} title={modal.type === 'master' ? modal.record ? 'Edit IPO' : 'Create IPO' : modal.type === 'details' ? modal.record.companyName : modal.type === 'application' ? 'Record an IPO application' : modal.type === 'deleteIpo' ? 'Delete IPO master?' : 'Delete application record?'} busy={busy} onClose={() => setModal(null)}>
      {modal.type === 'master' && <IpoMasterForm record={modal.record} enabled={connected && isAdmin} busy={busy} error={actionError} serverFields={serverFields} onSubmit={body => { if (isAdmin) run(() => modal.record ? api.updateIpo(modal.record.ipoId, body) : api.createIpo(body), modal.record ? 'IPO changes saved.' : 'IPO created.'); }} />}
      {modal.type === 'details' && <IpoDetails record={modal.record} api={api} isAdmin={isAdmin} busy={busy} setBusy={setBusy} onAuthFailure={authFailure} onEdit={record => open({ type: 'master', record })} onDelete={record => open({ type: 'deleteIpo', record })} onApply={record => open({ type: 'application', record })} />}
      {modal.type === 'application' && <IpoApplicationForm ipos={state.ipos || []} initialId={modal.record?.ipoId} busy={busy} error={actionError} onSubmit={values => run(() => api.apply(values.ipoId, values.lotsApplied), 'Application recorded. No bid or payment was placed.')} />}
      {['deleteIpo', 'deleteApplication'].includes(modal.type) && <div className="ipo-form"><p>Delete the {modal.type === 'deleteIpo' ? 'IPO master' : 'application record'} for <strong>{modal.record.companyName}</strong>? This cannot be undone here.{modal.type === 'deleteApplication' && ' This removes only the PortFolioX record; it does not cancel a bid with a broker.'}</p>{actionError && <p className="ipo-error" role="alert">{actionError}</p>}<div className="ipo-actions"><button className="ipo-button" disabled={busy} onClick={() => setModal(null)}>Keep record</button><button className="ipo-button ipo-button--danger" disabled={busy} onClick={() => run(() => modal.type === 'deleteIpo' && isAdmin ? api.deleteIpo(modal.record.ipoId) : modal.type === 'deleteApplication' ? api.deleteApplication(modal.record.applicationId) : Promise.reject(new Error('Administrator access required.')), 'Record deleted.')}>{busy ? 'Deleting…' : 'Delete record'}</button></div></div>}
    </IpoDialog>}
  </div>;
}


