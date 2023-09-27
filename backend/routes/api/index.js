// /api
const router = require('express').Router();

router.post('/test', function(req,res) {
    res.json({requestBody: req.body});
});

module.exports = router;

// fetch('/api/test', {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": "0r0zVgBI-tgRBdVYoyz0qvesFLc0Aqb8UjCs"
//     },
//     body: JSON.stringify({ hello: 'world' })
//   }).then(res => res.json()).then(data => console.log(data));

// http://localhost:8000/api/csrf/restore
