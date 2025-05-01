// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Example: "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1]; // Get the token part
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to request
    next(); // Proceed to the route
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
