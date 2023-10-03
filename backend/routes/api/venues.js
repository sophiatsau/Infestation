// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth, authorizationError } = require('../../utils/auth');
const { Group, Membership, GroupImage, User, Venue, sequelize } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

/******************* HELPER FUNCTIONS ********* */

// function groupValidate(group, next) {
//     if (!group) {
//         const err = new Error("Group couldn't be found")
//         err.status = 404;
//         return next(err)
//     }
// }

/******************* MIDDLEWARE *************** */
const validateVenue = [
    check('address')
      .exists({ checkFalsy: true })
      .isLength({max: 60, min: 1}) //inclusive
      .withMessage("Name must be 60 characters or less"),
    check('city')
      .exists({ checkFalsy: true })
      .isLength({min: 50}) //inclusive
      .withMessage("About must be 50 characters or more"),
    check('state')
      .exists({ checkFalsy: true })
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('lat')
      .exists({ checkFalsy: false })
      .isBoolean() //if want strictly true, false, use {strict: true}
      .withMessage("Private must be a boolean"),
    check('lng')
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    handleValidationErrors
];

/***************** ROUTE HANDLERS *********** */

const router = express.Router();

router.put('/:venueId', requireAuth, validateVenue, async (req,res,next) => {
    // const organizerId = req.user.id;
    // const {groupId} = req.params;

    // const group = await Group.findByPk(groupId);

    // groupValidate(group, next);

    // if (group.toJSON().organizerId !== organizerId) {
    //     return next(authorizationError(next))
    // }

    // await group.update(req.body)

    return res.json();
})

module.exports = router;
