const Circle = require('../models/Circle'); // Import the Circle model
const User = require('../models/User'); // Import the User model
const activityLogService = require('./activityLogService'); // Import the Activity Log Service

// Service function to create a new circle
exports.createCircle = async (userId, name, description) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found.');
    if (!user.canJoinCircle()) throw new Error('Free users can only join or create up to 2 circles. Upgrade to Premium!');

    const circle = new Circle({
      name,
      description,
      createdBy: userId,
      members: [userId],
    });

    await circle.save();

    user.circles.push(circle._id);
    await user.save();

    // Log activity
    await activityLogService.logActivity(userId, 'create_circle', { circleId: circle._id, circleName: name });

    return circle;
  } catch (error) {
    throw new Error('Error creating circle: ' + error.message);
  }
};

// Service function to fetch details of a circle
exports.getCircleDetails = async (circleId, userId) => {
  try {
    const circle = await Circle.findById(circleId).populate('members', 'username name').populate('recipes');
    if (!circle) throw new Error('Circle not found.');

    if (!circle.members.some((member) => member._id.toString() === userId)) {
      throw new Error('Unauthorized: You are not a member of this circle.');
    }

    // Log activity
    await activityLogService.logActivity(userId, 'view_circle', { circleId, circleName: circle.name });

    return circle;
  } catch (error) {
    throw new Error('Error fetching circle details: ' + error.message);
  }
};

// Service function to join a circle
exports.joinCircle = async (circleId, userId) => {
  try {
    const circle = await Circle.findById(circleId);
    if (!circle) throw new Error('Circle not found.');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found.');
    if (!user.canJoinCircle()) throw new Error('Free users can only join or create up to 2 circles. Upgrade to Premium!');

    if (circle.members.includes(userId)) {
      throw new Error('You are already a member of this circle.');
    }

    circle.members.push(userId);
    await circle.save();

    user.circles.push(circle._id);
    await user.save();

    // Log activity
    await activityLogService.logActivity(userId, 'join_circle', { circleId: circle._id, circleName: circle.name });

    return 'Joined circle successfully.';
  } catch (error) {
    throw new Error('Error joining circle: ' + error.message);
  }
};

// Service function to delete a circle
exports.deleteCircle = async (circleId, userId) => {
  try {
    const circle = await Circle.findById(circleId);
    if (!circle) throw new Error('Circle not found.');

    if (circle.createdBy.toString() !== userId) {
      throw new Error('Unauthorized: Only the creator can delete this circle.');
    }

    await User.updateMany(
      { circles: circle._id },
      { $pull: { circles: circle._id } }
    );

    await Circle.findByIdAndDelete(circleId);

    // Log activity
    await activityLogService.logActivity(userId, 'delete_circle', { circleId, circleName: circle.name });

    return 'Circle deleted successfully.';
  } catch (error) {
    throw new Error('Error deleting circle: ' + error.message);
  }
};
