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
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, categoryId } = req.body;
    let imageUrl = null;

    if (req.file) {
      // Definisikan fileName di sini
      const ext = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;

      console.log('Mengupload file:', fileName);

      const { data, error } = await supabase.storage
        .from('report-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error.message);
      } else {
        const { data: urlData } = supabase.storage
          .from('report-images')
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
        console.log('✅ Image URL:', imageUrl);
      }
    }

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