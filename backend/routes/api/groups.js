// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

/******************* MIDDLEWARE *************** */
// const validateLogin = [
//     check('credential')
//       .exists({ checkFalsy: true })
//       .notEmpty()
//       .withMessage('Please provide a valid email or username.'),
//     check('password')
//       .exists({ checkFalsy: true })
//       .withMessage('Please provide a password.'),
//     handleValidationErrors
// ];

/***************** ROUTE HANDLERS *********** */

const router = express.Router();

router.get('/', async (req,res,next) => {
    res.json();
})




module.exports = router;
