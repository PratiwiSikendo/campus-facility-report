import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const statusColor = { PENDING: '#f59e0b', VALIDATED: '#d97706', IN_PROGRESS: '#2563eb', RESOLVED: '#059669', REJECTED: '#dc2626' };
const statusBg = { PENDING: '#fffbeb', VALIDATED: '#fef3c7', IN_PROGRESS: '#dbeafe', RESOLVED: '#d1fae5', REJECTED: '#fee2e2' };
const statusLabel = { PENDING: 'Validasi Petugas', VALIDATED: 'Menunggu', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };

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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 60px' }}>
      <style>{`
        /* HERO */
        .hero {
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 60%, #0ea5e9 100%);
          border-radius: 20px; padding: 24px 20px;
          margin: 16px 0 20px; position: relative; overflow: hidden;
          box-shadow: 0 8px 32px rgba(37,99,235,0.25);
        }
        .hero::before {
          content: ''; position: absolute; top: -30px; right: -30px;
          width: 120px; height: 120px; border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }
        .hero::after {
          content: ''; position: absolute; bottom: -40px; right: 40px;
          width: 160px; height: 160px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.15); color: white;
          padding: 4px 10px; border-radius: 20px; font-size: 11px;
          font-weight: 600; margin-bottom: 10px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .hero h1 {
          color: white; font-size: 20px; font-weight: 700;
          margin-bottom: 8px; line-height: 1.3;
        }
        .hero p {
          color: rgba(255,255,255,0.82); font-size: 13px;
          margin-bottom: 16px; line-height: 1.5; max-width: 320px;
        }
        .hero-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: white; color: #1d4ed8;
          padding: 9px 18px; border-radius: 8px;
          text-decoration: none; font-weight: 700; font-size: 13px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.15); transition: all 0.2s;
        }
        .hero-btn:hover { transform: translateY(-1px); }
        .hero-stats {
          display: flex; gap: 20px; margin-top: 18px; flex-wrap: wrap;
        }
        .hero-stat-num { color: white; font-size: 20px; font-weight: 800; line-height: 1; }
        .hero-stat-lbl { color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 2px; }

        /* FILTER */
        .filter-bar { display: flex; gap: 10px; margin-bottom: 16px; }
        .filter-sel {
          flex: 1; padding: 9px 12px; border: 1.5px solid #e2eaf6;
          border-radius: 10px; background: white; font-size: 13px;
          box-shadow: 0 1px 4px rgba(59,130,246,0.08);
          appearance: none; cursor: pointer; color: #0f172a;
        }

        /* SECTION TITLE */
        .sec-title {
          font-size: 16px; font-weight: 700; margin-bottom: 12px;
          color: #0f172a; display: flex; align-items: center; gap: 8px;
        }
        .sec-title::after { content: ''; flex: 1; height: 1px; background: #e2eaf6; }

        /* REPORT CARD */
        .r-card {
          background: white; border-radius: 14px;
          border: 1.5px solid #e2eaf6; padding: 14px;
          margin-bottom: 10px; display: flex; gap: 12px;
          box-shadow: 0 2px 8px rgba(59,130,246,0.07);
          transition: all 0.2s;
        }
        .r-card:hover { box-shadow: 0 4px 16px rgba(59,130,246,0.14); transform: translateY(-1px); border-color: #bfdbfe; }
        .r-thumb {
          width: 72px; height: 60px; border-radius: 8px;
          object-fit: cover; flex-shrink: 0;
        }
        .r-thumb-ph {
          width: 72px; height: 60px; border-radius: 8px;
          background: #eff6ff; display: flex; align-items: center;
          justify-content: center; font-size: 20px; flex-shrink: 0;
        }
        .r-badge {
          padding: 3px 9px; border-radius: 20px;
          font-size: 11px; font-weight: 600; white-space: nowrap;
        }
        .r-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; line-height: 1.3; }
        .r-meta { color: #64748b; font-size: 12px; margin-bottom: 5px; }
        .r-desc { font-size: 13px; color: #374151; line-height: 1.4; }
        .r-date { color: #94a3b8; font-size: 11px; margin-top: 6px; }

        /* EMPTY */
        .empty {
          text-align: center; padding: 48px 20px;
          background: white; border-radius: 14px;
          border: 2px dashed #e2eaf6;
        }
        .empty-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: #eff6ff; display: flex; align-items: center;
          justify-content: center; font-size: 22px; margin: 0 auto 12px;
        }
      `}</style>

      {/* Hero — compact untuk mobile */}
      <div className="hero">
        <div className="hero-badge">✦ Sistem Pelaporan Digital</div>
        <h1>Sistem Pelaporan<br />Fasilitas Kampus</h1>
        <p>
          Platform ini memudahkan civitas akademika untuk melaporkan kerusakan fasilitas di lingkungan kampus. 
          Setiap laporan akan divalidasi oleh petugas sebelum diproses lebih lanjut oleh admin.
        </p>
        <div className="hero-stats">
          <div>
            <div className="hero-stat-num">{reports.length}</div>
            <div className="hero-stat-lbl">Total Laporan</div>
          </div>
          <div>
            <div className="hero-stat-num">{reports.filter(r => r.status === 'RESOLVED').length}</div>
            <div className="hero-stat-lbl">Selesai</div>
          </div>
          <div>
            <div className="hero-stat-num">{reports.filter(r => r.status === 'PENDING').length}</div>
            <div className="hero-stat-lbl">Menunggu</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <select className="filter-sel" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="PENDING">Validasi Petugas</option>
          <option value="VALIDATED">Menunggu Admin</option>
          <option value="IN_PROGRESS">Diproses</option>
          <option value="RESOLVED">Selesai</option>
          <option value="REJECTED">Ditolak</option>
        </select>
        <select className="filter-sel" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="sec-title">Laporan Terbaru</div>

      {reports.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>Belum ada laporan</p>
          <p style={{ color: '#64748b', fontSize: 13 }}>Jadilah yang pertama melaporkan kerusakan.</p>
        </div>
      ) : reports.map(r => (
        <div key={r.id} className="r-card">
          {r.imageUrl
            ? <img src={r.imageUrl.split(',')[0]} className="r-thumb" alt="foto" />
            : <div className="r-thumb-ph">🔧</div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
              <div className="r-title">{r.title}</div>
              <span className="r-badge" style={{ background: statusBg[r.status], color: statusColor[r.status] }}>
                {statusLabel[r.status]}
              </span>
            </div>
            <div className="r-meta">📍 {r.location} · {r.category?.name}</div>
            <div className="r-desc">
              {r.description?.length > 80 ? r.description.slice(0, 80) + '...' : r.description}
            </div>
            <div className="r-date">
              {r.user?.name} · {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}