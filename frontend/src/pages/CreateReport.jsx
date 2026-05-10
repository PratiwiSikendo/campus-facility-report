import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CreateReport() {
  const [form, setForm] = useState({ title: '', description: '', location: '', categoryId: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reports/categories`).then(r => setCategories(r.data));
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

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
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 680, margin: '32px auto', padding: '0 20px 60px' }}>
      <style>{`
        .page-card { background: var(--surface); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); border: 1px solid var(--border); overflow: hidden; }
        .page-card-header { background: linear-gradient(135deg, #1d4ed8, #3b82f6); padding: 28px 32px; }
        .page-card-body { padding: 32px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text); }
        .form-group { margin-bottom: 20px; }
        .upload-area {
          border: 2px dashed var(--border); border-radius: var(--radius-lg);
          padding: 32px; text-align: center; cursor: pointer;
          transition: all 0.2s; background: var(--surface2);
          position: relative;
        }
        .upload-area:hover { border-color: var(--primary); background: var(--primary-light); }
        .upload-area input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #3b82f6, #0ea5e9); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(59,130,246,0.3); transition: all 0.2s; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.4); }
        .submit-btn:disabled { opacity: 0.7; }
      `}</style>

      <div className="page-card">
        <div className="page-card-header">
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>Buat Laporan Kerusakan</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6 }}>Lengkapi informasi kerusakan fasilitas kampus</p>
        </div>
        <div className="page-card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Judul Kerusakan</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: AC Rusak di Ruang 301" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label className="form-label">Kategori</label>
                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Lokasi</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="Gedung A, Lantai 3" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi Kerusakan</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={4} placeholder="Jelaskan detail kerusakan yang terjadi..." required
                style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Foto Kerusakan (opsional)</label>
              {preview ? (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 }} />
                  <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                    style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="upload-area">
                  <input type="file" accept="image/*" onChange={handleImage} />
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Klik atau seret foto ke sini</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>PNG, JPG, JPEG · Maks. 5MB</p>
                </div>
              )}
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '⏳ Mengirim...' : '✓ Kirim Laporan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}