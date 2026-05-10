import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', REJECTED: '#ef4444' };
const statusBg = { PENDING: '#fffbeb', IN_PROGRESS: '#eff6ff', RESOLVED: '#f0fdf4', REJECTED: '#fef2f2' };
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
    axios.get(`${import.meta.env.VITE_API_URL}/reports`, { params }).then(r => setReports(r.data)).catch(() => {});
  }, [filterStatus, filterCategory]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reports/categories`).then(r => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 60px' }}>
      <style>{`
        .hero {
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #0ea5e9 100%);
          border-radius: var(--radius-xl); padding: 52px 40px;
          margin: 28px 0 32px; position: relative; overflow: hidden;
          box-shadow: var(--shadow-xl);
        }
        .hero::before {
          content: ''; position: absolute; top: -40px; right: -40px;
          width: 200px; height: 200px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }
        .hero::after {
          content: ''; position: absolute; bottom: -60px; right: 80px;
          width: 280px; height: 280px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.15); color: white;
          padding: 6px 14px; border-radius: 20px; font-size: 12px;
          font-weight: 600; margin-bottom: 16px; backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .hero h1 { color: white; font-size: clamp(24px, 4vw, 36px); font-weight: 700; margin-bottom: 12px; }
        .hero p { color: rgba(255,255,255,0.85); font-size: 15px; max-width: 480px; margin-bottom: 28px; line-height: 1.6; }
        .hero-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: var(--primary-dark);
          padding: 12px 24px; border-radius: 10px;
          text-decoration: none; font-weight: 700; font-size: 14px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15); transition: all 0.2s;
        }
        .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .hero-stats {
          display: flex; gap: 24px; margin-top: 32px; flex-wrap: wrap;
        }
        .hero-stat { color: white; }
        .hero-stat-num { font-size: 24px; font-weight: 700; }
        .hero-stat-label { font-size: 12px; opacity: 0.75; }

        .filter-bar {
          display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;
        }
        .filter-select {
          flex: 1; min-width: 160px; padding: 10px 14px;
          border: 1.5px solid var(--border); border-radius: 10px;
          background: var(--surface); font-size: 14px;
          box-shadow: var(--shadow-sm); appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          padding-right: 32px; cursor: pointer;
        }

        .report-card {
          background: var(--surface); border-radius: var(--radius-lg);
          border: 1px solid var(--border); padding: 20px;
          margin-bottom: 14px; display: flex; gap: 16px;
          box-shadow: var(--shadow-sm); transition: all 0.2s;
        }
        .report-card:hover { box-shadow: var(--shadow); transform: translateY(-1px); border-color: var(--primary-mid); }
        .report-img { width: 90px; height: 72px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
        .report-img-placeholder {
          width: 90px; height: 72px; border-radius: 10px;
          background: var(--primary-light); display: flex; align-items: center;
          justify-content: center; font-size: 24px; flex-shrink: 0;
        }
        .status-badge {
          padding: 4px 12px; border-radius: 20px;
          font-size: 12px; font-weight: 600; white-space: nowrap;
        }
        .section-title {
          font-size: 20px; font-weight: 700; margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-title::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }
        .empty-state {
          text-align: center; padding: 60px 20px;
          background: var(--surface); border-radius: var(--radius-lg);
          border: 2px dashed var(--border);
        }
        .empty-icon {
          width: 64px; height: 64px; border-radius: 16px;
          background: var(--primary-light); display: flex; align-items: center;
          justify-content: center; font-size: 28px; margin: 0 auto 16px;
        }
        @media (max-width: 600px) {
          .hero { padding: 32px 20px; }
          .report-img, .report-img-placeholder { width: 70px; height: 56px; }
        }
      `}</style>

      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">✦ Sistem Pelaporan Digital</div>
        <h1>Laporkan Kerusakan<br />Fasilitas Kampus</h1>
        <p>Pantau status perbaikan secara real-time. Bersama kita jaga fasilitas kampus tetap prima.</p>
        <Link to="/laporan/buat" className="hero-btn">
          + Buat Laporan Baru
        </Link>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">{reports.length}</div>
            <div className="hero-stat-label">Total Laporan</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{reports.filter(r => r.status === 'RESOLVED').length}</div>
            <div className="hero-stat-label">Selesai Diperbaiki</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{reports.filter(r => r.status === 'PENDING').length}</div>
            <div className="hero-stat-label">Menunggu Tindakan</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="PENDING">Menunggu</option>
          <option value="IN_PROGRESS">Diproses</option>
          <option value="RESOLVED">Selesai</option>
          <option value="REJECTED">Ditolak</option>
        </select>
        <select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="section-title">Laporan Terbaru</div>
      {reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Belum ada laporan</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Jadilah yang pertama melaporkan kerusakan fasilitas.</p>
        </div>
      ) : reports.map(r => (
        <div key={r.id} className="report-card">
          {r.imageUrl
            ? <img src={r.imageUrl} alt="foto" className="report-img" />
            : <div className="report-img-placeholder">🔧</div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{r.title}</h3>
              <span className="status-badge" style={{ background: statusBg[r.status], color: statusColor[r.status] }}>
                {statusLabel[r.status]}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>
              📍 {r.location} · 📂 {r.category?.name} · 👤 {r.user?.name}
            </p>
            <p style={{ fontSize: 14, color: 'var(--text)', margin: 0 }}>
              {r.description?.length > 100 ? r.description.slice(0, 100) + '...' : r.description}
            </p>
            <p style={{ color: 'var(--text-light)', fontSize: 12, marginTop: 8 }}>
              {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}