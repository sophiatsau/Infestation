// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth, checkEvent, authorizationError, isCoHost} = require('../../utils/auth');
const { Event, Attendance, Group, Membership, Venue, sequelize, } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors, validateVenue, validateEvent } = require('../../utils/validation');

/***************** HELPER FUNCTIONS ********** */


/***************** ROUTE HANDLERS *********** */

const router = express.Router();


module.exports = router;
