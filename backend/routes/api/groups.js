// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group } = require('../../db/models');

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

//Returns all the groups.
router.get('/', async (req,res,next) => {
    //include num members
    //include preview images
    const Groups = await Group.findAll();
    res.json({Groups});
})




module.exports = router;
