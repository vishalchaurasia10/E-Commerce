const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

function generateJwtToken(user) {

    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    // Sign the token
    return accessToken;
}

// Initialize the Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if a user with this Google ID already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            // If the user doesn't exist, create a new user
            user = new User({
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                // You can add more user data from the Google profile if needed
            });

            user = await user.save();
        }

        // Create a JWT token
        const token = generateJwtToken(user);
        console.log(token);

        return done(null, token);
    } catch (error) {
        return done(error, false);
    }
}));

// Serialize the user to store in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Create a route for Google OAuth authentication
exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'], // Define the scopes you need
});

// Handle the Google OAuth callback
exports.googleAuthCallback = (req, res) => {
    passport.authenticate('google', (err, token) => {
        if (err) {
            // Handle the error, e.g., redirect to an error page
            return res.redirect('http://localhost:3000/auth-error');
        }

        if (token) {
            // Append the token as a query parameter to the successRedirect URL
            const redirectUrl = `http://localhost:3000/verification?token=${token}`;
            return res.redirect(redirectUrl);
        }

        // Handle any other case, e.g., redirect to a login page
        return res.redirect('http://localhost:3000/login');
    })(req, res);
};
