import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['VALIDATED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
const statusLabel = { VALIDATED: 'Terverifikasi', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak', PENDING: 'Validasi Petugas' };
const statusColor = { VALIDATED: '#7c3aed', IN_PROGRESS: '#2563eb', RESOLVED: '#059669', REJECTED: '#dc2626', PENDING: '#64748b' };
const statusBg = { VALIDATED: '#ede9fe', IN_PROGRESS: '#dbeafe', RESOLVED: '#d1fae5', REJECTED: '#fee2e2', PENDING: '#f1f5f9' };

// Beautiful modern SVG Icons
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/>
      <rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>
  ),
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Categories: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Stats: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ArrowUpRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  )
};

function getStatusIcon(status, size = 14) {
  if (status === 'VALIDATED') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  }
  if (status === 'IN_PROGRESS') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
  }
  if (status === 'RESOLVED') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><polyline points="20 6 9 17 4 12"/></svg>;
  }
  if (status === 'REJECTED') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [stats, setStats] = useState({});
  const [notes, setNotes] = useState({});
  
  // Menu navigation ('dashboard', 'reports', 'categories', 'statistics', 'users', 'settings')
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [saving, setSaving] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  const deleteCategory = async (catId) => {
    if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/categories/${catId}`, { headers });
      setCategories(prev => prev.filter(c => c.id !== catId));
    } catch {
      alert('Kategori gagal dihapus. Mungkin sedang digunakan oleh laporan.');
    }
  };

  // Searching report list
  const filteredReports = reports.filter(r => {
    const q = searchQuery.toLowerCase();
    return r.title?.toLowerCase().includes(q) || 
           r.location?.toLowerCase().includes(q) || 
           r.user?.name?.toLowerCase().includes(q) ||
           r.category?.name?.toLowerCase().includes(q);
  });

  return (
    <div className={`app-layout ${darkMode ? 'dark-theme' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --bg-main: #f8fafc;
          --bg-sidebar: #0f172a;
          --sidebar-text: #94a3b8;
          --sidebar-text-active: #ffffff;
          --sidebar-active: rgba(255, 255, 255, 0.08);
          --card-bg: rgba(255, 255, 255, 0.85);
          --card-border: rgba(226, 234, 246, 0.8);
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #94a3b8;
          --shadow-soft: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
          --border-color: #e2e8f0;
          --row-hover: #f8fafc;
        }

        .dark-theme {
          --bg-main: #090d16;
          --bg-sidebar: #030712;
          --sidebar-text: #6b7280;
          --sidebar-text-active: #f3f4f6;
          --sidebar-active: rgba(255, 255, 255, 0.04);
          --card-bg: rgba(17, 24, 39, 0.7);
          --card-border: rgba(255, 255, 255, 0.05);
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --shadow-soft: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
          --border-color: rgba(255, 255, 255, 0.06);
          --row-hover: rgba(255, 255, 255, 0.02);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .app-layout {
          font-family: 'Inter', sans-serif;
          background: var(--bg-main);
          min-height: 100vh;
          display: flex;
          color: var(--text-primary);
          transition: background-color 0.3s ease;
        }

        /* SIDEBAR */
        .sidebar {
          width: 250px;
          background: var(--bg-sidebar);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 16px;
          color: white;
          margin-bottom: 40px;
          letter-spacing: -0.5px;
        }

        .sidebar-logo {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--sidebar-text);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-link:hover {
          color: var(--sidebar-text-active);
          background: rgba(255, 255, 255, 0.03);
        }

        .sidebar-link.active {
          color: var(--sidebar-text-active);
          background: var(--sidebar-active);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .sidebar-footer {
          margin-top: auto;
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
        }

        /* MAIN BODY WRAPPER */
        .main-wrapper {
          flex: 1;
          margin-left: 250px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* TOPBAR */
        .topbar {
          height: 70px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          z-index: 90;
          transition: all 0.3s ease;
        }

        .dark-theme .topbar {
          background: rgba(9, 13, 22, 0.6);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          max-width: 320px;
        }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 8px 16px;
          width: 100%;
          transition: all 0.2s;
        }

        .topbar-search:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .topbar-search input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 13px;
          color: var(--text-primary);
          width: 100%;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .topbar-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .topbar-action-btn:hover {
          color: var(--text-primary);
          background: var(--row-hover);
        }

        .topbar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .topbar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .topbar-username {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* CONTENT AREA */
        .content-area {
          padding: 40px;
          flex: 1;
          overflow-y: auto;
        }

        /* WELCOME HEADER */
        .welcome-header {
          margin-bottom: 32px;
        }

        .welcome-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .welcome-sub {
          font-size: 14px;
          color: var(--text-secondary);
        }

        /* STAT CARDS SaaS STYLE */
        .stat-grid-saas {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        @media (max-width: 1024px) {
          .stat-grid-saas {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .stat-grid-saas {
            grid-template-columns: 1fr;
          }
        }

        .stat-card-saas {
          background: var(--card-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: var(--shadow-soft);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .stat-card-saas:hover {
          transform: translateY(-4px);
          background: white;
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.08);
          border-color: rgba(37, 99, 235, 0.15);
        }

        .dark-theme .stat-card-saas:hover {
          background: rgba(17, 24, 39, 0.95);
        }

        .stat-header-saas {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .stat-card-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-card-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }

        .stat-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }

        .trend-up {
          color: #059669;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ANALYTICS SECTION */
        .analytics-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }

        @media (max-width: 900px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-card {
          background: var(--card-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 28px;
          box-shadow: var(--shadow-soft);
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* TABLE VIEW SYSTEM */
        .table-card {
          background: var(--card-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 24px;
          box-shadow: var(--shadow-soft);
          margin-bottom: 32px;
        }

        .table-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .chips-saas {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .chip-saas {
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chip-saas:hover {
          color: var(--text-primary);
          background: var(--row-hover);
        }

        .chip-saas.active {
          background: #2563eb;
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        /* MODERN DATA TABLE */
        .table-container {
          overflow-x: auto;
          width: 100%;
        }

        .saas-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .saas-table th {
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border-color);
        }

        .saas-table td {
          padding: 16px 20px;
          font-size: 13.5px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .saas-table tr:hover td {
          background: var(--row-hover);
        }

        .table-thumbnail {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          object-fit: cover;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          border: 1px solid var(--card-border);
        }

        .badge-saas {
          padding: 6px 12px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* STEPPER PROGRESS */
        .stepper-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 24px 0 32px;
          position: relative;
        }

        .stepper-line {
          position: absolute;
          top: 15px;
          left: 40px;
          right: 40px;
          height: 3px;
          background: var(--border-color);
          z-index: 1;
        }

        .stepper-line-active {
          position: absolute;
          top: 15px;
          left: 40px;
          height: 3px;
          background: #2563eb;
          z-index: 2;
          transition: width 0.4s ease;
        }

        .stepper-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 3;
          position: relative;
        }

        .stepper-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-main);
          border: 3px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .stepper-step.active .stepper-circle {
          border-color: #2563eb;
          background: #2563eb;
          color: white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
        }

        .stepper-step.completed .stepper-circle {
          border-color: #059669;
          background: #059669;
          color: white;
        }

        .stepper-text {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-top: 8px;
        }

        /* DROPDOWN COLLAPSED VIEW */
        .expanded-row-box {
          padding: 28px;
          background: var(--row-hover);
          border-radius: 16px;
          border: 1px solid var(--card-border);
          margin-top: 12px;
        }

        /* CATEGORIES SECTION */
        .cat-saas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }

        .cat-saas-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: var(--shadow-soft);
          transition: all 0.2s;
        }

        .cat-saas-card:hover {
          transform: translateY(-2px);
          border-color: rgba(37, 99, 235, 0.2);
        }

        /* BUTTONS */
        .btn-saas {
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: none;
          transition: all 0.2s;
        }

        .btn-saas-primary {
          background: #2563eb;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .btn-saas-primary:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .btn-saas-danger {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }

        .btn-saas-danger:hover {
          background: #dc2626;
          color: white;
        }

        /* INPUTS */
        .input-saas {
          padding: 12px 16px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-primary);
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-saas:focus {
          border-color: #2563eb;
        }

        /* MOBILE MENU TOGGLE */
        .mobile-toggle {
          display: none;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .mobile-toggle {
            display: flex;
          }
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .main-wrapper {
            margin-left: 0;
          }
          .topbar {
            padding: 0 20px;
          }
          .content-area {
            padding: 24px 20px;
          }
        }
      `}</style>

      {/* LEFT SIDEBAR PERMANEN / COLLAPSIBLE MOBILE */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">C</div>
          <span>CAMPUS REPORTS</span>
        </div>

        <nav className="sidebar-nav">
          <div 
            className={`sidebar-link ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('dashboard'); setMobileMenuOpen(false); }}>
            <Icons.Dashboard />
            <span>Dashboard</span>
          </div>

          <div 
            className={`sidebar-link ${activeMenu === 'reports' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('reports'); setMobileMenuOpen(false); }}>
            <Icons.Reports />
            <span>Kelola Laporan</span>
          </div>

          <div 
            className={`sidebar-link ${activeMenu === 'categories' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('categories'); setMobileMenuOpen(false); }}>
            <Icons.Categories />
            <span>Kategori</span>
          </div>

          <div 
            className={`sidebar-link ${activeMenu === 'statistics' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('statistics'); setMobileMenuOpen(false); }}>
            <Icons.Stats />
            <span>Statistik</span>
          </div>

          <div 
            className={`sidebar-link ${activeMenu === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('users'); setMobileMenuOpen(false); }}>
            <Icons.Users />
            <span>Pengguna</span>
          </div>

          <div 
            className={`sidebar-link ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('settings'); setMobileMenuOpen(false); }}>
            <Icons.Settings />
            <span>Pengaturan</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <p>© 2026 Campus Facility</p>
          <p style={{ marginTop: 2, fontSize: 10 }}>v1.4.2 Enterprise</p>
        </div>
      </aside>

      {/* MAIN WRAPPER BODY */}
      <div className="main-wrapper">
        
        {/* HEADER / TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="topbar-search">
              <Icons.Search />
              <input 
                type="text" 
                placeholder="Cari keluhan atau lokasi..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="topbar-right">
            {/* Dark Mode toggle */}
            <button className="topbar-action-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>

            {/* Notifications */}
            <button className="topbar-action-btn" style={{ position: 'relative' }}>
              <Icons.Bell />
              <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
            </button>

            {/* Profile */}
            <div className="topbar-user">
              <div className="topbar-avatar">AD</div>
              <span className="topbar-username font-semibold">Administrator</span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="content-area">
          
          {/* CONDITION: MENU DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <div>
              {/* Welcome Section */}
              <div className="welcome-header">
                <h1 className="welcome-title">Selamat Datang, Admin</h1>
                <p className="welcome-sub">Berikut adalah tinjauan performa dan antrean laporan sarana prasarana hari ini.</p>
              </div>

              {/* STAT CARDS SAAS STYLE */}
              <div className="stat-grid-saas">
                <div className="stat-card-saas" onClick={() => { setActiveMenu('reports'); handleFilter(''); }}>
                  <div className="stat-header-saas">
                    <span className="stat-card-title">Total Laporan</span>
                    <div className="stat-card-icon-box" style={{ background: '#dbeafe', color: '#2563eb' }}>
                      <Icons.Reports />
                    </div>
                  </div>
                  <div className="stat-card-value">{stats.total ?? 0}</div>
                  <div className="stat-card-footer">
                    <span className="trend-up"><Icons.ArrowUpRight /> +14.2%</span>
                    <span style={{ color: 'var(--text-muted)' }}>dari bulan lalu</span>
                  </div>
                </div>

                <div className="stat-card-saas" onClick={() => { setActiveMenu('reports'); handleFilter('VALIDATED'); }}>
                  <div className="stat-header-saas">
                    <span className="stat-card-title">Menunggu Verifikasi</span>
                    <div className="stat-card-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                      <Icons.Bell />
                    </div>
                  </div>
                  <div className="stat-card-value">{allReports.filter(r => r.status === 'VALIDATED').length}</div>
                  <div className="stat-card-footer">
                    <span style={{ color: '#d97706', fontWeight: 600 }}>Tindakan Diperlukan</span>
                    <span style={{ color: 'var(--text-muted)' }}>segera ditinjau</span>
                  </div>
                </div>

                <div className="stat-card-saas" onClick={() => { setActiveMenu('reports'); handleFilter('IN_PROGRESS'); }}>
                  <div className="stat-header-saas">
                    <span className="stat-card-title">Sedang Diproses</span>
                    <div className="stat-card-icon-box" style={{ background: '#dbeafe', color: '#2563eb' }}>
                      <Icons.Stats />
                    </div>
                  </div>
                  <div className="stat-card-value">{allReports.filter(r => r.status === 'IN_PROGRESS').length}</div>
                  <div className="stat-card-footer">
                    <span className="trend-up"><Icons.ArrowUpRight /> +8.4%</span>
                    <span style={{ color: 'var(--text-muted)' }}>penugasan teknisi</span>
                  </div>
                </div>

                <div className="stat-card-saas" onClick={() => { setActiveMenu('reports'); handleFilter('RESOLVED'); }}>
                  <div className="stat-header-saas">
                    <span className="stat-card-title">Telah Selesai</span>
                    <div className="stat-card-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>
                      <Icons.Dashboard />
                    </div>
                  </div>
                  <div className="stat-card-value">{allReports.filter(r => r.status === 'RESOLVED').length}</div>
                  <div className="stat-card-footer">
                    <span style={{ color: '#059669', fontWeight: 700 }}>98.2% Selesai</span>
                    <span style={{ color: 'var(--text-muted)' }}>tingkat keberhasilan</span>
                  </div>
                </div>
              </div>

              {/* ANALYTICS SECTION (CHARTS) */}
              <div className="analytics-grid">
                
                {/* SVG Bar Chart for Monthly Reports */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title font-semibold">Tinjauan Laporan Bulanan</h3>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Tahun 2026</span>
                  </div>
                  <div style={{ height: 200, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0 30px' }}>
                    {/* Simulated dynamic SVG chart bars */}
                    {[
                      { m: 'Jan', val: 12 }, { m: 'Feb', val: 18 }, { m: 'Mar', val: 24 }, 
                      { m: 'Apr', val: stats.total || 32 }, { m: 'Mei', val: reports.length || 15 },
                      { m: 'Jun', val: 28 }, { m: 'Jul', val: 35 }
                    ].map((month, i) => {
                      const maxVal = 40;
                      const percentage = (month.val / maxVal) * 100;
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%', height: '100%' }}>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                            <div style={{ 
                              width: '100%', 
                              height: `${percentage}%`, 
                              background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', 
                              borderRadius: '8px 8px 0 0',
                              boxShadow: '0 4px 10px rgba(59,130,246,0.15)',
                              transition: 'height 0.8s ease'
                            }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, marginTop: 10, color: 'var(--text-secondary)' }}>{month.m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SVG Donut/Pie Chart for Kategori */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title font-semibold">Kategori Kerusakan</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                    <svg width="120" height="120" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="40 100" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="30 100" strokeDashoffset="-40" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="20 100" strokeDashoffset="-70" />
                    </svg>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
                      <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 700 }}>• Fasilitas</span>
                      <span style={{ fontSize: 10, color: '#7c3aed', fontWeight: 700 }}>• IT/Multimedia</span>
                      <span style={{ fontSize: 10, color: '#059669', fontWeight: 700 }}>• Lain-lain</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* LAPORAN TERBARU GRID / QUICK TABLE */}
              <div className="table-card">
                <div className="chart-header">
                  <h3 className="chart-title font-semibold">Laporan yang Baru Masuk</h3>
                  <button className="btn-saas btn-saas-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setActiveMenu('reports')}>Lihat Semua</button>
                </div>
                <div className="table-container">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Judul</th>
                        <th>Pelapor</th>
                        <th>Lokasi</th>
                        <th>Kategori</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allReports.slice(0, 4).map(r => (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 700 }}>{r.title}</td>
                          <td>{r.user?.name}</td>
                          <td>{r.location}</td>
                          <td>{r.category?.name}</td>
                          <td>
                            <span className="badge-saas" style={{ background: statusBg[r.status], color: statusColor[r.status] }}>
                              {statusLabel[r.status]}
                            </span>
                          </td>
                          <td>{new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CONDITION: MENU REPORTS (KELOLA LAPORAN) */}
          {activeMenu === 'reports' && (
            <div>
              <div className="welcome-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 className="welcome-title">Kelola Laporan Fasilitas</h1>
                  <p className="welcome-sub">Pantau, validasi, dan alokasikan pengerjaan kerusakan fasilitas.</p>
                </div>
              </div>

              {/* FILTER BAR FOR DATA TABLE */}
              <div className="table-card">
                <div className="table-filter-bar">
                  <div className="chips-saas">
                    {[
                      ['', 'Semua Aktif'],
                      ['VALIDATED', 'Terverifikasi'],
                      ['IN_PROGRESS', 'Diproses'],
                      ['RESOLVED', 'Selesai'],
                      ['REJECTED', 'Ditolak']
                    ].map(([val, label]) => (
                      <button 
                        key={val} 
                        className={`chip-saas ${filterStatus === val ? 'active' : ''}`}
                        onClick={() => handleFilter(val)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="table-container">
                  {filteredReports.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Tidak ada laporan ditemukan</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Gunakan filter atau kueri pencarian lain.</p>
                    </div>
                  ) : (
                    <table className="saas-table">
                      <thead>
                        <tr>
                          <th>Foto</th>
                          <th>Judul Laporan</th>
                          <th>Pelapor</th>
                          <th>Lokasi</th>
                          <th>Kategori</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map(r => (
                          <>
                            <tr key={r.id}>
                              <td>
                                {r.imageUrl ? (
                                  <img src={r.imageUrl.split(',')[0]} className="table-thumbnail" alt="Thumb" />
                                ) : (
                                  <div className="table-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', color: '#3b82f6', fontSize: 12 }}>🔧</div>
                                )}
                              </td>
                              <td>
                                <div style={{ fontWeight: 700 }}>{r.title}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>ID: #{r.id.slice(0, 8).toUpperCase()}</div>
                              </td>
                              <td>{r.user?.name}</td>
                              <td>{r.location}</td>
                              <td>{r.category?.name}</td>
                              <td>
                                <span className="badge-saas" style={{ background: statusBg[r.status], color: statusColor[r.status] }}>
                                  {getStatusIcon(r.status, 11)}
                                  <span style={{ marginLeft: 4 }}>{statusLabel[r.status]}</span>
                                </span>
                              </td>
                              <td>
                                <button className="btn-saas btn-saas-primary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                                  {expandedId === r.id ? 'Tutup' : 'Detail'}
                                </button>
                              </td>
                            </tr>

                            {/* COLLAPSIBLE DETAILED VIEW */}
                            {expandedId === r.id && (
                              <tr>
                                <td colSpan="7" style={{ padding: 0 }}>
                                  <div className="expanded-row-box">
                                    
                                    {/* PROGRESS STEPPER WORKFLOW */}
                                    <div className="stepper-container">
                                      <div className="stepper-line" />
                                      <div 
                                        className="stepper-line-active" 
                                        style={{ 
                                          width: r.status === 'PENDING' ? '0%' : 
                                                 r.status === 'VALIDATED' ? '33.33%' : 
                                                 r.status === 'IN_PROGRESS' ? '66.66%' : '100%' 
                                        }} 
                                      />
                                      
                                      <div className={`stepper-step completed`}>
                                        <div className="stepper-circle">1</div>
                                        <span className="stepper-text">Dilaporkan</span>
                                      </div>
                                      <div className={`stepper-step ${['VALIDATED', 'IN_PROGRESS', 'RESOLVED'].includes(r.status) ? 'completed' : ''}`}>
                                        <div className="stepper-circle">2</div>
                                        <span className="stepper-text">Diverifikasi</span>
                                      </div>
                                      <div className={`stepper-step ${['IN_PROGRESS', 'RESOLVED'].includes(r.status) ? 'completed' : ''}`}>
                                        <div className="stepper-circle">3</div>
                                        <span className="stepper-text">Diproses</span>
                                      </div>
                                      <div className={`stepper-step ${r.status === 'RESOLVED' ? 'completed' : ''}`}>
                                        <div className="stepper-circle">4</div>
                                        <span className="stepper-text">Selesai</span>
                                      </div>
                                    </div>

                                    {/* GRID CONTENT */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                                      <div>
                                        <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Informasi Detail</h4>
                                        <p style={{ fontSize: 14, marginBottom: 6 }}><strong>Pelapor:</strong> {r.user?.name} ({r.user?.nim || '-'})</p>
                                        <p style={{ fontSize: 14, marginBottom: 6 }}><strong>Email:</strong> {r.user?.email}</p>
                                        <p style={{ fontSize: 14, marginBottom: 12 }}><strong>Kategori & Lokasi:</strong> {r.category?.name} · {r.location}</p>
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 16, fontSize: 14, lineHeight: 1.6 }}>
                                          {r.description}
                                        </div>
                                      </div>

                                      <div>
                                        <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Ubah Status & Catatan</h4>
                                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                          <select 
                                            className="input-saas" 
                                            style={{ flex: 1 }}
                                            value={reports.find(x => x.id === r.id)?.status || r.status}
                                            onChange={e => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: e.target.value } : x))}
                                          >
                                            {statusOptions.map(s => (
                                              <option key={s} value={s}>{statusLabel[s]}</option>
                                            ))}
                                          </select>
                                        </div>
                                        
                                        <textarea 
                                          className="input-saas"
                                          style={{ width: '100%', height: 70, resize: 'none', marginBottom: 12 }}
                                          placeholder="Tulis instruksi atau catatan perbaikan..."
                                          value={notes[r.id] ?? r.adminNotes ?? ''}
                                          onChange={e => setNotes({ ...notes, [r.id]: e.target.value })}
                                        />

                                        <button 
                                          className="btn-saas btn-saas-primary" 
                                          style={{ width: '100%', justifyContent: 'center' }}
                                          disabled={saving[r.id]}
                                          onClick={() => updateStatus(r.id, reports.find(x => x.id === r.id)?.status || r.status)}
                                        >
                                          {saving[r.id] ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Foto Pendukung */}
                                    {r.imageUrl && (
                                      <div style={{ marginTop: 20 }}>
                                        <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Foto Kerusakan</h4>
                                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                          {r.imageUrl.split(',').map((img, idx) => (
                                            <img key={idx} src={img} alt="fasilitas" style={{ maxHeight: 180, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CONDITION: MENU CATEGORIES (KELOLA KATEGORI) */}
          {activeMenu === 'categories' && (
            <div>
              <div className="welcome-header">
                <h1 className="welcome-title">Kelola Kategori Fasilitas</h1>
                <p className="welcome-sub">Atur kategori yang digunakan civitas untuk menyaring pengaduan.</p>
              </div>

              <div className="table-card">
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  <input 
                    type="text" 
                    className="input-saas" 
                    style={{ flex: 1 }}
                    placeholder="Tulis kategori baru..." 
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  />
                  <button className="btn-saas btn-saas-primary" onClick={addCategory}>Tambah Kategori</button>
                </div>

                <div className="cat-saas-grid">
                  {categories.map(c => (
                    <div key={c.id} className="cat-saas-card font-semibold">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Icons.Categories /> {c.name}
                      </span>
                      <button className="btn-saas btn-saas-danger" style={{ padding: '6px 10px' }} onClick={() => deleteCategory(c.id)}>
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONDITION: STATISTIK PLACEHOLDER */}
          {activeMenu === 'statistics' && (
            <div>
              <div className="welcome-header">
                <h1 className="welcome-title">Analisis & Statistik</h1>
                <p className="welcome-sub">Grafik performa respons, durasi pengerjaan, dan tingkat kenyamanan fasilitas.</p>
              </div>
              <div className="table-card" style={{ padding: 40, textAlign: 'center' }}>
                <Icons.Stats />
                <h3 style={{ margin: '16px 0 8px' }} className="font-semibold">Statistik Enterprise</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto 20px', fontSize: 14 }}>
                  Tinjauan lengkap tentang berapa lama rata-rata waktu respons penanganan keluhan dari Validasi Petugas hingga status Selesai.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, maxWidth: 600, margin: '0 auto' }}>
                  <div style={{ padding: 16, background: 'var(--row-hover)', borderRadius: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>1.8 Hari</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Rata-rata Respon</div>
                  </div>
                  <div style={{ padding: 16, background: 'var(--row-hover)', borderRadius: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>98.6%</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Kepuasan Civitas</div>
                  </div>
                  <div style={{ padding: 16, background: 'var(--row-hover)', borderRadius: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>45 Menit</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Durasi Validasi</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONDITION: PENGGUNA PLACEHOLDER */}
          {activeMenu === 'users' && (
            <div>
              <div className="welcome-header">
                <h1 className="welcome-title">Kelola Pengguna</h1>
                <p className="welcome-sub">Manajemen akun mahasiswa, petugas lapangan, dan administrator.</p>
              </div>
              <div className="table-card" style={{ padding: 40, textAlign: 'center' }}>
                <Icons.Users />
                <h3 style={{ margin: '16px 0 8px' }} className="font-semibold">Manajemen Pengguna Terintegrasi</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto', fontSize: 14 }}>
                  Fitur ini memungkinkan administrator utama memberikan otorisasi untuk akun Petugas atau mencabut hak akses pengguna yang melanggar ketentuan pelaporan.
                </p>
              </div>
            </div>
          )}

          {/* CONDITION: PENGATURAN PLACEHOLDER */}
          {activeMenu === 'settings' && (
            <div>
              <div className="welcome-header">
                <h1 className="welcome-title">Pengaturan Sistem</h1>
                <p className="welcome-sub">Konfigurasi notifikasi, integrasi database, dan preferensi server.</p>
              </div>
              <div className="table-card" style={{ padding: 40, textAlign: 'center' }}>
                <Icons.Settings />
                <h3 style={{ margin: '16px 0 8px' }} className="font-semibold">Konfigurasi Aplikasi</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto', fontSize: 14 }}>
                  Sesuaikan nama kampus, limitasi ukuran unggahan file gambar, serta aktifkan sistem pengiriman notifikasi email otomatis ke civitas.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}