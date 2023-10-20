// backend/routes/index.js
const express = require('express');
const router = express.Router();

const apiRouter = require('./api');
router.use('/api', apiRouter);

//attach XSRF-TOKEN in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    // Serve frontend/build/index.html at root of /api
    router.get('/', (req, res) => {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      return res.sendFile(
        path.resolve(__dirname, '../../frontend', 'build', 'index.html')
      );
    });

    // Serve static assets from frontend/build
    router.use(express.static(path.resolve("../frontend/build")));

    // Serve frontend/build/index.html to routes that don't start with /api
    router.get(/^(?!\/?api).*/, (req, res) => {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      return res.sendFile(
        path.resolve(__dirname, '../../frontend', 'build', 'index.html')
      );
    });
}

// for dev only, get XSRF-TOKEN from frontend app
if (process.env.NODE_ENV !== 'production') {
    router.get('/api/csrf/restore', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.json({});
    });
}

// router.get('/api/csrf/restore', function(req, res) {
//     const csrfToken = req.csrfToken()
//     res.cookie('XSRF-TOKEN', csrfToken);
//     res.status(200).json({
//         'XSRF-Token': csrfToken
//     });
// });

module.exports = router;
