const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const { capitalize, formatFigure, stripTags, title, formatDate } = require('../helpers/ejs');

const User = require('../models/User');
const Story = require('../models/Story');
const Comment = require('../models/Comment');

// @desc    Show admin panel
// @route   GET /admin/cpanel
router.get('/cpanel', ensureAuth, async (req, res) => {
    isSuperadmin = req.user.membership == 'superadmin' ? true : false;
    isAdmin = req.user.membership == 'admin' ? true : false;
    isModerator = req.user.membership == 'moderator' ? true : false;
    if (!isSuperadmin && !isAdmin && !isModerator) return res.render('error/404')

    const users = await User.find().lean();
    const comments = await Comment.find().lean();
    const stories = await Story.find().populate('user').lean();

    allowed = { isSuperadmin, isModerator, isAdmin }
    res.render('admin/cpanel', {
        layout: 'layouts/admin',
        isSuperadmin,
        users,
        stories,
        comments,
        capitalize,
        title,
        formatDate,
        formatFigure
    })
});

// @desc    Push stories to FTP
// @route   PUT /admin/cpanel/push/:id
router.put('/cpanel/push/:id', async (req, res) => {

    if (req.body.reqType == 'push') {
        req.body.frontPagePost = 'true'
        req.body.publishedAt = Date.now()
    } else {
        req.body.frontPagePost = 'false'
    }
    
    if (req.body.preload) {
        let stories = await Story.find().populate('user').lean()
        res.send({stories})
    } else {
        delete req.body.preload;
        delete req.body.reqType
        let story = await Story.findById(req.params.id)
        try {
            if (!story) {
                return res.render('error/404')
            }
            const membership = /superadmin|admin|moderator/;
            if (!membership.test(req.user.membership)) {
                res.redirect('/admin/cpanel')
            } else {
                story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                    new: true,
                    runValidators: true
                });
            }
            let stories = await Story.find().populate('user').lean()
            res.send({stories})
        } catch (err) {
            console.error(err);
            res.render('error/500')
        }
    }
});

router.post('/cpanel/stories', async (req, res) => {
    const stories = await Story.find().populate('user');
    res.send({ stories: stories })
})

module.exports = router