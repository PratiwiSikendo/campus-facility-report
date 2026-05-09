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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '32px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Masuk</h2>
      {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', boxSizing: 'border-box' }} required />
        </div>
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </div>
  );
}