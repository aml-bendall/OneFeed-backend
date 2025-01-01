const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');
const SocialMediaAccount = require('../src/models/SocialMediaAccount'); // Import the model

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Function to refresh YouTube access token
async function refreshYouTubeToken(userId) {
  try {
    const account = await SocialMediaAccount.findOne({ userId, platform: 'YouTube' });

    if (!account || !account.refreshToken) {
      throw new Error('No refresh token available for this user.');
    }

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: account.refreshToken,
      grant_type: 'refresh_token',
    });

    const { access_token, expires_in } = tokenResponse.data;

    // Update the account with the new access token
    account.accessToken = access_token;
    account.expiresIn = expires_in;
    account.createdAt = new Date(); // Update the createdAt timestamp
    await account.save();

    return access_token;
  } catch (error) {
    console.error('Error refreshing YouTube token:', error.response?.data || error.message);
    throw new Error('Failed to refresh YouTube token.');
  }
}

// Middleware to check and refresh token if necessary
async function checkAndRefreshToken(req, res, next) {
  const { userId } = req.query; // Assuming userId is passed as a query parameter

  try {
    console.log('Middleware triggered for userId:', userId);

    // Convert userId to ObjectId if necessary
    const objectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const account = await SocialMediaAccount.findOne({ userId: objectId, platform: 'YouTube' });
    console.log('Account from MongoDB:', account);

    if (!account) {
      return res.status(404).json({ error: 'YouTube account not linked for this user.' });
    }

    const tokenExpiryTime = new Date(account.createdAt).getTime() + account.expiresIn * 1000;
    console.log('Token Expiry Time:', new Date(tokenExpiryTime));

    if (Date.now() > tokenExpiryTime) {
      console.log('Access token expired, refreshing...');
      const newAccessToken = await refreshYouTubeToken(userId);
      req.accessToken = newAccessToken; // Attach new token to the request
    } else {
      console.log('Token is valid. Using existing token.');
      req.accessToken = account.accessToken; // Use existing token
    }

    next();
  } catch (error) {
    console.error('Error checking/refreshing token:', error.message);
    res.status(500).send('Failed to refresh YouTube token.');
  }
}

router.get('/youtube/recommendations', checkAndRefreshToken, async (req, res) => {
    try {
      const accessToken = req.accessToken;
  
      // Fetch activities for personalized feed
      const activitiesResponse = await axios.get('https://www.googleapis.com/youtube/v3/activities', {
        params: {
          part: 'snippet,contentDetails',
          maxResults: 10,
          home: true,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      let recommendations = activitiesResponse.data.items || [];
  
      // If no activities, fallback to subscriptions
      if (recommendations.length === 0) {
        const subscriptionsResponse = await axios.get('https://www.googleapis.com/youtube/v3/subscriptions', {
          params: { part: 'snippet', mine: true, maxResults: 10 },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const channelIds = subscriptionsResponse.data.items.map(
          (subscription) => subscription.snippet.resourceId.channelId
        );
  
        const subscriptionsVideosResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            channelId: channelIds.join(','),
            maxResults: 10,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        recommendations = subscriptionsVideosResponse.data.items;
      }
  
      // If still empty, fallback to trending
      if (recommendations.length === 0) {
        const trendingResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'snippet,contentDetails',
            chart: 'mostPopular',
            maxResults: 10,
            regionCode: 'US',
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        recommendations = trendingResponse.data.items;
      }
  
      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching YouTube recommendations:', error.response?.data || error.message);
      res.status(500).send('Failed to fetch YouTube recommendations');
    }
  });
  

module.exports = router;
