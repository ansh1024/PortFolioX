import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import JournalCard from '../components/decision-journal/JournalCard.jsx';
import JournalEditor from '../components/decision-journal/JournalEditor.jsx';
import useDecisionJournal from '../features/decision-journal/useDecisionJournal.js';
import { filterJournals, journalSummary } from '../features/decision-journal/decisionJournalModel.js';
import { number } from '../features/ipo/ipoModel.js';
import { recordDate } from '../features/risk-assessment/riskAssessmentModel.js';
import '../styles/ipo.css';
import '../styles/decision-journal.css';
export default function DecisionJournalPage({ api=null }) {
  const state=useDecisionJournal(api), [query,setQuery]=useState(''), [sort,setSort]=useState('latest'), [editor,setEditor]=useState(null), [notice,setNotice]=useState('');
  const summary=journalSummary(state.entries), entries=useMemo(()=>filterJournals(state.entries || [],{query,sort}),[state.entries,query,sort]);
  const ready=!!api && state.status==='ready', canCreate=ready && !!state.ipos?.length && !!state.entries;
  useEffect(()=>{setEditor(null);},[api]);
  useEffect(()=>{if(state.status==='blocked')setEditor(null);},[state.status]);
  function saved(message){setEditor(null);setNotice(message);state.reload();}
  function expired(){setEditor(null);state.invalidate();setNotice('Your account connection has expired. Connect again to continue.');}
  return <div className="dj-page">
    <section className="dj-hero"><div className="dj-hero-copy"><span className="dj-kicker">YOUR PERSONAL DECISION JOURNAL</span><h2>Keep the thought.<br/>Find your perspective<span>.</span></h2><p>The reasons behind an investment deserve a place of their own.</p><button className="ipo-button ipo-button--primary" disabled={!canCreate} onClick={()=>setEditor({entry:null})}>＋ Write a decision</button></div><div className="dj-hero-foot"><span>Thoughtfully recorded. Yours to revisit.</span><span>One IPO. One evolving note.</span></div></section>
    {state.status==='blocked' && <div className="dj-message" role="status"><p>Connect your account to open your private journal. No live entries are displayed.</p><Link to="/login">Sign-in preview ↗</Link></div>}
    {notice && <div className="dj-message" role="status"><p>{notice}</p><button className="ipo-button" onClick={()=>setNotice('')}>Dismiss</button></div>}
    {Object.keys(state.errors).length>0 && <div className="dj-error" role="alert">{Object.entries(state.errors).map(([key,value])=><p key={key}>{key==='ipos'?'IPO catalogue':'Journal'}: {value}</p>)}<button className="ipo-button" onClick={state.reload}>Retry workspace</button></div>}
    <section className="dj-summary" aria-label="Journal overview"><div><span>Recorded decisions</span><strong>{number(summary.total)}</strong></div><div><span>IPOs with a note</span><strong>{number(summary.ipos)}</strong></div><div><span>Latest activity</span><strong className="dj-summary-date">{state.status==='loading'?'Loading…':!state.entries?'Unavailable':summary.latest?recordDate(summary.latest):'No dated activity'}</strong></div></section>
    <section className="dj-board" aria-labelledby="dj-board-title"><header><div><span className="dj-kicker">A RECORD OF YOUR REASONING</span><h3 id="dj-board-title">Your perspectives.</h3></div><button className="ipo-button" disabled={!api || state.status==='blocked' || state.status==='loading'} onClick={state.reload}>↻ Refresh journal</button></header>
      <div className="dj-toolbar"><div className="ipo-field"><label htmlFor="dj-search">Find a thought</label><input id="dj-search" type="search" placeholder="Search companies or your words…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="ipo-field"><label htmlFor="dj-sort">Sort entries</label><select id="dj-sort" value={sort} onChange={e=>setSort(e.target.value)}><option value="latest">Latest updated</option><option value="oldest">Oldest updated</option><option value="company">Company A–Z</option></select></div><span>{state.entries?`${entries.length} of ${state.entries.length} entries`:'Private workspace'}</span></div>
      {state.status==='loading'?<div className="dj-empty" role="status">Opening your journal…</div>:entries.length?<div className="dj-card-grid">{entries.map((entry,index)=><JournalCard key={entry.journalId} entry={entry} index={index} onOpen={e=>setEditor({entry:e})}/>)}</div>:<div className="dj-empty"><span className="dj-empty-mark" aria-hidden="true">✳</span><h4>{query && state.entries?.length?'No thoughts found.':!state.entries?'A space for your next perspective.':'Every decision starts with a thought.'}</h4><p>{query && state.entries?.length?'Try another company or a phrase from your note.':!state.entries?'Your saved entries will appear once account data is available.':'Record what you see, what gives you pause, and why you choose to act.'}</p>{query?<button className="ipo-button" onClick={()=>setQuery('')}>Clear search</button>:<button className="ipo-button" disabled={!canCreate} onClick={()=>setEditor({entry:null})}>Write your first decision ↗</button>}</div>}
      <footer><span>Notes evolve. Your original creation date stays.</span><span>IPO decisions only</span></footer>
    </section><p className="dj-footnote">A personal record, not an investment recommendation. Review dates, outcomes and revision history are not tracked by this journal.</p>
    {editor && api && <JournalEditor entry={editor.entry} entries={state.entries} ipos={state.ipos} api={api} onSaved={saved} onExpired={expired} onClose={()=>setEditor(null)}/>}
  </div>;
}
