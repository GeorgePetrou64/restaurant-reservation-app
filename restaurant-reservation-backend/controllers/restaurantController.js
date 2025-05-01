// controllers/restaurantController.js
const db = require('../models/db');

exports.getRestaurants = async (req, res) => {
  const search = req.query.search; // ?search=keyword

  try {
    let query = 'SELECT * FROM restaurants';
    let params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR location LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    const [restaurants] = await db.query(query, params);
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
