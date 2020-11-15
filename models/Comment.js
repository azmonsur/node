const mongoose = require('mongoose');

const CommnentSchema = mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifieddAt: {
        type: Date
    }
});

module.exports = mongoose.model('Comment', CommnentSchema)