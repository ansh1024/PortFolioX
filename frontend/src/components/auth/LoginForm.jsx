import { useEffect, useRef, useState } from 'react';
import { validateLogin } from './loginValidation.js';

function PasswordIcon({ visible }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{visible && <path d="m3 3 18 18" />}</svg>;
}

// Loading and server-error props are ready for a later API-integration step.
export default function LoginForm({ onSubmit, isSubmitting = false, authError = '', onActivity }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [visible, setVisible] = useState(false);
  const [notice, setNotice] = useState('');
  const [focused, setFocused] = useState(null);
  const [exchangeId, setExchangeId] = useState(0);
  const [rejectionId, setRejectionId] = useState(0);
  const previousField = useRef(null);
  const hasPassword = Boolean(values.password);
  const errors = validateLogin(values);
  const hasError = Boolean(authError || (touched.email && errors.email) || (touched.password && errors.password));
  useEffect(() => {
    onActivity?.({ field: focused, passwordVisible: visible, hasPassword, hasError, exchangeId, rejectionId });
  }, [onActivity, focused, visible, hasPassword, hasError, exchangeId, rejectionId]);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  function focus(event) {
    const field = event.target.name;
    if (field !== 'email' && field !== 'password') return;
    if (previousField.current && previousField.current !== field && values[previousField.current].trim()) setExchangeId(value => value + 1);
    previousField.current = field;
    setFocused(field);
  }
  function blur(field) {
    setTouched(previous => ({ ...previous, [field]: true }));
    if (errors[field] && values[field]) setRejectionId(value => value + 1);
  }
  function change(event) {
    const { name, value } = event.target;
    setValues(previous => ({ ...previous, [name]: value }));
    setNotice('');
  }
  function submit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setTouched({ email: true, password: true });
    setNotice('');
    if (errors.email || errors.password) {
      setRejectionId(value => value + 1);
      (errors.email ? emailInput : passwordInput).current?.focus();
      return;
    }
    if (onSubmit) onSubmit({ email: values.email.trim(), password: values.password });
    else setNotice('Sign-in isn’t connected yet. Your details haven’t been sent.');
  }
  return <form className="auth-form" onSubmit={submit} noValidate aria-label="Sign in" aria-busy={isSubmitting} onFocusCapture={focus} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); }}>
    <div className="auth-server-error" role="alert" aria-live="assertive">{authError}</div>
    <div className="auth-field">
      <label htmlFor="login-email">Email address <span aria-hidden="true">*</span></label>
      <input ref={emailInput} id="login-email" name="email" type="email" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck={false} value={values.email} onChange={change} onBlur={() => blur('email')} required disabled={isSubmitting} placeholder="you@example.com" aria-invalid={Boolean(touched.email && errors.email)} aria-describedby={touched.email && errors.email ? 'login-email-error' : undefined} />
      {touched.email && errors.email && <p className="auth-field-error" id="login-email-error">{errors.email}</p>}
    </div>
    <div className="auth-field">
      <label htmlFor="login-password">Password <span aria-hidden="true">*</span></label>
      <div className="auth-password">
        <input ref={passwordInput} id="login-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" value={values.password} onChange={change} onBlur={() => blur('password')} required disabled={isSubmitting} placeholder="Enter your password" aria-invalid={Boolean(touched.password && errors.password)} aria-describedby={touched.password && errors.password ? 'login-password-error' : undefined} />
        <button type="button" className="auth-password-toggle" onClick={() => setVisible(value => !value)} aria-label={visible ? 'Hide password' : 'Show password'} aria-controls="login-password" aria-pressed={visible} disabled={isSubmitting}><PasswordIcon visible={visible} /><span>{visible ? 'Hide' : 'Show'}</span></button>
      </div>
      {touched.password && errors.password && <p className="auth-field-error" id="login-password-error">{errors.password}</p>}
    </div>
    <button type="submit" className="auth-submit" disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? <><span className="auth-spinner" aria-hidden="true" />Signing in…</> : <>Sign in <span aria-hidden="true">↗</span></>}</button>
    <div className="auth-form-notice" role="status" aria-live="polite">{notice}</div>
  </form>;
}
