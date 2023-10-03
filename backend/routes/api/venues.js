// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth, authorizationError, authorize } = require('../../utils/auth');
const { Group, Membership, GroupImage, User, Venue, sequelize } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

/******************* HELPER FUNCTIONS ********* */

async function checkVenue(req, res, next) {
    req.venue = await Venue.findByPk(req.params.venueId)

    if (!req.venue) {
        const err = new Error("Venue couldn't be found")
        err.status = 404;
        return next(err)
    }

    return next();
}

function addGroupToVenue(req, res, next) {
    req.params.groupId = req.venue.toJSON().groupId;

    return next();
}

//multiple. Oh nm, maybe only in group.
async function checkGroup(req,res,next) {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
        const err = new Error("Group couldn't be found")
        err.status = 404;
        return next(err)
    }

    return next();
}

async function isCoHost(req, res, next) {
    //check is user is co-host of groupId
    const group = await Group.findByPk(req.params.groupId);

    const isCoHost = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: group.toJSON().id,
            status: "co-host"
        }
    })

    console.log(req.body, 'body')

    if (!isCoHost) return next(authorizationError());

    return next()
}

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

router.put('/:venueId', requireAuth, checkVenue, addGroupToVenue, isCoHost, validateVenue, async (req,res,next) => {
    const {address, city, state, lat, lng} = req.body;

    let venue = await req.venue.update({address, city, state, lat, lng})

    return res.json(venue);
})

module.exports = router;
