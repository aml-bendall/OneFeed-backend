const axios = require('axios');
const SocialMediaAccount = require('../models/SocialMediaAccount'); // Import the model

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:8100/options';

exports.connectYouTube = async (req, res) => {
  const { code, userId } = req.body; // Expecting userId from the frontend

  try {
    // Step 1: Exchange authorization code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Step 2: Save or update the YouTube account in the database
    const existingAccount = await SocialMediaAccount.findOne({ userId, platform: 'YouTube' });

    if (existingAccount) {
      // Update existing account
      existingAccount.accessToken = access_token;
      existingAccount.refreshToken = refresh_token || existingAccount.refreshToken;
      existingAccount.expiresIn = expires_in;
      await existingAccount.save();
    } else {
      // Create a new account
      const newAccount = new SocialMediaAccount({
        userId,
        platform: 'YouTube',
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      });
      await newAccount.save();
    }

    // Step 3: Respond to the client
    res.json({ accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in });
  } catch (error) {
    console.error('Error connecting social account:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).send('Failed to exchange YouTube code for token');
  }
};
