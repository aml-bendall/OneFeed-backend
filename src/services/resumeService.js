// services/resumeService.js
const Resume = require('../models/Resume');  // Import the Resume model

// Service function to save user data
exports.saveUserData = async (userId, name, email, experience, education) => {
    try {
        // Save user data (including experience) to MongoDB with the user ID
        const userData = new Resume({
            userId,  // Link the resume data to the user
            name,
            email,
            experience,  // Array of experience objects
            education
        });

        await userData.save();

        // Return a message confirming data is saved
        return 'User data saved successfully.';
    } catch (error) {
        throw new Error('Error saving user data: ' + error.message);
    }
};
