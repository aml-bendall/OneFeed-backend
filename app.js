const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const createError = require('http-errors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const googleRoutes = require('./routes/googleOAuthRoute');
const facebookRoutes = require('./routes/facebookOAuthRoute');
const facebookFeedRoutes = require('./routes/facebookFeedRoutes');
const googleFeedRoutes = require('./routes/googleFeedRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api', googleRoutes);
app.use('/api', facebookRoutes);
app.use('/api', googleFeedRoutes);
app.use('/api', facebookFeedRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log errors
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({ error: res.locals.message });
});

app._router.stack
  .filter((r) => r.route) // Filter only routes
  .map((r) => console.log(r.route.path)); // Log the path

module.exports = app;
