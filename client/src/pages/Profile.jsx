import React, { useState } from 'react';
import { User, Mail, Phone, Building, Calendar, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [institution, setInstitution] = useState(user?.institution || '');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (name.trim().length < 2) {
      setErrorMsg('Full name must be at least 2 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.put('/users/me', {
        name: name.trim(),
        phone: phone.trim(),
        institution: institution.trim(),
      });

      if (res.data.success) {
        updateUserProfile(res.data.user);
        setSuccessMsg('Your profile has been updated successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container container-narrow" style={{ maxWidth: '640px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage your personal profile information and campus contact preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          {successMsg && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Info Read-only Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.75rem',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{user?.name}</h3>
                  <span className="badge badge-found" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                    {user?.role}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Member since {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="form-group">
              <label className="form-label">Email Address (Account Identifier)</label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: 'var(--bg-subtle)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
              />
              <p className="form-hint">Email address cannot be changed directly for account security.</p>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+1 (555) 012-3456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="form-hint">Used strictly for authorized handover coordination. Never shown publicly.</p>
            </div>

            {/* Institution / Department */}
            <div className="form-group">
              <label className="form-label">Campus Department or Hostel</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. School of Engineering, Hostel Block C"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
