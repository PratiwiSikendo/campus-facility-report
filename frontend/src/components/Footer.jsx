import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: '#f8fafc',
      padding: '24px',
      textAlign: 'center',
      borderTop: '1px solid #e2e8f0',
      color: '#64748b',
      fontSize: '14px',
      marginTop: 'auto'
    }}>
      <p>&copy; {new Date().getFullYear()} Sistem Pelaporan Fasilitas Kampus. All rights reserved.</p>
    </footer>
  );
}
