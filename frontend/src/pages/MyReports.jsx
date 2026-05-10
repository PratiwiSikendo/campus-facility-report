import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', REJECTED: '#ef4444' };
const statusBg = { PENDING: '#fffbeb', IN_PROGRESS: '#eff6ff', RESOLVED: '#f0fdf4', REJECTED: '#fef2f2' };
const statusLabel = { PENDING: 'Menunggu', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reports/my`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setReports(r.data));
  }, [token]);

  return (
    <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 20px 60px' }}>
      <style>{`
        .page-header { margin-bottom: 24px; }
        .page-header h2 { font-size: 24px; font-weight: 700; }
        .page-header p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
        .report-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; margin-bottom: 14px; box-shadow: var(--shadow-sm); transition: all 0.2s; }
        .report-card:hover { box-shadow: var(--shadow); transform: translateY(-1px); }
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .admin-note { margin-top: 12px; padding: 12px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 13px; color: #92400e; display: flex; gap: 8px; align-items: flex-start; }
        .empty-state { text-align: center; padding: 60px 20px; background: var(--surface); border-radius: var(--radius-lg); border: 2px dashed var(--border); }
        .empty-icon { width: 64px; height: 64px; border-radius: 16px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; }
        .new-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #3b82f6, #0ea5e9); color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(59,130,246,0.3); transition: all 0.2s; margin-top: 16px; }
        .new-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Laporan Saya</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{reports.length} laporan ditemukan</p>
        </div>
        <Link to="/laporan/buat" className="new-btn">+ Buat Laporan</Link>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Belum ada laporan</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Buat laporan pertama kamu.</p>
          <Link to="/laporan/buat" className="new-btn">+ Buat Laporan Pertama</Link>
        </div>
      ) : reports.map(r => (
        <div key={r.id} className="report-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{r.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>
                📍 {r.location} · 📂 {r.category?.name}
              </p>
              <p style={{ fontSize: 14 }}>{r.description}</p>
            </div>
            <span className="status-badge" style={{ background: statusBg[r.status], color: statusColor[r.status], flexShrink: 0 }}>
              {statusLabel[r.status]}
            </span>
          </div>
          {r.adminNotes && (
            <div className="admin-note">
              <span>📝</span>
              <span><strong>Catatan Admin:</strong> {r.adminNotes}</span>
            </div>
          )}
          {r.imageUrl && <img src={r.imageUrl} alt="foto" style={{ marginTop: 12, width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8 }} />}
          <p style={{ color: 'var(--text-light)', fontSize: 12, marginTop: 10 }}>
            {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  );
}