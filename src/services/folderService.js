const Folder = require('../models/Folder');
const Recipe = require('../models/Recipe');
const fs = require('fs');
const path = require('path');

// Create a new folder
exports.createFolder = async (userId, name, description, image) => {
  try {
    const folder = new Folder({
      name,
      description,
      image,
      createdBy: userId,
    });
    return await folder.save();
  } catch (error) {
    throw new Error(`Error creating folder: ${error.message}`);
  }
};

// Get all folders for a user
exports.getFolders = async (userId) => {
  try {
    return await Folder.find({ createdBy: userId }).populate('recipes');
  } catch (error) {
    throw new Error(`Error fetching folders: ${error.message}`);
  }
};

// Update a folder
exports.updateFolder = async (userId, folderId, updateData, file) => {
  try {
    if (file) {
      const newImagePath = `/uploads/folders/${file.filename}`;
      const folder = await Folder.findOne({ _id: folderId, createdBy: userId });

      if (!folder) throw new Error('Folder not found or unauthorized');

      if (folder.image) {
        const oldImagePath = path.join(__dirname, '..', folder.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.image = newImagePath;
    }

    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: folderId, createdBy: userId },
      updateData,
      { new: true }
    );

    if (!updatedFolder) throw new Error('Folder not found or unauthorized');
    return updatedFolder;
  } catch (error) {
    throw new Error(`Error updating folder: ${error.message}`);
  }
};

// Delete a folder
exports.deleteFolder = async (userId, folderId) => {
  try {
    const folder = await Folder.findOneAndDelete({ _id: folderId, createdBy: userId });

    if (!folder) throw new Error('Folder not found or unauthorized');

    if (folder.image) {
      const imagePath = path.join(__dirname, '..', folder.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Recipe.updateMany({ folderId }, { folderId: null });
    return folder;
  } catch (error) {
    throw new Error(`Error deleting folder: ${error.message}`);
  }
};

// Move a recipe to a folder
exports.moveRecipeToFolder = async (userId, folderId, recipeId) => {
  try {
    let folder = null;

    if (folderId) {
      folder = await Folder.findOne({ _id: folderId, createdBy: userId });
      if (!folder) folderId = null; // Fallback to Uncategorized
    }

    const recipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, createdBy: userId },
      { folderId },
      { new: true }
    );

    if (!recipe) throw new Error('Recipe not found or unauthorized');
    return recipe;
  } catch (error) {
    throw new Error(`Error moving recipe to folder: ${error.message}`);
  }
};
