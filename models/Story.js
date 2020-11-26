const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String
    },
    category: {
        type: String,
        enum: ['politics', 'entertainment', 'sport', 'relationship', 'crime','business', 
                'travel', 'education', 'computers', 'fashion', 'health', 'culture', 'religion', 
                'diaries'
            ]
    },
    likes: {
        count: {
            type: Number,
            default: 0
        },
        users: [] 
    },
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'private',
        enum: ['public', 'private']
    },
    frontPagePost: {
        type: String,
        default: 'false',
        enum: ['false', 'true']
    },
    archivePost: {
        type: String,
        default: 'false',
        enum: ['false', 'true']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    publishedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Story', StorySchema);