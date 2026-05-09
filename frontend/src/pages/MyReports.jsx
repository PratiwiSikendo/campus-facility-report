import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', REJECTED: '#ef4444' };
const statusLabel = { PENDING: 'Menunggu', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/reports/my`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setReports(res.data));
  }, [token]);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px' }}>
      <h2>Laporan Saya</h2>
      {reports.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Belum ada laporan. <a href="/laporan/buat">Buat laporan pertama</a></p>
      ) : reports.map(r => (
        <div key={r.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 4px' }}>{r.title}</h3>
              <p style={{ color: '#6b7280', margin: '0 0 8px', fontSize: '14px' }}>📍 {r.location} · 📂 {r.category?.name}</p>
              <p style={{ margin: 0 }}>{r.description}</p>
              {r.adminNotes && <p style={{ marginTop: '8px', padding: '8px', background: '#fef3c7', borderRadius: '6px', fontSize: '14px' }}>📝 Catatan admin: {r.adminNotes}</p>}
            </div>
            <span style={{ background: statusColor[r.status], color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', whiteSpace: 'nowrap' }}>
              {statusLabel[r.status]}
            </span>
          </div>
          {r.imageUrl && <img src={r.imageUrl} alt="foto" style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />}
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
            {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  );
}