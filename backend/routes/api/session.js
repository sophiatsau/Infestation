// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

//Login: POST /api/session
router.post('/', async(req,res,next) => {
    const {credential, password} = req.body;

    const user = await User.scope('all').findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential,
            }
        }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
    }

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    }

    //set cookies based on safe user info
    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser,
    })
});


//Logout: DELETE /api/session
router.delete('/', async(req,res,next) => {
    res.clearCookie('token');
    res.json({message: "Successfully logged out"});
})


//Get session user: GET /api/session


module.exports = router;
