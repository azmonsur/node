const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ensureAuth } = require('../middleware/auth');
const { capitalize } = require('../helpers/ejs');

// User model 
const User = require('../models/User');

// @desc    Show contributor page
// @route   GET /user/apply/contributor
router.get('/apply/contributor', ensureAuth, (req, res) => {
    res.render('user/contributor');
});


// @desc    Show edit-profile page
// @route   GET /user/edit-profile
router.get('/edit-profile/:id', ensureAuth, async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('user/edit_profile', {
        user,
        capitalize
    })
});

// @desc    edit user profile
// @route   PUT /user/edit-profile
router.put('/edit-profile/:id', async (req, res) => {
    try {
        if (req.params.id == req.user._id) {
            const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard');
        } else {
            res.render('error/400')
        }
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
});

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/images/uploads/users',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${req.user.username}-${Date.now()}${path.extname(file.originalname)}`)
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('myImage');

// Function check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const fileTypes = /jpeg|gif|jpg|png/;

    // Check the extension
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    // Check the MIME type
    const mimeType = fileTypes.test(file.mimetype)

    if (mimeType && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images only')
    }
}

// @desc    Upload image
// @route   POST /user/upload/:id
router.post('/upload/', (req, res) => {
    const uploadsPath = './public/images/uploads/users'
    files = fs.readdirSync(uploadsPath);
    files.forEach(file => {
        if (file.includes(req.user.username)) {
            fs.unlinkSync(path.join(uploadsPath, file));
        }
    })
    upload(req, res, async (err) => {
        if (err) {
            const user = await User.findById(req.user._id)
            res.render('user/edit_profile', {
                user,
                msg: err,
                capitalize
            })
        } else {
            if (req.file == undefined) {
                const user = await User.findById(req.user._id)
                res.render('user/edit_profile', {
                    user,
                    msg: 'Error: No File Selected',
                    capitalize
                })
            } else {
                req.body.image = req.file.filename;
                const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
                    new: true,
                    runValidators: true
                });
                res.render('user/edit_profile', {
                    user,
                    msg: 'File Successfully Uploaded',
                    capitalize
                })
            }
        }
    });
});

module.exports = router;