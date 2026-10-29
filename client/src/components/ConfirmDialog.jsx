import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: confirmVariant === 'danger' ? 'var(--status-danger-bg)' : 'var(--primary-100)',
                color: confirmVariant === 'danger' ? 'var(--status-danger)' : 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
          </div>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{message}</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline btn-sm" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-${confirmVariant} btn-sm`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
