import { lazy, Suspense } from 'react';
import LayoutIcon from '../layout/LayoutIcon.jsx';
import { catalogueSummary, categoryDistribution, numeric } from '../../features/mutual-funds/mutualFundModel.js';

const CategoryChart = lazy(() => import('./MutualFundCategoryChart.jsx'));

export default function MutualFundOverview({ funds, sips, loading, onCategory }) {
  const summary = catalogueSummary(funds);
  const distribution = categoryDistribution(funds);
  return <section className="mf-overview" aria-label="Catalogue overview">
    <div className="mf-universe">
      <div className="mf-overline"><LayoutIcon name="funds" size={18} /> FUND UNIVERSE</div>
      <div className="mf-universe-total"><strong>{numeric(summary.total)}</strong><span>schemes in<br />your catalogue</span></div>
      <p>Research the fund.<br />Keep the decision yours.</p>
      <span className="mf-universe-rule" aria-hidden="true" />
      <small>MASTER RECORDS · NOT INVESTED CAPITAL</small>
    </div>
    <div className="mf-overview-body">
      <div className="mf-overview-metrics">
        {[['Fund houses', summary.houses, 'Distinct recorded AMCs'], ['Categories', summary.categories, 'Across the fund universe'], ['My SIP records', sips?.length ?? null, sips ? 'Your account only' : 'Account connection required']].map(([title, value, note]) =>
          <div key={title}><span>{title}</span><strong>{numeric(value)}</strong><small>{loading ? 'Loading records…' : note}</small></div>)}
      </div>
      <div className="mf-distribution">
        <div><span className="mf-overline">CATALOGUE COMPOSITION</span><h3>A view across categories</h3><p>Number of schemes, never portfolio allocation.</p></div>
        {funds?.length ? <div className="mf-chart" role="img" aria-label={distribution.map(item => `${item.name}: ${item.count} funds`).join(', ')}>
          <Suspense fallback={<div className="mf-chart-unavailable">Loading composition chart…</div>}><CategoryChart distribution={distribution} /></Suspense>
        </div> : <div className="mf-chart-unavailable"><LayoutIcon name="funds" size={23} /><span>{loading ? 'Gathering category records…' : funds ? 'Add schemes to see the category mix.' : 'Category composition appears with your catalogue.'}</span></div>}
      </div>
      <div className="mf-category-counts" aria-label="Filter by category">{(distribution || []).filter(item => item.count > 0).map(item =>
        <button key={item.category} onClick={() => onCategory(item.category)}>{item.name}<strong>{numeric(item.count)}</strong><span aria-hidden="true">↗</span></button>)}</div>
    </div>
  </section>;
}
