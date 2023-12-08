const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const passport = require('../middlewares/passportConfig')
const multer = require('multer');

// Define multer storage configuration for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffers

const upload = multer({ storage });

// Register a new user
router.post('/register', authenticationController.createUser);

// Login a user
router.post('/login', authenticationController.loginUser);

// Get all users
router.get('/', authenticationController.getAllUsers);

// Route for initiating Google OAuth
router.get('/auth/google', passport.googleAuth);

// Route for handling Google OAuth callback
router.get('/auth/google/callback', passport.googleAuthCallback);


//upload profile image of user
router.post('/upload/:userId', upload.single('file'), authenticationController.uploadProfileImage)

// verify the JWT token sent by the user
router.get('/verifyjwt', authenticationController.verifyUserToken, (req, res) => {
    res.status(200).json({ user: req.user });
});

// Get a single user by ID
router.get('/:userId', authenticationController.getUserById);

// Update a user by ID
router.put('/:userId', authenticationController.updateUser);

// Delete a user by ID
router.delete('/:userId', authenticationController.deleteUser);

module.exports = router;