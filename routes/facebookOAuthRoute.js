const express = require('express');
const axios = require('axios');
const router = express.Router();

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const REDIRECT_URI = 'http://localhost:8100/options';

router.post('/auth/facebook', async (req, res) => {
  const { code } = req.body;

  try {
    // Step 1: Exchange authorization code for access token
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v10.0/oauth/access_token`, {
        params: {
          client_id: FACEBOOK_APP_ID,
          redirect_uri: REDIRECT_URI,
          client_secret: FACEBOOK_APP_SECRET,
          code: code,
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Step 2: Fetch user profile
    const userResponse = await axios.get(
      `https://graph.facebook.com/me`,
      { params: { access_token } }
    );

    // Save the access token and user data in your database (e.g., MongoDB)
    res.json({ user: userResponse.data, accessToken: access_token });
  } catch (error) {
    console.error('Facebook OAuth Error:', error.response?.data || error.message);
    res.status(500).send('Failed to authenticate with Facebook');
  }
});

module.exports = router;
