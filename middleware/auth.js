module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            req.session.flash = {
                type: 'warning',
                message: 'Please log in to view this resource.',
            }
            res.redirect('/auth/login')
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}