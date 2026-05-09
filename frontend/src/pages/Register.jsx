import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', nim: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, form);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registrasi gagal');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '32px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Daftar Akun</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {[['Nama Lengkap','name','text'],['NIM','nim','text'],['Email','email','email'],['Password','password','password']].map(([label, key, type]) => (
          <div key={key} style={{ marginBottom: '16px' }}>
            <label>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', boxSizing: 'border-box' }}
              required={key !== 'nim'} />
          </div>
        ))}
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          Daftar
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>Sudah punya akun? <Link to="/login">Masuk</Link></p>
    </div>
  );
}