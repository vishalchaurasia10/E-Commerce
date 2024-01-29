const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10; // The number of salt rounds for hashing
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const aws = require('aws-sdk');
const { Readable } = require('stream');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./emailController');

// AWS S3 Configuration
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Authenticate a user
exports.verifyUserToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Access Denied / Unauthorized request' });
        }
        token = token.split(' ')[1]
        if (token === 'null' || !token) {
            return res.status(401).json({ errpr: 'Access Denied / Unauthorized request' });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ error: 'Access Denied / Unauthorized request' });
        }
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
}

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user with the email exists and is unverified
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ error: 'User already exists' });
            } else {
                // Generate a new verification token and update the expiration time
                existingUser.verificationToken = crypto.randomBytes(20).toString('hex');
                existingUser.verificationTokenExpires = Date.now() + 3600000; // Update expiration time to 1 hour
                await existingUser.save();

                // Send a new verification email
                await sendVerificationEmail(existingUser.email, existingUser.verificationToken);

                return res.status(200).json({ message: 'Verification email resent. Please verify your email address to continue' });
            }
        }

        // Generate a verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password and verification token
        const user = new User({
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + 3600000, // Token expires in 1 hour
        });

        // Save the user to the database
        const savedUser = await user.save();

        // Send a verification email
        await sendVerificationEmail(savedUser.email, verificationToken);

        res.status(201).json({ message: 'Verification email sent. Please verify your email address to continue' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        // Omit the user password from the response
        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json(userWithoutPassword);
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

        // Check if the user has verified their email address
        if (!user.isVerified) {
            return res.status(401).json({ error: 'Please verify your email address to continue' });
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

        res.status(200).header("auth-token", accessToken).send({ "token": accessToken, "user": user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadProfileImage = async (req, res) => {
    try {
        const file = req.file;

        // Check if a file was uploaded
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileName = `profiles/${Date.now()}-${file.originalname}`; // Updated Key

        // Create a Readable stream from the buffer
        const fileStream = Readable.from(file.buffer);

        let uniqueId;

        s3.upload(
            {
                Bucket: 'forevertrendin-bucket',
                Key: fileName,
                Body: fileStream,
                ContentType: file.mimetype,
            },
            async (error, data) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error uploading file to S3' });
                }

                uniqueId = data.Location;

                // Check if the user already has a profile image
                const userId = req.params.userId;
                const user = await User.findById(userId);

                if (user.profileImageId) {
                    // If an old profile image exists, delete it from S3
                    try {
                        const oldImageKey = user.profileImageId.split('/').pop(); // Extract the key from the URL
                        await s3.deleteObject({
                            Bucket: 'forevertrendin-bucket',
                            Key: `profiles/${oldImageKey}`,
                        }).promise();
                    } catch (deleteError) {
                        console.error('Error deleting old profile image from S3:', deleteError);
                        return res.status(500).json({ error: 'Error deleting old profile image from S3' });
                    }
                }

                // Update the user with the new profile image ID
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { $set: { profileImageId: uniqueId } },
                    { new: true }
                );

                if (!updatedUser) {
                    return res.status(404).json({ error: 'User not found' });
                }

                // Respond with a success message
                res.status(200).json({ message: 'File uploaded successfully', fileId: uniqueId });
            }
        );
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const { token } = req.query;

        // Find the user by the verification token
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }, // Check if the token is not expired
        });

        if (!user) {
            // Token is invalid or expired
            return res.status(400).json({ error: 'Invalid or expired verification token.' });
        }

        // Update the user's status to "verified" and remove the verification token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        // Redirect or respond with a success message
        res.status(200).json({ message: 'Email verification successful. You can now log in.' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Error verifying email.' });
    }
};

exports.sendResetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordTokenExpires = Date.now() + 3600000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpires = resetPasswordTokenExpires;

        await user.save();

        await sendPasswordResetEmail(user.email, user.resetPasswordToken);

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending reset password email:', error);
        res.status(500).json({ error: 'Error sending reset password email' });
    }
};

exports.verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired reset token.' });
        }

        res.status(200).json({ message: 'Reset token is valid.' });
    } catch (error) {
        console.error('Error verifying reset token:', error);
        res.status(500).json({ error: 'Error verifying reset token.' });
    }
};

exports.updatePasswordWithResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired reset token.' });
        }

        // Update the password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;

        // Clear the reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password with reset token:', error);
        res.status(500).json({ error: 'Error updating password with reset token.' });
    }
};