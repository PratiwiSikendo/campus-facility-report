const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', RESOLVED: '#10b981', REJECTED: '#ef4444' };
const statusLabel = { PENDING: 'Menunggu', IN_PROGRESS: 'Diproses', RESOLVED: 'Selesai', REJECTED: 'Ditolak' };

export default function ReportCard({ report }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{report.title}</h3>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 8px' }}>
            📍 {report.location} · 📂 {report.category?.name}
          </p>
          <p style={{ margin: 0, fontSize: '14px' }}>{report.description}</p>
          {report.adminNotes && (
            <p style={{ marginTop: '8px', padding: '8px', background: '#fef3c7', borderRadius: '6px', fontSize: '13px' }}>
              📝 Catatan admin: {report.adminNotes}
            </p>
          )}
        </div>
        <span style={{ background: statusColor[report.status], color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
          {statusLabel[report.status]}
        </span>
      </div>
      {report.imageUrl && (
        <img src={report.imageUrl} alt="foto kerusakan" style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />
      )}
      <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
        {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  );
}