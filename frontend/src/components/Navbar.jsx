import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 0',
    display: 'block',
    fontSize: '15px',
  };

  return (
    <nav style={{ background: '#1e40af', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)}
          style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏛️ FasilitasKampus
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }} className="desktop-menu">
          <style>{`
            @media (max-width: 768px) { .desktop-menu { display: none !important; } .hamburger { display: flex !important; } }
            @media (min-width: 769px) { .mobile-menu { display: none !important; } .hamburger { display: none !important; } }
          `}</style>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }}>Beranda</Link>
          {user ? (
            <>
              <Link to="/laporan/buat" style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }}>+ Laporan</Link>
              <Link to="/laporan/saya" style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }}>Laporan Saya</Link>
              {(user.role === 'ADMIN' || user.role === 'PETUGAS') && (
                <Link to="/admin" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>Admin</Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: '#1e3a8a' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '15px' }}>Masuk</Link>
              <Link to="/register" style={{ background: 'white', color: '#1e40af', padding: '7px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Daftar</Link>
            </>
          )}
        </div>

        {/* Hamburger Button */}
        <button className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ width: '24px', height: '2px', background: 'white', display: 'block', transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ width: '24px', height: '2px', background: 'white', display: 'block', transition: 'all 0.3s',
            opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: '24px', height: '2px', background: 'white', display: 'block', transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className="mobile-menu"
        style={{ display: menuOpen ? 'block' : 'none', borderTop: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px', maxWidth: '1100px', margin: '0 auto' }}>
        {user && (
          <div style={{ padding: '12px 0 8px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e3a8a' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: 'white', margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{user.name}</p>
              <p style={{ color: '#bfdbfe', margin: 0, fontSize: '12px' }}>{user.role}</p>
            </div>
          </div>
        )}

        <Link to="/" onClick={() => setMenuOpen(false)} style={linkStyle}>🏠 Beranda</Link>
        {user ? (
          <>
            <Link to="/laporan/buat" onClick={() => setMenuOpen(false)} style={linkStyle}>➕ Buat Laporan</Link>
            <Link to="/laporan/saya" onClick={() => setMenuOpen(false)} style={linkStyle}>📋 Laporan Saya</Link>
            {(user.role === 'ADMIN' || user.role === 'PETUGAS') && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ ...linkStyle, color: '#fbbf24', fontWeight: 'bold' }}>⚙️ Dashboard Admin</Link>
            )}
            <button onClick={handleLogout}
              style={{ color: '#fca5a5', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0', fontSize: '15px', textAlign: 'left', width: '100%' }}>
              🚪 Keluar
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)} style={linkStyle}>🔑 Masuk</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} style={linkStyle}>📝 Daftar</Link>
          </>
        )}
      </div>
    </nav>
  );
}