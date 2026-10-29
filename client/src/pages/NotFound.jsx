import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      className="section"
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div className="container container-narrow" style={{ maxWidth: '480px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Compass size={36} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          It looks like this link is lost too! The page you were searching for might have been moved, renamed, or withdrawn.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            Back to Homepage
          </Link>
          <Link to="/browse" className="btn btn-outline">
            Browse Items
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
