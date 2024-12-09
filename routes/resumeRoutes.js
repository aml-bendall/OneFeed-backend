// routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const resumeController = require('../src/controllers/resumeController');
const authMiddleware = require('../src/middleware/authMiddleware');  // JWT middleware to verify token
const Resume = require('../src/models/Resume');  // Import the Resume model
const User = require('../src/models/User');  // Import the User model
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Configure Multer to save the original file extension
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Use the original name and extension for the uploaded file
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);  // Preserves the original file name and extension
    }
});

// Python NLP model execution
function runAIConversion(filePath) {
    return new Promise((resolve, reject) => {
        // Spawn the Python process
        const pythonProcess = spawn('python', [path.join(__dirname, '../src/nlp/nlp_model.py'), filePath]);

        let output = '';
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('NLP Model stderr:', data.toString());
            reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
            try {
                resolve(output); // Parse and resolve JSON output from Python
            } catch (error) {
                reject(error);
            }
        });
    });
}

const upload = multer({ storage: storage });

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
            email: req.body.email || '', // Adding email to the model
            status: req.body.status || 'In Progress', // Status field for progress tracking

            // Education - expecting an array of education objects
            education: req.body.education || [],

            // Experience - expecting an array of experience objects
            experience: req.body.experience || [],

            // Achievements, awards, and extracurricular activities
            achievements: req.body.achievements || [],
            awards: req.body.awards || [],
            extracurriculars: req.body.extracurriculars || [],

            createdAt: new Date(),
        });

        const savedResume = await newResume.save();  // Save the resume to the database
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

// Helper function to retry file deletion
const retryUnlink = (filePath, retries = 3, delay = 2000) => {
    if (retries < 0) {
        console.error(`Failed to delete file after retries: ${filePath}`);
        return;
    }

    setTimeout(() => {
        fs.unlink(filePath, (err) => {
            if (err && err.code === 'EBUSY') {
                console.warn(`Retrying file deletion for: ${filePath}`);
                retryUnlink(filePath, retries - 1, delay);
            } else if (err) {
                console.error(`Error deleting file: ${filePath}`, err);
            } else {
                console.log(`Successfully deleted file: ${filePath}`);
            }
        });
    }, delay);
};

router.post('/upload-resume/:id', upload.single('resume'), async (req, res) => {
    const resumeId = req.params.id;
    const filePath = req.file.path;

    try {
        // Send resume text to GPT for structured data extraction
        const structuredData = await runAIConversion(filePath);

        // Save structured data to MongoDB
        const updatedResume = await Resume.findByIdAndUpdate(
            resumeId,
            { $set: JSON.parse(structuredData) },
            { new: true }  // Return the updated document
        );

        // Check if the resume was found and updated
        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Respond with the updated resume
        res.json(updatedResume);

    } catch (error) {
        console.error('Error parsing and saving resume:', error);
        res.status(500).json({ error: 'Failed to process resume' });
    } finally {
        // Optionally delete the uploaded file after processing
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        const resumeId = req.params.id;  // Get the resume ID from the request parameters
        const resume = await Resume.findById(resumeId);  // Query MongoDB for the resume

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json(resume);  // Send the resume back as JSON
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Server error while fetching resume' });
    }
});

module.exports = router;
