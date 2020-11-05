const express = require('express');
const passport = require('passport');
const { ensureAuth } = require('../middleware/auth');
//const localEnsureLogin = require('connect-ensure-login');
const router = express.Router();

// User model
const User = require('../models/User');

// @desc    Auth with google
// @route    GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc    Google auth callback
// @route    GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard')
});

// @desc   Auth with local
// @route POST /auth/local
router.post('/local', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        const { username, password } = req.body
        const newUser = await User.findOne({ firstName: username }).lean()
        try {
            if (newUser) {
                console.log('User not exist')
                return res.render('login');
            }
            res.render('dashboard', {
                user
            });

        } catch (error) {
            console.error(error)
            return res.render('error/500')
        }
    })(req, res, next)

})

// @desc   Logout user
// @route GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(303, '/');
})


module.exports = router;