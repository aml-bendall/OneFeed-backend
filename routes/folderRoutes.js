const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const folderController = require('../src/controllers/folderController');
const { authMiddleware } = require('../src/middleware/authMiddleware');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/folders'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post('/', authMiddleware, upload.single('image'), folderController.createFolder);
router.get('/', authMiddleware, folderController.getFolders);
router.put('/:id', authMiddleware, upload.single('image'), folderController.updateFolder);
router.delete('/:id', authMiddleware, folderController.deleteFolder);
router.post('/move-recipe', authMiddleware, folderController.moveRecipeToFolder);

module.exports = router;
