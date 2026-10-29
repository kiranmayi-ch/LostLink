import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Send,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      title: 'Report a Lost or Found Belonging',
      desc: 'Whether you misplaced your wireless earbuds or found an unattended student ID card in the dining hall, create a clear listing with category, approximate location, date, and general description.',
      icon: FileText,
      color: '#0284c7',
    },
    {
      num: 2,
      title: 'Smart Matching & Search',
      desc: 'Our rule-based engine computes keyword, category, location, and date proximity similarity between lost and found listings to suggest potential matches instantly.',
      icon: Search,
      color: '#0d9488',
    },
    {
      num: 3,
      title: 'Submit Verified Claim',
      desc: 'If you believe a found item belongs to you, submit an ownership claim. Provide private identifying details (such as stickers, engravings, or passcodes) not revealed publicly.',
      icon: Send,
      color: '#6366f1',
    },
    {
      num: 4,
      title: 'Finder Verification',
      desc: 'The finder reviews your claim message and private proof. If evidence matches the physical item, the finder approves the claim. Competing false claims are rejected.',
      icon: ShieldCheck,
      color: '#d97706',
    },
    {
      num: 5,
      title: 'Coordinate Safe Campus Handover',
      desc: 'Once approved, arrange a secure exchange at designated campus safe zones (e.g. Central Library Circulation Desk or Campus Security Office).',
      icon: MapPin,
      color: '#ec4899',
    },
    {
      num: 6,
      title: 'Mark Item Returned & Audit',
      desc: 'After the physical item is back with its rightful owner, confirm the return in the platform. The listing is archived in the successful return audit history.',
      icon: CheckCircle2,
      color: '#10b981',
    },
  ];

  return (
    <div>
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0b192c 0%, #1e3e62 100%)',
          color: '#ffffff',
          padding: '4rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container container-narrow">
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--primary-400)',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            Step-by-Step Guide
          </span>
          <h1 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '1rem' }}>
            The LostLink Recovery Workflow
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.6 }}>
            A transparent, 6-step verification pipeline designed to keep campus members safe and ensure authentic ownership.
          </p>
        </div>
      </section>

      {/* Steps List */}
      <section className="section">
        <div className="container container-narrow">
          {/* Important Match Disclaimer Callout */}
          <div className="alert alert-warning" style={{ marginBottom: '3rem' }}>
            <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>
                Important Notice: Potential Match ≠ Proof of Ownership
              </strong>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                LostLink match suggestions are mathematical keyword approximations to help users find candidate listings. A match suggestion does NOT grant ownership. Finders must verify unique physical proof before releasing an item.
              </p>
            </div>
          </div>

          {/* Workflow Steps Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {steps.map((s) => {
              const IconComp = s.icon;
              return (
                <div
                  key={s.num}
                  className="card"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${s.color}15`,
                      color: s.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                      {s.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Get started now</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/report-lost" className="btn btn-primary">
                Report a Lost Item
              </Link>
              <Link to="/report-found" className="btn btn-secondary">
                Report a Found Item
              </Link>
              <Link to="/browse" className="btn btn-outline">
                Browse Campus Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
