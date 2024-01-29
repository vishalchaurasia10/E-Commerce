const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
    },
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    profileImageId: {
        type: String,
    },
    phoneNumber: {
        type: String,
        minlength: 10,
        maxlength: 10,
    },
    address: {
        type: String,
        minlength: 3,
    },
    city: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    state: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    pinCode: {
        type: String,
        minlength: 6,
        maxlength: 6,
    },
    apartment: {
        type: String,
        minlength: 3,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpires: {
        type: Date,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordTokenExpires: {
        type: Date,
    },
});

// Define a static method to find a user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        return { status: 404, message: 'User not found' };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return { status: 401, message: 'Incorrect password' };
    }

    return { status: 200, user };
};

const User = mongoose.model('User', userSchema);

module.exports = User;