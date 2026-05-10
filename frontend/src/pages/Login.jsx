import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <style>{`
        .auth-card {
          background: var(--surface); border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl); padding: 40px;
          width: 100%; max-width: 420px;
          border: 1px solid var(--border);
        }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin: 0 auto 16px;
          box-shadow: 0 4px 16px rgba(59,130,246,0.3);
        }
        .auth-title { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
        .auth-subtitle { color: var(--text-muted); font-size: 14px; }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text); }
        .error-alert {
          background: #fef2f2; border: 1px solid #fecaca;
          color: #ef4444; padding: 12px 16px; border-radius: 10px;
          font-size: 13px; margin-bottom: 18px;
        }
        .submit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          color: white; border: none; border-radius: 10px;
          font-size: 15px; font-weight: 600;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
          transition: all 0.2s;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59,130,246,0.4); }
        .submit-btn:disabled { opacity: 0.7; }
        .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-muted); }
        .auth-footer a { color: var(--primary); font-weight: 600; text-decoration: none; }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔑</div>
          <h2 className="auth-title">Selamat Datang</h2>
          <p className="auth-subtitle">Masuk ke akun FasilitasKampus</p>
        </div>
        {error && <div className="error-alert">⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Alamat Email</label>
            <input type="email" placeholder="contoh@kampus.ac.id" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" placeholder="Masukkan password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <div className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </div>
      </div>
    </div>
  );
}