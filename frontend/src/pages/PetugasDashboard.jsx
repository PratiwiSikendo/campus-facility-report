import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusLabel = { PENDING: 'Menunggu Validasi', VALIDATED: 'Terverifikasi', REJECTED: 'Ditolak' };
const statusColor = { PENDING: '#d97706', VALIDATED: '#7c3aed', REJECTED: '#dc2626' };
const statusBg = { PENDING: '#fef3c7', VALIDATED: '#ede9fe', REJECTED: '#fee2e2' };

function getStatusIcon(status, size = 14) {
  if (status === 'VALIDATED') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  }
  if (status === 'REJECTED') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

export default function PetugasDashboard() {
  const [reports, setReports] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [saving, setSaving] = useState({});
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const fetchPendingReports = () => {
    // Only fetch PENDING reports for petugas to validate
    axios.get(`${import.meta.env.VITE_API_URL}/admin/reports?status=PENDING`, { headers }).then(r => {
      setReports(r.data);
    });
  };

  const updateStatus = async (id, status) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      if (!window.confirm(`Yakin menandai laporan ini sebagai ${statusLabel[status]}?`)) return;
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/reports/${id}`, { status }, { headers });
      setReports(prev => prev.filter(r => r.id !== id));
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Validasi Laporan (Petugas)</h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>Periksa keaslian foto dan detail laporan sebelum diteruskan ke tahap pengerjaan (Admin).</p>
      </div>

      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
        Menunggu Validasi: <strong>{reports.length}</strong> laporan
      </p>

      {reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: 'white', borderRadius: 14, border: '2px dashed #e2eaf6' }}>
          <div style={{ marginBottom: 12 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Semua Beres!</p>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Tidak ada laporan baru yang perlu divalidasi saat ini.</p>
        </div>
      ) : reports.map(r => (
        <div key={r.id} style={{ background: 'white', borderRadius: 14, border: '1.5px solid #e2eaf6', marginBottom: 10, overflow: 'hidden' }}>
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor[r.status] }} />
            <div style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{r.title}</div>
             <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusBg[r.status], color: statusColor[r.status], display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {getStatusIcon(r.status, 11)} {statusLabel[r.status]}
             </span>
            <span style={{ fontSize: 12, color: '#94a3b8', transform: expandedId === r.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
          </div>

          {expandedId !== r.id && (
            <div style={{ padding: '0 16px 14px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> {r.user?.name}
              </span>
              <span style={{ fontSize: 12, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {r.location}
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {expandedId === r.id && (
            <div style={{ borderTop: '1px solid #f0f7ff' }}>
              <div style={{ padding: 16, background: '#f8faff' }}>
                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Deskripsi & Foto</p>
                <div style={{ background: 'white', borderRadius: 8, padding: 12, border: '1px solid #e2eaf6', marginBottom: 12, fontSize: 13 }}>
                  {r.description}
                </div>

                {r.imageUrl && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {r.imageUrl.split(',').map((img, idx) => (
                      <img key={idx} src={img} alt="foto" style={{ width: '100%', maxWidth: '300px', objectFit: 'cover', borderRadius: 8 }} />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ padding: 16, borderTop: '1px solid #e2eaf6', background: 'white' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 10 }}>Aksi Validasi</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    disabled={saving[r.id]}
                    onClick={() => updateStatus(r.id, 'REJECTED')}
                    style={{ flex: 1, padding: 12, background: '#fee2e2', color: '#dc2626', border: '1px solid #f87171', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {saving[r.id] ? 'Menyimpan...' : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Tolak Laporan (Tidak Valid)
                      </>
                    )}
                  </button>
                  <button 
                    disabled={saving[r.id]}
                    onClick={() => updateStatus(r.id, 'VALIDATED')}
                    style={{ flex: 1, padding: 12, background: '#ede9fe', color: '#7c3aed', border: '1px solid #c4b5fd', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {saving[r.id] ? 'Menyimpan...' : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Verifikasi (Teruskan ke Admin)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
