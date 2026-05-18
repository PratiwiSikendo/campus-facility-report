import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusLabel = { PENDING: 'Menunggu Validasi', VALIDATED: 'Tervalidasi', REJECTED: 'Ditolak' };
const statusColor = { PENDING: '#d97706', VALIDATED: '#059669', REJECTED: '#dc2626' };
const statusBg = { PENDING: '#fef3c7', VALIDATED: '#d1fae5', REJECTED: '#fee2e2' };
const statusIcon = { PENDING: '⏳', VALIDATED: '✅', REJECTED: '❌' };

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
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Dashboard Petugas</h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>Validasi kelayakan gambar dan detail laporan sebelum diteruskan ke Admin</p>
      </div>

      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
        Menunggu Validasi: <strong>{reports.length}</strong> laporan
      </p>

      {reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: 'white', borderRadius: 14, border: '2px dashed #e2eaf6' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Semua Beres!</p>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Tidak ada laporan baru yang perlu divalidasi saat ini.</p>
        </div>
      ) : reports.map(r => (
        <div key={r.id} style={{ background: 'white', borderRadius: 14, border: '1.5px solid #e2eaf6', marginBottom: 10, overflow: 'hidden' }}>
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor[r.status] }} />
            <div style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{r.title}</div>
            <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusBg[r.status], color: statusColor[r.status] }}>
              {statusIcon[r.status]} {statusLabel[r.status]}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8', transform: expandedId === r.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
          </div>

          {expandedId !== r.id && (
            <div style={{ padding: '0 16px 14px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>👤 {r.user?.name}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>📍 {r.location}</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
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
                    style={{ flex: 1, padding: 12, background: '#fee2e2', color: '#dc2626', border: '1px solid #f87171', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    {saving[r.id] ? '⏳...' : '❌ Tidak Layak (Tolak)'}
                  </button>
                  <button 
                    disabled={saving[r.id]}
                    onClick={() => updateStatus(r.id, 'VALIDATED')}
                    style={{ flex: 1, padding: 12, background: '#d1fae5', color: '#059669', border: '1px solid #34d399', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    {saving[r.id] ? '⏳...' : '✅ Layak (Teruskan ke Admin)'}
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
