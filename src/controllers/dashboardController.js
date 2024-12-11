const User = require('../models/User');
const Circle = require('../models/Circle');
const Recipe = require('../models/Recipe');
const Folder = require('../models/Folder'); // Import Folder model
const ActivityLog = require('../models/ActivityLog');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated request

    // Fetch user details
    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user-related data
    const circles = await Circle.find({ members: userId }).select('name description createdBy'); // User's circles
    const recipes = await Recipe.find({ createdBy: userId }).select('name visibility folderId createdAt'); // User's recipes
    const folders = await Folder.find({ createdBy: userId }).select('name description image createdAt'); // User's folders
    const activities = await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(10); // Recent activities

    // Construct the dashboard data response
    const dashboardData = {
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        premium: user.premium,
      },
      circles,
      recipes,
      folders,
      activities,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
};
