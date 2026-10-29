import React from 'react';
import { Tag, Clock, CheckCircle2, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';

export const StatusBadge = ({ type, status, className = '' }) => {
  // Report Type (Lost vs Found)
  if (type === 'reportType') {
    if (status === 'lost') {
      return (
        <span className={`badge badge-lost ${className}`}>
          <AlertCircle size={12} />
          Lost
        </span>
      );
    }
    return (
      <span className={`badge badge-found ${className}`}>
        <Tag size={12} />
        Found
      </span>
    );
  }

  // Item Status
  if (type === 'itemStatus') {
    switch (status) {
      case 'active':
        return (
          <span className={`badge badge-pending ${className}`}>
            <Clock size={12} />
            Active
          </span>
        );
      case 'under_claim':
        return (
          <span className={`badge badge-found ${className}`}>
            <Clock size={12} />
            Under Claim
          </span>
        );
      case 'returned':
        return (
          <span className={`badge badge-returned ${className}`}>
            <CheckCircle2 size={12} />
            Returned
          </span>
        );
      case 'archived':
        return (
          <span className={`badge badge-category ${className}`}>
            Archived
          </span>
        );
      case 'hidden':
        return (
          <span className={`badge badge-danger ${className}`}>
            Hidden
          </span>
        );
      default:
        return <span className={`badge badge-category ${className}`}>{status}</span>;
    }
  }

  // Claim Status
  if (type === 'claimStatus') {
    switch (status) {
      case 'pending':
        return (
          <span className={`badge badge-pending ${className}`}>
            <Clock size={12} />
            Pending Review
          </span>
        );
      case 'under_review':
        return (
          <span className={`badge badge-found ${className}`}>
            <Clock size={12} />
            Under Review
          </span>
        );
      case 'approved':
        return (
          <span className={`badge badge-approved ${className}`}>
            <ShieldCheck size={12} />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className={`badge badge-danger ${className}`}>
            <XCircle size={12} />
            Rejected
          </span>
        );
      case 'cancelled':
        return (
          <span className={`badge badge-category ${className}`}>
            Withdrawn
          </span>
        );
      default:
        return <span className={`badge badge-category ${className}`}>{status}</span>;
    }
  }

  // Handover Status
  if (type === 'handoverStatus') {
    switch (status) {
      case 'scheduled':
        return (
          <span className={`badge badge-found ${className}`}>
            <Clock size={12} />
            Handover Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className={`badge badge-returned ${className}`}>
            <CheckCircle2 size={12} />
            Handover Completed
          </span>
        );
      default:
        return null;
    }
  }

  return <span className={`badge badge-category ${className}`}>{status}</span>;
};

export default StatusBadge;
