import { useId, useRef, useState } from 'react';
import { answerPayload, confirmedPrompts, dimensions, hasQuestionnaire, initialAnswers, validateAnswers } from '../../features/risk-assessment/riskAssessmentModel.js';

export default function RiskAssessmentWizard({ active, questions, canSubmit, busy, error, serverFields = {}, onSubmit, onClose }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [step, setStep] = useState(0);
  const [required, setRequired] = useState('');
  const heading = useRef(null);
  const id = useId();
  const mapped = hasQuestionnaire(questions);
  const [key, dimension] = dimensions[Math.min(step, dimensions.length - 1)];
  const question = mapped ? questions.find(item => item.key === key) : null;
  const review = step === dimensions.length;
  const completed = Object.values(answers).filter(value => value !== null).length;
  const choices = question?.answers || [];
  function move(next) {
    if (mapped && next > step && !review && validateAnswers(answers)[key]) { setRequired('Select one answer to continue.'); return; }
    setRequired(''); setStep(next);
    queueMicrotask(() => heading.current?.focus());
  }
  function submit(event) {
    event.preventDefault();
    const errors = validateAnswers(answers);
    if (Object.keys(errors).length) { setStep(dimensions.findIndex(([field]) => errors[field])); setRequired('Complete every answer before submitting.'); return; }
    if (canSubmit && mapped && !busy) onSubmit(answerPayload(answers));
  }
  return <section className="ra-wizard" hidden={!active} aria-labelledby={`${id}-title`}>
    <header><div><span className="ra-overline">{mapped ? 'RISK ASSESSMENT' : 'PENDING CONFIGURATION'}</span><h3 id={`${id}-title`}>A little more about you.</h3></div><button className="ipo-button" disabled={busy} onClick={onClose}>Back to profile</button></header>
    {!mapped && <div className="ra-notice" role="status">The question wording or answer mappings are incomplete. This is a preview of the assessment structure. No answers are collected or submitted until configuration is complete.</div>}
    <div className="ra-progress-label"><span>{review ? mapped ? 'Review your answers' : 'Review structure' : `${mapped ? 'Step' : 'Field'} ${step + 1} of ${dimensions.length}`}</span><span>{mapped ? `${completed} / ${dimensions.length} answered` : 'Configuration pending'}</span></div><progress value={mapped ? completed : Math.min(step + 1, dimensions.length)} max={dimensions.length} aria-label={mapped ? 'Answered assessment fields' : 'Assessment structure preview progress'} />
    <form onSubmit={submit} noValidate>
      {error && <div className="ra-alert" role="alert"><p>{error}</p>{Object.entries(serverFields).map(([field, message]) => <p key={field}>{field}: {message}</p>)}</div>}
      {review ? <div className="ra-review"><h4 ref={heading} tabIndex={-1}>{mapped ? 'Check before you submit.' : 'The assessment structure.'}</h4><p>{mapped ? 'Your answers are sent to the backend for assessment. No risk score is calculated in this browser.' : 'All eight backend fields are retained. Answer choices are pending configuration.'}</p><dl>{dimensions.map(([field, name], index) => <div key={field}><dt>{name}</dt><dd>{mapped ? questions.find(q => q.key === field).answers.find(a => a.value === answers[field])?.label : 'Answer mapping pending'}<button type="button" disabled={busy} onClick={() => move(index)} aria-label={`Change ${name}`}>Change</button></dd></div>)}</dl></div>
        : <fieldset disabled={busy}><legend className="ra-question-title" ref={heading} tabIndex={-1}>{question?.prompt || confirmedPrompts[key] || dimension}</legend>{!mapped && <p className="ra-field-code">Request field: <code>{key}</code> · Answer mapping pending</p>}{!mapped && <div className="ra-pending-options"><span aria-hidden="true">◌</span><h4>Answer choices are not configured yet.</h4><p>{confirmedPrompts[key] ? 'The question is confirmed. Its four answer labels are still pending.' : 'This field is retained; final question wording and answer labels are pending.'}</p></div>}<div className="ra-answer-options">{choices.map(answer => <label key={answer.value} data-selected={answers[key] === answer.value}><input type="radio" name={`${id}-${key}`} value={answer.value} checked={answers[key] === answer.value} onChange={() => { setAnswers(previous => ({ ...previous, [key]: answer.value })); setRequired(''); }} /><span>{answer.label}</span><span className="ra-answer-number" aria-hidden="true">{String(answer.value + 1).padStart(2, '0')}</span></label>)}</div>{required && <p className="ra-field-error" role="alert">{required}</p>}</fieldset>}
      <footer><button type="button" className="ipo-button" disabled={step === 0 || busy} onClick={() => move(step - 1)}>← Previous</button>{review ? <button type="submit" className="ipo-button ipo-button--primary" disabled={!canSubmit || !mapped || busy} aria-busy={busy}>{busy ? 'Assessing…' : 'Submit assessment'}</button> : <button type="button" className="ipo-button ipo-button--primary" disabled={busy} onClick={event => { event.preventDefault(); move(step + 1); }}>{step === dimensions.length - 1 ? mapped ? 'Review answers' : 'Review structure' : mapped ? 'Continue' : 'Next field'} →</button>}</footer>
      {review && (!canSubmit || !mapped) && <p className="ra-muted">{mapped ? 'Your answers are ready for review. Connect your account before submitting an assessment.' : 'Submission requires account connection and complete question/answer mappings.'}</p>}
    </form>
  </section>;
}
