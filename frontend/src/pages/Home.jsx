import { useEffect, useState } from 'react';
import axios from 'axios';

// Modern SVG Icons
const Icons = {
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
    </svg>
  ),
  Clipboard: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  Shield: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#7c3aed' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Wrench: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  Check: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#059669' }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Folder: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  User: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
};

const statusColor = { PENDING: '#f59e0b', VALIDATED: '#7c3aed', IN_PROGRESS: '#2563eb' };
const statusBg = { PENDING: '#fffbeb', VALIDATED: '#ede9fe', IN_PROGRESS: '#dbeafe' };
const statusLabel = { PENDING: 'Validasi Petugas', VALIDATED: 'Terverifikasi', IN_PROGRESS: 'Diproses' };

export default function Home() {
  const [reports, setReports] = useState([]);
  const [totalDbCount, setTotalDbCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterCategory) params.categoryId = filterCategory;
    axios.get(`${import.meta.env.VITE_API_URL}/reports`, { params }).then(r => {
      // HIDE RESOLVED AND REJECTED ENTIRELY
      const activeReports = r.data.filter(report => !['RESOLVED', 'REJECTED'].includes(report.status));
      setReports(activeReports);
    }).catch(() => {});
  }, [filterStatus, filterCategory]);

  useEffect(() => {
    // Get stats from database
    axios.get(`${import.meta.env.VITE_API_URL}/reports`).then(r => {
      setTotalDbCount(r.data.length);
      setResolvedCount(r.data.filter(x => x.status === 'RESOLVED').length);
    }).catch(() => {});
    
    axios.get(`${import.meta.env.VITE_API_URL}/reports/categories`).then(r => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <div className="home-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap');
        
        .home-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: radial-gradient(circle at 10% 20%, rgba(240, 247, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 90%);
          min-height: 100vh;
          padding: 0 16px 80px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* HERO SECTION */
        .hero-section {
          position: relative;
          padding: 80px 48px;
          background: linear-gradient(135deg, #090d16 0%, #111827 100%);
          border-radius: 32px;
          color: white;
          overflow: hidden;
          margin: 24px 0 48px;
          box-shadow: 0 30px 60px -15px rgba(9, 13, 22, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%);
          filter: blur(50px);
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, transparent 70%);
          filter: blur(50px);
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          font-size: 13px;
          font-weight: 700;
          color: #60a5fa;
          margin-bottom: 28px;
          backdrop-filter: blur(8px);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: 48px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff 30%, #93c5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          font-size: 17px;
          color: #94a3b8;
          line-height: 1.7;
          max-width: 620px;
          margin-bottom: 40px;
        }

        /* HERO STATS */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 24px 32px;
          max-width: 600px;
          backdrop-filter: blur(12px);
        }

        .stat-item {
          text-align: left;
        }

        .stat-num {
          font-family: 'Outfit', sans-serif;
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 6px;
          background: linear-gradient(135deg, #ffffff, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 800;
        }

        /* PLATFORM FOCUS SECTION */
        .focus-section {
          padding: 40px 0;
          margin-bottom: 48px;
        }

        .focus-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .focus-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .focus-content h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          margin-bottom: 16px;
        }

        .focus-content p {
          font-size: 15px;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .focus-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-card {
          display: flex;
          gap: 16px;
          background: white;
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid rgba(226, 234, 246, 0.8);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .feature-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          flex-shrink: 0;
        }

        .feature-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .feature-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
        }

        /* SECTION TITLE */
        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          text-align: center;
        }

        .section-subtitle {
          font-size: 15px;
          color: #64748b;
          text-align: center;
          max-width: 500px;
          margin: 0 auto 36px;
          line-height: 1.6;
        }

        /* WORKFLOW CARDS */
        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .work-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          padding: 28px 24px;
          text-align: center;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .work-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -15px rgba(37, 99, 235, 0.12);
          border-color: rgba(37, 99, 235, 0.25);
          background: white;
        }

        .work-icon-box {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.03);
        }

        .work-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .work-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }

        /* EXPLORE SECTION */
        .explore-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
          border-top: 1px solid rgba(226, 234, 246, 0.6);
          padding-top: 48px;
        }

        .explore-title {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
        }

        /* FILTERS */
        .filter-wrapper {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 12px 20px;
          border: 1px solid rgba(226, 234, 246, 0.8);
          border-radius: 16px;
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
          gap: 24px;
        }

        .report-item-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .report-item-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -15px rgba(37, 99, 235, 0.14);
          background: white;
          border-color: rgba(37, 99, 235, 0.25);
        }

        .card-img-wrapper {
          position: relative;
          height: 190px;
          width: 100%;
          overflow: hidden;
          background: #f1f5f9;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .report-item-card:hover .card-image {
          transform: scale(1.06);
        }

        .card-placeholder-icon {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }

        .card-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 6px 14px;
          border-radius: 24px;
          font-size: 11px;
          font-weight: 800;
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          backdrop-filter: blur(8px);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-meta {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.35;
        }

        .card-desc {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
        }

        .card-footer {
          border-top: 1px solid rgba(226, 234, 246, 0.5);
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
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
            padding: 48px 24px;
            text-align: center;
          }
          .hero-title {
            font-size: 34px;
          }
          .hero-desc {
            font-size: 15px;
            margin: 0 auto 30px;
          }
          .stats-container {
            grid-template-columns: 1fr;
            margin: 0 auto;
            padding: 16px;
          }
          .explore-header {
            flex-direction: column;
            align-items: flex-start;
            padding-top: 36px;
          }
          .filter-wrapper {
            width: 100%;
          }
          .filter-select {
            flex: 1;
            padding: 10px 14px;
          }
        }
      `}</style>

      {/* HERO BANNER - CINEMATIC MODERN */}
      <div className="hero-section">
        <div className="hero-tag">
          <Icons.Sparkles /> Platform Pelaporan Digital Kampus
        </div>
        <h1 className="hero-title">Bangun Infrastruktur Kampus yang Sempurna</h1>
        <p className="hero-desc">
          Sistem pelaporan cerdas yang dirancang khusus untuk mempermudah civitas akademika melaporkan kerusakan sarana prasarana. Mengintegrasikan pelapor, petugas lapangan, dan admin dalam satu alur kerja transparan demi terwujudnya fasilitas belajar mengajar yang kondusif.
        </p>
        
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-num">{totalDbCount}</div>
            <div className="stat-label">Laporan Masuk</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{resolvedCount}</div>
            <div className="stat-label">Selesai Diperbaiki</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{reports.length}</div>
            <div className="stat-label">Antrean Aktif</div>
          </div>
        </div>
      </div>

      {/* DETAILED EXPLANATION ABOUT SYSTEM (STORY-DRIVEN) */}
      <div className="focus-section">
        <div className="focus-grid">
          <div className="focus-content">
            <h2>Mekanisme Birokrasi yang Responsif & Modern</h2>
            <p>
              Kami percaya bahwa pemeliharaan sarana kampus adalah tanggung jawab bersama. Melalui sistem ini, setiap keluhan tidak lagi terhambat oleh birokrasi konvensional yang lambat. Platform ini dirancang untuk memotong rantai komunikasi yang tidak efisien, memastikan setiap kerusakan langsung sampai ke tangan pihak yang tepat.
            </p>
            <p>
              Dari ruang kelas ber-AC yang tidak dingin hingga kursi kuliah yang patah, laporkan segala kendala sarana prasarana dalam hitungan detik. Pantau status penanganan secara real-time dan berikan umpan balik langsung setelah perbaikan selesai dilakukan.
            </p>
          </div>
          <div className="focus-features">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h4 className="feature-title">Kolaborasi Tiga Aktor Utama</h4>
                <p className="feature-desc">Mahasiswa melapor, Petugas Lapangan memvalidasi kondisi fisik, dan Admin mengelola tindakan eksekusi perbaikan secara harmonis.</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h20"/><path d="M20 12v8H4v-8"/><path d="m12 2 10 10-10 10L2 12z"/>
                </svg>
              </div>
              <div>
                <h4 className="feature-title">Transparansi Penuh 100%</h4>
                <p className="feature-desc">Pelapor dapat melihat langsung catatan proses kerja dari tim admin dan riwayat pemantauan tanpa ada yang ditutup-tutupi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARA KERJA SISTEM */}
      <h2 className="section-title">Alur Penanganan Laporan</h2>
      <p className="section-subtitle">Bagaimana sistem kami bekerja dari awal laporan dikirimkan hingga selesai diperbaiki oleh tim teknisi.</p>
      
      <div className="workflow-grid">
        <div className="work-card">
          <div className="work-icon-box" style={{ background: '#eff6ff' }}>
            <Icons.Clipboard />
          </div>
          <h3 className="work-title">1. Ajukan Laporan</h3>
          <p className="work-desc">Mahasiswa mengunggah deskripsi kerusakan beserta bukti foto langsung di aplikasi.</p>
        </div>
        <div className="work-card">
          <div className="work-icon-box" style={{ background: '#f5f3ff' }}>
            <Icons.Shield />
          </div>
          <h3 className="work-title">2. Validasi Lapangan</h3>
          <p className="work-desc">Petugas memeriksa kondisi riil di lokasi untuk memastikan laporan valid.</p>
        </div>
        <div className="work-card">
          <div className="work-icon-box" style={{ background: '#eff6ff' }}>
            <Icons.Wrench />
          </div>
          <h3 className="work-title">3. Eksekusi Admin</h3>
          <p className="work-desc">Admin memproses tindakan penugasan teknisi untuk penanganan masalah di lapangan.</p>
        </div>
        <div className="work-card">
          <div className="work-icon-box" style={{ background: '#ecfdf5' }}>
            <Icons.Check />
          </div>
          <h3 className="work-title">4. Selesai Diperbaiki</h3>
          <p className="work-desc">Status laporan dinyatakan selesai, dan riwayat diarsipkan secara otomatis.</p>
        </div>
      </div>

      {/* EXPLORE REPORTS */}
      <div className="explore-header">
        <h2 className="explore-title">Laporan Dalam Penanganan</h2>
        <div className="filter-wrapper">
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Semua Status Aktif</option>
            <option value="PENDING">Validasi Petugas</option>
            <option value="VALIDATED">Terverifikasi</option>
            <option value="IN_PROGRESS">Diproses</option>
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p style={{ fontWeight: 800, fontSize: 17, marginBottom: 6, color: '#1e293b' }}>Tidak Ada Laporan Aktif</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Saat ini tidak ada laporan fasilitas yang sedang dalam status aktif penanganan.</p>
          </div>
        ) : reports.map(r => (
          <div key={r.id} className="report-item-card">
            <div className="card-img-wrapper">
              {r.imageUrl ? (
                <img src={r.imageUrl.split(',')[0]} className="card-image" alt="Foto Fasilitas" />
              ) : (
                <div className="card-placeholder-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
              )}
              <span className="card-badge" style={{ background: statusColor[r.status] }}>
                {r.status === 'PENDING' ? <Icons.Clock /> : r.status === 'VALIDATED' ? <Icons.Shield /> : <Icons.Wrench />}
                {statusLabel[r.status]}
              </span>
            </div>
            
            <div className="card-body">
              <div className="card-meta">
                <span><Icons.MapPin /> {r.location}</span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span><Icons.Folder /> {r.category?.name}</span>
              </div>
              <h3 className="card-title">{r.title}</h3>
              <p className="card-desc">
                {r.description?.length > 100 ? r.description.slice(0, 100) + '...' : r.description}
              </p>
              
              <div className="card-footer">
                <span><Icons.User /> {r.user?.name}</span>
                <span>{new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}