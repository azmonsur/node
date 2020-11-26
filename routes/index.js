const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const { capitalize, formatDate, truncateWithWords, stripTags, title, formatFigure, paginate } = require('../helpers/ejs')

// Story model
const Story = require('../models/Story');

// Story model
const User = require('../models/User');

// @desc    Login/Landing page
// @desc    GET /
router.get('/', async (req, res) => {

    try {
        let stories = await Story.find({ frontPagePost: 'true', status: 'public', archivePost: 'false' }).populate('user').sort({ publishedAt: -1 }).lean(); 

        res.render('index', {
            stories,
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
router.get('/dashboard/:id', ensureAuth, async (req, res) => {
    let page = req.query.page 
    if (!page) {
        page = 1
    }
    console.log(page, req.params.id)
    try {
        // Get all stories
        const stories = await Story.find({ user: req.params.id, archivePost: 'false' }).sort({ createdAt: -1 }).populate('user').lean();

        res.render('dashboard', {
            stories,
            formatDate,
            title,
            formatFigure,
            paginate
        });
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }


});

module.exports = router