const express = require('express');
const passport = require('passport');
const Joi = require('joi');
const bycrypt = require('bcryptjs');
const { ensureAuth } = require('../middleware/auth');
const router = express.Router();

// User and Story models
const User = require('../models/User');
const Story = require('../models/Story');

// @desc    Local auth
// @route    GET /auth/login
router.get('/login', (req, res) => {
    res.render('login', { layout: 'layouts/login' })
})

// @desc    Local signup
// @route    GET /auth/register
router.get('/register', (req, res) => {
    res.render('register', { layout: 'layouts/login' })
})

// @desc    Auth with google
// @route    GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route    GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard')
});

// @desc   Register
// @route POST /auth/register
router.post('/register', async (req, res) => {
    const { email, username, password, verify_password } = req.body

    let errors = new Array()

    let user = await User.findOne({ username: username })
    let mail = await User.findOne({ email: email })

    // Create validation schema
    const validationSchema = {
        email: Joi.string().min(5).max(255).required(),
        username: Joi.string().min(2).max(255).regex(/^[a-z_]+$/i).required(),
        password: Joi.string().min(8).max(255).required(),
        verify_password: Joi.string().min(8).max(255).required(),
    }

    // User the schema to validate
    Joi.validate(req.body, validationSchema, (err, value) => {
        if (err) {
            errors.push({ message: `${err}` })
            //return //res.redirect(303, '/auth/register')
        }

        // If user exist in database 
        if (user) errors.push({ message: 'Username exists' });

        // If email exists
        if (mail) errors.push({ message: 'Email exist exists' });

        if (password !== verify_password) {
            errors.push({ message: 'Passwords do not match' })
            //return
        }

        errors.reverse()
        if (errors.length > 0) {
            res.render('register', {
                layout: 'layouts/login',
                errors,
                email,
                username,
                type: 'warning'
            })
        } else {
            const newUser = new User({
                email,
                username,
                password
            });

            // Hash password
            bycrypt.genSalt(10, (err, salt) => {
                bycrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err

                    // Set password to hash
                    newUser.password = hash;

                    // Save the user
                    newUser.save()
                        .then(() => {
                            req.session.flash = {
                                type: 'success',
                                message: 'You are now registered and can log in.',
                            }
                            res.redirect('/auth/login');
                        })
                        .catch(err => console.log(err));
                })
            })
        }
    });
})

// @desc   Auth with local
// @route POST /auth/local
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureMessage: req.session.flash = {
            type: 'warning',
            message: 'Invalid login details',
        }
    })(req, res, next)
});

// @desc   Logout user
// @route GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    req.session.flash = {
        type: 'success',
        message: 'You are now logged out.',
    }
    res.redirect('/auth/login');
})


module.exports = router;