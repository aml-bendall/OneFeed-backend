const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String }, // User's full name (optional)
  circles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Circle' }], // References to circles the user belongs to
  role: { type: String, enum: ['admin', 'member'], default: 'member' }, // User's role in the system
  premium: { type: Boolean, default: false }, // Premium flag for paid users
  recipeCount: { type: Number, default: 0 }, // Tracks the number of recipes created by the user
  createdAt: { type: Date, default: Date.now } // Track account creation
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Utility method to check if user is eligible to create more recipes
userSchema.methods.canCreateRecipe = function () {
  // Free users are limited to 10 recipes
  return this.premium || this.recipeCount < 10;
};

// Utility method to check if user can create/join more circles
userSchema.methods.canJoinCircle = async function () {
  // Free users are limited to 2 circles
  return this.premium || this.circles.length < 2;
};

module.exports = mongoose.model('User', userSchema);
