// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

//used to validate request bodies for signup
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

/******************* MIDDLEWARE *************** */
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];


/***************** ROUTE HANDLERS *********** */

const router = express.Router();

// Signup: POST /api/users
router.post('/', validateSignup, async(req,res,next) => {
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
