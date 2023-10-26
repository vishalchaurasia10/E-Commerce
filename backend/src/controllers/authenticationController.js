const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10; // The number of salt rounds for hashing
const jwt = require('jsonwebtoken');

// Authenticate a user
exports.verifyUserToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Access Denied / Unauthorized request' });
        }
        token = token.split(' ')[1]
        if (token === 'null' || !token) {
            return res.status(401).json({ message: 'Access Denied / Unauthorized request' });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: 'Access Denied / Unauthorized request' });
        }
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
}

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password
        const user = new User({ email, password: hashedPassword });

        // Save the user to the database
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
}

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate an access token
        const accessToken = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).header("auth-token", accessToken).send({ "token": accessToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout a user from a single device
exports.logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token != req.token;
        });
        await req.user.save();
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout a user from all devices
exports.logoutAll = async (req, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};