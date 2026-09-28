import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
        color: '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        fontWeight: 600,
        fontSize: '0.95rem',
      }}
      className="animate-fade-in"
    >
      {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          padding: '2px',
          marginLeft: '0.5rem',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
