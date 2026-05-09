import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
const statusLabel = { PENDING: 'Menunggu', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };
const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', REJECTED: '#ef4444' };

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [notes, setNotes] = useState({});
  const [activeTab, setActiveTab] = useState('laporan');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const { token } = useAuth();

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchReports();
    axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers }).then(r => setStats(r.data));
    axios.get(`${import.meta.env.VITE_API_URL}/reports/categories`).then(r => setCategories(r.data));
  }, []);

  const fetchReports = (status = '') => {
    const params = status ? { status } : {};
    axios.get(`${import.meta.env.VITE_API_URL}/admin/reports`, { headers, params })
      .then(r => setReports(r.data));
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/admin/reports/${id}`,
      { status, adminNotes: notes[id] || '' }, { headers });
    setReports(prev => prev.map(r => r.id === id ? { ...r, status, adminNotes: notes[id] || r.adminNotes } : r));
    alert('Status berhasil diperbarui!');
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/categories`, { name: newCategory }, { headers });
    setCategories(prev => [...prev, res.data]);
    setNewCategory('');
    alert('Kategori berhasil ditambahkan!');
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    fetchReports(status);
  };

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #1e40af' : '3px solid transparent',
    background: 'transparent',
    cursor: 'pointer',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    color: activeTab === tab ? '#1e40af' : '#6b7280',
    fontSize: '15px',
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 16px' }}>
      <h2>⚙️ Dashboard Admin</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          ['Total', stats.total, '#1e40af'],
          ['Menunggu', stats.pending, '#f59e0b'],
          ['Diproses', stats.inProgress, '#3b82f6'],
          ['Selesai', stats.resolved, '#10b981'],
        ].map(([label, val, color]) => (
          <div key={label} style={{ background: color, color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{val ?? 0}</div>
            <div style={{ fontSize: '14px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <button style={tabStyle('laporan')} onClick={() => setActiveTab('laporan')}>📋 Kelola Laporan</button>
        <button style={tabStyle('kategori')} onClick={() => setActiveTab('kategori')}>📂 Kelola Kategori</button>
      </div>

      {/* Tab: Laporan */}
      {activeTab === 'laporan' && (
        <>
          {/* Filter status */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(s => (
              <button key={s} onClick={() => handleFilterStatus(s)}
                style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #d1d5db', cursor: 'pointer',
                  background: filterStatus === s ? '#1e40af' : 'white',
                  color: filterStatus === s ? 'white' : '#374151', fontSize: '13px' }}>
                {s === '' ? 'Semua' : statusLabel[s]}
              </button>
            ))}
          </div>

          {reports.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>Tidak ada laporan.</p>
          ) : reports.map(r => (
            <div key={r.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{r.title}</h3>
                    <span style={{ background: statusColor[r.status], color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                      {statusLabel[r.status]}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 6px' }}>
                    👤 {r.user?.name} ({r.user?.nim || 'no nim'}) · 📧 {r.user?.email}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 8px' }}>
                    📍 {r.location} · 📂 {r.category?.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px' }}>{r.description}</p>
                  {r.imageUrl && (
                    <img src={r.imageUrl} alt="foto" style={{ marginTop: '10px', maxWidth: '200px', borderRadius: '8px', maxHeight: '120px', objectFit: 'cover' }} />
                  )}
                  <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                    {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Kontrol admin */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
                  <label style={{ fontSize: '13px', color: '#6b7280' }}>Ubah Status:</label>
                  <select value={r.status} onChange={e => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: e.target.value } : x))}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                    {statusOptions.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
                  </select>
                  <label style={{ fontSize: '13px', color: '#6b7280' }}>Catatan untuk pelapor:</label>
                  <textarea rows={2} placeholder="Tulis catatan..." value={notes[r.id] || r.adminNotes || ''}
                    onChange={e => setNotes({ ...notes, [r.id]: e.target.value })}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'none' }} />
                  <button onClick={() => updateStatus(r.id, r.status)}
                    style={{ padding: '8px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    💾 Simpan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Tab: Kategori */}
      {activeTab === 'kategori' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input value={newCategory} onChange={e => setNewCategory(e.target.value)}
              placeholder="Nama kategori baru..."
              style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <button onClick={addCategory}
              style={{ padding: '10px 24px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              + Tambah
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {categories.map(c => (
              <div key={c.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', textAlign: 'center', background: '#f9fafb' }}>
                📂 {c.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}