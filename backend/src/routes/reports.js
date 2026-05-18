const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET kategori
router.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// GET laporan milik user sendiri
router.get('/my', authMiddleware, async (req, res) => {
  const reports = await prisma.report.findMany({
    where: { userId: req.user.id },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(reports);
});

// GET semua laporan publik
router.get('/', async (req, res) => {
  const { status, categoryId } = req.query;
  const where = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;

  const reports = await prisma.report.findMany({
    where,
    include: { category: true, user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(reports);
});

// POST buat laporan baru
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, location, categoryId } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const ext = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        const { error } = await supabase.storage
          .from('report-images')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (!error) {
          const { data: urlData } = supabase.storage
            .from('report-images')
            .getPublicUrl(fileName);
          imageUrls.push(urlData.publicUrl);
        }
      }
    }

    const imageUrl = imageUrls.length > 0 ? imageUrls.join(',') : null;

    const report = await prisma.report.create({
      data: { title, description, location, categoryId, imageUrl, userId: req.user.id }
    });
    res.status(201).json(report);
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;