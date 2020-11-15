const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

// Import user model
const User = require('../models/User')
module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, async (email, password, done) => {
            // Match user
            let user = await User.findOne({ email: email })
            try {
                if (!user) {
                    return done(null, user)
                }
                
                // Match password
                bycrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                })
            } catch (error) {
                console.error(error);
                res.render('error/500')
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}