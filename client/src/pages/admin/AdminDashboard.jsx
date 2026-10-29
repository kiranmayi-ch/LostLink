import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  Inbox,
  History,
  CheckCircle2,
  AlertTriangle,
  Search,
  Eye,
  Ban,
  UserCheck,
  ShieldCheck,
  Flag,
  Archive,
} from 'lucide-react';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Pagination from '../../components/Pagination.jsx';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Users tab state
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  // Reports tab state
  const [reports, setReports] = useState([]);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotalPages, setReportsTotalPages] = useState(1);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Claims tab state
  const [claims, setClaims] = useState([]);
  const [claimsPage, setClaimsPage] = useState(1);
  const [claimsTotalPages, setClaimsTotalPages] = useState(1);
  const [claimsLoading, setClaimsLoading] = useState(false);

  // Audit Logs tab state
  const [auditLogs, setAuditLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Moderation action modal state
  const [modModalOpen, setModModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [moderationStatus, setModerationStatus] = useState('approved');
  const [reportStatus, setReportStatus] = useState('active');
  const [modNotes, setModNotes] = useState('');
  const [modSubmitting, setModSubmitting] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/admin');
      if (res.data.success) {
        setStats(res.data.stats);
        setAuditLogs(res.data.recentAuditLogs || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await api.get(`/admin/users?page=${usersPage}&search=${encodeURIComponent(userSearch)}`);
      if (res.data.success) {
        setUsers(res.data.users);
        setUsersTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      const res = await api.get(`/admin/reports?page=${reportsPage}`);
      if (res.data.success) {
        setReports(res.data.reports);
        setReportsTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load admin reports:', err);
    } finally {
      setReportsLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      setClaimsLoading(true);
      const res = await api.get(`/admin/claims?page=${claimsPage}`);
      if (res.data.success) {
        setClaims(res.data.claims);
        setClaimsTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load claims:', err);
    } finally {
      setClaimsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await api.get('/admin/audit-logs');
      if (res.data.success) {
        setAuditLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'reports') fetchReports();
    if (activeTab === 'claims') fetchClaims();
    if (activeTab === 'audit') fetchAuditLogs();
  }, [activeTab, usersPage, reportsPage, claimsPage]);

  const handleToggleUserStatus = async (userDoc) => {
    const nextStatus = userDoc.accountStatus === 'suspended' ? 'active' : 'suspended';
    const reason = prompt(
      `Please confirm ${nextStatus === 'suspended' ? 'suspending' : 'reactivating'} ${userDoc.name}:`,
      nextStatus === 'suspended' ? 'Policy violation' : 'Account restored'
    );
    if (reason === null) return;

    try {
      await api.patch(`/admin/users/${userDoc._id}/status`, {
        status: nextStatus,
        reason,
      });
      fetchUsers();
      fetchOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleModerationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      setModSubmitting(true);
      await api.patch(`/admin/reports/${selectedReport._id}/moderation`, {
        moderationStatus,
        status: reportStatus,
        notes: modNotes.trim(),
      });
      setModModalOpen(false);
      setSelectedReport(null);
      fetchReports();
      fetchOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to moderate report.');
    } finally {
      setModSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading administration portal..." />;
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <ShieldAlert size={26} style={{ color: 'var(--status-danger)' }} />
              <h1 style={{ fontSize: '2rem', margin: 0 }}>Campus Administration Portal</h1>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Moderation dashboard, user governance, dispute reviews, and verified audit logging.
            </p>
          </div>
        </div>

        {/* Real MongoDB Stats */}
        {stats && (
          <div className="grid-4" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Registered Users
              </span>
              <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0.25rem 0' }}>
                {stats.totalUsers}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campus accounts</span>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Reports
              </span>
              <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-600)', margin: '0.25rem 0' }}>
                {stats.activeReports}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {stats.totalLostReports} Lost • {stats.totalFoundReports} Found
              </span>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Claims
              </span>
              <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--status-pending)', margin: '0.25rem 0' }}>
                {stats.pendingClaims}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Under review or dispute</span>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Successfully Returned
              </span>
              <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--status-returned)', margin: '0.25rem 0' }}>
                {stats.returnedReports}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reunited belongings</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <ShieldCheck size={16} />
            Audit & Overview
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            User Management
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileText size={16} />
            Report Moderation
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('claims')}
          >
            <Inbox size={16} />
            Claims & Disputes
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <History size={16} />
            Audit Trail
          </button>
        </div>

        {/* Tab 1: Overview & Recent Audit */}
        {activeTab === 'overview' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Administrative Audit Trail</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Actor</th>
                    <th>Resource Type</th>
                    <th>Resource ID</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log._id}>
                      <td>
                        <span className="badge badge-category" style={{ fontWeight: 700 }}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <strong>{log.actorId?.name || 'System Admin'}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {log.actorId?.role}
                        </span>
                      </td>
                      <td>{log.resourceType}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.resourceId}</td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search user by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') fetchUsers(); }}
                  style={{ paddingLeft: '2.2rem' }}
                />
              </div>
              <button type="button" onClick={fetchUsers} className="btn btn-outline btn-sm">
                Search
              </button>
            </div>

            {usersLoading ? (
              <LoadingSpinner text="Loading users..." />
            ) : (
              <>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Institution</th>
                        <th>Account Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td style={{ fontWeight: 600 }}>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className="badge badge-category" style={{ textTransform: 'capitalize' }}>
                              {u.role}
                            </span>
                          </td>
                          <td>{u.institution}</td>
                          <td>
                            {u.accountStatus === 'suspended' ? (
                              <span className="badge badge-danger">Suspended</span>
                            ) : (
                              <span className="badge badge-approved">Active</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {u.role !== 'admin' && (
                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(u)}
                                className={`btn btn-sm ${u.accountStatus === 'suspended' ? 'btn-success' : 'btn-danger'}`}
                              >
                                {u.accountStatus === 'suspended' ? (
                                  <><UserCheck size={14} /> Reactivate</>
                                ) : (
                                  <><Ban size={14} /> Suspend</>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={usersPage}
                  totalPages={usersTotalPages}
                  onPageChange={(p) => setUsersPage(p)}
                />
              </>
            )}
          </div>
        )}

        {/* Tab 3: Report Moderation */}
        {activeTab === 'reports' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>All Campus Item Reports</h2>

            {reportsLoading ? (
              <LoadingSpinner text="Loading reports..." />
            ) : (
              <>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Reporter</th>
                        <th>Item Status</th>
                        <th>Moderation</th>
                        <th style={{ textAlign: 'right' }}>Moderate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r) => (
                        <tr key={r._id}>
                          <td style={{ fontWeight: 600 }}>{r.title}</td>
                          <td><StatusBadge type="reportType" status={r.reportType} /></td>
                          <td>{r.category}</td>
                          <td>{r.reporterId?.name} ({r.reporterId?.email})</td>
                          <td><StatusBadge type="itemStatus" status={r.status} /></td>
                          <td>
                            {r.moderationStatus === 'flagged' ? (
                              <span className="badge badge-pending">Flagged</span>
                            ) : r.moderationStatus === 'hidden' ? (
                              <span className="badge badge-danger">Hidden</span>
                            ) : (
                              <span className="badge badge-approved">Approved</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReport(r);
                                setModerationStatus(r.moderationStatus || 'approved');
                                setReportStatus(r.status || 'active');
                                setModNotes(r.moderationNotes || '');
                                setModModalOpen(true);
                              }}
                              className="btn btn-outline btn-sm"
                            >
                              Moderate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={reportsPage}
                  totalPages={reportsTotalPages}
                  onPageChange={(p) => setReportsPage(p)}
                />
              </>
            )}
          </div>
        )}

        {/* Tab 4: Claims & Disputes */}
        {activeTab === 'claims' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Platform Claims & Verification Records</h2>

            {claimsLoading ? (
              <LoadingSpinner text="Loading claims..." />
            ) : (
              <>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item Report</th>
                        <th>Claimant</th>
                        <th>Finder</th>
                        <th>Message</th>
                        <th>Claim Status</th>
                        <th>Handover</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((c) => (
                        <tr key={c._id}>
                          <td style={{ fontWeight: 600 }}>{c.reportId?.title}</td>
                          <td>{c.claimantId?.name} ({c.claimantId?.email})</td>
                          <td>{c.finderId?.name} ({c.finderId?.email})</td>
                          <td style={{ maxWidth: '240px', fontSize: '0.85rem' }}>{c.claimMessage}</td>
                          <td><StatusBadge type="claimStatus" status={c.status} /></td>
                          <td><StatusBadge type="handoverStatus" status={c.handoverStatus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={claimsPage}
                  totalPages={claimsTotalPages}
                  onPageChange={(p) => setClaimsPage(p)}
                />
              </>
            )}
          </div>
        )}

        {/* Tab 5: Detailed Audit Log */}
        {activeTab === 'audit' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Complete System Audit Trail</h2>
            {logsLoading ? (
              <LoadingSpinner text="Fetching audit logs..." />
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Admin Actor</th>
                      <th>Resource Type</th>
                      <th>Resource ID</th>
                      <th>Metadata / Notes</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log._id}>
                        <td>
                          <span className="badge badge-category" style={{ fontWeight: 700 }}>
                            {log.action}
                          </span>
                        </td>
                        <td>
                          <strong>{log.actorId?.name || 'Administrator'}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {log.actorId?.email}
                          </span>
                        </td>
                        <td>{log.resourceType}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.resourceId}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '220px' }}>
                          {JSON.stringify(log.metadata || {})}
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Moderation Modal */}
      {modModalOpen && selectedReport && (
        <div className="modal-overlay" onClick={() => setModModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Moderate Report: {selectedReport.title}</h3>
              <button
                type="button"
                onClick={() => setModModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModerationSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Moderation Status</label>
                  <select
                    className="form-select"
                    value={moderationStatus}
                    onChange={(e) => setModerationStatus(e.target.value)}
                  >
                    <option value="approved">Approved (Publicly Visible)</option>
                    <option value="flagged">Flagged (Mark for Review)</option>
                    <option value="hidden">Hidden (Violates Guidelines / Inappropriate)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Item Report Status</label>
                  <select
                    className="form-select"
                    value={reportStatus}
                    onChange={(e) => setReportStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived / Withdrawn</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Moderation Notes / Audit Reason</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Document rationale for moderation action..."
                    value={modNotes}
                    onChange={(e) => setModNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setModModalOpen(false)}
                  disabled={modSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={modSubmitting}
                >
                  {modSubmitting ? <span className="spinner"></span> : 'Save Moderation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
