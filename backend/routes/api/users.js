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
    check('firstName')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Last Name is required'),
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
    const {username, email, password, firstName, lastName} = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const newUserInfo = {username, email, hashedPassword, firstName, lastName};

    const user = await User.create(newUserInfo);

    const safeUser = {
        username, email, id: user.id, firstName, lastName, memberships: [],
        attendances: [],
    };

    //log the user in immediately
    await setTokenCookie(res, safeUser);

    res.json({user: safeUser});
})

module.exports = router;
