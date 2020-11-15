const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
    },
    parentId: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    editedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Story', StorySchema);