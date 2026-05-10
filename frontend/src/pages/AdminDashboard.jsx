import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
const statusLabel = { PENDING: 'Menunggu', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };
const statusColor = { PENDING: '#d97706', IN_PROGRESS: '#2563eb', RESOLVED: '#059669', REJECTED: '#dc2626' };
const statusBg = { PENDING: '#fef3c7', IN_PROGRESS: '#dbeafe', RESOLVED: '#d1fae5', REJECTED: '#fee2e2' };
const statusIcon = { PENDING: '⏳', IN_PROGRESS: '🔧', RESOLVED: '✅', REJECTED: '❌' };

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [stats, setStats] = useState({});
  const [notes, setNotes] = useState({});
  const [activeTab, setActiveTab] = useState('laporan');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [saving, setSaving] = useState({});
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
    axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers }).then(r => setStats(r.data));
    axios.get(`${import.meta.env.VITE_API_URL}/reports/categories`).then(r => setCategories(r.data));
  }, []);

  const fetchAll = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/admin/reports`, { headers }).then(r => {
      setAllReports(r.data);
      setReports(r.data);
    });
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    setExpandedId(null);
    if (!status) setReports(allReports);
    else setReports(allReports.filter(r => r.status === status));
  };

  const updateStatus = async (id, status) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/reports/${id}`,
        { status, adminNotes: notes[id] ?? allReports.find(r => r.id === id)?.adminNotes ?? '' },
        { headers });
      const updated = (r) => r.id === id ? { ...r, status, adminNotes: notes[id] ?? r.adminNotes } : r;
      setAllReports(prev => prev.map(updated));
      setReports(prev => {
        const newList = prev.map(updated);
        if (filterStatus && filterStatus !== status) return newList.filter(r => r.id !== id);
        return newList;
      });
      axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers }).then(r => setStats(r.data));
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/categories`, { name: newCategory }, { headers });
    setCategories(prev => [...prev, res.data]);
    setNewCategory('');
  };

  const statCards = [
    { label: 'Total', val: stats.total, icon: '📋', color: '#2563eb', bg: '#dbeafe', filter: '' },
    { label: 'Menunggu', val: stats.pending, icon: '⏳', color: '#d97706', bg: '#fef3c7', filter: 'PENDING' },
    { label: 'Diproses', val: stats.inProgress, icon: '🔧', color: '#2563eb', bg: '#dbeafe', filter: 'IN_PROGRESS' },
    { label: 'Selesai', val: stats.resolved, icon: '✅', color: '#059669', bg: '#d1fae5', filter: 'RESOLVED' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
      <style>{`
        .admin-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* STAT CARDS */
        .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
        @media (min-width: 640px) { .stat-grid { grid-template-columns: repeat(4, 1fr); } }
        .stat-card {
          background: white; border-radius: 16px; padding: 16px;
          box-shadow: 0 2px 12px rgba(59,130,246,0.1);
          border: 1.5px solid #e2eaf6; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; gap: 12px;
        }
        .stat-card:hover, .stat-card.active {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.18);
          border-color: var(--primary);
        }
        .stat-card.active { border-color: var(--primary); background: var(--primary-light); }
        .stat-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .stat-num { font-size: 26px; font-weight: 800; font-family: 'Outfit', sans-serif; line-height: 1; }
        .stat-lbl { font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px; }

        /* TABS */
        .tab-bar { display: flex; gap: 4px; background: #f0f7ff; padding: 4px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e2eaf6; }
        .tab-btn { flex: 1; padding: 10px; border-radius: 8px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: white; color: #2563eb; box-shadow: 0 2px 8px rgba(59,130,246,0.12); }

        /* FILTER CHIPS */
        .chips { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
        .chip { padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e2eaf6; background: white; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #64748b; }
        .chip.active { background: #2563eb; color: white; border-color: #2563eb; }

        /* REPORT CARDS */
        .r-card {
          background: white; border-radius: 14px; border: 1.5px solid #e2eaf6;
          margin-bottom: 10px; box-shadow: 0 2px 8px rgba(59,130,246,0.07);
          overflow: hidden; transition: all 0.2s;
        }
        .r-card:hover { box-shadow: 0 4px 16px rgba(59,130,246,0.14); }
        .r-header {
          padding: 16px; display: flex; align-items: center;
          gap: 12px; cursor: pointer;
        }
        .r-status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .r-title { font-size: 14px; font-weight: 600; flex: 1; }
        .r-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
        .r-chevron { font-size: 12px; color: #94a3b8; transition: transform 0.2s; flex-shrink: 0; }
        .r-chevron.open { transform: rotate(180deg); }

        /* EXPANDED */
        .r-body { border-top: 1px solid #f0f7ff; }
        .r-info { padding: 16px; background: #f8faff; }
        .r-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        @media (max-width: 480px) { .r-info-grid { grid-template-columns: 1fr; } }
        .r-info-item { background: white; border-radius: 8px; padding: 10px 12px; border: 1px solid #e2eaf6; }
        .r-info-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        .r-info-val { font-size: 13px; font-weight: 500; color: #0f172a; }
        .r-desc { background: white; border-radius: 8px; padding: 12px; border: 1px solid #e2eaf6; margin-bottom: 12px; font-size: 13px; line-height: 1.6; }
        .r-img { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; }

        /* CONTROL */
        .r-control { padding: 16px; border-top: 1px solid #e2eaf6; background: white; }
        .ctrl-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
        .ctrl-select { flex: 1; min-width: 140px; padding: 10px 12px; border: 1.5px solid #e2eaf6; border-radius: 10px; font-size: 13px; font-weight: 500; background: #f8faff; }
        .ctrl-textarea { width: 100%; padding: 10px 12px; border: 1.5px solid #e2eaf6; border-radius: 10px; font-size: 13px; resize: none; margin-bottom: 10px; background: #f8faff; box-sizing: border-box; }
        .ctrl-save { width: 100%; padding: 12px; background: linear-gradient(135deg, #2563eb, #0ea5e9); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 3px 10px rgba(37,99,235,0.3); transition: all 0.2s; }
        .ctrl-save:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(37,99,235,0.4); }
        .ctrl-save:disabled { opacity: 0.6; }

        /* EMPTY */
        .empty { text-align: center; padding: 48px 20px; background: white; border-radius: 14px; border: 2px dashed #e2eaf6; }

        /* CATEGORY */
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 16px; }
        .cat-item { background: white; border: 1.5px solid #e2eaf6; border-radius: 10px; padding: 14px 16px; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 1px 4px rgba(59,130,246,0.07); }
        .add-row { display: flex; gap: 10px; }
        .add-input { flex: 1; padding: 11px 14px; border: 1.5px solid #e2eaf6; border-radius: 10px; font-size: 14px; background: white; }
        .add-btn { padding: 11px 20px; background: linear-gradient(135deg, #2563eb, #0ea5e9); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 8px rgba(37,99,235,0.25); }
      `}</style>

      <div className="admin-page">
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Dashboard Admin</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Kelola laporan kerusakan fasilitas kampus</p>
        </div>

        {/* Stat Cards — klik untuk filter */}
        <div className="stat-grid">
          {statCards.map(s => (
            <div key={s.label} className={`stat-card ${filterStatus === s.filter && activeTab === 'laporan' ? 'active' : ''}`}
              onClick={() => { setActiveTab('laporan'); handleFilter(s.filter); }}>
              <div className="stat-icon-box" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className="stat-num" style={{ color: s.color }}>{s.val ?? 0}</div>
                <div className="stat-lbl">{s.label}</div>
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

        {/* Tab Laporan */}
        {activeTab === 'laporan' && (
          <>
            {/* Filter Chips */}
            <div className="chips">
              {[['', 'Semua', `${allReports.length}`],
                ['PENDING', 'Menunggu', `${stats.pending ?? 0}`],
                ['IN_PROGRESS', 'Diproses', `${stats.inProgress ?? 0}`],
                ['RESOLVED', 'Selesai', `${stats.resolved ?? 0}`],
                ['REJECTED', 'Ditolak', `${stats.rejected ?? 0}`]
              ].map(([val, lbl, count]) => (
                <button key={val} className={`chip ${filterStatus === val ? 'active' : ''}`}
                  onClick={() => handleFilter(val)}>
                  {lbl} <span style={{ opacity: 0.7, marginLeft: 4 }}>({count})</span>
                </button>
              ))}
            </div>

            {/* Laporan Count */}
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Menampilkan <strong>{reports.length}</strong> laporan
              {filterStatus ? ` · ${statusLabel[filterStatus]}` : ''}
            </p>

            {reports.length === 0 ? (
              <div className="empty">
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>Tidak ada laporan</p>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  {filterStatus ? `Tidak ada laporan dengan status "${statusLabel[filterStatus]}"` : 'Belum ada laporan masuk'}
                </p>
              </div>
            ) : reports.map(r => (
              <div key={r.id} className="r-card">
                {/* Header — klik untuk expand */}
                <div className="r-header" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                  <div className="r-status-dot" style={{ background: statusColor[r.status] }} />
                  <div className="r-title">{r.title}</div>
                  <span className="r-badge" style={{ background: statusBg[r.status], color: statusColor[r.status] }}>
                    {statusIcon[r.status]} {statusLabel[r.status]}
                  </span>
                  <span className={`r-chevron ${expandedId === r.id ? 'open' : ''}`}>▼</span>
                </div>

                {/* Info singkat */}
                {expandedId !== r.id && (
                  <div style={{ padding: '0 16px 14px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>👤 {r.user?.name}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>📍 {r.location}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>📂 {r.category?.name}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                      {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}

                {/* Expanded Detail */}
                {expandedId === r.id && (
                  <div className="r-body">
                    <div className="r-info">
                      <div className="r-info-grid">
                        <div className="r-info-item">
                          <div className="r-info-label">Pelapor</div>
                          <div className="r-info-val">{r.user?.name}</div>
                        </div>
                        <div className="r-info-item">
                          <div className="r-info-label">NIM</div>
                          <div className="r-info-val">{r.user?.nim || '-'}</div>
                        </div>
                        <div className="r-info-item">
                          <div className="r-info-label">Email</div>
                          <div className="r-info-val" style={{ fontSize: 12 }}>{r.user?.email}</div>
                        </div>
                        <div className="r-info-item">
                          <div className="r-info-label">Lokasi</div>
                          <div className="r-info-val">{r.location}</div>
                        </div>
                        <div className="r-info-item">
                          <div className="r-info-label">Kategori</div>
                          <div className="r-info-val">{r.category?.name}</div>
                        </div>
                        <div className="r-info-item">
                          <div className="r-info-label">Tanggal</div>
                          <div className="r-info-val">
                            {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div className="r-info-label" style={{ marginBottom: 6 }}>Deskripsi</div>
                      <div className="r-desc">{r.description}</div>

                      {r.imageUrl && <img src={r.imageUrl} alt="foto" className="r-img" />}

                      {r.adminNotes && (
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#92400e' }}>
                          📝 <strong>Catatan sebelumnya:</strong> {r.adminNotes}
                        </div>
                      )}
                    </div>

                    {/* Control Panel */}
                    <div className="r-control">
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                        Tindakan Admin
                      </p>
                      <div className="ctrl-row">
                        <select className="ctrl-select"
                          value={reports.find(x => x.id === r.id)?.status || r.status}
                          onChange={e => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: e.target.value } : x))}>
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{statusIcon[s]} {statusLabel[s]}</option>
                          ))}
                        </select>
                      </div>
                      <textarea className="ctrl-textarea" rows={2}
                        placeholder="Tulis catatan untuk pelapor..."
                        value={notes[r.id] ?? r.adminNotes ?? ''}
                        onChange={e => setNotes({ ...notes, [r.id]: e.target.value })} />
                      <button className="ctrl-save" disabled={saving[r.id]}
                        onClick={() => updateStatus(r.id, reports.find(x => x.id === r.id)?.status || r.status)}>
                        {saving[r.id] ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Tab Kategori */}
        {activeTab === 'kategori' && (
          <div>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>
              {categories.length} kategori tersedia
            </p>
            <div className="add-row">
              <input className="add-input" value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="Nama kategori baru..."
                onKeyDown={e => e.key === 'Enter' && addCategory()} />
              <button className="add-btn" onClick={addCategory}>+ Tambah</button>
            </div>
            <div className="cat-grid">
              {categories.map(c => (
                <div key={c.id} className="cat-item">
                  <span>📂</span> {c.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}