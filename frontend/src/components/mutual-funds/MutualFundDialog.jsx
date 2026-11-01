import IpoDialog from '../ipo/IpoDialog.jsx';

export default function MutualFundDialog({ title, variant, busy, onClose, children }) {
  return <IpoDialog title={title} variant={variant} busy={busy} onClose={onClose}>
    <div className="mf-dialog-content">{children}</div>
  </IpoDialog>;
}
