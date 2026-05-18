import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['VALIDATED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
const statusLabel = { VALIDATED: 'Terverifikasi', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak', PENDING: 'Validasi Petugas' };
const statusColor = { VALIDATED: '#7c3aed', IN_PROGRESS: '#2563eb', RESOLVED: '#059669', REJECTED: '#dc2626', PENDING: '#64748b' };
const statusBg = { VALIDATED: '#ede9fe', IN_PROGRESS: '#dbeafe', RESOLVED: '#d1fae5', REJECTED: '#fee2e2', PENDING: '#f1f5f9' };
const statusIcon = { VALIDATED: '🛡️', IN_PROGRESS: '🔧', RESOLVED: '✅', REJECTED: '❌', PENDING: '👀' };

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
      setReports(r.data.filter(x => ['VALIDATED', 'IN_PROGRESS'].includes(x.status)));
    });
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    setExpandedId(null);
    if (!status) setReports(allReports.filter(r => ['VALIDATED', 'IN_PROGRESS'].includes(r.status)));
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
    { label: 'Terverifikasi', val: allReports.filter(r => r.status === 'VALIDATED').length, icon: '🛡️', color: '#7c3aed', bg: '#ede9fe', filter: 'VALIDATED' },
    { label: 'Diproses', val: allReports.filter(r => r.status === 'IN_PROGRESS').length, icon: '🔧', color: '#2563eb', bg: '#dbeafe', filter: 'IN_PROGRESS' },
    { label: 'Selesai', val: allReports.filter(r => r.status === 'RESOLVED').length, icon: '✅', color: '#059669', bg: '#d1fae5', filter: 'RESOLVED' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
      <style>{`
        .admin-page { font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif; }

        /* STAT CARDS */
        .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; }
        @media (min-width: 640px) { .stat-grid { grid-template-columns: repeat(4, 1fr); } }
        .stat-card {
          background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(16px);
          border-radius: 20px; padding: 20px;
          box-shadow: 0 10px 30px -10px rgba(37,99,235,0.1);
          border: 1px solid rgba(255,255,255,0.8); cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; align-items: center; gap: 16px;
        }
        .stat-card:hover, .stat-card.active {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px -10px rgba(37,99,235,0.15);
          background: white;
        }
        .stat-card.active { border-color: var(--primary); }
        .stat-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .stat-num { font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; color: #0f172a; }
        .stat-lbl { font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        /* TABS */
        .tab-bar { display: flex; gap: 8px; background: rgba(255,255,255,0.5); padding: 6px; border-radius: 16px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.6); backdrop-filter: blur(10px); }
        .tab-btn { flex: 1; padding: 12px; border-radius: 12px; border: none; background: transparent; font-size: 14px; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.3s; }
        .tab-btn.active { background: white; color: #2563eb; box-shadow: 0 4px 12px rgba(37,99,235,0.1); }

        /* FILTER CHIPS */
        .chips { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .chip { padding: 8px 16px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.8); background: rgba(255,255,255,0.6); backdrop-filter: blur(8px); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #475569; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .chip:hover { background: white; transform: translateY(-1px); }
        .chip.active { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }

        /* REPORT CARDS */
        .r-card {
          background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px);
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.9);
          margin-bottom: 14px; box-shadow: 0 8px 24px -8px rgba(37,99,235,0.08);
          overflow: hidden; transition: all 0.3s ease;
        }
        .r-card:hover { box-shadow: 0 12px 32px -8px rgba(37,99,235,0.15); transform: translateY(-2px); }
        .r-header { padding: 18px 20px; display: flex; align-items: center; gap: 14px; cursor: pointer; }
        .r-status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.5); }
        .r-title { font-size: 15px; font-weight: 700; flex: 1; color: #0f172a; }
        .r-badge { padding: 5px 12px; border-radius: 24px; font-size: 12px; font-weight: 700; white-space: nowrap; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
        .r-chevron { font-size: 14px; color: #94a3b8; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; }
        .r-chevron.open { transform: rotate(180deg); }

        /* EXPANDED */
        .r-body { border-top: 1px solid rgba(226,234,246,0.5); background: rgba(248,250,255,0.5); }
        .r-info { padding: 20px; }
        .r-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        @media (max-width: 480px) { .r-info-grid { grid-template-columns: 1fr; } }
        .r-info-item { background: white; border-radius: 12px; padding: 12px 16px; border: 1px solid rgba(226,234,246,0.6); box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .r-info-label { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .r-info-val { font-size: 14px; font-weight: 600; color: #1e293b; }
        .r-desc { background: white; border-radius: 12px; padding: 16px; border: 1px solid rgba(226,234,246,0.6); margin-bottom: 16px; font-size: 14px; line-height: 1.6; color: #334155; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .r-img { width: auto; max-width: 100%; max-height: 240px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

        /* CONTROL */
        .r-control { padding: 20px; border-top: 1px solid rgba(226,234,246,0.5); background: white; }
        .ctrl-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
        .ctrl-select { flex: 1; min-width: 160px; padding: 12px 16px; border: 1.5px solid #e2eaf6; border-radius: 12px; font-size: 14px; font-weight: 600; background: #f8faff; outline: none; transition: border-color 0.2s; }
        .ctrl-select:focus { border-color: #3b82f6; }
        .ctrl-textarea { width: 100%; padding: 12px 16px; border: 1.5px solid #e2eaf6; border-radius: 12px; font-size: 14px; resize: none; margin-bottom: 16px; background: #f8faff; box-sizing: border-box; outline: none; font-family: inherit; transition: border-color 0.2s; }
        .ctrl-textarea:focus { border-color: #3b82f6; }
        .ctrl-save { width: 100%; padding: 14px; background: linear-gradient(135deg, #2563eb, #0ea5e9); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.3); transition: all 0.2s; }
        .ctrl-save:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
        .ctrl-save:disabled { opacity: 0.6; transform: none; box-shadow: none; }

        /* EMPTY */
        .empty { text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.6); backdrop-filter: blur(8px); border-radius: 20px; border: 2px dashed rgba(226,234,246,0.8); }

        /* CATEGORY */
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; margin-top: 20px; }
        .cat-item { background: rgba(255,255,255,0.8); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.9); border-radius: 14px; padding: 16px; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(37,99,235,0.05); transition: transform 0.2s; }
        .cat-item:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(37,99,235,0.1); }
        .add-row { display: flex; gap: 12px; }
        .add-input { flex: 1; padding: 14px 18px; border: 1.5px solid rgba(226,234,246,0.8); border-radius: 12px; font-size: 15px; background: rgba(255,255,255,0.8); backdrop-filter: blur(8px); outline: none; transition: border-color 0.2s; }
        .add-input:focus { border-color: #3b82f6; background: white; }
        .add-btn { padding: 14px 24px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px rgba(37,99,235,0.25); transition: all 0.2s; }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(37,99,235,0.35); }
      `}</style>

      <div className="admin-page">
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, background: 'linear-gradient(135deg, #0f172a, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard Admin</h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>Kelola laporan kerusakan fasilitas kampus dengan cepat & efisien.</p>
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
              {[['', 'Antrean', `${allReports.filter(r => ['VALIDATED', 'IN_PROGRESS'].includes(r.status)).length}`],
                ['VALIDATED', 'Terverifikasi', `${allReports.filter(r => r.status === 'VALIDATED').length}`],
                ['IN_PROGRESS', 'Diproses', `${allReports.filter(r => r.status === 'IN_PROGRESS').length}`],
                ['RESOLVED', 'Selesai', `${allReports.filter(r => r.status === 'RESOLVED').length}`],
                ['REJECTED', 'Ditolak', `${allReports.filter(r => r.status === 'REJECTED').length}`]
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

                      {r.imageUrl && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          {r.imageUrl.split(',').map((img, idx) => (
                            <img key={idx} src={img} alt="foto" className="r-img" style={{ width: 'auto', maxWidth: '100%', maxHeight: 200 }} />
                          ))}
                        </div>
                      )}

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