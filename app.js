var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const circleRoutes = require('./routes/circleRoutes');
const activityRoutes = require('./routes/activityRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const recipeScalerRoutes = require('./routes/recipeScalerRoutes');
const paypalRoutes = require('./routes/paypalRoutes');

var app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(cors({ origin: 'http://localhost:4200' })); // Configure CORS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User management routes
app.use('/api/recipes', recipeRoutes); // Recipe management routes
app.use('/api/circles', circleRoutes); // Circle management routes
app.use('/api/activities', activityRoutes); // Activity log routes
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/recipes', recipeScalerRoutes);
app.use('/api/paypal', paypalRoutes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;