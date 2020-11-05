const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

// Story model
const Story = require('../models/Story');

// @desc    Show add page
// @route    GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

// @desc    Process the add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean()
        res.render('stories/index', {
            stories,
        });
    } catch (error) {
        console.error(error)
        res.render(error / 500)
    }
});


// @desc    Show a user stories
// @route   GET /stories/user/:id
router.get('/user/:id', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ 
            user: req.params.id,
            status: 'public'
        }).populate('user').sort({ createdAt: 'desc' }).lean()

        res.render('stories/index', {
            stories,
        });
    } catch (error) {
        console.error(error)
        res.render(error / 500)
    }
});


// @desc    Show single story
// @route    GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).populate('user').lean();

        if (!story) return res.render('error/404');
        res.render('stories/show', { story })
    } catch (error) {
        console.error(error);
        res.render('error/404')
    }
});

// @desc    Edit story
// @route   GET /stories/edit
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const story = await Story.findOne({ _id: req.params.id }).lean()
    try {
        if (!story) {
            return res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story,
            })
        }
    } catch (error) {
        return res.render('error/500')
    }
});

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    let story = await Story.findById(req.params.id).lean();
    try {
        if (!story) {
            return res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
});

// @desc    Delete single post
// @route   DELETE /stories/delete
router.delete('/delete/:id', ensureAuth, async (req, res) => {
    try {
        let user = await Story.remove({ _id: req.params.id })
        if (user) res.redirect(303, "/dashboard")
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
    res.render('stories/add');
});


module.exports = router