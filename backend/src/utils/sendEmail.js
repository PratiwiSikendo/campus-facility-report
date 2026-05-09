const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const statusLabel = {
  PENDING: 'Menunggu Ditinjau',
  IN_PROGRESS: 'Sedang Diproses',
  RESOLVED: 'Selesai / Telah Diperbaiki',
  REJECTED: 'Ditolak',
};

const statusColor = {
  PENDING: '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  RESOLVED: '#10b981',
  REJECTED: '#ef4444',
};

async function sendStatusUpdateEmail({ to, name, reportTitle, status, adminNotes }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">🏛️ FasilitasKampus</h1>
        <p style="color: #bfdbfe; margin: 4px 0 0;">Sistem Pelaporan Fasilitas Kampus</p>
      </div>

      <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 16px;">Halo <strong>${name}</strong>,</p>
        <p style="color: #374151;">Status laporan kamu telah diperbarui oleh admin.</p>

        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Judul Laporan</p>
          <p style="margin: 0 0 16px; font-weight: bold; font-size: 16px; color: #111827;">${reportTitle}</p>

          <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Status Terbaru</p>
          <span style="background: ${statusColor[status]}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: bold;">
            ${statusLabel[status]}
          </span>

          ${adminNotes ? `
          <p style="margin: 16px 0 8px; color: #6b7280; font-size: 14px;">Catatan dari Admin</p>
          <p style="margin: 0; padding: 12px; background: #fef3c7; border-radius: 6px; color: #374151;">${adminNotes}</p>
          ` : ''}
        </div>

        <p style="color: #6b7280; font-size: 14px;">Kamu bisa login untuk melihat detail laporan di sistem.</p>
      </div>

      <div style="background: #f3f4f6; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 FasilitasKampus · Sistem Pelaporan Fasilitas</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"FasilitasKampus" <${process.env.EMAIL_USER}>`,
    to,
    subject: `[FasilitasKampus] Status Laporan "${reportTitle}" - ${statusLabel[status]}`,
    html,
  });
}

module.exports = { sendStatusUpdateEmail };