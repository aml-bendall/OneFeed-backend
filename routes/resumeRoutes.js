// routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const resumeController = require('../src/controllers/resumeController');
const authMiddleware = require('../src/middleware/authMiddleware');  // JWT middleware to verify token
const Resume = require('../src/models/Resume');  // Import the Resume model
const User = require('../src/models/User');  // Import the User model

// Route to save user data (protected route)
router.post('/saveUserData', authMiddleware, resumeController.saveUserData);

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);  // Fetch user's name from the User model
        console.log(user);
        const resumes = await Resume.find({ userId });
        console.log(resumes);

        if (!resumes || resumes.length === 0) {
            return res.status(404).json({ message: 'No resumes found for this user', userName: user.name });
        }

        res.json({ resumes, userName: user.name });
    } catch (error) {
        console.error('Error fetching profile:', error);  // Log the error for debugging
        res.status(500).json({ message: 'Failed to load resumes for the user' });
    }
});


router.post('/create', authMiddleware, async (req, res) => {
    try {
        const newResume = new Resume({
            userId: req.user.id,  // Extracted from JWT token
            name: req.body.name || 'Untitled Resume',
            status: req.body.status || 'In Progress',
            education: req.body.education || "",
            experience: req.body.experience || null,
            createdAt: new Date(),
        });
        const savedResume = await newResume.save();
        res.json(savedResume);  // Return the created resume
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating resume' });
    }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        const resumeId = req.params.id;  // Extract the resume ID from the route
        const userId = req.user.id;  // Extract the user ID from the JWT token

        // Find the resume and check if it belongs to the authenticated user
        const resume = await Resume.findOne({ _id: resumeId, userId: userId });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or not authorized to delete' });
        }

        // Delete the resume
        await Resume.findByIdAndDelete(resumeId);

        return res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return res.status(500).json({ message: 'Server error while deleting resume' });
    }
});

module.exports = router;
