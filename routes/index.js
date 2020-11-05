const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// Story model
const Story = require('../models/Story');

// @desc    Login/Landing page
// @desc    GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', { layout: 'login' })
})

// @desc    Dashboard
// @desc    GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => { //i removed async
    try {
        const stories = await Story.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
        const publicStories = await Story.find({ user: req.user.id, status: 'public' }).lean();
        const privateStories = await Story.find({ user: req.user.id, status: 'private' }).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            stories,
            image: req.user.image,
            publicStories,
            privateStories
        });
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    

});


module.exports = router