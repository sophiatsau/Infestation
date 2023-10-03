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
      .withMessage("Street address is required"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage("State is required"),
    check('lat')
      .exists({ checkFalsy: false })
      .isFloat({min:-90, max:90})
      .withMessage("Latitude is not valid"),
    check('lng')
      .exists({ checkFalsy: false })
      .isFloat({min:-180, max:180})
      .withMessage("Longitude is not valid"),
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
