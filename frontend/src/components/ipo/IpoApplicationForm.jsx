import { useId, useState } from 'react';
import { validateApplication } from '../../features/ipo/ipoModel.js';
export default function IpoApplicationForm({ ipos, initialId, busy, error, onSubmit }) {
  const [values, setValues] = useState({ ipoId: String(initialId || ''), lotsApplied: '' });
  const [errors, setErrors] = useState({});
  const prefix = useId();
  return <form className="ipo-form" noValidate onSubmit={event => {
    event.preventDefault(); const found = validateApplication(values); setErrors(found);
    if (Object.keys(found).length) { event.currentTarget.elements[Object.keys(found)[0]]?.focus(); return; }
    if (!busy) onSubmit(values);
  }}>
    <p className="ipo-muted">Record an application in PortFolioX. This does not place a bid or make a payment.</p>
    <div className="ipo-field"><label htmlFor={`${prefix}-ipo`}>IPO *</label><select id={`${prefix}-ipo`} name="ipoId" value={values.ipoId} disabled={busy} aria-invalid={!!errors.ipoId} aria-describedby={errors.ipoId ? `${prefix}-ipo-error` : undefined} onChange={event => setValues(current => ({ ...current, ipoId: event.target.value }))}><option value="">Select a company</option>{ipos.map(ipo => <option key={ipo.ipoId} value={ipo.ipoId}>{ipo.companyName}</option>)}</select>{errors.ipoId && <span className="ipo-field__error" id={`${prefix}-ipo-error`}>{errors.ipoId}</span>}</div>
    <div className="ipo-field"><label htmlFor={`${prefix}-lots`}>Lots applied *</label><input id={`${prefix}-lots`} name="lotsApplied" type="number" min="1" max="2147483647" step="1" value={values.lotsApplied} disabled={busy} aria-invalid={!!errors.lotsApplied} aria-describedby={errors.lotsApplied ? `${prefix}-lots-error` : undefined} onChange={event => setValues(current => ({ ...current, lotsApplied: event.target.value }))} />{errors.lotsApplied && <span className="ipo-field__error" id={`${prefix}-lots-error`}>{errors.lotsApplied}</span>}</div>
    <p className="ipo-notice">Quantity and application amount are unavailable because shares per lot are not recorded.</p>
    {error && <p className="ipo-error" role="alert">{error}</p>}
    <button className="ipo-button ipo-button--primary" disabled={busy}>{busy ? 'Saving…' : 'Record application'}</button>
  </form>;
}

