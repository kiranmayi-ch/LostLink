import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertCircle,
  Tag,
  Clock,
  CheckCircle2,
  Sparkles,
  Inbox,
  ArrowRight,
  Trash2,
  Edit,
  ShieldCheck,
  XCircle,
  Eye,
  Calendar,
  MapPin,
} from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

export const UserDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [lostReports, setLostReports] = useState([]);
  const [foundReports, setFoundReports] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [returnedReports, setReturnedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Withdraw report modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Review Claim modal state (for finder reviewing received claims)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Handover modal state
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [handoverLocation, setHandoverLocation] = useState('Central Library Circulation Desk');
  const [handoverDate, setHandoverDate] = useState('');
  const [handoverNotes, setHandoverNotes] = useState('');
  const [handoverStatus, setHandoverStatus] = useState('completed');
  const [handoverLoading, setHandoverLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, myReportsRes, claimsRes, receivedRes] = await Promise.all([
        api.get('/dashboard/user'),
        api.get('/reports/mine'),
        api.get('/claims/mine'),
        api.get('/claims/received'),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
      }

      if (myReportsRes.data.success) {
        const allMy = myReportsRes.data.reports || [];
        setLostReports(allMy.filter((r) => r.reportType === 'lost' && r.status !== 'archived'));
        setFoundReports(allMy.filter((r) => r.reportType === 'found' && r.status !== 'archived'));
        setReturnedReports(allMy.filter((r) => r.status === 'returned'));
      }

      if (claimsRes.data.success) {
        setMyClaims(claimsRes.data.claims || []);
      }

      if (receivedRes.data.success) {
        setReceivedClaims(receivedRes.data.claims || []);
      }
    } catch (err) {
      console.error('Failed to load user dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleWithdrawReport = async () => {
    if (!reportToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/reports/${reportToDelete._id}`);
      setDeleteModalOpen(false);
      setReportToDelete(null);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw report.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClaim) return;
    try {
      setReviewLoading(true);
      setReviewError('');
      await api.patch(`/claims/${selectedClaim._id}/status`, {
        status: reviewStatus,
        reviewNotes: reviewNotes.trim(),
      });
      setReviewModalOpen(false);
      setSelectedClaim(null);
      setReviewNotes('');
      fetchDashboardData();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to update claim review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleHandoverSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClaim) return;
    try {
      setHandoverLoading(true);
      await api.patch(`/claims/${selectedClaim._id}/handover`, {
        handoverStatus,
        location: handoverLocation.trim(),
        scheduledDate: handoverDate || undefined,
        notes: handoverNotes.trim(),
      });
      setHandoverModalOpen(false);
      setSelectedClaim(null);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update handover status.');
    } finally {
      setHandoverLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading your campus activity..." />;
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div
          className="card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #0b192c 0%, #1e3e62 100%)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--primary-400)',
                  marginBottom: '0.5rem',
                }}
              >
                Campus Member Dashboard
              </span>
              <h1 style={{ color: '#ffffff', fontSize: '1.85rem', marginBottom: '0.35rem' }}>
                Welcome back, {user?.name}!
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', margin: 0 }}>
                {user?.institution || 'Campus Community'} • Track your reported items, verify claims, and coordinate safe returns.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/report-lost" className="btn btn-primary btn-sm">
                Report Lost Item
              </Link>
              <Link
                to="/report-found"
                className="btn btn-outline btn-sm"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
              >
                Report Found Item
              </Link>
            </div>
          </div>
        </div>

        {/* Real MongoDB Stats Cards */}
        {stats && (
          <div className="grid-4" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                My Lost Reports
              </span>
              <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0.25rem 0' }}>
                {stats.totalLost}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered lost items</span>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                My Found Reports
              </span>
              <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-teal)', margin: '0.25rem 0' }}>
                {stats.totalFound}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Items waiting for owners</span>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Claims to Review
              </span>
              <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--status-pending)', margin: '0.25rem 0' }}>
                {stats.receivedPendingClaimsCount}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Awaiting your decision</span>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Successfully Reunited
              </span>
              <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--status-returned)', margin: '0.25rem 0' }}>
                {stats.returnedItems}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Items returned safely</span>
            </div>
          </div>
        )}

        {/* Dashboard Tabs Header */}
        <div className="tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={16} />
            Overview
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'lost' ? 'active' : ''}`}
            onClick={() => setActiveTab('lost')}
          >
            <AlertCircle size={16} />
            My Lost Items
            <span className="tab-count">{lostReports.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'found' ? 'active' : ''}`}
            onClick={() => setActiveTab('found')}
          >
            <Tag size={16} />
            My Found Items
            <span className="tab-count">{foundReports.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'received_claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('received_claims')}
          >
            <Inbox size={16} />
            Claims Received
            <span className="tab-count">{receivedClaims.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'my_claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('my_claims')}
          >
            <ShieldCheck size={16} />
            My Claims
            <span className="tab-count">{myClaims.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'returned' ? 'active' : ''}`}
            onClick={() => setActiveTab('returned')}
          >
            <CheckCircle2 size={16} />
            Returned History
            <span className="tab-count">{returnedReports.length}</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Actions & Recent Lost items */}
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Active Lost Reports</h3>
                  <Link to="/report-lost" className="btn btn-outline btn-sm">
                    Report New
                  </Link>
                </div>
                <div className="card-body" style={{ padding: '1rem' }}>
                  {lostReports.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
                      You haven't reported any lost items.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {lostReports.slice(0, 4).map((r) => (
                        <div
                          key={r._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-subtle)',
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{r.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {r.category} • {r.approximateLocation}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <StatusBadge type="itemStatus" status={r.status} />
                            <Link to={`/items/${r._id}`} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                              <Eye size={14} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Claims Received Pending Review */}
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Incoming Claims Requiring Review</h3>
                  <span className="badge badge-pending">{receivedClaims.filter(c => c.status === 'pending').length} pending</span>
                </div>
                <div className="card-body" style={{ padding: '1rem' }}>
                  {receivedClaims.filter(c => c.status === 'pending').length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
                      No pending claims waiting for your review.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {receivedClaims.filter(c => c.status === 'pending').slice(0, 4).map((c) => (
                        <div
                          key={c._id}
                          style={{
                            padding: '0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-subtle)',
                            borderLeft: '4px solid var(--status-pending)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{c.reportId?.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              From {c.claimantId?.name}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            "{c.claimMessage.slice(0, 80)}..."
                          </p>
                          <button
                            type="button"
                            onClick={() => { setSelectedClaim(c); setReviewModalOpen(true); }}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                          >
                            Review Evidence
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Lost Items */}
        {activeTab === 'lost' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>My Reported Lost Items</h2>
              <Link to="/report-lost" className="btn btn-primary btn-sm">
                + Report Another Item
              </Link>
            </div>

            {lostReports.length === 0 ? (
              <div className="empty-state">
                <AlertCircle size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
                <h3>No lost items reported</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  If you misplaced something on campus, report it now to search for matches.
                </p>
                <Link to="/report-lost" className="btn btn-primary btn-sm">
                  Report a Lost Item
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Date Lost</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lostReports.map((r) => (
                      <tr key={r._id}>
                        <td style={{ fontWeight: 600 }}>{r.title}</td>
                        <td>{r.category}</td>
                        <td>{r.approximateLocation}</td>
                        <td>{new Date(r.dateOccurred).toLocaleDateString()}</td>
                        <td><StatusBadge type="itemStatus" status={r.status} /></td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <Link to={`/items/${r._id}`} className="btn btn-outline btn-sm" title="View details">
                              <Eye size={14} />
                            </Link>
                            {r.status !== 'returned' && (
                              <button
                                type="button"
                                onClick={() => { setReportToDelete(r); setDeleteModalOpen(true); }}
                                className="btn btn-danger btn-sm"
                                title="Withdraw report"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Found Items */}
        {activeTab === 'found' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>My Reported Found Items</h2>
              <Link to="/report-found" className="btn btn-primary btn-sm">
                + Report Found Item
              </Link>
            </div>

            {foundReports.length === 0 ? (
              <div className="empty-state">
                <Tag size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
                <h3>No found items reported</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Found an unattended phone, bag, or keys on campus? Help the owner by reporting it.
                </p>
                <Link to="/report-found" className="btn btn-primary btn-sm">
                  Report Found Item
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Location Found</th>
                      <th>Date Found</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foundReports.map((r) => (
                      <tr key={r._id}>
                        <td style={{ fontWeight: 600 }}>{r.title}</td>
                        <td>{r.category}</td>
                        <td>{r.approximateLocation}</td>
                        <td>{new Date(r.dateOccurred).toLocaleDateString()}</td>
                        <td><StatusBadge type="itemStatus" status={r.status} /></td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <Link to={`/items/${r._id}`} className="btn btn-outline btn-sm">
                              <Eye size={14} /> View
                            </Link>
                            {r.status !== 'returned' && (
                              <button
                                type="button"
                                onClick={() => { setReportToDelete(r); setDeleteModalOpen(true); }}
                                className="btn btn-danger btn-sm"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Claims Received (Finder Reviews Incoming Claims) */}
        {activeTab === 'received_claims' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Claims Received for Your Found Reports</h2>

            {receivedClaims.length === 0 ? (
              <div className="empty-state">
                <Inbox size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
                <h3>No claims received yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  When campus members identify an item you found, their ownership claim messages will appear here.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item Report</th>
                      <th>Claimant</th>
                      <th>Explanation</th>
                      <th>Status</th>
                      <th>Handover</th>
                      <th style={{ textAlign: 'right' }}>Review Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivedClaims.map((c) => (
                      <tr key={c._id}>
                        <td style={{ fontWeight: 600 }}>{c.reportId?.title}</td>
                        <td>
                          <div>
                            <strong>{c.claimantId?.name}</strong>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {c.claimantId?.institution || 'Campus Community'}
                            </span>
                          </div>
                        </td>
                        <td style={{ maxWidth: '280px' }}>
                          <span style={{ fontSize: '0.85rem' }}>{c.claimMessage}</span>
                          {c.privateVerificationDetails && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', marginTop: '0.2rem' }}>
                              Proof: {c.privateVerificationDetails}
                            </div>
                          )}
                        </td>
                        <td><StatusBadge type="claimStatus" status={c.status} /></td>
                        <td><StatusBadge type="handoverStatus" status={c.handoverStatus} /></td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => { setSelectedClaim(c); setReviewModalOpen(true); }}
                              className="btn btn-primary btn-sm"
                            >
                              Review
                            </button>
                            {c.status === 'approved' && (
                              <button
                                type="button"
                                onClick={() => { setSelectedClaim(c); setHandoverModalOpen(true); }}
                                className="btn btn-success btn-sm"
                              >
                                Handover
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: My Claims (User's Submitted Claims) */}
        {activeTab === 'my_claims' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Submitted Ownership Claims</h2>

            {myClaims.length === 0 ? (
              <div className="empty-state">
                <ShieldCheck size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
                <h3>No claims submitted</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Browse found belongings to identify missing items and submit ownership proof.
                </p>
                <Link to="/browse?type=found" className="btn btn-primary btn-sm">
                  Browse Found Items
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Found Item</th>
                      <th>Finder</th>
                      <th>My Claim Explanation</th>
                      <th>Status</th>
                      <th>Review Notes</th>
                      <th>Handover Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myClaims.map((c) => (
                      <tr key={c._id}>
                        <td style={{ fontWeight: 600 }}>
                          <Link to={`/items/${c.reportId?._id}`}>{c.reportId?.title}</Link>
                        </td>
                        <td>{c.finderId?.name}</td>
                        <td style={{ maxWidth: '280px', fontSize: '0.85rem' }}>{c.claimMessage}</td>
                        <td><StatusBadge type="claimStatus" status={c.status} /></td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {c.reviewNotes || 'Under initial review'}
                        </td>
                        <td><StatusBadge type="handoverStatus" status={c.handoverStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Returned History */}
        {activeTab === 'returned' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Successfully Returned Belongings</h2>

            {returnedReports.length === 0 ? (
              <div className="empty-state">
                <CheckCircle2 size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
                <h3>No returned items history yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  Items that are verified and completed through safe handovers will appear in your permanent return history.
                </p>
              </div>
            ) : (
              <div className="grid-3" style={{ gap: '1.5rem' }}>
                {returnedReports.map((r) => (
                  <div key={r._id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <StatusBadge type="reportType" status={r.reportType} />
                      <StatusBadge type="itemStatus" status="returned" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{r.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      {r.description}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--status-returned)', fontWeight: 600 }}>
                      ✓ Successfully reunited with verified owner
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Withdraw Report Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Withdraw Report"
        message={`Are you sure you want to withdraw "${reportToDelete?.title}"? The report will be safely archived.`}
        confirmText="Withdraw Report"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleWithdrawReport}
        onCancel={() => { setDeleteModalOpen(false); setReportToDelete(null); }}
      />

      {/* Review Claim Modal (Finder / Moderator) */}
      {reviewModalOpen && selectedClaim && (
        <div className="modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Review Ownership Claim</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="modal-body">
                {reviewError && <div className="alert alert-danger">{reviewError}</div>}

                <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Item Claimed</p>
                  <h4 style={{ fontSize: '1.05rem', margin: '0.2rem 0 0.5rem' }}>{selectedClaim.reportId?.title}</h4>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.2rem' }}>
                    <strong>Claimant:</strong> {selectedClaim.claimantId?.name} ({selectedClaim.claimantId?.institution})
                  </p>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>
                    <strong>Message:</strong> "{selectedClaim.claimMessage}"
                  </p>
                  {selectedClaim.privateVerificationDetails && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--primary-50)', borderRadius: '4px', fontSize: '0.825rem', color: 'var(--primary-700)' }}>
                      <strong>Claimant Provided Proof:</strong> {selectedClaim.privateVerificationDetails}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Review Decision</label>
                  <select
                    className="form-select"
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                  >
                    <option value="approved">Approve Claim (Valid Proof Provided)</option>
                    <option value="under_review">Put Under Review (Request More Details)</option>
                    <option value="rejected">Reject Claim (Insufficient Proof)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Notes to Claimant</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Provide comments or state why proof was accepted/rejected..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setReviewModalOpen(false)}
                  disabled={reviewLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={reviewLoading}
                >
                  {reviewLoading ? <span className="spinner"></span> : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Handover Modal */}
      {handoverModalOpen && selectedClaim && (
        <div className="modal-overlay" onClick={() => setHandoverModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Coordinate Handover</h3>
              <button
                type="button"
                onClick={() => setHandoverModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleHandoverSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Handover Status</label>
                  <select
                    className="form-select"
                    value={handoverStatus}
                    onChange={(e) => setHandoverStatus(e.target.value)}
                  >
                    <option value="scheduled">Schedule Handover Meeting</option>
                    <option value="completed">Mark Item Returned (Handover Complete)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Meeting Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={handoverLocation}
                    onChange={(e) => setHandoverLocation(e.target.value)}
                    required
                  />
                  <p className="form-hint">Designate a safe campus public area (e.g. Library desk, Campus security office).</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Scheduled Date / Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={handoverDate}
                    onChange={(e) => setHandoverDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Handover Instructions / Notes</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="e.g. Please bring your college student ID card for identity verification..."
                    value={handoverNotes}
                    onChange={(e) => setHandoverNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setHandoverModalOpen(false)}
                  disabled={handoverLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-sm"
                  disabled={handoverLoading}
                >
                  {handoverLoading ? <span className="spinner"></span> : 'Confirm Handover Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
