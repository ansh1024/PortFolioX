import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutIcon from '../components/layout/LayoutIcon.jsx';
import IpoDialog from '../components/ipo/IpoDialog.jsx';
import RiskProfileCard from '../components/risk-assessment/RiskProfileCard.jsx';
import RiskAssessmentWizard from '../components/risk-assessment/RiskAssessmentWizard.jsx';
import RiskAssessmentResult from '../components/risk-assessment/RiskAssessmentResult.jsx';
import { riskQuestionnaire } from '../features/risk-assessment/riskQuestionnaire.js';
import useRiskAssessment from '../features/risk-assessment/useRiskAssessment.js';
import { hasQuestionnaire, sortProfiles, validProfile } from '../features/risk-assessment/riskAssessmentModel.js';
import { dashboardSections, sectionUrl } from '../app/dashboardSections.js';
import '../styles/ipo.css';
import '../styles/risk-assessment.css';

const scoringRoute = sectionUrl(dashboardSections.find(section => section.path === 'ipo-scoring'));
export default function RiskAssessmentPage({ api = null, questions = riskQuestionnaire }) {
  const state = useRiskAssessment(api);
  const [active, setActive] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [notice, setNotice] = useState('');
  const [inspected, setInspected] = useState(null);
  const writing = useRef(false);
  const wizardSection = useRef(null);
  const loading = state.status === 'loading';
  const blocked = state.status === 'blocked';
  const configured = hasQuestionnaire(questions);
  const latest = sortProfiles(state.profiles)[0] || null;
  useEffect(() => {
    if (!active) return;
    const frame = requestAnimationFrame(() => wizardSection.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [active, attempt]);
  useEffect(() => { if (blocked) setInspected(null); }, [blocked]);
  useEffect(() => { setInspected(null); }, [api]);
  function start() {
    if (writing.current) return;
    setAttempt(value => value + 1); setError(''); setFields({}); setActive(true); setInspected(null);
  }
  async function assess(body) {
    if (!api || state.status !== 'ready' || !configured || writing.current) return;
    writing.current = true; setBusy(true); setError(''); setFields({});
    try {
      const profile = await api.assess(body);
      if (!validProfile(profile)) throw new Error('The server returned an invalid assessment result. Refresh your profiles before submitting again.');
      state.accept(profile); setActive(false); setNotice('Assessment saved. The score and category below are returned by the backend.');
    } catch (problem) {
      if ([401, 403].includes(problem.status)) { state.invalidate(); setInspected(null); setActive(false); setNotice(problem.message || 'Account connection is required.'); }
      else { setError(problem.message || 'The assessment could not be saved.'); setFields(problem.fields || {}); }
    } finally { writing.current = false; setBusy(false); }
  }
  return <div className="ra-page">
    <header className="ra-page-heading"><div><p className="ra-overline">INVESTMENT INTELLIGENCE / YOUR PROFILE</p><h2>Risk, with perspective<span>.</span></h2><p>Understand the capacity behind your next decision.</p></div><div className="ipo-actions"><Link className="ipo-button" to={scoringRoute}>IPO scoring ↗</Link><button className="ipo-button" disabled={loading || blocked || busy} onClick={state.reload}>↻ Refresh</button></div></header>
    {blocked && <div className="ra-notice" role="status"><LayoutIcon name="profile" size={17} /><p>Connect your account to load private risk profiles. No live assessment result is shown.</p><Link to="/login">Sign-in preview ↗</Link></div>}
    {state.status === 'error' && <div className="ra-alert" role="alert"><p>{state.error}</p><button className="ipo-button" onClick={state.reload}>Retry profiles</button></div>}
    {notice && <div className="ra-notice" role="status"><p>{notice}</p><button className="ipo-button" onClick={() => setNotice('')}>Dismiss</button></div>}
    <div className="ra-profile-grid"><RiskProfileCard profile={latest} loading={loading} onStart={start} /><div className="ra-context-column">
      <section className="ra-intro-panel"><span className="ra-overline">EIGHT INPUTS. ONE CLEARER VIEW.</span><h3>Start with the person.<br />Then consider the opportunity.</h3><p>Capacity, tolerance and investing context belong in the same conversation. Your risk profile and an IPO score answer different questions.</p><div className="ra-input-tags"><span>Capacity</span><span>Tolerance</span><span>Context</span></div></section>
      <section className="ra-status-panel"><div className="ra-status-icon"><LayoutIcon name="journal" size={21} /></div><div><span className="ra-overline">QUESTIONNAIRE</span><h3>{configured ? 'Ready for assessment' : 'Pending configuration'}</h3><p>{configured ? 'Review all eight answers before submitting them to the service.' : 'All eight fields are preserved. Missing prompts and answer meanings will be completed later.'}</p></div><button className="ipo-button" disabled={loading || busy} onClick={start}>{configured ? 'Start assessment' : 'Preview structure'} ↗</button></section>
    </div></div>
    <div ref={wizardSection} tabIndex={-1} className="ra-wizard-anchor"><RiskAssessmentWizard key={attempt} active={active} questions={questions} canSubmit={!!api && state.status === 'ready' && configured} busy={busy} error={error} serverFields={fields} onSubmit={assess} onClose={() => setActive(false)} /></div>
    <section className="ra-framework"><header><span className="ra-overline">HOW THE SERVICE READS RISK</span><h3>A score needs context.</h3></header><div className="ra-framework-grid"><article><span className="ra-step-number">01</span><h4>Eight required inputs</h4><p>Each answer uses a code from 0–3. The request adapts dependency codes to match the backend’s reversed direction.</p></article><article><span className="ra-step-number">02</span><h4>Normalised to 100</h4><p>Answer points are 0, 3, 7 and 10. The combined raw score is divided by 80 and scaled to 100.</p></article><article><span className="ra-step-number">03</span><h4>Capacity comes first</h4><p>Limited emergency savings, heavy dependence on investments or difficult debt repayments can cap High/Very high at Moderate.</p></article></div></section>
    <div className="ra-lower-grid"><RiskAssessmentResult profiles={state.profiles} onInspect={setInspected} /><section className="ra-category-guide"><span className="ra-overline">BEFORE CAPACITY SAFEGUARDS</span><h3>The category scale</h3><dl>{[['Low', 'Below 25'], ['Moderate', '25 to below 50'], ['High', '50 to below 75'], ['Very high', '75 and above']].map(([name, range], index) => <div key={name}><dt><i data-index={index} />{name}</dt><dd>{range}</dd></div>)}</dl><p>The returned category is authoritative. A numeric score alone does not establish investment suitability.</p></section></div>
    <p className="ra-footnote"><LayoutIcon name="risk" size={15} />Decision support, not a guarantee. Past answers are not returned by the profile API; retaking starts a new assessment.</p>
    {inspected && <IpoDialog title="Saved risk profile" onClose={() => setInspected(null)}><div className="ra-saved-result"><RiskProfileCard profile={inspected} onStart={start} /><p className="ra-muted">Server timestamp: {inspected.calculatedAt || 'Not recorded'}. The saved record contains a score and category, not the original answers.</p></div></IpoDialog>}
  </div>;
}
