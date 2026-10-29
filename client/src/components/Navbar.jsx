import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  HelpCircle,
  Info,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  LayoutDashboard,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, isModerator, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.925rem',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? 'var(--primary-500)' : 'var(--text-main)',
    textDecoration: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.15s ease',
  });

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-900)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(11, 25, 44, 0.2)',
            }}
          >
            <Compass size={22} style={{ color: 'var(--primary-400)' }} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--primary-900)',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Lost<span style={{ color: 'var(--primary-500)' }}>Link</span>
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                letterSpacing: '0.02em',
                display: 'none',
              }}
              className="d-desktop"
            >
              Campus Lost & Found
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="desktop-nav"
        >
          <NavLink to="/" style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/browse" style={navLinkStyle}>
            Browse Items
          </NavLink>
          <NavLink to="/report-lost" style={navLinkStyle}>
            Report Lost
          </NavLink>
          <NavLink to="/report-found" style={navLinkStyle}>
            Report Found
          </NavLink>
          <NavLink to="/how-it-works" style={navLinkStyle}>
            How It Works
          </NavLink>
          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>
        </nav>

        {/* Right Section: NotificationBell & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <NotificationBell />

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                  }}
                  aria-label="User menu"
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      maxWidth: '120px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    className="desktop-only"
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="card"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '220px',
                      zIndex: 1100,
                      boxShadow: 'var(--shadow-xl)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 0',
                    }}
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, color: 'var(--primary-900)' }}>
                        {user.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                        {user.email}
                      </p>
                      <span
                        className="badge badge-category"
                        style={{ marginTop: '0.4rem', fontSize: '0.65rem', textTransform: 'capitalize' }}
                      >
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                      }}
                    >
                      <LayoutDashboard size={16} />
                      User Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                      }}
                    >
                      <User size={16} />
                      Profile Settings
                    </Link>

                    {isModerator && (
                      <Link
                        to="/admin"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 1rem',
                          fontSize: '0.875rem',
                          color: 'var(--status-danger)',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <ShieldAlert size={16} />
                        Admin Portal
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.35rem 0' }}></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--status-danger)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
          className="mobile-nav-drawer"
        >
          <NavLink to="/" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/browse" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Browse Items
          </NavLink>
          <NavLink to="/report-lost" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Report Lost Item
          </NavLink>
          <NavLink to="/report-found" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Report Found Item
          </NavLink>
          <NavLink to="/how-it-works" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </NavLink>
          <NavLink to="/about" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            About LostLink
          </NavLink>
        </div>
      )}

      {/* CSS for responsive navigation */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .d-desktop { display: block !important; }
        }
        @media (max-width: 899px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
