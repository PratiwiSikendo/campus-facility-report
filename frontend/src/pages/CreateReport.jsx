import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CreateReport() {
  const [form, setForm] = useState({ title: '', description: '', location: '', categoryId: '' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reports/categories`).then(r => setCategories(r.data));
  }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('Maksimal hanya bisa mengupload 5 foto.');
      return;
    }
    if (files.length) {
      setImages(prev => [...prev, ...files]);
      setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    images.forEach(img => data.append('images', img));
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
              <label className="form-label">Foto Kerusakan (opsional, bisa lebih dari 1)</label>
              {previews.length > 0 && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                  {previews.map((prev, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img src={prev} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10 }} />
                      <button type="button" onClick={() => removeImage(idx)}
                        style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="upload-area">
                <input type="file" multiple accept="image/*" onChange={handleImages} />
                <div style={{ marginBottom: 8, color: '#3b82f6' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Klik atau seret foto ke sini</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Bisa pilih banyak foto. PNG, JPG, JPEG · Maks. 5MB</p>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Mengirim...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Kirim Laporan
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}