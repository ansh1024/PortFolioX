import { useMemo, useState } from 'react';
import { dateLabel, initials, money } from '../../features/ipo/ipoModel.js';
import { filterCatalogue } from '../../features/ipo-scoring/ipoScoringModel.js';

export default function IpoScoreCatalogue({ ipos, records, status, selectedId, onSelect, onDetails, busy }) {
  const [filters, setFilters] = useState({ query: '', status: '', sort: 'companyName' });
  const [page, setPage] = useState(0);
  const items = useMemo(() => filterCatalogue(ipos || [], filters), [ipos, filters]);
  const pages = Math.max(1, Math.ceil(items.length / 6));
  const current = Math.min(page, pages - 1);
  const update = (key, value) => { setFilters(previous => ({ ...previous, [key]: value })); setPage(0); };
  return <section className="sc-catalogue" aria-labelledby="sc-catalogue-title">
    <header><div><h3 id="sc-catalogue-title">Opportunity library</h3><p>Issue context first. A score when you choose to run it.</p></div><span>{ipos ? `${ipos.length} recorded IPOs` : 'Catalogue unavailable'}</span></header>
    <div className="sc-library-filters">
      <div className="ipo-field"><label htmlFor="sc-library-search">Search IPOs</label><input id="sc-library-search" type="search" placeholder="Find a company…" value={filters.query} onChange={event => update('query', event.target.value)} /></div>
      <div className="ipo-field"><label htmlFor="sc-library-status">Issue status</label><select id="sc-library-status" value={filters.status} onChange={event => update('status', event.target.value)}><option value="">All statuses</option>{[...new Set((ipos || []).map(ipo => ipo.ipoStatus).filter(Boolean))].sort().map(value => <option key={value}>{value}</option>)}</select></div>
      <div className="ipo-field"><label htmlFor="sc-library-sort">Order</label><select id="sc-library-sort" value={filters.sort} onChange={event => update('sort', event.target.value)}><option value="companyName">Company A–Z</option><option value="openingDate">Opening date</option><option value="price">Issue price</option></select></div>
    </div>
    {status === 'loading' ? <p className="sc-skeleton" role="status">Loading recorded IPOs…</p> : !ipos ? <div className="sc-library-empty"><h4>{status === 'blocked' ? 'Your research starts with a connection.' : 'The catalogue could not be loaded.'}</h4><p>{status === 'blocked' ? 'Connect your account to browse IPOs and request an assessment. No sample companies are shown here.' : 'Use Retry catalogue above to try again.'}</p></div> : !items.length ? <div className="sc-library-empty"><h4>{ipos.length ? 'No matching companies.' : 'No IPOs recorded yet.'}</h4><p>{ipos.length ? 'Try a different company name or issue status.' : 'The library will show IPO master records when they are available.'}</p>{ipos.length > 0 && <button className="ipo-button" onClick={() => { setFilters({ query: '', status: '', sort: 'companyName' }); setPage(0); }}>Clear filters</button>}</div> : <>
      <div className="sc-library-list">{items.slice(current * 6, current * 6 + 6).map(ipo => {
        const score = records.find(record => String(record.ipoId) === String(ipo.ipoId));
        return <article className="sc-library-row" key={ipo.ipoId} data-selected={String(ipo.ipoId) === selectedId}>
          <span className="sc-company-monogram" aria-hidden="true">{initials(ipo.companyName)}</span>
          <div className="sc-library-company"><h4>{ipo.companyName}</h4><p>{ipo.sector || 'Sector not recorded'} <span>· {ipo.ipoStatus || 'Status not recorded'}</span></p></div>
          <dl><div><dt>Issue price</dt><dd>{money(ipo.price)}</dd></div><div><dt>Opens</dt><dd>{dateLabel(ipo.openingDate)}</dd></div><div><dt>Latest this visit</dt><dd>{score ? <button className="sc-score-link" onClick={() => onDetails(score)} aria-label={`View score for ${ipo.companyName}`}>{score.totalScore} pts · {score.verdict}</button> : 'Not scored here'}</dd></div></dl>
          <button className="ipo-button" disabled={busy} aria-pressed={String(ipo.ipoId) === selectedId} onClick={() => onSelect(String(ipo.ipoId))} aria-label={`Select ${ipo.companyName}`}>{String(ipo.ipoId) === selectedId ? 'Selected ✓' : 'Evaluate ↗'}</button>
        </article>;
      })}</div>
      <footer><span>{current * 6 + 1}–{Math.min((current + 1) * 6, items.length)} of {items.length}</span><div><button className="ipo-button" disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</button><span>Page {current + 1} / {pages}</span><button className="ipo-button" disabled={current + 1 === pages} onClick={() => setPage(current + 1)}>Next</button></div></footer>
    </>}
  </section>;
}
