const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const { capitalize, formatDate, truncateWithWords, stripTags, title } = require('../helpers/ejs')

// Story model
const Story = require('../models/Story');

// @desc    Login/Landing page
// @desc    GET /
router.get('/', async (req, res) => {

    try {
        let stories = await Story.find({ frontPagePost: 'true', status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean()
        const trending = await Story.find({ frontPagePost: 'true', status: 'public' }).populate('user').sort({ views: 'desc' }).limit(10).lean()

        res.render('index', {
            stories,
            trending,
            capitalize,
            truncateWithWords,
            stripTags,
            title,
            formatDate
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc    Dashboard
// @desc    GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        // Get all stories
        const stories = await Story.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();

        // Get all public stories
        const publicStories = await Story.find({ user: req.user.id, status: 'public' }).sort({ createdAt: -1 }).lean();

        // Get all private stories
        const privateStories = await Story.find({ user: req.user.id, status: 'private' }).sort({ createdAt: -1 }).lean();

        res.render('dashboard', {
            name: req.user.firstName,
            username: req.user.username,
            stories,
            image: req.user.image,
            publicStories,
            privateStories,
            formatDate,
            title
        });
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }


});

module.exports = router