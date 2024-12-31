const axios = require('axios');
const SocialMediaAccount = require('../models/SocialMediaAccount');

class SocialMediaService {
  async linkAccount(userId, platform, accessToken, refreshToken) {
    const account = new SocialMediaAccount({
      userId,
      platform,
      accessToken,
      refreshToken,
    });
    await account.save();
    return { message: `${platform} account linked successfully.` };
  }

  async unlinkAccount(userId, platform) {
    await SocialMediaAccount.deleteOne({ userId, platform });
    return { message: `${platform} account unlinked successfully.` };
  }

  async fetchFeed(userId) {
    const accounts = await SocialMediaAccount.find({ userId });
    const feed = [];

    for (const account of accounts) {
      try {
        const platformFeed = await this.fetchPlatformFeed(account.platform, account.accessToken);
        feed.push(...platformFeed);
      } catch (error) {
        console.error(`Error fetching feed for ${account.platform}:`, error.message);
      }
    }

    return feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async fetchPlatformFeed(platform, accessToken) {
    if (platform === 'facebook') {
      const response = await axios.get('https://graph.facebook.com/me/posts', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data.map(post => ({
        platform,
        postId: post.id,
        content: post.message,
        timestamp: post.created_time,
      }));
    }
    throw new Error(`Platform ${platform} not supported.`);
  }
}

module.exports = new SocialMediaService();
