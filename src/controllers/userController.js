const User = require('../models/User'); // Replace with actual User model path
const SocialMediaAccount = require('../models/SocialMediaAccount'); // Ensure this path is correct

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch all linked accounts with all attributes
    const linkedAccounts = await SocialMediaAccount.find({ userId });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      premium: user.premium,
      linkedAccounts, // Return all linked account attributes
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Update user details
exports.updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure `req.user` is populated via middleware like JWT auth
    const { name, email, ...otherFields } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, ...otherFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
};
