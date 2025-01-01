const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User'); // Ensure the path to your User model is correct
const SocialMediaAccount = require('../models/SocialMediaAccount'); // Ensure the path is correct
const axios = require('axios'); // Required for token refresh logic

// Middleware to authenticate users and attach user details to req.user
const authMiddleware = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. Invalid or missing Authorization header.' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch linked social media accounts for the user
    const linkedAccounts = await SocialMediaAccount.find({
      userId: mongoose.Types.ObjectId.isValid(user._id) ? new mongoose.Types.ObjectId(user._id) : user._id,
    });

    // Attach user details and linked accounts to req.user
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      linkedAccounts, // Pass full account details for flexibility
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Function to refresh tokens for linked social media accounts
const refreshSocialMediaToken = async (userId, platform) => {
  try {
    // Ensure userId is an ObjectId if required
    const userIdObject = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // Fetch the social media account for the user and platform
    const account = await SocialMediaAccount.findOne({ userId: userIdObject, platform });
    if (!account || !account.refreshToken) {
      throw new Error(`${platform} account not linked or refresh token missing.`);
    }

    // Example: Refresh token logic for YouTube
    if (platform === 'YouTube') {
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: account.refreshToken,
        grant_type: 'refresh_token',
      });

      const { access_token, expires_in } = tokenResponse.data;

      // Update account with new token
      account.accessToken = access_token;
      account.expiresIn = expires_in;
      account.createdAt = new Date(); // Update the timestamp
      await account.save();

      return access_token;
    }

    throw new Error(`Token refresh logic not implemented for platform: ${platform}`);
  } catch (error) {
    console.error(`Error refreshing token for ${platform}:`, error.message);
    throw error;
  }
};

// Middleware to check and refresh token if necessary
const checkAndRefreshToken = async (req, res, next) => {
  const { platform } = req.query;

  try {
    if (!req.user || !platform) {
      return res.status(400).json({ message: 'User or platform not provided.' });
    }

    // Ensure userId is an ObjectId if required
    const userIdObject = mongoose.Types.ObjectId.isValid(req.user.id)
      ? new mongoose.Types.ObjectId(req.user.id)
      : req.user.id;

    // Fetch the account
    const account = await SocialMediaAccount.findOne({ userId: userIdObject, platform });
    if (!account) {
      return res.status(404).json({ message: `${platform} account not linked for this user.` });
    }

    const tokenExpiryTime = new Date(account.createdAt).getTime() + account.expiresIn * 1000;
    if (Date.now() > tokenExpiryTime) {
      console.log(`Refreshing token for platform: ${platform}`);
      req.accessToken = await refreshSocialMediaToken(req.user.id, platform);
    } else {
      req.accessToken = account.accessToken; // Use the existing token
    }

    next();
  } catch (error) {
    console.error('Error checking/refreshing token:', error.message);
    res.status(500).send({ message: `Failed to refresh token for ${platform}` });
  }
};

module.exports = {
  authMiddleware,
  refreshSocialMediaToken,
  checkAndRefreshToken,
};
