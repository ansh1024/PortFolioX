import ScoringBreakdown from './ScoringBreakdown.jsx';
import { number } from '../../features/ipo/ipoModel.js';
import { verdictLabel } from '../../features/ipo-scoring/ipoScoringModel.js';
import { recordDate } from '../../features/risk-assessment/riskAssessmentModel.js';

export default function IpoScoreDetails({ record }) {
  return <div className="sc-details"><span className="sc-overline">BACKEND SCORE LOG / {record.scoreLogId}</span><h3>{record.companyName || `IPO #${record.ipoId}`}</h3><div className="sc-result-banner"><strong>{number(record.totalScore)}</strong><div><span>Total points returned</span><span className="sc-verdict" data-verdict={record.verdict}>{verdictLabel(record.verdict)}</span></div></div><ScoringBreakdown record={record} /><dl className="sc-record-meta"><div><dt>IPO ID</dt><dd>{record.ipoId}</dd></div><div><dt>Scoring date</dt><dd>{recordDate(record.calculatedAt)}</dd></div><div><dt>Server timestamp</dt><dd>{record.calculatedAt || 'Not recorded'}</dd></div></dl><p className="sc-muted">The backend assigns Apply at 75 or above, Watch from 45 to below 75, and Skip below 45. The badge above displays the actual returned verdict. Decision support does not guarantee an investment outcome.</p></div>;
}
