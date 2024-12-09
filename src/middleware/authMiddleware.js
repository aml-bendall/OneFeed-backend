const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
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
        req.user = decoded; // Attach the decoded user data to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error); // Log the error for debugging
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
