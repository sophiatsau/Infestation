// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth,
    checkVenue,
    addGroupToVenue,
    isCoHost, } = require('../../utils/auth');
const { Group, Membership, GroupImage, User, Venue, sequelize } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors, validateVenue } = require('../../utils/validation');

/***************** ROUTE HANDLERS *********** */

const router = express.Router();

router.put('/:venueId', requireAuth, checkVenue, addGroupToVenue, isCoHost, validateVenue, async (req,res,next) => {
    const {address, city, state, lat, lng} = req.body;

    let venue = await req.venue.update({address, city, state, lat, lng})

    return res.json(venue);
})

module.exports = router;
