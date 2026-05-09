import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', REJECTED: '#ef4444' };
const statusLabel = { PENDING: 'Menunggu', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };

export default function Home() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterCategory) params.categoryId = filterCategory;
    axios.get(`${import.meta.env.VITE_API_URL}/reports`, { params })
      .then(res => setReports(res.data))
      .catch(() => {});
  }, [filterStatus, filterCategory]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reports/categories`)
      .then(res => setCategories(res.data))
      .catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 16px' }}>
      {/* Hero */}
      <div style={{ background: '#1e40af', color: 'white', borderRadius: '16px', padding: '40px', marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 12px', fontSize: '28px' }}>🏛️ Sistem Pelaporan Fasilitas Kampus</h1>
        <p style={{ margin: '0 0 24px', opacity: 0.85 }}>Laporkan kerusakan fasilitas kampus dengan mudah dan pantau statusnya secara real-time.</p>
        <Link to="/laporan/buat" style={{ background: 'white', color: '#1e40af', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
          + Buat Laporan
        </Link>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', flex: 1, minWidth: '160px' }}>
          <option value="">Semua Status</option>
          <option value="PENDING">Menunggu</option>
          <option value="IN_PROGRESS">Diproses</option>
          <option value="RESOLVED">Selesai</option>
          <option value="REJECTED">Ditolak</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', flex: 1, minWidth: '160px' }}>
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Daftar laporan */}
      <h2 style={{ marginBottom: '16px' }}>Laporan Terbaru</h2>
      {reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '12px' }}>
          <p style={{ fontSize: '18px', margin: '0 0 8px' }}>Belum ada laporan</p>
          <p style={{ margin: 0 }}>Jadilah yang pertama melaporkan kerusakan fasilitas.</p>
        </div>
      ) : (
        reports.map(r => (
          <div key={r.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px', display: 'flex', gap: '16px' }}>
            {r.imageUrl && (
              <img src={r.imageUrl} alt="foto" style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{r.title}</h3>
                <span style={{ background: statusColor[r.status], color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {statusLabel[r.status]}
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 6px' }}>
                📍 {r.location} · 📂 {r.category?.name} · 👤 {r.user?.name}
              </p>
              <p style={{ margin: 0, color: '#374151', fontSize: '14px' }}>
                {r.description.length > 120 ? r.description.slice(0, 120) + '...' : r.description}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}