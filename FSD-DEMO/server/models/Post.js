// models/Post.js - This model is used to store and retrieve data from post collection that will be 
//                   diplayed/manipulated/processed and shown in the front-end

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    },],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        text: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },],
    date: {
        type: Date,
        default: Date.now,
    }, 
});

module.exports = mongoose.model('Post', postSchema);
