import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
const statusLabel = { PENDING: 'Menunggu', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };
const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', REJECTED: '#ef4444' };
const statusBg = { PENDING: '#fffbeb', IN_PROGRESS: '#eff6ff', RESOLVED: '#f0fdf4', REJECTED: '#fef2f2' };

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
    axios.get(`${import.meta.env.VITE_API_URL}/admin/reports`, { headers, params }).then(r => setReports(r.data));
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/admin/reports/${id}`,
      { status, adminNotes: notes[id] || '' }, { headers });
    setReports(prev => prev.map(r => r.id === id ? { ...r, status, adminNotes: notes[id] || r.adminNotes } : r));
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/categories`, { name: newCategory }, { headers });
    setCategories(prev => [...prev, res.data]);
    setNewCategory('');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 60px' }}>
      <style>{`
        .stat-card { background: var(--surface); border-radius: var(--radius-lg); padding: 20px 24px; box-shadow: var(--shadow); border: 1px solid var(--border); display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .stat-num { font-size: 28px; font-weight: 700; font-family: 'Outfit', sans-serif; }
        .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .tab-bar { display: flex; gap: 4px; background: var(--surface2); padding: 4px; border-radius: 12px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
        .tab-btn { flex: 1; padding: 10px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow-sm); }
        .filter-chips { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .chip { padding: 6px 16px; border-radius: 20px; border: 1.5px solid var(--border); background: var(--surface); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; color: var(--text-muted); }
        .chip:hover { border-color: var(--primary); color: var(--primary); }
        .chip.active { background: var(--primary); color: white; border-color: var(--primary); }
        .report-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; margin-bottom: 14px; box-shadow: var(--shadow-sm); transition: all 0.2s; }
        .report-card:hover { box-shadow: var(--shadow); }
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .control-panel { background: var(--surface2); border-radius: 10px; border: 1px solid var(--border); padding: 16px; display: flex; flex-direction: column; gap: 10px; min-width: 220px; }
        .control-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .save-btn { padding: 10px; background: linear-gradient(135deg, #3b82f6, #0ea5e9); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(59,130,246,0.3); transition: all 0.2s; }
        .save-btn:hover { transform: translateY(-1px); }
        .cat-card { background: var(--surface2); border-radius: 10px; border: 1px solid var(--border); padding: 16px; display: flex; align-items: center; gap: 10px; font-weight: 500; font-size: 14px; }
        .add-btn { padding: 11px 20px; background: linear-gradient(135deg, #3b82f6, #0ea5e9); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(59,130,246,0.3); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .add-btn:hover { transform: translateY(-1px); }
        @media (max-width: 640px) { .report-inner { flex-direction: column !important; } .control-panel { min-width: unset; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700 }}>Dashboard Admin</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Kelola laporan kerusakan fasilitas kampus</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Laporan', val: stats.total, icon: '📋', color: '#eff6ff', iconColor: '#3b82f6' },
          { label: 'Menunggu', val: stats.pending, icon: '⏳', color: '#fffbeb', iconColor: '#f59e0b' },
          { label: 'Diproses', val: stats.inProgress, icon: '🔧', color: '#eff6ff', iconColor: '#3b82f6' },
          { label: 'Selesai', val: stats.resolved, icon: '✓', color: '#f0fdf4', iconColor: '#10b981' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color, color: s.iconColor }}>{s.icon}</div>
            <div>
              <div className="stat-num" style={{ color: s.iconColor }}>{s.val ?? 0}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'laporan' ? 'active' : ''}`} onClick={() => setActiveTab('laporan')}>
          📋 Kelola Laporan
        </button>
        <button className={`tab-btn ${activeTab === 'kategori' ? 'active' : ''}`} onClick={() => setActiveTab('kategori')}>
          📂 Kelola Kategori
        </button>
      </div>

      {activeTab === 'laporan' && (
        <>
          <div className="filter-chips">
            {[['', 'Semua'], ['PENDING', 'Menunggu'], ['IN_PROGRESS', 'Diproses'], ['RESOLVED', 'Selesai'], ['REJECTED', 'Ditolak']].map(([val, label]) => (
              <button key={val} className={`chip ${filterStatus === val ? 'active' : ''}`}
                onClick={() => { setFilterStatus(val); fetchReports(val); }}>
                {label}
              </button>
            ))}
          </div>

          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Tidak ada laporan.</p>
            </div>
          ) : reports.map(r => (
            <div key={r.id} className="report-card">
              <div className="report-inner" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{r.title}</h3>
                    <span className="status-badge" style={{ background: statusBg[r.status], color: statusColor[r.status] }}>
                      {statusLabel[r.status]}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 4 }}>
                    👤 {r.user?.name} · {r.user?.nim || '-'} · {r.user?.email}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>
                    📍 {r.location} · 📂 {r.category?.name}
                  </p>
                  <p style={{ fontSize: 14 }}>{r.description}</p>
                  {r.imageUrl && <img src={r.imageUrl} alt="foto" style={{ marginTop: 10, maxWidth: 180, borderRadius: 8, maxHeight: 120, objectFit: 'cover' }} />}
                  <p style={{ color: 'var(--text-light)', fontSize: 12, marginTop: 8 }}>
                    {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="control-panel">
                  <div className="control-label">Ubah Status</div>
                  <select value={r.status}
                    onChange={e => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: e.target.value } : x))}>
                    {statusOptions.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
                  </select>
                  <div className="control-label">Catatan untuk Pelapor</div>
                  <textarea rows={2} placeholder="Tulis catatan..." value={notes[r.id] ?? r.adminNotes ?? ''}
                    onChange={e => setNotes({ ...notes, [r.id]: e.target.value })}
                    style={{ resize: 'none', fontSize: 13 }} />
                  <button className="save-btn" onClick={() => updateStatus(r.id, r.status)}>
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {activeTab === 'kategori' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <input value={newCategory} onChange={e => setNewCategory(e.target.value)}
              placeholder="Nama kategori baru..." style={{ flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && addCategory()} />
            <button className="add-btn" onClick={addCategory}>+ Tambah</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {categories.map(c => (
              <div key={c.id} className="cat-card">
                <span style={{ fontSize: 20 }}>📂</span> {c.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}