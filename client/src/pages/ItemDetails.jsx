import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Tag,
  User,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowLeft,
  Send,
  Lock,
  CheckCircle2,
  X,
} from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [report, setReport] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [userClaim, setUserClaim] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [privateVerificationDetails, setPrivateVerificationDetails] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');
  const [claimErrorMsg, setClaimErrorMsg] = useState('');

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/reports/${id}`);
      if (res.data.success) {
        setReport(res.data.report);
        setIsOwner(res.data.isOwner);
        setUserClaim(res.data.userClaim);

        // Fetch potential matches if user is authenticated
        if (isAuthenticated) {
          api
            .get(`/reports/${id}/matches`)
            .then((mRes) => {
              if (mRes.data.success) {
                setMatches(mRes.data.matches || []);
              }
            })
            .catch(() => {});
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load item report details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [id, isAuthenticated]);

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setClaimErrorMsg('');
    setClaimSuccessMsg('');

    if (claimMessage.trim().length < 10) {
      setClaimErrorMsg('Please provide an explanation of at least 10 characters.');
      return;
    }

    try {
      setClaimSubmitting(true);
      const res = await api.post('/claims', {
        reportId: id,
        claimMessage: claimMessage.trim(),
        privateVerificationDetails: privateVerificationDetails.trim(),
      });

      if (res.data.success) {
        setClaimSuccessMsg('Your claim has been submitted! The reporter has been notified to review your evidence.');
        setUserClaim(res.data.claim);
        setTimeout(() => {
          setClaimModalOpen(false);
          fetchReportData();
        }, 2000);
      }
    } catch (err) {
      setClaimErrorMsg(err.response?.data?.message || 'Failed to submit claim. Please try again.');
    } finally {
      setClaimSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving report details..." />;
  }

  if (error || !report) {
    return (
      <div className="section">
        <div className="container container-narrow">
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <AlertCircle size={48} style={{ color: 'var(--status-danger)', margin: '0 auto 1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Report Unavailable</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {error || 'The requested item report could not be found or has been removed.'}
            </p>
            <Link to="/browse" className="btn btn-primary">
              <ArrowLeft size={16} />
              Return to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(report.dateOccurred).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedReportedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex' }}
          >
            <ArrowLeft size={16} />
            Back to listings
          </button>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid-3" style={{ gap: '2rem', alignItems: 'start' }}>
          {/* Left Column (2 spans): Image & Detailed Overview */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Main Item Card */}
            <div className="card">
              {/* Photo Display */}
              {report.imageUrl && (
                <div style={{ height: '360px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div className="card-body" style={{ padding: '2rem' }}>
                {/* Badges Bar */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <StatusBadge type="reportType" status={report.reportType} />
                  <StatusBadge type="itemStatus" status={report.status} />
                  <span className="badge badge-category">
                    <Tag size={12} />
                    {report.category}
                  </span>
                </div>

                {/* Title */}
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
                  {report.title}
                </h1>

                {/* Description */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Description</h3>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                    {report.description}
                  </p>
                </div>

                {/* Identifying details if owner */}
                {isOwner && report.identifyingDetails && (
                  <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                    <Lock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
                        Your Confidential Identifying Details (Private to You)
                      </strong>
                      <span>{report.identifyingDetails}</span>
                    </div>
                  </div>
                )}

                {/* Metadata Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Location
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontWeight: 600 }}>
                      <MapPin size={16} style={{ color: 'var(--primary-500)' }} />
                      <span>{report.approximateLocation}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {report.reportType === 'lost' ? 'Date Lost' : 'Date Found'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontWeight: 600 }}>
                      <Calendar size={16} style={{ color: 'var(--primary-500)' }} />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Reported On
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontWeight: 600 }}>
                      <Clock size={16} style={{ color: 'var(--primary-500)' }} />
                      <span>{formattedReportedDate}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Reporter Community
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontWeight: 600 }}>
                      <User size={16} style={{ color: 'var(--primary-500)' }} />
                      <span>{report.reporterId?.institution || 'Campus Community'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Matches Section */}
            {isAuthenticated && matches.length > 0 && (
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-100)',
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Smart Algorithm Matches</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      Possible matching reports based on keywords, category, and date proximity.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {matches.map((m) => (
                    <div
                      key={m.report._id}
                      style={{
                        padding: '1rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span
                            className="badge badge-found"
                            style={{ backgroundColor: 'var(--accent-teal-light)', color: 'var(--accent-teal)' }}
                          >
                            {m.matchScore}% Match
                          </span>
                          <span className="badge badge-category">{m.report.category}</span>
                        </div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{m.report.title}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {m.matchReasons.map((r, i) => (
                            <span key={i} style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link to={`/items/${m.report._id}`} className="btn btn-outline btn-sm">
                        View Match
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (1 span): Action Sidebar & Safety Guidance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Claim / Action Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Take Action</h3>

              {/* Status Message */}
              {report.status === 'returned' ? (
                <div className="alert alert-success">
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Item Returned</strong>
                    <p style={{ fontSize: '0.825rem', margin: 0 }}>
                      This item has been successfully verified and returned to its rightful owner.
                    </p>
                  </div>
                </div>
              ) : isOwner ? (
                <div>
                  <div className="alert alert-info">
                    <User size={18} style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>
                      You created this report. You can review incoming claims and track updates in your dashboard.
                    </p>
                  </div>
                  <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                    Open Dashboard
                  </Link>
                </div>
              ) : userClaim ? (
                <div>
                  <div className="alert alert-info">
                    <Clock size={18} style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block' }}>Claim Status: {userClaim.status.toUpperCase()}</strong>
                      <span style={{ fontSize: '0.825rem' }}>
                        Your claim has been submitted. Check your dashboard for finder review and handover instructions.
                      </span>
                    </div>
                  </div>
                  <Link to="/dashboard" className="btn btn-outline" style={{ width: '100%' }}>
                    Track in Dashboard
                  </Link>
                </div>
              ) : !isAuthenticated ? (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Believe this item is yours? Sign in or create an account to submit an ownership verification claim.
                  </p>
                  <Link to="/login" state={{ from: `/items/${id}` }} className="btn btn-primary" style={{ width: '100%' }}>
                    Sign In to Submit Claim
                  </Link>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    {report.reportType === 'found'
                      ? 'Are you the rightful owner of this found belonging? Submit a claim with proof of ownership.'
                      : 'Did you find this missing item? Connect with the owner through our verified claim process.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(true)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Send size={16} />
                    {report.reportType === 'found' ? 'Claim This Item' : 'I Found This Item'}
                  </button>
                </div>
              )}
            </div>

            {/* Safe Handover Guidance Card */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--status-returned)' }} />
                <h4 style={{ fontSize: '1rem', margin: 0 }}>Safe Handover Protocol</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--status-returned)', marginTop: '2px', flexShrink: 0 }} />
                  <span>Never send money or gift cards for courier delivery.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--status-returned)', marginTop: '2px', flexShrink: 0 }} />
                  <span>Meet at the Central Library desk or Campus Security Office.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--status-returned)', marginTop: '2px', flexShrink: 0 }} />
                  <span>Verify item passcode, serial number, or initials in person.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Submission Modal */}
      {claimModalOpen && (
        <div className="modal-overlay" onClick={() => setClaimModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Submit Ownership Claim</h3>
              <button
                type="button"
                onClick={() => setClaimModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitClaim}>
              <div className="modal-body">
                {claimErrorMsg && <div className="alert alert-danger">{claimErrorMsg}</div>}
                {claimSuccessMsg && <div className="alert alert-success">{claimSuccessMsg}</div>}

                <div className="form-group">
                  <label className="form-label">
                    Explanation & Circumstances <span style={{ color: 'var(--status-danger)' }}>*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe how and where you lost this item, or when you last had it..."
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    required
                  ></textarea>
                  <p className="form-hint">Minimum 10 characters required.</p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Private Identifying Details (Confidential)
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Provide specific marks, engraved initials, screen wallpaper, case scratches, or serial identifiers..."
                    value={privateVerificationDetails}
                    onChange={(e) => setPrivateVerificationDetails(e.target.value)}
                  ></textarea>
                  <p className="form-hint" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Lock size={12} />
                    Only visible to the finder and campus administrators for ownership verification.
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setClaimModalOpen(false)}
                  disabled={claimSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={claimSubmitting}
                >
                  {claimSubmitting ? <span className="spinner"></span> : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
