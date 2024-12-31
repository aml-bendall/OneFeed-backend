const SocialMediaAccount = require('../models/SocialMediaAccount');
const UnifiedFeed = require('../models/UnifiedFeed');

exports.linkAccount = async (req, res) => {
  try {
    const { userId, platform, accessToken, refreshToken } = req.body;
    const account = new SocialMediaAccount({ userId, platform, accessToken, refreshToken });
    await account.save();
    res.status(201).json({ message: 'Account linked successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unlinkAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    const { userId } = req.body;
    await SocialMediaAccount.deleteOne({ userId, platform });
    res.status(200).json({ message: 'Account unlinked successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchUnifiedFeed = async (req, res) => {
  try {
    const { userId } = req.query;
    const feed = await UnifiedFeed.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
