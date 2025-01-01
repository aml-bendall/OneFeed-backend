const express = require('express');
const router = express.Router();

router.get('/facebook/feeds', async (req, res) => {
    const { accessToken } = req.query;
  
    try {
      const feedResponse = await axios.get(
        `https://graph.facebook.com/me/posts`,
        { params: { access_token: accessToken } }
      );
  
      res.json(feedResponse.data);
    } catch (error) {
      console.error('Error fetching Facebook feeds:', error.response?.data || error.message);
      res.status(500).send('Failed to fetch Facebook feeds');
    }
  });

  module.exports = router;