const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

// User model 
const User = require('../models/User')

// @desc    Show contributor page
// @route   GET /user/apply/contributor
router.get('/apply/contributor', ensureAuth, (req, res) => {
    res.render('user/contributor')
});


// @desc    Show edit-profile page
// @route   GET /user/edit-profile
router.get('/edit-profile/:id', ensureAuth, async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('user/edit_profile', {
        user
    })
});

// @desc    edit user profile
// @route   PUT /user/edit-profile
router.put('/edit-profile/:id', async (req, res) => {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    })
    res.redirect('/dashboard')
});

module.exports = router;