import { Link, useOutletContext } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.jsx';

export default function LoginPage() {
  const { onActivity } = useOutletContext();
  return <section className="auth-card" aria-labelledby="login-title">
    <span className="auth-eyebrow">YOUR INVESTMENT WORKSPACE</span>
    <h1 id="login-title">Welcome back<span>.</span></h1>
    <p className="auth-card__intro">A clearer perspective starts here.<br />Sign in to your PortFolioX workspace.</p>
    <p className="auth-required-note">All fields are required.</p>
    <LoginForm onActivity={onActivity} />
    <p className="auth-register-link">New to PortFolioX? <Link to="/register">Create an account <span aria-hidden="true">↗</span></Link></p>
    <p className="auth-preview-note"><span aria-hidden="true" />UI preview · Sign-in is not connected yet.</p>
  </section>;
}
