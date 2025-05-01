const express = require('express');
const router = express.Router();
const { getAllReservations } = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const db = require('../models/db'); // your MariaDB connection

const { getAllUsers, deleteUser, updateUserRole } = require('../controllers/adminController');

// GET /api/admin/reservations
router.get('/reservations', authenticateToken, isAdmin, getAllReservations);

// DELETE /api/admin/reservations/:id
router.delete('/reservations/:id', authenticateToken, isAdmin, async (req, res) => {
  const reservationId = req.params.id;
  try {
    await db.query('DELETE FROM reservations WHERE reservation_id = ?', [reservationId]);
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/stats
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Count users
    const [userRows] = await db.query(
      'SELECT COUNT(*) AS userCount FROM users'
    );
    const userCount = userRows[0]?.userCount || 0;
    // Count reservations
    const [reservationRows] = await db.query(
      'SELECT COUNT(*) AS reservationCount FROM reservations'
    );
    const reservationCount = reservationRows[0]?.reservationCount || 0;
    res.json({ users: userCount, reservations: reservationCount });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET /api/admin/users
router.get('/users', authenticateToken, isAdmin, getAllUsers);

// DELETE /api/admin/users/:id
router.delete('/users/:id', authenticateToken, isAdmin, deleteUser);

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', authenticateToken, isAdmin, updateUserRole);

module.exports = router;
