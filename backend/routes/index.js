// backend/routes/index.js
const express = require('express');
const router = express.Router();

const apiRouter = require('./api');
router.use('/api', apiRouter);

// for devs only
router.get('/api/csrf/restore', function(req, res) {
    const csrfToken = req.csrfToken()
    res.cookie('XSRF-TOKEN', csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

module.exports = router;
