import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const statusColor = { PENDING: '#f59e0b', VALIDATED: '#7c3aed', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', REJECTED: '#ef4444' };
const statusBg = { PENDING: '#fffbeb', VALIDATED: '#ede9fe', IN_PROGRESS: '#eff6ff', RESOLVED: '#f0fdf4', REJECTED: '#fef2f2' };
const statusLabel = { PENDING: 'Validasi Petugas', VALIDATED: 'Terverifikasi', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };

function getStatusIcon(status, size = 14) {
  if (status === 'VALIDATED') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  }
  if (status === 'IN_PROGRESS') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
  }
  if (status === 'RESOLVED') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><polyline points="20 6 9 17 4 12"/></svg>;
  }
  if (status === 'REJECTED') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('aktif');
  const { token } = useAuth();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reports/my`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setReports(r.data));
  }, [token]);

  return (
    <div style={{ maxWidth: 850, margin: '40px auto', padding: '0 20px 80px', fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        /* HERO HEADER */
        .page-header { margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
        .page-title { fontSize: 28px; fontWeight: 800; background: linear-gradient(135deg, #0f172a, #334155); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; line-height: 1.2; }
        .page-subtitle { color: #64748b; font-size: 15px; }
        
        /* TABS */
        .tab-container { display: flex; gap: 8px; background: rgba(255,255,255,0.6); backdrop-filter: blur(12px); padding: 6px; border-radius: 16px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.8); }
        .tab-btn { flex: 1; padding: 12px 20px; border-radius: 12px; border: none; background: transparent; font-size: 14px; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; justify-content: center; align-items: center; gap: 8px; }
        .tab-btn.active { background: white; color: #2563eb; box-shadow: 0 4px 16px rgba(37,99,235,0.1); }
        .tab-badge { background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 20px; font-size: 11px; }
        .tab-btn.active .tab-badge { background: #dbeafe; color: #2563eb; }

        /* REPORT CARD */
        .report-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(16px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.9); padding: 24px; margin-bottom: 16px; box-shadow: 0 10px 30px -10px rgba(37,99,235,0.1); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .report-card:hover { box-shadow: 0 20px 40px -10px rgba(37,99,235,0.15); transform: translateY(-4px) scale(1.01); background: white; }
        .status-badge { padding: 6px 14px; border-radius: 24px; font-size: 12px; font-weight: 700; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .admin-note { margin-top: 16px; padding: 16px; background: rgba(255, 251, 235, 0.8); backdrop-filter: blur(8px); border: 1px solid rgba(253, 230, 138, 0.8); border-radius: 14px; font-size: 14px; color: #92400e; display: flex; gap: 12px; align-items: flex-start; line-height: 1.5; box-shadow: 0 2px 10px rgba(245, 158, 11, 0.05); }
        
        /* EMPTY STATE */
        .empty-state { text-align: center; padding: 60px 20px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(12px); border-radius: 24px; border: 2px dashed rgba(226, 234, 246, 0.8); }
        .empty-icon { width: 72px; height: 72px; border-radius: 20px; background: white; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; box-shadow: 0 8px 24px rgba(37,99,235,0.08); }
        
        /* BUTTONS */
        .new-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #2563eb, #0ea5e9); color: white; padding: 12px 24px; border-radius: 14px; text-decoration: none; font-size: 15px; font-weight: 700; box-shadow: 0 4px 16px rgba(37,99,235,0.3); transition: all 0.3s ease; }
        .new-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.4); }
      `}</style>

      <div className="page-header">
        <div>
          <h2 className="page-title">Laporan Saya</h2>
          <p className="page-subtitle">Pantau status laporan fasilitas kampus Anda</p>
        </div>
        <Link to="/laporan/buat" className="new-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Buat Laporan Baru
        </Link>
      </div>

      <div className="tab-container">
        <button 
          className={`tab-btn ${activeTab === 'aktif' ? 'active' : ''}`} 
          onClick={() => setActiveTab('aktif')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}><polygon points="5 3 19 12 5 21 5 3"/></svg> Berjalan <span className="tab-badge">{reports.filter(r => ['PENDING', 'VALIDATED', 'IN_PROGRESS'].includes(r.status)).length}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'riwayat' ? 'active' : ''}`} 
          onClick={() => setActiveTab('riwayat')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> Riwayat <span className="tab-badge">{reports.filter(r => ['RESOLVED', 'REJECTED'].includes(r.status)).length}</span>
        </button>
      </div>

      {reports.filter(r => activeTab === 'aktif' ? ['PENDING', 'VALIDATED', 'IN_PROGRESS'].includes(r.status) : ['RESOLVED', 'REJECTED'].includes(r.status)).length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
          </div>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#0f172a' }}>Belum ada laporan {activeTab === 'aktif' ? 'aktif' : 'di riwayat'}</p>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>{activeTab === 'aktif' ? 'Semua laporan Anda sudah diproses atau Anda belum membuat laporan baru.' : 'Laporan yang telah selesai atau ditolak akan muncul di sini.'}</p>
          {activeTab === 'aktif' && <Link to="/laporan/buat" className="new-btn">+ Mulai Lapor Pertama</Link>}
        </div>
      ) : reports.filter(r => activeTab === 'aktif' ? ['PENDING', 'VALIDATED', 'IN_PROGRESS'].includes(r.status) : ['RESOLVED', 'REJECTED'].includes(r.status)).map(r => (
        <div key={r.id} className="report-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{r.title}</h3>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {r.location}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> {r.category?.name}
                </span>
              </p>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{r.description}</p>
            </div>
            <span className="status-badge" style={{ background: statusBg[r.status], color: statusColor[r.status], flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {getStatusIcon(r.status, 12)} {statusLabel[r.status]}
            </span>
          </div>
          {r.adminNotes && (
            <div className="admin-note">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              <span><strong style={{ display: 'block', marginBottom: 2 }}>Catatan Admin:</strong> {r.adminNotes}</span>
            </div>
          )}
          {r.imageUrl && (
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {r.imageUrl.split(',').map((img, idx) => (
                <img key={idx} src={img} alt="foto" style={{ width: 'auto', maxWidth: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              ))}
            </div>
          )}
          <div style={{ borderTop: '1px solid rgba(226, 234, 246, 0.6)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>ID Laporan: #{r.id.slice(0,8).toUpperCase()}</p>
            <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
              {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}