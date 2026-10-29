import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Compass, AlertCircle, Key, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill credentials for demo testing
  const quickFill = (testEmail, testPass) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError('');
  };

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary-900)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Compass size={28} style={{ color: 'var(--primary-400)' }} />
          </div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Sign in to manage your campus reports and track active claims.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Campus Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          {/* Quick Demo Test Accounts Box */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              <UserCheck size={14} />
              <span>1-CLICK DEMO ACCOUNTS</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => quickFill('admin@lostlink.edu', 'Admin@LostLink2026!')}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => quickFill('moderator@lostlink.edu', 'Moderator@LostLink2026!')}
              >
                Moderator
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => quickFill('alex.rivera@campus.edu', 'Student@LostLink2026!')}
              >
                Alex (Student)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={() => quickFill('priya.sharma@campus.edu', 'Student@LostLink2026!')}
              >
                Priya (Finder)
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Do not have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
