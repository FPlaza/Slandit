import React from 'react';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ open, title = 'Confirmar', message = '', onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 2000 }}>
      <div style={{ width: 520, background: 'var(--card-bg)', padding: 18, borderRadius: 10, border: 'var(--card-border-width) solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
        <p style={{ margin: '0 0 12px', color: 'var(--muted-text)' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="icon-btn" onClick={onCancel} style={{ padding: '8px 12px', borderRadius: 8 }}>Cancelar</button>
          <button className="icon-btn" onClick={onConfirm} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--danger)', color: '#fff' }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
