// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth} = require('../../utils/auth');
const { Event, sequelize } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors, validateVenue } = require('../../utils/validation');

/***************** ROUTE HANDLERS *********** */

const router = express.Router();



module.exports = router;
