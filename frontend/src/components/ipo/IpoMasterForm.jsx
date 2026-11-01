import { useId, useState } from 'react';
import { initialMaster, numericFields, IPO_STATUSES, validateMaster, masterPayload, text } from '../../features/ipo/ipoModel.js';
export default function IpoMasterForm({ record, enabled, busy, error, serverFields = {}, onSubmit }) {
  const [values, setValues] = useState(() => initialMaster(record));
  const [errors, setErrors] = useState({});
  const [edited, setEdited] = useState({});
  const prefix = useId();
  const field = (key, title, type = 'text', required = false) => {
    const problem = errors[key] || (!edited[key] && serverFields[key]);
    return <div className="ipo-field" key={key}><label htmlFor={`${prefix}-${key}`}>{title}{required ? ' *' : ''}</label><input id={`${prefix}-${key}`} name={key} type={type} value={values[key]} required={required} step={type === 'number' ? 'any' : undefined} min={type === 'number' ? key === 'price' ? undefined : '0' : undefined} maxLength={type === 'text' ? 255 : undefined} disabled={busy} aria-invalid={!!problem} aria-describedby={problem ? `${prefix}-${key}-error` : undefined} onChange={event => { setValues(current => ({ ...current, [key]: event.target.value })); setErrors(current => ({ ...current, [key]: null })); setEdited(current => ({ ...current, [key]: true })); }} />{problem && <span className="ipo-field__error" id={`${prefix}-${key}-error`}>{problem}</span>}</div>;
  };
  return <form className="ipo-form" noValidate onSubmit={event => {
    event.preventDefault(); const found = validateMaster(values); setErrors(found);
    if (Object.keys(found).length) { event.currentTarget.elements[Object.keys(found)[0]]?.focus(); return; }
    if (enabled && !busy) { setEdited({}); onSubmit(masterPayload(values)); }
  }}>
    <p className="ipo-muted">IPO master records are managed by administrators. Fields marked * are required.</p>
    {!enabled && <p className="ipo-notice">Form preview only. Saving requires a connected administrator account.</p>}
    <div className="ipo-form__grid">{field('companyName', 'Company name', 'text', true)}{field('sector', 'Sector')}{field('openingDate', 'Open date', 'date', true)}{field('closingDate', 'Close date', 'date', true)}{field('allotmentDate', 'Allotment date', 'date')}
      <div className="ipo-field"><label htmlFor={`${prefix}-status`}>Recorded status</label><select id={`${prefix}-status`} value={values.ipoStatus} disabled={busy} onChange={event => setValues(current => ({ ...current, ipoStatus: event.target.value }))}><option value="">Not recorded</option>{IPO_STATUSES.map(value => <option key={value} value={value}>{text(value)}</option>)}</select></div>
      {numericFields.map(([key, title]) => field(key, title, 'number', key === 'price'))}</div>
    <p className="ipo-muted">Blank GMP and subscription fields are saved as 0, matching the backend’s numeric defaults. Subscription values are ratios, not percentages.</p>
    {error && <p className="ipo-error" role="alert">{error}</p>}
    <button className="ipo-button ipo-button--primary" type="submit" disabled={!enabled || busy}>{busy ? 'Saving…' : record ? 'Save changes' : 'Create IPO'}</button>
  </form>;
}
