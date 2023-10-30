const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const uploadProfileImageMiddleware = require('../middlewares/uploadProfileImageMiddleware')
const passport = require('../middlewares/passportConfig')

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
router.post('/upload/:userId', uploadProfileImageMiddleware.single('file'), authenticationController.uploadProfileImage)

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