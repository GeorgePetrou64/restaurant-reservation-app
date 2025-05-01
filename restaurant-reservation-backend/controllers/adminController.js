// controllers/adminController.js
const db = require('../models/db');

exports.getAllReservations = async (req, res) => {
  try {
    const [reservations] = await db.query(`
      SELECT r.reservation_id, u.name as user_name, res.name as restaurant_name, r.date, r.time, r.people_count
      FROM reservations r
      JOIN users u ON r.user_id = u.user_id
      JOIN restaurants res ON r.restaurant_id = res.restaurant_id
      ORDER BY r.date DESC
    `);

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT user_id, name, email, role FROM users'
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllUsers error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query('DELETE FROM users WHERE user_id = ?', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;   // expect 'admin' or 'user'
  try {
    await db.query(
      'UPDATE users SET role = ? WHERE user_id = ?',
      [role, userId]
    );
    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error('updateUserRole error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

