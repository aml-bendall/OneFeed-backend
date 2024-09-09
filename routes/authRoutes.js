// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../src/controllers/authController');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Add a refresh token endpoint on the backend
router.post('/refresh-token', (req, res) => {
    const refreshToken = req.body.refreshToken;

    // Verify the refresh token and issue a new JWT
    if (isValidRefreshToken(refreshToken)) {
        const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: newToken });
    } else {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});

module.exports = router;