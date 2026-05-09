import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CreateReport() {
  const [form, setForm] = useState({ title: '', description: '', location: '', categoryId: '' });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reports/categories`)
      .then(res => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (image) data.append('image', image);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reports`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert('Laporan berhasil dikirim!');
      navigate('/laporan/saya');
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
      <h2>Buat Laporan Kerusakan</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label>Judul Kerusakan</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            placeholder="Contoh: AC Rusak di Ruang 301"
            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label>Kategori</label>
          <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', boxSizing: 'border-box' }} required>
            <option value="">-- Pilih Kategori --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label>Lokasi</label>
          <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
            placeholder="Contoh: Gedung A, Lantai 3"
            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label>Deskripsi</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            rows={4} placeholder="Jelaskan detail kerusakan..."
            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label>Foto Kerusakan (opsional)</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
            style={{ display: 'block', marginTop: '4px' }} />
        </div>
        <button type="submit" disabled={loading}
          style={{ padding: '12px 32px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
      </form>
    </div>
  );
}