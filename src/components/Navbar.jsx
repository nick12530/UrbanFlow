import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiNavigation, FiCoffee, FiUser, FiLogOut, 
  FiMenu, FiX, FiMessageCircle, FiSettings 
} from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <FiHome /> },
    { path: '/transport', label: 'Transport', icon: <FiNavigation /> },
    { path: '/food', label: 'Food & Markets', icon: <FiCoffee /> },
    { path: '/assistant', label: 'AI Assistant', icon: <FiMessageCircle /> }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          textDecoration: 'none',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '2rem' }}>🌆</span>
          UrbanFlow
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                color: isActive(item.path) ? '#fbbf24' : 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontWeight: isActive(item.path) ? '600' : '400',
                background: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ color: 'white', fontSize: '0.9rem' }}>
                Welcome, {user.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <FiUser />
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              style={{
                textDecoration: 'none',
                color: isActive(item.path) ? '#667eea' : '#374151',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: isActive(item.path) ? '#f3f4f6' : 'transparent',
                fontWeight: isActive(item.path) ? '600' : '400'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              <FiLogOut />
              Logout
            </button>
          )}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          nav > div > div:nth-child(2) {
            display: none !important;
          }
          nav > div > div:last-child button:last-child {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;