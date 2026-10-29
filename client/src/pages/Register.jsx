import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Compass, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone.trim(),
        institution: institution.trim() || 'Campus Community',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ maxWidth: '520px' }}>
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
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Join your campus community on LostLink to report and recover belongings.
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
              <label className="form-label">
                Full Name <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Campus or Personal Email <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="jane.doe@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="form-hint">Used for secure account sign in and verification notices.</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="form-hint">Never shown publicly.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Campus / Department</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Science & Computing"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : <><UserPlus size={18} /> Register Account</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
