import { number } from '../../features/ipo/ipoModel.js';
import { verdictLabel } from '../../features/ipo-scoring/ipoScoringModel.js';
import { recordDate } from '../../features/risk-assessment/riskAssessmentModel.js';

export default function IpoScoreCard({ record, onDetails }) {
  return <article className="sc-score-card"><header><span className="sc-verdict" data-verdict={record.verdict}>{verdictLabel(record.verdict)}</span><span>Log #{record.scoreLogId}</span></header><h3>{record.companyName || `IPO #${record.ipoId}`}</h3><div className="sc-score-value"><strong>{number(record.totalScore)}</strong><span>returned<br />total score</span></div><footer><time dateTime={record.calculatedAt}>{recordDate(record.calculatedAt)}</time><button className="ipo-button" onClick={() => onDetails(record)}>View breakdown ↗</button></footer></article>;
}
