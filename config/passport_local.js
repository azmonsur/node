const bycrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

// User model
const User = require('../models/User');

module.exports  = function(passport) {
    passport.use(
        new LocalStrategy({ usernamefield: 'username' }, async (email, password, done) => {
            let  user = await User.findOne({ email: email });
            try {
                if (!user) {
                    return done(null, false)
                }
                bycrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                })
            } catch (err) {
                console.error(err);
                res.render('error/500')
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}