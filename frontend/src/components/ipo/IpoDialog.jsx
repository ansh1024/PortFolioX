import { useEffect, useId, useRef } from 'react';
import LayoutIcon from '../layout/LayoutIcon.jsx';
export default function IpoDialog({ title, onClose, busy, children, variant }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      queueMicrotask(() => { if (opener?.isConnected) opener.focus(); });
    };
  }, []);
  useEffect(() => {
    ref.current.querySelector('button')?.focus();
  }, [title]);
  return <dialog className={`ipo-dialog${variant === 'drawer' ? ' ipo-dialog--drawer' : ''}`} ref={ref} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} onClick={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <div className="ipo-dialog__inner"><header><h2 id={titleId}>{title}</h2><button className="ipo-icon-button" onClick={onClose} disabled={busy} aria-label="Close dialog"><LayoutIcon name="close" /></button></header>{children}</div>
  </dialog>;
}
