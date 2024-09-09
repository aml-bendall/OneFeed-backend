// controllers/resumeController.js
exports.saveUserData = async (req, res, next) => {
    try {
        const { name, email, experience, education } = req.body;

        // Access the user ID from the authenticated request
        const userId = req.user.id;

        // Call the service to save the user data, including the user ID
        const response = await resumeService.saveUserData(userId, name, email, experience, education);

        // Send the response back to the frontend
        res.json({ message: response });
    } catch (error) {
        next(error);  // Pass any errors to the error handler
    }
};
