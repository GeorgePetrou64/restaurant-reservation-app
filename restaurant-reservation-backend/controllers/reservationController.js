// controllers/reservationController.js
const db = require('../models/db');

exports.createReservation = async (req, res) => {
  const { restaurant_id, date, time, people_count } = req.body;
  const user_id = req.user.id; // Extracted from JWT middleware

  try {
    await db.query(
      'INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)',
      [user_id, restaurant_id, date, time, people_count]
    );
    res.status(201).json({ message: 'Reservation created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getUserReservations = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [reservations] = await db.query(
      `SELECT r.reservation_id, r.date, r.time, r.people_count, res.name AS restaurant_name
       FROM reservations r
       JOIN restaurants res ON r.restaurant_id = res.restaurant_id
       WHERE r.user_id = ?`,
      [user_id]
    );
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteReservation = async (req, res) => {
  const reservation_id = req.params.id;
  const user_id = req.user.id; // From JWT

  try {
    const [reservation] = await db.query('SELECT * FROM reservations WHERE reservation_id = ?', [reservation_id]);
    
    if (reservation.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Unauthorized to delete this reservation' });
    }

    await db.query('DELETE FROM reservations WHERE reservation_id = ?', [reservation_id]);
    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReservation = async (req, res) => {
  const reservation_id = req.params.id;
  const { date, time, people_count } = req.body;
  const user_id = req.user.id;

  try {
    const [reservation] = await db.query('SELECT * FROM reservations WHERE reservation_id = ?', [reservation_id]);

    if (reservation.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Unauthorized to update this reservation' });
    }

    await db.query(
      'UPDATE reservations SET date = ?, time = ?, people_count = ? WHERE reservation_id = ?',
      [date, time, people_count, reservation_id]
    );

    res.json({ message: 'Reservation updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
