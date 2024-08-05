const express = require('express');
const { createShortUrl, redirectToLongUrl, getAllUrls } = require('../controllers/urlController');
const router = express.Router();

router.post('/', createShortUrl);
router.get('/:shortUrl', redirectToLongUrl);
router.get('/', getAllUrls);

module.exports = router;
