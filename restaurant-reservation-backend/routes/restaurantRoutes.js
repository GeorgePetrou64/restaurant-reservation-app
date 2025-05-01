// routes/restaurantRoutes.js
const express = require('express');
const router  = express.Router();
const db      = require('../models/db');
const jwtAuth = require('../middlewares/authMiddleware');

// GET /api/restaurants?q=term
router.get('/', async (req, res) => {
  const { q } = req.query;   // e.g. /api/restaurants?q=pizza
  try {
    let sql    = 'SELECT * FROM restaurants';
    let params = [];
    if (q) {
      sql += ' WHERE name LIKE ? OR location LIKE ?';
      const like = `%${q}%`;
      params = [like, like];
    }
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
