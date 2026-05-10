import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', nim: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, form);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registrasi gagal');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <style>{`
        .auth-card { background: var(--surface); border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); padding: 40px; width: 100%; max-width: 420px; border: 1px solid var(--border); }
        .auth-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #3b82f6, #0ea5e9); display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px; box-shadow: 0 4px 16px rgba(59,130,246,0.3); }
        .form-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
        .form-group { margin-bottom: 16px; }
        .error-alert { background: #fef2f2; border: 1px solid #fecaca; color: #ef4444; padding: 12px 16px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; }
        .submit-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #3b82f6, #0ea5e9); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(59,130,246,0.3); transition: all 0.2s; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.7; }
        .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-muted); }
        .auth-footer a { color: var(--primary); font-weight: 600; text-decoration: none; }
      `}</style>
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="auth-icon">✦</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Buat Akun Baru</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Bergabung dengan FasilitasKampus</p>
        </div>
        {error && <div className="error-alert">⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          {[['Nama Lengkap','name','text','John Doe'],['NIM (opsional)','nim','text','23024XXX'],['Email','email','email','nama@kampus.ac.id'],['Password','password','password','Min. 8 karakter']].map(([label, key, type, ph]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input type={type} placeholder={ph} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required={key !== 'nim'} />
            </div>
          ))}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>
        <div className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </div>
      </div>
    </div>
  );
}