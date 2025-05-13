const express = require('express');
const router = express.Router();
const Item = require('../models/ItemModel');
const multer = require('multer');
const path = require('path');
const { default: mongoose } = require('mongoose');

// File storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// POST Route
router.post('/adduser', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No profile image uploaded');
    }

    const item = new Item({
      ...req.body,
      profileImage: req.file.path, // Make sure 'profileImage' matches the frontend key
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Error in /adduser route:', err); // Server logs
    res.status(500).json({ error: err.message });
  }
});


router.get('/users', async (req, res) => {
  try {
    const users = await Item.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Correct DELETE route to delete a user by ID
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const deletedUser = await Item.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await Item.findById(req.params.id); // or whatever model you're using
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const { firstName, lastName, department, userRole, status, dob, username } = req.body;

    const updatedData = {
      firstName,
      lastName,
      department,
      userRole,
      status,
      dob,
      username
    };

    // Handle uploaded file
    if (req.file) {
      updatedData.profileImage = req.file.filename;
    }

    const updatedUser = await Item.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});





module.exports = router;
