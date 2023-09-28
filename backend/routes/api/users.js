// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Signup: POST /api/users
router.post('/', async(req,res,next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const user = await User.create({username, email, hashedPassword});

    const safeUser = {
        username, email, id: user.id,
    }

    //log the user in immediately
    await setTokenCookie(res, safeUser);

    res.json({user: safeUser});
})

module.exports = router;
