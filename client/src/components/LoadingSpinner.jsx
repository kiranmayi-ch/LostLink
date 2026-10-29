import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '1rem',
        }}
      >
        <div className="spinner spinner-primary" style={{ width: '40px', height: '40px', borderWidth: '3.5px' }}></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>{text}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '2rem' }}>
      <div className="spinner spinner-primary"></div>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</span>
    </div>
  );
};

export default LoadingSpinner;
