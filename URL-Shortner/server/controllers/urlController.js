const URL = require('../models/URL');
const shortid = require('shortid');

exports.createShortUrl = async (req, res) => {
    try {
        const { longUrl } = req.body;
        const shortUrl = shortid.generate();
        const url = await URL.create({ longUrl, shortUrl });
        res.status(201).json({ shortUrl });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.redirectToLongUrl = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await URL.findOne({ shortUrl });
        if (!url) throw new Error('URL not found');
        url.hits += 1;
        await url.save();
        res.redirect(url.longUrl);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllUrls = async (req, res) => {
    try {
        const urls = await URL.find();
        res.status(200).json(urls);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
