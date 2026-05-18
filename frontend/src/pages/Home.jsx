import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const statusColor = { PENDING: '#f59e0b', VALIDATED: '#7c3aed', IN_PROGRESS: '#2563eb', RESOLVED: '#059669', REJECTED: '#dc2626' };
const statusBg = { PENDING: '#fffbeb', VALIDATED: '#ede9fe', IN_PROGRESS: '#dbeafe', RESOLVED: '#d1fae5', REJECTED: '#fee2e2' };
const statusLabel = { PENDING: 'Validasi Petugas', VALIDATED: 'Terverifikasi', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };
const statusIcon = { PENDING: '⏳', VALIDATED: '🛡️', IN_PROGRESS: '🔧', RESOLVED: '✅', REJECTED: '❌' };

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
    <div className="home-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap');
        
        .home-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: radial-gradient(circle at 10% 20%, rgba(240, 247, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 90%);
          min-height: 100vh;
          padding: 0 16px 80px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* HERO SECTION */
        .hero-section {
          position: relative;
          padding: 60px 40px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 32px;
          color: white;
          overflow: hidden;
          margin: 24px 0 40px;
          box-shadow: 0 20px 50px -15px rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          filter: blur(40px);
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
          filter: blur(45px);
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          color: #93c5fd;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }

        .hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: 42px;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -1px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #ffffff 40%, #bfdbfe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          font-size: 16px;
          color: #94a3b8;
          line-height: 1.6;
          max-width: 580px;
          margin-bottom: 32px;
        }

        /* HERO STATS */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 20px;
          max-width: 550px;
          backdrop-filter: blur(10px);
        }

        .stat-item {
          text-align: left;
        }

        .stat-num {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 6px;
          background: linear-gradient(135deg, #ffffff, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        /* WORKFLOW CARDS */
        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 24px;
          text-align: center;
          position: relative;
        }

        .section-title::after {
          content: '';
          display: block;
          width: 40px;
          height: 4px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-radius: 2px;
          margin: 8px auto 0;
        }

        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 48px;
        }

        .work-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .work-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.1);
          border-color: rgba(37, 99, 235, 0.2);
          background: white;
        }

        .work-icon-box {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin: 0 auto 16px;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.05);
        }

        .work-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .work-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
        }

        /* EXPLORE SECTION */
        .explore-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .explore-title {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        /* FILTERS */
        .filter-wrapper {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 10px 18px;
          border: 1px solid rgba(226, 234, 246, 0.8);
          border-radius: 14px;
          background: white;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          outline: none;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.03);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* REPORT CARDS */
        .report-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .report-item-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .report-item-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.12);
          background: white;
          border-color: rgba(37, 99, 235, 0.2);
        }

        .card-img-wrapper {
          position: relative;
          height: 180px;
          width: 100%;
          overflow: hidden;
          background: #f1f5f9;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .report-item-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-placeholder-icon {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
        }

        .card-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          backdrop-filter: blur(4px);
        }

        .card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-meta {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .card-desc {
          font-size: 14px;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 16px;
          flex: 1;
        }

        .card-footer {
          border-top: 1px solid rgba(226, 234, 246, 0.5);
          padding-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        /* EMPTY STATE */
        .empty-box {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 24px;
          border: 2px dashed rgba(226, 234, 246, 0.8);
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 40px 24px;
            text-align: center;
          }
          .hero-title {
            font-size: 32px;
          }
          .hero-desc {
            font-size: 14px;
            margin: 0 auto 24px;
          }
          .stats-container {
            grid-template-columns: 1fr;
            margin: 0 auto;
          }
          .explore-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .filter-wrapper {
            width: 100%;
          }
          .filter-select {
            flex: 1;
          }
        }
      `}</style>

      {/* HERO BANNER - CINEMATIC MODERN */}
      <div className="hero-section">
        <div className="hero-tag">✦ Layanan Pengaduan Fasilitas Kampus</div>
        <h1 className="hero-title">Wujudkan Kampus Nyaman & Aman Bersama</h1>
        <p className="hero-desc">
          Platform pelaporan digital interaktif yang menghubungkan civitas akademika, petugas lapangan, dan tim administrasi secara real-time untuk penanganan fasilitas yang cepat, transparan, dan terstruktur.
        </p>
        
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-num">{reports.length}</div>
            <div className="stat-label">Laporan Masuk</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{reports.filter(r => r.status === 'RESOLVED').length}</div>
            <div className="stat-label">Selesai Diperbaiki</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{reports.filter(r => ['PENDING', 'VALIDATED', 'IN_PROGRESS'].includes(r.status)).length}</div>
            <div className="stat-label">Sedang Diproses</div>
          </div>
        </div>
      </div>

      {/* CARA KERJA SISTEM */}
      <h2 className="section-title">Alur Proses Transparan</h2>
      <div className="workflow-grid">
        <div className="work-card">
          <div className="work-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>📝</div>
          <h3 className="work-title">1. Buat Laporan</h3>
          <p className="work-desc">Unggah detail kerusakan fasilitas beserta dokumentasi foto melalui akun Anda.</p>
        </div>
        <div className="work-card">
          <div className="work-icon-box" style={{ background: '#ede9fe', color: '#7c3aed' }}>🛡️</div>
          <h3 className="work-title">2. Verifikasi Petugas</h3>
          <p className="work-desc">Petugas mengecek validitas lokasi dan kelayakan foto kerusakan secara langsung.</p>
        </div>
        <div className="work-card">
          <div className="work-icon-box" style={{ background: '#dbeafe', color: '#2563eb' }}>🔧</div>
          <h3 className="work-title">3. Tindakan Admin</h3>
          <p className="work-desc">Tim administrasi menunjuk teknisi dan mengalokasikan sumber daya untuk perbaikan.</p>
        </div>
        <div className="work-card">
          <div className="work-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>✅</div>
          <h3 className="work-title">4. Selesai</h3>
          <p className="work-desc">Fasilitas selesai diperbaiki dan siap digunakan kembali demi kenyamanan bersama.</p>
        </div>
      </div>

      {/* EXPLORE REPORTS */}
      <div className="explore-header">
        <h2 className="explore-title">Laporan Terbaru Civitas</h2>
        <div className="filter-wrapper">
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="PENDING">Validasi Petugas</option>
            <option value="VALIDATED">Terverifikasi</option>
            <option value="IN_PROGRESS">Diproses</option>
            <option value="RESOLVED">Selesai</option>
            <option value="REJECTED">Ditolak</option>
          </select>
          <select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="report-grid">
        {reports.length === 0 ? (
          <div className="empty-box">
            <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: '#1e293b' }}>Tidak Ada Laporan</p>
            <p style={{ color: '#64748b', fontSize: 13 }}>Tidak ada laporan yang sesuai dengan kriteria penyaringan Anda.</p>
          </div>
        ) : reports.map(r => (
          <div key={r.id} className="report-item-card">
            <div className="card-img-wrapper">
              {r.imageUrl ? (
                <img src={r.imageUrl.split(',')[0]} className="card-image" alt="Foto Fasilitas" />
              ) : (
                <div className="card-placeholder-icon">🔧</div>
              )}
              <span className="card-badge" style={{ background: statusColor[r.status] }}>
                {statusIcon[r.status]} {statusLabel[r.status]}
              </span>
            </div>
            
            <div className="card-body">
              <div className="card-meta">
                <span>📍 {r.location}</span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span>📂 {r.category?.name}</span>
              </div>
              <h3 className="card-title">{r.title}</h3>
              <p className="card-desc">
                {r.description?.length > 90 ? r.description.slice(0, 90) + '...' : r.description}
              </p>
              
              <div className="card-footer">
                <span>👤 {r.user?.name}</span>
                <span>{new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}