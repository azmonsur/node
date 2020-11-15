const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const { capitalize, truncateWithWords, stripTags, title } = require('../helpers/ejs');

// @desc    Show admin panel
// @route   GET /admin/cpanel
router.get('/cpanel', ensureAuth, (req, res) => {
    isSuperadmin = req.user.membership == 'superadmin' ? true : false;
    isAdmin = req.user.membership == 'admin' ? true : false;
    isModerator = req.user.membership == 'moderator' ? true : false;
    if (!isSuperadmin && !isAdmin && !isModerator) return res.render('error/404')

    allowed = { isSuperadmin, isModerator, isAdmin }
    res.render('admin/cpanel', {
        layout: 'layouts/admin',
        isSuperadmin,
        capitalize,
    })
})

module.exports = router