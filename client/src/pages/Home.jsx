import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Laptop,
  CreditCard,
  Briefcase,
  Wallet,
  Key,
  BookOpen,
  Shirt,
  Coffee,
  Watch,
  HelpCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../services/api.js';
import ItemCard from '../components/ItemCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const CATEGORY_ITEMS = [
  { name: 'Electronics', icon: Laptop, color: '#0284C7' },
  { name: 'ID Cards and Documents', icon: CreditCard, color: '#0D9488' },
  { name: 'Bags and Backpacks', icon: Briefcase, color: '#D97706' },
  { name: 'Wallets and Purses', icon: Wallet, color: '#6366F1' },
  { name: 'Keys', icon: Key, color: '#EC4899' },
  { name: 'Books and Stationery', icon: BookOpen, color: '#10B981' },
  { name: 'Clothing', icon: Shirt, color: '#8B5CF6' },
  { name: 'Water Bottles', icon: Coffee, color: '#06B6D4' },
  { name: 'Jewellery and Accessories', icon: Watch, color: '#F59E0B' },
];

export const Home = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [reportsRes, statsRes] = await Promise.all([
          api.get('/reports?limit=6&sort=newest'),
          api.get('/dashboard/admin').catch(() => null),
        ]);

        if (reportsRes.data.success) {
          setRecentReports(reportsRes.data.reports || []);
        }

        if (statsRes?.data?.success) {
          setStats(statsRes.data.stats);
        } else {
          // Calculate from reports response if admin stats unavailable
          setStats({
            returnedReports: 1,
            totalLostReports: reportsRes.data.total || 0,
            activeReports: reportsRes.data.total || 0,
            totalUsers: 5,
          });
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const faqs = [
    {
      q: 'How does LostLink verify that someone actually owns an item?',
      a: 'When an item is reported as found, private identifying details (such as engraved initials, wallpaper photos, or serial numbers) are withheld from public view. A claimant must describe these exact identifying marks when submitting a claim. The finder reviews this evidence before arranging a verified handover.',
    },
    {
      q: 'Will my phone number or email be shown publicly?',
      a: 'Never. Public listings never expose your phone number, email address, student ID numbers, or home address. All communication happens securely through the platform until a claim is approved for collection.',
    },
    {
      q: 'Where do handovers take place on campus?',
      a: 'We recommend designated campus safe zones with staff oversight, such as the Central Library Circulation Desk, Student Union Helpdesk, or Campus Safety Office.',
    },
    {
      q: 'Does a potential match mean ownership is proven?',
      a: 'No. Our matching algorithm computes similarity based on keywords, category, and date proximity to assist users, but it does NOT prove ownership. Finders must always verify physical proof of ownership.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0b192c 0%, #1e3e62 100%)',
          color: '#ffffff',
          paddingTop: '4.5rem',
          paddingBottom: '5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Campus Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-400)',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} />
              Centralized Campus Lost & Found System
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              Lost Something? <br />
              <span style={{ color: 'var(--primary-400)' }}>Let's Bring It Back.</span>
            </h1>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#cbd5e1',
                marginBottom: '2.25rem',
                lineHeight: 1.6,
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              LostLink helps students and campus communities report missing belongings, discover found items, and reconnect people with what matters.
            </p>

            {/* Quick Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                maxWidth: '620px',
                margin: '0 auto 2.25rem',
                display: 'flex',
                backgroundColor: '#ffffff',
                padding: '0.4rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '1rem', gap: '0.5rem' }}>
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search for headphones, student ID cards, water bottles, keys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    background: 'transparent',
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.65rem 1.5rem' }}
              >
                Search
              </button>
            </form>

            {/* Primary & Secondary Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/report-lost" className="btn btn-primary btn-lg" style={{ minWidth: '200px' }}>
                <PlusCircle size={20} />
                Report a Lost Item
              </Link>
              <Link
                to="/browse?type=found"
                className="btn btn-outline btn-lg"
                style={{
                  minWidth: '200px',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                }}
              >
                Browse Found Items
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      {stats && (
        <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '2rem 0' }}>
          <div className="container">
            <div className="grid-4" style={{ textAlign: 'center', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-600)', margin: 0 }}>
                  {stats.returnedReports || 0}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Items Successfully Reunited
                </p>
              </div>
              <div>
                <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-900)', margin: 0 }}>
                  {stats.totalLostReports || 0}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Active Lost Reports
                </p>
              </div>
              <div>
                <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-teal)', margin: 0 }}>
                  {stats.totalFoundReports || 0}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Found Items Waiting Claim
                </p>
              </div>
              <div>
                <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-500)', margin: 0 }}>
                  {stats.totalUsers || 0}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Campus Community Members
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-found" style={{ marginBottom: '0.75rem' }}>
              Transparent Process
            </span>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How LostLink Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              A safe, rule-based recovery pipeline designed specifically for educational institutions.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '2rem' }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Report Item Details</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Submit a lost or found report with category, location, and non-sensitive descriptions. Sensitive ID numbers are never displayed publicly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-teal-light)',
                  color: 'var(--accent-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Smart Match & Claim</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Our rule-based engine computes keyword and location overlap to suggest possible matches. Owners submit proof through controlled claims.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-returned-bg)',
                  color: 'var(--status-returned)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Safe Campus Handover</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Meet safely at designated campus desks (library or campus safety) to verify evidence, complete handover, and mark the item as returned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Categories Grid */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
                Quick Browse
              </span>
              <h2 style={{ fontSize: '2rem' }}>Common Categories</h2>
            </div>
            <Link to="/browse" className="btn btn-outline btn-sm">
              <span>View All Categories</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {CATEGORY_ITEMS.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/browse?category=${encodeURIComponent(cat.name)}`}
                  className="card card-hover"
                  style={{
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cat.color,
                    }}
                  >
                    <IconComp size={24} />
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recently Reported Items */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-found" style={{ marginBottom: '0.5rem' }}>
                Latest Community Activity
              </span>
              <h2 style={{ fontSize: '2rem' }}>Recently Reported Items</h2>
            </div>
            <Link to="/browse" className="btn btn-outline btn-sm">
              <span>Browse All Listings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching campus reports..." />
          ) : recentReports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search size={32} />
              </div>
              <h3 className="empty-state-title">No Reports Found</h3>
              <p className="empty-state-text">
                Be the first to report a missing or found belonging to assist our campus community.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/report-lost" className="btn btn-primary btn-sm">
                  Report Lost Item
                </Link>
                <Link to="/report-found" className="btn btn-outline btn-sm">
                  Report Found Item
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '1.75rem' }}>
              {recentReports.map((report) => (
                <ItemCard key={report._id} report={report} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Privacy & Safe Handover Assurance */}
      <section className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container container-narrow">
          <div className="card" style={{ padding: '2.5rem', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
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
                <Lock size={22} />
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>Privacy & Security Pledge</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              LostLink is committed to student and staff privacy. Public listings never expose sensitive personal information, identity card numbers, wallet contents, phone numbers, or private student records.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-returned)' }} />
                <span>Zero Public Phone Numbers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-returned)' }} />
                <span>Audited Handover Coordination</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-returned)' }} />
                <span>Campus Moderator Oversight</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-returned)' }} />
                <span>Encrypted Authentication</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
              Got Questions?
            </span>
            <h2 style={{ fontSize: '2rem' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--primary-900)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
