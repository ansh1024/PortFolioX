import { journalPreview } from '../../features/decision-journal/decisionJournalModel.js';
import { recordDate } from '../../features/risk-assessment/riskAssessmentModel.js';
export default function JournalCard({ entry, index, onOpen }) {
  return <article className="dj-card" style={{ '--entry-order': Math.min(index,5) }}><div className="dj-card-top"><span>IPO #{entry.ipoId}</span><span aria-hidden="true">↗</span></div><h3><button onClick={()=>onOpen(entry)}>{entry.companyName || `IPO #${entry.ipoId}`}</button></h3><p className="dj-card-preview">{journalPreview(entry.content) || 'No content recorded.'}</p><footer><div><span>Last updated</span><time dateTime={entry.updatedAt}>{recordDate(entry.updatedAt)}</time></div><small>Created {recordDate(entry.createdAt)}</small></footer></article>;
}
