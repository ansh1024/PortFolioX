import { Link } from 'react-router-dom';
import { dashboardSections, sectionUrl } from '../app/dashboardSections.js';
import LayoutIcon from '../components/layout/LayoutIcon.jsx';
import useOverviewData from '../features/overview/useOverviewData.js';
import { deriveOverview, formatMoney, formatCount, formatDate, label } from '../features/overview/overviewData.js';
import '../styles/overview.css';

const quickActions = dashboardSections.filter(item => ['ipo-tracker', 'mutual-funds', 'risk-assessment', 'decision-journal'].includes(item.path));
const destination = path => sectionUrl(dashboardSections.find(item => item.path === path));
const resourceNames = { applications: 'IPO applications', holdings: 'SIP holdings', journals: 'journal', profiles: 'risk profile' };
const Arrow = () => <span aria-hidden="true">↗</span>;

function Metric({ title, value, note, icon, path, accent = false }) {
  return <article className={`ov-metric${accent ? ' ov-metric--accent' : ''}`}>
    <div className="ov-metric__head"><span className="ov-icon"><LayoutIcon name={icon} size={17} /></span><h3>{path ? <Link className="ov-metric__link" to={destination(path)}>{title}<Arrow /></Link> : title}</h3></div>
    <p className="ov-metric__value">{value}</p><p className="ov-caption">{note}</p>
  </article>;
}

function PanelHeader({ id, title, path, icon }) {
  return <header className="ov-panel__head"><h3 id={id}>{title}</h3>{path
    ? <Link className="ov-circle-link" to={destination(path)} aria-label={`Open ${dashboardSections.find(item => item.path === path).label}`}><Arrow /></Link>
    : <span className="ov-icon"><LayoutIcon name={icon} size={17} /></span>}</header>;
}

function EmptyState({ icon, title, children }) {
  return <div className="ov-empty"><span className="ov-empty__icon"><LayoutIcon name={icon} size={23} /></span><h4>{title}</h4><p>{children}</p></div>;
}

export function OverviewContent({ status, resources = {}, reload = () => {}, fetchedAt = null }) {
  const model = deriveOverview(resources);
  const blocked = status === 'blocked';
  const loading = status === 'loading';
  const unavailable = loading ? 'Loading records…' : blocked ? 'Account not connected' : 'Data unavailable';
  const failed = Object.entries(resources).filter(([, item]) => item.status === 'error');
  const fetchedDate = fetchedAt && Number.isFinite(Date.parse(fetchedAt)) ? new Date(fetchedAt) : null;
  const today = new Date();
  const date = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(today);
  const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(today);
  return <div className="ov-page" aria-busy={loading}>
    <header className="ov-intro"><div><p className="ov-kicker">YOUR INVESTMENT WORKSPACE</p><h2>The whole picture.</h2><p className="ov-intro__copy">Your capital, commitments and decisions. Together.</p></div>
      <div className="ov-date"><span className="ov-date__number">{today.getDate()}</span><div><span>{weekday}</span><time dateTime={`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`}>{date}</time></div></div>
    </header>

    <div className="ov-toolbar"><nav aria-label="Overview quick actions">{quickActions.map(item => <Link key={item.path} to={sectionUrl(item)}><LayoutIcon name={item.icon} size={15} /><span>{item.label}</span><Arrow /></Link>)}</nav><div className="ov-sync"><span className="ov-connection"><i aria-hidden="true" />{loading ? 'Loading records' : blocked ? 'Account not connected' : status === 'error' ? 'Connection unavailable' : failed.length ? 'Partially loaded' : 'Records loaded'}</span><button className="ov-refresh" onClick={reload} disabled={blocked || loading} title={blocked ? 'Refresh becomes available after account connection' : 'Reload overview records'}><span aria-hidden="true">↻</span>{loading ? 'Refreshing…' : 'Refresh'}</button></div></div>
    {fetchedDate && status === 'ready' && <p className="ov-fetched" role="status">{failed.length ? 'Available records fetched' : 'Records fetched'} <time dateTime={fetchedAt}>{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(fetchedDate)}</time></p>}
    {blocked && <div className="ov-account-note" role="status"><LayoutIcon name="profile" size={16} /><p>Account connection is coming next. Balances and activity will appear here once sign-in is connected.</p><Link to="/login">Sign-in preview <Arrow /></Link></div>}
    {status === 'error' && <div className="ov-notice ov-notice--error" role="alert"><p><strong>We couldn’t load your overview.</strong> Check your connection and try again.</p><button onClick={reload}>Try again <Arrow /></button></div>}
    {failed.length > 0 && status !== 'error' && <div className="ov-notice ov-notice--error" role="alert"><p>Some records could not be loaded: {failed.map(([key]) => resourceNames[key]).join(', ')}. Other available records are shown.</p><button onClick={reload}>Retry <Arrow /></button></div>}
    {model.empty && <p className="ov-notice" role="status">No investment records yet. Your overview will take shape as records are added.</p>}
    {loading && <p className="ov-loading" role="status">Loading your investment records…</p>}

    <section className="ov-metrics" aria-label="Portfolio summary">
      <Metric title="Total invested" value="—" note="Portfolio-wide cost basis unavailable" icon="overview" accent />
      <Metric title="SIP invested" value={formatMoney(model.sipInvested)} note={model.sipInvested === null ? unavailable : 'Recorded cost of SIP holdings'} icon="sip" path="sip-holdings" />
      <Metric title="IPO applications" value={formatCount(model.applicationCount)} note={model.applicationCount === null ? unavailable : 'Across all application statuses'} icon="ipo" path="ipo-tracker" />
      <Metric title="Mutual funds held" value={formatCount(model.fundCount)} note={model.fundCount === null ? unavailable : `${formatCount(model.holdingCount)} SIP holding records`} icon="funds" path="mutual-funds" />
    </section>

    <div className="ov-grid">
      <section className="ov-panel ov-allocation" aria-labelledby="allocation-title"><PanelHeader id="allocation-title" title="Investment allocation" icon="funds" />
        <p className="ov-caption">By recorded invested amount</p>
        <div className="ov-allocation__visual" aria-hidden="true"><i /><i /><i /><div><span>₹</span><strong>—</strong></div></div>
        <div className="ov-allocation__message"><h4>Allocation not available yet</h4><p className="ov-caption">IPO and mutual fund costs need to be comparable before a breakdown can be shown.</p></div>
        <dl className="ov-allocation__list"><div><dt><i />Mutual funds <small>SIP cost</small></dt><dd>{formatMoney(model.sipInvested)}</dd></div><div><dt><i />IPOs</dt><dd>Unavailable</dd></div></dl>
        <div className="ov-holdings"><div className="ov-holdings__head"><h4>Top fund holdings</h4><span className="ov-caption">By invested cost</span></div>{model.topHoldings?.length ? <ol>{model.topHoldings.map((fund, index) => <li key={fund.id}><span className="ov-holdings__rank">{index + 1}</span><span className="ov-holdings__name">{fund.name}</span><strong>{formatMoney(fund.invested)}</strong></li>)}</ol> : <p className="ov-caption">{model.topHoldings ? 'No fund holdings recorded.' : blocked ? 'Your largest recorded fund positions will appear here.' : loading ? 'Loading fund holdings…' : 'Complete fund costs are needed to rank holdings.'}</p>}</div>
        <p className="ov-footnote">Portfolio value and profit/loss are omitted until reliable valuation data is available.</p>
      </section>

      <section className="ov-panel ov-activity" aria-labelledby="activity-title"><PanelHeader id="activity-title" title="Recent activity" path="decision-journal" />
        {model.activity.length ? <ol className="ov-activity__list">{model.activity.map((item, index) => <li key={item.id}><span className="ov-icon"><LayoutIcon name="journal" size={16} /></span><div>{index === 0 && <span className="ov-latest">Latest decision</span>}<h4>{item.title}</h4><p>{item.description}</p><time dateTime={item.date}>{formatDate(item.date)}</time></div></li>)}</ol>
          : <EmptyState icon="journal" title={loading ? 'Gathering your activity…' : blocked ? 'Your decisions belong here.' : resources.journals?.status === 'ready' ? 'No dated journal entries yet' : 'Activity unavailable'}>{blocked ? 'Journal decisions will appear after your account is connected.' : 'Your dated journal entries appear here, newest first.'}</EmptyState>}
        <div className="ov-panel__foot"><span>Decision Journal</span><span>{formatCount(model.journals?.length ?? null)} entries</span></div>
      </section>

      <section className="ov-panel ov-risk" aria-labelledby="risk-title"><PanelHeader id="risk-title" title="Risk profile" path="risk-assessment" />
        <div className="ov-risk__body"><span className="ov-risk__seal"><LayoutIcon name="risk" size={28} /></span><div><h4>{model.risk ? label(model.risk.riskCategory) : 'Not available'}</h4><p className="ov-caption">{model.risk ? `Assessed ${formatDate(model.risk.calculatedAt)}` : loading ? 'Loading assessment…' : blocked ? 'Awaiting account connection' : resources.profiles?.status === 'ready' ? 'No assessment recorded' : 'Assessment unavailable'}</p></div></div>
        <Link className="ov-text-link" to={destination('risk-assessment')}>View assessment <Arrow /></Link>
      </section>

      <section className="ov-panel ov-ipos" aria-labelledby="applications-title"><PanelHeader id="applications-title" title="IPO applications" path="ipo-tracker" />
        <dl className="ov-ipo-summary" aria-label="IPO allotment status counts">{model.ipoStatuses.map(item => <div key={item.status}><dt>{label(item.status)}</dt><dd>{formatCount(item.count)}</dd></div>)}{model.otherStatusCount > 0 && <div><dt>Not recorded</dt><dd>{formatCount(model.otherStatusCount)}</dd></div>}</dl>
        {model.applications?.length ? <ul className="ov-ipo-list">{model.applications.slice(0, 3).map(item => <li key={item.applicationId}><span className="ov-icon"><LayoutIcon name="ipo" size={16} /></span><div><h4>{item.companyName || 'IPO application'}</h4><p className="ov-caption">{formatCount(item.lotsApplied ?? null)} lots applied · {formatCount(item.lotsAllotted ?? null)} allotted</p></div><span className="ov-status">{label(item.applicationStatus)}<small>{label(item.allotmentStatus)}</small></span></li>)}</ul>
          : <EmptyState icon="ipo" title={loading ? 'Loading applications…' : blocked ? 'Applications, in one place.' : model.applications ? 'No IPO applications yet' : 'Applications unavailable'}>{blocked ? 'Track companies, lots and application statuses once your account is connected.' : 'Your application records and allotment statuses will appear here.'}</EmptyState>}
        <div className="ov-panel__foot"><span>All application statuses</span><Link to={destination('ipo-tracker')}>IPO Tracker <Arrow /></Link></div>
      </section>

      <section className="ov-panel ov-sip" aria-labelledby="sip-title"><PanelHeader id="sip-title" title="SIP commitments" path="sip-holdings" />
        {model.contributions.length ? <dl className="ov-contributions">{model.contributions.map(item => <div key={item.frequency}><dt>{label(item.frequency)}</dt><dd>{formatMoney(item.amount)}</dd></div>)}</dl> : <div className="ov-sip__empty"><p className="ov-sip__value">—</p><p className="ov-caption">{model.holdings ? 'No commitments recorded' : unavailable}</p></div>}
        <p className="ov-footnote">Contributions grouped by frequency. Weekly and monthly amounts stay separate.</p>
      </section>
    </div>
    <p className="ov-disclaimer">Only recorded account data is shown. IPO applications have no submission date and are listed separately from dated journal activity.</p>
  </div>;
}

export default function OverviewPage({ loader }) {
  const state = useOverviewData(loader);
  return <OverviewContent {...state} />;
}
