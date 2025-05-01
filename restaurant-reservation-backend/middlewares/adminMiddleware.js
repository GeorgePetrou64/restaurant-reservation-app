// middlewares/adminMiddleware.js
const db = require('../models/db');

const isAdmin = async (req, res, next) => {
  const user_id = req.user.id;

  try {
    const [user] = await db.query('SELECT role FROM users WHERE user_id = ?', [user_id]);

    if (user.length === 0 || user[0].role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next(); // User is admin, continue
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isAdmin;
