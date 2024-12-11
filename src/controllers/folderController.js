const folderService = require('../services/folderService');

// Create a folder
exports.createFolder = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const image = req.file ? req.file.filename : null; // Handle uploaded image

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const folder = await folderService.createFolder(userId, name, description, image);
    res.status(201).json({ message: 'Folder created successfully', folder });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all folders
exports.getFolders = async (req, res) => {
  try {
    const userId = req.user.id;
    const folders = await folderService.getFolders(userId);
    res.status(200).json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a folder
exports.updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;
    const image = req.file ? req.file.filename : undefined; // Update image if uploaded

    if (!id) {
      return res.status(400).json({ message: 'Folder ID is required' });
    }

    const updateData = { name, description };
    if (image) updateData.image = image; // Include image only if provided

    const folder = await folderService.updateFolder(userId, id, updateData);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or unauthorized' });
    }

    res.status(200).json({ message: 'Folder updated successfully', folder });
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a folder
exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: 'Folder ID is required' });
    }

    const folder = await folderService.deleteFolder(userId, id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or unauthorized' });
    }

    res.status(200).json({ message: 'Folder deleted successfully', folder });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Move a recipe to a folder
exports.moveRecipeToFolder = async (req, res) => {
  try {
    const { folderId, recipeId } = req.body;
    const userId = req.user.id;

    if (!folderId || !recipeId) {
      return res.status(400).json({ message: 'Folder ID and Recipe ID are required' });
    }

    const recipe = await folderService.moveRecipeToFolder(userId, folderId, recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }

    res.status(200).json({ message: 'Recipe moved to folder successfully', recipe });
  } catch (error) {
    console.error('Error moving recipe to folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
