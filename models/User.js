const mongoose = require('mongoose');
const LocalStrategy = require('passport-local-mongoose'); // Change to passport-local-mongoose when installed


const UserSchema = new mongoose.Schema({
    googleId: {
        type: String
    },
    firstName: {
        type: String,
        uppercase: true,
        trim: true
    },
    lastName: {
        type: String,
        uppercase: true,
        trim: true
    },
    middleName: {
        type: String,
        uppercase: true,
        trim: true
    },
    
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    mobile: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    introText: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: String
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    membership: {
        type: String,
        default: 'ordinary',
        enum: ['ordinary', 'contributor', 'moderator', 'admin', 'superadmin']
    },
    requests: {
        type: String,
        default: 'none',
        enum: ['none', 'contributor_request', 'moderator_request', 'admin_request']
    },
    requestsApproved: {
        type: String,
        default: 'no',
        enum: ['no', 'yes']
    }
});

module.exports = mongoose.model('User', UserSchema)