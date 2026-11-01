import LayoutIcon from '../layout/LayoutIcon.jsx';
import { dateLabel, issueEvents, number, text } from '../../features/ipo/ipoModel.js';
export default function IpoTrackerRail({ ipos, applications, onDetails, onApplications, loading }) {
  const events = issueEvents(ipos);
  const statuses = ['PENDING', 'ALLOTTED', 'NOT_ALLOTTED'];
  const unknown = applications?.filter(item => !statuses.includes(item.allotmentStatus)).length;
  return <aside className="ipo-rail" aria-label="IPO calendar and application snapshot">
    <section className="ipo-calendar" aria-labelledby="ipo-calendar-title"><header><span className="ipo-rail-icon"><LayoutIcon name="overview" size={18} /></span><div><h3 id="ipo-calendar-title">Issue calendar</h3><p>Next recorded dates</p></div></header>
      {events?.length ? <ol>{events.map(event => <li key={event.id}><time dateTime={event.date} aria-label={dateLabel(event.date)}><strong>{event.date.slice(8)}</strong><span>{new Intl.DateTimeFormat('en-IN', { month: 'short', timeZone: 'UTC' }).format(new Date(`${event.date}T00:00:00Z`))}</span></time><div><span className="ipo-calendar__event">{event.label}</span><button onClick={() => onDetails(event.ipo)}>{event.ipo.companyName}</button></div></li>)}</ol> : <div className="ipo-calendar__empty"><span className="ipo-calendar__placeholder" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span><h4>{loading ? 'Gathering issue dates…' : events ? 'No upcoming dates' : 'A place for every deadline.'}</h4><p>{events ? 'There are no future issue dates in the loaded records.' : 'Opening, closing and allotment dates will appear with your IPO records.'}</p></div>}
      <footer>Indian calendar dates · Open / close / allotment</footer>
    </section>
    <section className="ipo-application-snapshot" aria-labelledby="ipo-snapshot-title"><header><h3 id="ipo-snapshot-title">Your application pulse</h3><LayoutIcon name="ipo" size={18} /></header><dl>{statuses.map(status => <div key={status}><dt><i data-status={status} />{text(status)}</dt><dd>{number(applications ? applications.filter(item => item.allotmentStatus === status).length : null)}</dd></div>)}{unknown > 0 && <div><dt>Not recorded</dt><dd>{number(unknown)}</dd></div>}</dl><button onClick={onApplications}>View my applications <span aria-hidden="true">↗</span></button></section>
  </aside>;
}
