const LocalStrategy = require('passport-google-oauth20').Strategy; // Change to passport-local-mongoose when installed
const mongoose = require('mongoose');

// User = mongoose.model('User', require('../models/User').plugin(LocalStrategy));

module.exports = function (passport) {
    passport.use(User.createStrategy());
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value
    }

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}