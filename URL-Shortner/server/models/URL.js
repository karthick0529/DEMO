const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    hits: { type: Number, default: 0 },
});

module.exports = mongoose.model('URL', urlSchema);
