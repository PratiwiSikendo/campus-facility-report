import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setSidebarOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = user ? [
    { to: '/', label: 'Beranda', icon: '⌂' },
    { to: '/laporan/buat', label: 'Buat Laporan', icon: '+' },
    { to: '/laporan/saya', label: 'Laporan Saya', icon: '◈' },
    ...(user.role === 'ADMIN' || user.role === 'PETUGAS'
      ? [{ to: '/admin', label: 'Dashboard Admin', icon: '◉', admin: true }]
      : []),
  ] : [
    { to: '/', label: 'Beranda', icon: '⌂' },
    { to: '/login', label: 'Masuk', icon: '→' },
    { to: '/register', label: 'Daftar', icon: '✦' },
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 200;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .navbar-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: var(--text);
        }
        .nav-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(59,130,246,0.35);
          font-size: 18px;
        }
        .nav-logo-text { font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 700; }
        .nav-logo-text span { color: var(--primary); }

        .nav-links-desktop {
          display: flex; align-items: center; gap: 4px;
        }
        .nav-link {
          padding: 7px 14px; border-radius: 8px;
          text-decoration: none; font-size: 14px; font-weight: 500;
          color: var(--text-muted); transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .nav-link:hover { background: var(--primary-light); color: var(--primary); }
        .nav-link.active { background: var(--primary-light); color: var(--primary); }
        .nav-link.admin-link { color: var(--primary); font-weight: 600; }
        .nav-btn-primary {
          padding: 8px 18px; border-radius: 8px;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          color: white; text-decoration: none; font-size: 14px; font-weight: 600;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
          transition: all 0.2s; border: none;
        }
        .nav-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,130,246,0.4); }
        .nav-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 13px;
          box-shadow: 0 2px 6px rgba(59,130,246,0.3);
        }
        .nav-logout {
          padding: 7px 14px; border-radius: 8px; border: 1.5px solid var(--border);
          background: transparent; color: var(--text-muted);
          font-size: 13px; font-weight: 500; transition: all 0.2s;
        }
        .nav-logout:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

        .hamburger-btn {
          display: none; flex-direction: column; gap: 5px;
          background: transparent; border: none; padding: 6px; cursor: pointer;
        }
        .hamburger-btn span {
          width: 22px; height: 2px; background: var(--text);
          border-radius: 2px; display: block; transition: all 0.3s;
        }

        /* SIDEBAR */
        .sidebar-overlay {
          position: fixed; inset: 0; background: rgba(15,23,42,0.4);
          backdrop-filter: blur(4px); z-index: 300;
          opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .sidebar-overlay.open { opacity: 1; pointer-events: all; }
        .sidebar {
          position: fixed; top: 0; right: -320px; width: 300px; height: 100vh;
          background: var(--surface); z-index: 301;
          box-shadow: var(--shadow-xl);
          transition: right 0.3s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction: column;
          border-radius: 16px 0 0 16px;
        }
        .sidebar.open { right: 0; }
        .sidebar-header {
          padding: 20px 24px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .sidebar-close {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1.5px solid var(--border); background: transparent;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: var(--text-muted); transition: all 0.2s;
        }
        .sidebar-close:hover { background: #fef2f2; border-color: #ef4444; color: #ef4444; }
        .sidebar-user {
          padding: 20px 24px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 12px;
        }
        .sidebar-avatar {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 16px;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }
        .sidebar-nav { padding: 16px 12px; flex: 1; overflow-y: auto; }
        .sidebar-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 10px;
          text-decoration: none; color: var(--text-muted);
          font-size: 15px; font-weight: 500; transition: all 0.2s;
          margin-bottom: 4px;
        }
        .sidebar-link:hover { background: var(--primary-light); color: var(--primary); }
        .sidebar-link.active { background: var(--primary-light); color: var(--primary); }
        .sidebar-link.admin { color: var(--primary); font-weight: 600; }
        .sidebar-link-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: var(--bg); display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: all 0.2s;
        }
        .sidebar-link:hover .sidebar-link-icon,
        .sidebar-link.active .sidebar-link-icon { background: var(--primary-mid); }
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--border); }
        .sidebar-logout {
          width: 100%; padding: 12px; border-radius: 10px;
          border: 1.5px solid #fecaca; background: #fef2f2;
          color: #ef4444; font-size: 14px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .sidebar-logout:hover { background: #fee2e2; }

        @media (max-width: 768px) {
          .nav-links-desktop { display: none; }
          .hamburger-btn { display: flex; }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">🏛</div>
            <span className="nav-logo-text">Fasilitas<span>Kampus</span></span>
          </Link>

          {/* Desktop */}
          <div className="nav-links-desktop">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`nav-link ${isActive(link.to) ? 'active' : ''} ${link.admin ? 'admin-link' : ''}`}>
                {link.label}
              </Link>
            ))}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
                <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <button className="nav-logout" onClick={handleLogout}>Keluar</button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="nav-logo">
            <div className="nav-logo-icon" style={{ width: 32, height: 32, fontSize: 16 }}>🏛</div>
            <span className="nav-logo-text" style={{ fontSize: 15 }}>Fasilitas<span>Kampus</span></span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{user.role}</p>
            </div>
          </div>
        )}

        <div className="sidebar-nav">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`sidebar-link ${isActive(link.to) ? 'active' : ''} ${link.admin ? 'admin' : ''}`}
              onClick={() => setSidebarOpen(false)}>
              <div className="sidebar-link-icon">{link.icon}</div>
              {link.label}
            </Link>
          ))}
        </div>

        {user && (
          <div className="sidebar-footer">
            <button className="sidebar-logout" onClick={handleLogout}>
              ← Keluar dari Akun
            </button>
          </div>
        )}
      </div>
    </>
  );
}