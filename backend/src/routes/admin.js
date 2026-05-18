const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { sendStatusUpdateEmail } = require('../utils/sendEmail');

const router = express.Router();
const prisma = new PrismaClient();

// GET semua laporan (admin)
router.get('/reports', authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status) where.status = status;

  const reports = await prisma.report.findMany({
    where,
    include: { category: true, user: { select: { name: true, email: true, nim: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(reports);
});

// PATCH update status laporan + kirim email
router.patch('/reports/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    // Ambil data laporan beserta user
    const existing = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });

    if (!existing) return res.status(404).json({ error: 'Laporan tidak ditemukan' });

    const report = await prisma.report.update({
      where: { id: req.params.id },
      data: { status, adminNotes }
    });

    // Kirim email notifikasi ke pelapor
    try {
      await sendStatusUpdateEmail({
        to: existing.user.email,
        name: existing.user.name,
        reportTitle: existing.title,
        status,
        adminNotes,
      });
      console.log('✅ Email terkirim ke:', existing.user.email);
    } catch (emailErr) {
      console.error('❌ Gagal kirim email:', emailErr.message);
      // Tidak return error, laporan tetap terupdate meski email gagal
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET statistik
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  const [total, pending, inProgress, resolved, rejected] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.report.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.report.count({ where: { status: 'RESOLVED' } }),
    prisma.report.count({ where: { status: 'REJECTED' } }),
  ]);
  res.json({ total, pending, inProgress, resolved, rejected });
});

// POST tambah kategori
router.post('/categories', authMiddleware, adminOnly, async (req, res) => {
  const { name } = req.body;
  const cat = await prisma.category.create({ data: { name } });
  res.status(201).json(cat);
});

module.exports = router;
// Trigger nodemon restart for Prisma VALIDATED update