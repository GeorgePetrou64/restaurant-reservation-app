// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, deleteReservation, updateReservation } = require('../controllers/reservationController');
const authenticateToken = require('../middlewares/authMiddleware');

// POST /api/reservations
router.post('/', authenticateToken, createReservation);

// GET /api/reservations/my
router.get('/my', authenticateToken, getUserReservations);

module.exports = router;

// DELETE /api/reservations/:id
router.delete('/:id', authenticateToken, deleteReservation);

// PUT /api/reservations/:id
router.put('/:id', authenticateToken, updateReservation);


