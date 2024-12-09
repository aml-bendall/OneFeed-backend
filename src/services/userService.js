const User = require('../models/User'); // Import the User model

// Service function to fetch user details
exports.getUserDetails = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    if (!user) throw new Error('User not found.');

    return user;
  } catch (error) {
    throw new Error('Error fetching user details: ' + error.message);
  }
};

// Service function to update user profile
exports.updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found.');

    // Update the user profile fields
    const allowedUpdates = ['name', 'email'];
    for (const key of Object.keys(updateData)) {
      if (allowedUpdates.includes(key)) {
        user[key] = updateData[key];
      }
    }

    await user.save();

    return 'User profile updated successfully.';
  } catch (error) {
    throw new Error('Error updating user profile: ' + error.message);
  }
};

// Service function to upgrade to premium
exports.upgradeToPremium = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found.');

    if (user.premium) {
      throw new Error('User already has a premium subscription.');
    }

    user.premium = true;
    await user.save();

    return 'User upgraded to premium successfully.';
  } catch (error) {
    throw new Error('Error upgrading to premium: ' + error.message);
  }
};

// Service function to downgrade to free
exports.downgradeToFree = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found.');

    if (!user.premium) {
      throw new Error('User is already on a free plan.');
    }

    user.premium = false;
    await user.save();

    return 'User downgraded to free plan successfully.';
  } catch (error) {
    throw new Error('Error downgrading to free plan: ' + error.message);
  }
};
