// passportConfig.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Your user model
const session = require('express-session');

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const result = await User.findByCredentials(email, password);

            if (result.status !== 200) {
                return done(null, false, { message: result.message });
            }

            return done(null, result.user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            return done(null, user);
        })
        .catch((error) => done(error));
});

module.exports = passport;
