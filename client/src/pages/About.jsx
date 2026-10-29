import React from 'react';
import { Compass, ShieldCheck, Heart, Users, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div>
      {/* Hero Header */}
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
            About LostLink
          </span>
          <h1 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '1rem' }}>
            Transforming Campus Lost & Found
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Solving a genuine everyday problem across colleges, libraries, hostels, and universities with an intelligent, privacy-first management platform.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container container-narrow" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Problem Statement */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
              The Real-World Problem
            </h2>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '1rem' }}>
              On any vibrant educational campus, thousands of students, researchers, and faculty navigate between lecture halls, laboratories, libraries, cafeterias, and hostels every day. Inevitably, essential personal belongings get misplaced—student ID cards, keys, graphing calculators, wireless earbuds, water bottles, and backpacks.
            </p>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Historically, reports are fragmented across informal WhatsApp groups, chaotic notice boards, classroom announcements, or lost-and-found boxes behind help desks. Finders don't know who owns an item, and losers have no centralized directory to search. Belongings gather dust or get discarded.
            </p>
            <div className="alert alert-info" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
              <ShieldCheck size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>The LostLink Solution</strong>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  LostLink establishes a single authoritative digital platform where all lost and found reports are cataloged, automatically matched, and securely returned through auditable handovers.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Architecture */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={20} />
              </div>
              <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Privacy By Design</h2>
            </div>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              College identity cards and personal items contain sensitive information. LostLink was architected from the ground up to prevent privacy violations and harassment:
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--status-returned)', marginTop: '2px', flexShrink: 0 }} />
                <span>
                  <strong>No Public Phone Numbers:</strong> User contact information is strictly hidden from public directories. All ownership claims occur through an in-app verification workflow.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--status-returned)', marginTop: '2px', flexShrink: 0 }} />
                <span>
                  <strong>Confidential Verification Details:</strong> Specific identifying marks (like lock screen wallpapers, custom engravings, or ID numbers) are held in encrypted fields only accessible to verified participants.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--status-returned)', marginTop: '2px', flexShrink: 0 }} />
                <span>
                  <strong>Designated Campus Safe Zones:</strong> We actively discourage meeting in private rooms. Handover protocols recommend public campus desks with CCTV and staff oversight.
                </span>
              </li>
            </ul>
          </div>

          {/* Call to action */}
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Ready to explore the platform?</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/browse" className="btn btn-primary">
                Browse Campus Listings
              </Link>
              <Link to="/how-it-works" className="btn btn-outline">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
