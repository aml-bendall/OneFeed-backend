const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const authMiddleware = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from the database
    const user = await User.findById(decoded.id).populate('circles', 'name description'); // Populate circle info
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user data, including circles, to req.user
    req.user = {
      id: user.id,
      premium: user.premium,
      name: user.name,
      email: user.email,
      circles: user.circles, // Add populated circles
    };

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error.message); // Log the error for debugging
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to enforce premium access
const premiumMiddleware = (req, res, next) => {
  if (!req.user.premium) {
    return res.status(403).json({ message: 'This feature is available for Premium users only.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  premiumMiddleware,
};
