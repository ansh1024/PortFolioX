import { initials, label, numeric, associatedHoldings } from '../../features/mutual-funds/mutualFundModel.js';

export function FundIdentity({ fund, onDetails }) {
  return <button className="mf-scheme" onClick={() => onDetails(fund)}>
    <span className="mf-monogram" aria-hidden="true">{initials(fund.amc || fund.fundName)}</span>
    <span><strong>{fund.fundName || 'Unnamed fund'}</strong><small>{fund.amc || 'AMC not recorded'}<span aria-hidden="true"> · </span>{fund.fundId}</small></span>
  </button>;
}

function Actions({ fund, isAdmin, onDetails, onEdit, onDelete }) {
  const act = (event, callback) => {
    const menu = event.currentTarget.closest('details');
    menu.removeAttribute('open');
    menu.querySelector('summary').focus();
    callback(fund);
  };
  if (!isAdmin) return <button className="mf-open" onClick={() => onDetails(fund)} aria-label={`View ${fund.fundName}`}>↗</button>;
  return <details className="mf-actions-menu" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.removeAttribute('open'); event.currentTarget.querySelector('summary').focus(); event.stopPropagation(); } }}>
    <summary aria-label={`Actions for ${fund.fundName}`}>⋯</summary>
    <div><button onClick={e => act(e, onDetails)}>View research panel</button><button onClick={e => act(e, onEdit)}>Edit fund</button><button className="mf-danger-text" onClick={e => act(e, onDelete)}>Delete fund</button></div>
  </details>;
}

export default function MutualFundCatalogue({ rows, view, sips, isAdmin, onDetails, onEdit, onDelete, onSort, filters }) {
  const actionProps = { isAdmin, onDetails, onEdit, onDelete };
  const headings = [['fundName', 'Scheme'], ['category', 'Category'], ['nav', 'NAV'], ['aum', 'AUM'], [null, 'My SIPs']];
  return <div className="mf-results" data-view={view}>
    <div className="mf-table" role="region" aria-label="Mutual fund catalogue" tabIndex={0}>
      <table><thead><tr>{headings.map(([key, name]) => <th key={name} aria-sort={key && filters.sort === key ? filters.direction === 'asc' ? 'ascending' : 'descending' : undefined}>{key ? <button onClick={() => onSort(key)}>{name}<span aria-hidden="true">{filters.sort === key ? filters.direction === 'asc' ? '↑' : '↓' : '↕'}</span></button> : name}</th>)}<th><span className="ipo-sr-only">Actions</span></th></tr></thead>
        <tbody>{rows.map(fund => <tr key={fund.fundId}><td><FundIdentity fund={fund} onDetails={onDetails} /></td><td><span className="mf-tag" data-category={fund.category}>{label(fund.category)}</span></td><td>{numeric(fund.nav)}</td><td>{numeric(fund.aum)}</td><td><span className="mf-sip-count">{numeric(associatedHoldings(sips, fund.fundId)?.length)}</span></td><td><Actions fund={fund} {...actionProps} /></td></tr>)}</tbody>
      </table>
    </div>
    <div className="mf-fund-grid">{rows.map(fund => <article className="mf-fund-card" key={fund.fundId}><header><span className="mf-tag" data-category={fund.category}>{label(fund.category)}</span><Actions fund={fund} {...actionProps} /></header><FundIdentity fund={fund} onDetails={onDetails} /><dl><div><dt>Recorded NAV</dt><dd>{numeric(fund.nav)}</dd></div><div><dt>Recorded AUM</dt><dd>{numeric(fund.aum)}</dd></div></dl><footer><span>{sips ? `${associatedHoldings(sips, fund.fundId).length} of your SIP records` : 'SIP connection pending'}</span><button onClick={() => onDetails(fund)}>Research fund ↗</button></footer></article>)}</div>
  </div>;
}
