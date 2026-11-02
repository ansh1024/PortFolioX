import { useEffect, useRef, useState } from 'react';
import IpoDialog from '../ipo/IpoDialog.jsx';
import { existingJournal, journalPayload, validJournal } from '../../features/decision-journal/decisionJournalModel.js';
import { dateLabel, money } from '../../features/ipo/ipoModel.js';
import { recordDate } from '../../features/risk-assessment/riskAssessmentModel.js';
const prompts = ['Why am I interested in this IPO?', 'What are the potential risks?', 'What factors influenced my decision?', 'What is my intended investment strategy?', 'What would make me reconsider my decision?'];
export default function JournalEditor({ entry, entries, ipos, api, onSaved, onExpired, onClose }) {
  const [record,setRecord] = useState(null), [ipoId,setIpoId] = useState(entry ? String(entry.ipoId) : '');
  const [content,setContent] = useState(''), [original,setOriginal] = useState('');
  const [loading,setLoading] = useState(!!entry), [busy,setBusy] = useState(false), [error,setError] = useState(''), [conflict,setConflict] = useState(false), [discard,setDiscard] = useState(false);
  const [readRevision,setReadRevision] = useState(0);
  const writing = useRef(false), alive = useRef(true);
  const duplicate = !record && existingJournal(entries,ipoId);
  const ipo = (ipos || []).find(i=>String(i.ipoId)===ipoId);
  useEffect(()=>{ alive.current=true; return ()=>{alive.current=false;}; },[]);
  useEffect(()=>{
    if(!entry && !readRevision) return;
    const c=new AbortController();setLoading(true);setError('');
    api.get(entry?.ipoId || ipoId,c.signal).then(r=>{
      if(c.signal.aborted) return;
      if(!validJournal(r) || String(r.ipoId)!==String(entry?.ipoId || ipoId)) throw new Error('The journal response could not be verified.');
      setRecord(r);setContent(r.content || '');setOriginal(r.content || '');setConflict(false);
    }).catch(e=>{ if(c.signal.aborted)return; if([401,403].includes(e.status))onExpired();else setError(e.message || 'Could not open this entry.'); }).finally(()=>{if(!c.signal.aborted)setLoading(false);});
    return ()=>c.abort();
  },[entry,api,readRevision]);
  function close(){if(content!==original){setDiscard(true);return;}onClose();}
  async function save(e){
    e.preventDefault(); if(writing.current || loading || (entry && !record))return;
    try{journalPayload(content);}catch(e){setError(e.message);return;}
    if(!ipoId || (!record && !ipo)){setError('Select an IPO from the recorded catalogue.');return;}
    if(duplicate){setConflict(true);setError('This IPO already has an entry. Open it to edit instead.');return;}
    writing.current=true;setBusy(true);setError('');
    try{
      const r=await api[record?'update':'create'](ipoId,content);
      if(!alive.current)return;
      if(!validJournal(r) || String(r.ipoId)!==ipoId)throw new Error('The save response could not be verified. An entry may have been saved; refresh before retrying.');
      onSaved(record?'Decision updated.':'Decision recorded.');
    }catch(e){if(!alive.current)return;if([401,403].includes(e.status)){onExpired();return;}setConflict(e.status===409);setError(e.status===409?'An entry already exists for this IPO. Open the saved entry instead.':e.message || 'The entry could not be saved.');}
    finally{writing.current=false;if(alive.current)setBusy(false);}
  }
  return <IpoDialog title={entry || record?'Your decision, in full':'A new perspective'} variant="drawer" busy={busy} onClose={close}><div className="dj-editor">
    {discard && <div className="dj-message" role="alert"><p>Discard your unsaved changes?</p><button className="ipo-button" onClick={()=>setDiscard(false)}>Keep writing</button><button className="ipo-button" onClick={onClose}>Discard changes</button></div>}
    {loading?<p role="status">Opening the latest saved entry…</p>:<form onSubmit={save} noValidate>
      {record?<div className="dj-editor-company"><span>IPO #{record.ipoId}</span><h3>{record.companyName}</h3><p>Created {recordDate(record.createdAt)} · Updated {recordDate(record.updatedAt)}</p></div>:<div className="ipo-field"><label htmlFor="dj-ipo">Which IPO are you considering?</label><select id="dj-ipo" disabled={busy || !!entry} value={ipoId} onChange={e=>{setIpoId(e.target.value);setError('');setConflict(false);}}><option value="">Choose a recorded IPO</option>{(ipos || []).map(i=><option key={i.ipoId} value={i.ipoId}>{i.companyName}{existingJournal(entries,i.ipoId)?' · Entry exists':''}</option>)}</select></div>}
      {ipo && <dl className="dj-issue-context"><div><dt>Issue price</dt><dd>{money(ipo.price)}</dd></div><div><dt>Opens</dt><dd>{dateLabel(ipo.openingDate)}</dd></div><div><dt>Sector</dt><dd>{ipo.sector || 'Not recorded'}</dd></div></dl>}
      <div className="ipo-field"><label htmlFor="dj-content">Your decision & reasoning</label><textarea id="dj-content" disabled={busy || (!!entry && !record)} value={content} onChange={e=>{setContent(e.target.value);setError('');}} placeholder="What is your decision, and what led you here?" aria-describedby="dj-writing-help" aria-invalid={!!error} /></div>
      <details className="dj-prompts"><summary>A little help getting started</summary><ul id="dj-writing-help">{prompts.map(p=><li key={p}>{p}</li>)}</ul><p>Writing prompts only. Everything is saved as one note.</p></details>
      {error && <p className="dj-error" role="alert">{error}</p>}
      {(duplicate || conflict) && <button type="button" className="ipo-button" disabled={busy} onClick={()=>setReadRevision(r=>r+1)}>Open existing entry</button>}
      <footer><span>{content.trim() ? content.trim().split(/\s+/).length : 0} words · {busy?'Saving…':'Not autosaved'}</span><div><button type="button" className="ipo-button" disabled={busy} onClick={close}>Cancel</button><button type="submit" className="ipo-button ipo-button--primary" disabled={busy || !!duplicate || conflict || (!!entry && !record)} aria-busy={busy}>{busy?'Saving…':record?'Save changes':'Save decision'} ↗</button></div></footer>
    </form>}
  </div></IpoDialog>;
}
