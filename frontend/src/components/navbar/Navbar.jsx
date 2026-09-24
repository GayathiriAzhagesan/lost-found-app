import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Bell,
  PlusCircle,
  LogOut,
  User,
  ShieldAlert,
  ClipboardList,
  Layers,
  ChevronDown,
} from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadNotifCount } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Compass size={22} />
          </div>
          <span>
            Campus<span className="brand-highlight">Recover</span>
          </span>
        </Link>

        {/* Links */}
        <nav>
          <ul className="navbar-links">
            <li>
              <NavLink to="/lost-items" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Lost Items
              </NavLink>
            </li>
            <li>
              <NavLink to="/found-items" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Found Items
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/report" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Report Item</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="notif-bell-btn" title="Notifications">
                <Bell size={18} />
                {unreadNotifCount > 0 && (
                  <span className="notif-badge-pill">{unreadNotifCount}</span>
                )}
              </Link>

              <div className="user-menu-wrapper">
                <button
                  className="user-avatar-btn"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <div className="user-avatar-circle">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user?.name ? user.name.split(' ')[0] : 'Account'}</span>
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown-menu" onClick={() => setDropdownOpen(false)}>
                    <div className="dropdown-user-header">
                      <div className="dropdown-user-name">{user?.name}</div>
                      <div className="dropdown-user-email">{user?.email}</div>
                    </div>
                    <Link to="/profile" className="dropdown-item">
                      <User size={15} />
                      <span>Profile</span>
                    </Link>
                    <Link to="/my-items" className="dropdown-item">
                      <Layers size={15} />
                      <span>My Reports</span>
                    </Link>
                    <Link to="/my-claims" className="dropdown-item">
                      <ClipboardList size={15} />
                      <span>My Claims</span>
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="dropdown-divider" />
                        <Link to="/admin" className="dropdown-item" style={{ color: 'var(--primary-600)' }}>
                          <ShieldAlert size={15} />
                          <span>Admin Portal</span>
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item" style={{ color: 'var(--accent-rose)' }}>
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-outline btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
