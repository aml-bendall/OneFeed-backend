const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
    const { username, password, email, name } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already taken' });
        }

        // Create a new user
        const user = new User({ username, password, email, name });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
};

// Log in a user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check if the password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, premium: user.premium }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and user details
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                premium: user.premium,
                email: user.email,
                circles: user.circles,
                recipeCount: user.recipeCount,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('circles');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            username: user.username,
            premium: user.premium,
            email: user.email,
            circles: user.circles,
            recipeCount: user.recipeCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
};
