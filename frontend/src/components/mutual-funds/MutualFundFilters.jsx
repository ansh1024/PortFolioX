import { useId } from 'react';
import { categories, label, sortOptions } from '../../features/mutual-funds/mutualFundModel.js';

export default function MutualFundFilters({ filters, amcs, onChange, mobile = false }) {
  const id = useId();
  return <div className={`mf-filter-controls${mobile ? ' mf-filter-controls--mobile' : ''}`}>
    <div className="ipo-field"><label htmlFor={`${id}-category`}>Category</label><select id={`${id}-category`} value={filters.category} onChange={e => onChange('category', e.target.value)}><option value="">All categories</option>{categories.map(category => <option key={category} value={category}>{label(category)}</option>)}<option value="UNRECORDED">Not recorded</option></select></div>
    <div className="ipo-field"><label htmlFor={`${id}-amc`}>Fund house</label><select id={`${id}-amc`} value={filters.amc} onChange={e => onChange('amc', e.target.value)}><option value="">All fund houses</option>{amcs.map(amc => <option key={amc}>{amc}</option>)}</select></div>
    <div className="ipo-field"><label htmlFor={`${id}-sort`}>Sort by</label><select id={`${id}-sort`} value={filters.sort} onChange={e => onChange('sort', e.target.value)}>{sortOptions.map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></div>
    <button className="ipo-button mf-sort-direction" aria-label={`Sort ${filters.direction === 'asc' ? 'descending' : 'ascending'}`} onClick={() => onChange('direction', filters.direction === 'asc' ? 'desc' : 'asc')}>{filters.direction === 'asc' ? '↑ Ascending' : '↓ Descending'}</button>
  </div>;
}
