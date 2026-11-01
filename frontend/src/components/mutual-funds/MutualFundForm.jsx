import { useId, useState } from 'react';
import { initial, validate, payload, categories, periods } from '../../features/mutual-funds/mutualFundModel.js';

const identity = [['fundId', 'Fund ID'], ['fundName', 'Scheme name'], ['amc', 'Fund house / AMC'], ['category', 'Category']];
const snapshot = [['nav', 'NAV (recorded)'], ['aum', 'AUM (recorded units)']];
const required = ['fundId', 'fundName', 'amc', 'category', 'aum'];

export default function MutualFundForm({ record, enabled, busy, onSubmit, onCancel, onDirtyChange, error, serverFields = {} }) {
  const [original] = useState(() => initial(record));
  const [values, setValues] = useState(original);
  const [errors, setErrors] = useState({});
  const id = useId();
  function change(key, value) {
    const next = { ...values, [key]: value };
    setValues(next);
    onDirtyChange?.(Object.keys(original).some(field => String(next[field]) !== String(original[field])));
  }
  function submit(event) {
    event.preventDefault();
    if (busy || !enabled) return;
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length) { document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus(); return; }
    onSubmit(payload(values));
  }
  function field([key, name]) {
    const message = errors[key] || serverFields[key];
    const props = { id: `${id}-${key}`, value: values[key], 'aria-invalid': !!message,
      'aria-describedby': message ? `${id}-${key}-error` : undefined, onChange: event => change(key, event.target.value) };
    return <div className="ipo-field" key={key}><label htmlFor={props.id}>{name}{required.includes(key) && <span className="mf-required"> *</span>}</label>
      {key === 'category' ? <select {...props}><option value="">Select category</option>{categories.map(category => <option key={category}>{category}</option>)}</select>
        : <input {...props} readOnly={key === 'fundId' && !!record} type={['fundId', 'fundName', 'amc'].includes(key) ? 'text' : 'number'} step={key === 'aum' ? '1' : 'any'} maxLength={255} />}
      {key === 'fundId' && <small className="mf-field-help">{record ? 'Fund ID stays fixed when editing.' : 'Use the unique ID for this catalogue record.'}</small>}
      {message && <span id={`${id}-${key}-error`} className="ipo-field__error">{message}</span>}
    </div>;
  }
  return <form className="mf-form" onSubmit={submit} noValidate>
    <p className="mf-form-intro">{record ? 'Update the source record. All editable fields are saved together.' : 'Add a scheme to the research catalogue. This does not place an investment.'} <span>* Required</span></p>
    {error && <p className="mf-alert mf-alert--error" role="alert">{error}</p>}
    <fieldset disabled={busy}><legend><span>01</span> Scheme identity</legend><p>Identify the scheme and the institution behind it.</p><div className="mf-form-grid">{identity.map(field)}</div></fieldset>
    <fieldset disabled={busy}><legend><span>02</span> Recorded snapshot</legend><p>Values are stored as supplied. The API does not define currency, AUM scale or an as-of date.</p><div className="mf-form-grid">{snapshot.map(field)}</div></fieldset>
    <fieldset disabled={busy}><legend><span>03</span> Recorded returns <small>Optional</small></legend><p>Enter only figures you can verify. Leave unavailable periods blank.</p><div className="mf-form-grid mf-form-grid--returns">{periods.map(([key, name]) => field([key, `${name} return (%)`]))}</div></fieldset>
    {!enabled && <p className="mf-muted">Saving requires a connected administrator account.</p>}
    <footer className="mf-form-footer"><button type="button" className="ipo-button" disabled={busy} onClick={onCancel}>Cancel</button><button className="ipo-button ipo-button--primary" disabled={!enabled || busy} aria-busy={busy}>{busy ? 'Saving…' : record ? 'Save changes' : 'Create fund'}</button></footer>
  </form>;
}
