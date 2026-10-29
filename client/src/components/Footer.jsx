import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--primary-900)',
        color: '#94a3b8',
        borderTop: '1px solid #1e293b',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div className="grid-4" style={{ gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Column 1: Brand & Mission */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass size={20} style={{ color: 'var(--primary-400)' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                Lost<span style={{ color: 'var(--primary-400)' }}>Link</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              A centralized, intelligent lost-and-found management platform connecting campus communities, libraries, hostels, and academic halls.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <ShieldCheck size={16} style={{ color: 'var(--status-returned)' }} />
              <span>Campus Security & Safety Verified</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Platform Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/browse" style={{ color: '#94a3b8' }}>
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/report-lost" style={{ color: '#94a3b8' }}>
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found" style={{ color: '#94a3b8' }}>
                  Report a Found Item
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" style={{ color: '#94a3b8' }}>
                  Verification & Handover Workflow
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#94a3b8' }}>
                  About LostLink
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Safe Handover Guidelines */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Safe Handover Zones</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Always arrange item verification and return handovers at designated campus safe locations:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} style={{ color: 'var(--primary-400)' }} />
                Central Library Circulation Desk
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} style={{ color: 'var(--primary-400)' }} />
                Campus Safety & Security Office
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} style={{ color: 'var(--primary-400)' }} />
                Student Union Help Desk
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Campus Assistance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: 'var(--primary-400)' }} />
                <span>support@lostlink.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: 'var(--primary-400)' }} />
                <span>+1 (555) CAMPUS-HELP</span>
              </div>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#64748b' }}>
                For emergency identity document theft or high-value claims, visit the campus security office directly.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
          }}
        >
          <p>© 2026 LostLink. Smart Lost-and-Found Management Platform. Built for University & Campus Communities.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Designed with <Heart size={14} style={{ color: 'var(--status-danger)' }} /> for students & educators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
