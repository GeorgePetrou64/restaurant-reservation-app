// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

// GET /api/users/me
router.get('/me', authenticateToken, async (req, res) => {
  const db = require('../models/db');
  const userId = req.user.id;

  try {
    const [user] = await db.query('SELECT user_id, name, email, role FROM users WHERE user_id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/users/register
router.post('/register', register);

// POST /api/users/login
router.post('/login', login);

module.exports = router;
