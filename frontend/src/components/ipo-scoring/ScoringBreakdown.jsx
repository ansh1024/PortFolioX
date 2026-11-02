import { factorBreakdown, factorExplanations } from '../../features/ipo-scoring/ipoScoringModel.js';
import { number } from '../../features/ipo/ipoModel.js';

export default function ScoringBreakdown({ record }) {
  const items = factorBreakdown(record);
  return <section className="sc-breakdown"><header><h3>What makes the score.</h3><span>Returned points</span></header><dl>{items.map(item => <div key={item.key}><dt>{item.label}</dt><dd><strong>{number(item.value)}</strong>{item.share !== null && <span className="sc-factor-track" aria-hidden="true"><i style={{ width: `${item.share}%` }} /></span>}</dd></div>)}</dl><p>Bars compare returned components, not factor weights or expected returns. The service adds these five components to form the total.</p><div className="sc-factor-explanations">{items.map(item => <details key={item.key}><summary>{item.label}<span>How it is sourced</span></summary><p>{factorExplanations[item.key]}</p></details>)}</div><p>Factor weights and individual reasoning are not returned. Stored metric bounds are not enforced in the active backend scoring path; the UI does not assume a 100-point maximum.</p></section>;
}
