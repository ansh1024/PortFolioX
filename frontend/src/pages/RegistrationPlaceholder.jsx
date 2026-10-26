import { Link } from 'react-router-dom';
import LayoutIcon from '../components/layout/LayoutIcon.jsx';

export default function RegistrationPlaceholder() {
  return <section className="auth-card auth-registration" aria-labelledby="registration-title">
    <span className="auth-registration__icon"><LayoutIcon name="spark" size={30} /></span>
    <span className="auth-eyebrow">THE NEXT CHAPTER</span>
    <h1 id="registration-title">A little more<br />to come<span>.</span></h1>
    <p className="auth-card__intro">Account registration is coming in a later step. No account can be created from this preview yet.</p>
    <Link className="auth-submit" to="/login">Back to sign in <span aria-hidden="true">↗</span></Link>
  </section>;
}
