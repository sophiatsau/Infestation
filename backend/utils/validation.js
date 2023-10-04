// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { check } = require('express-validator'); //testing

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    //gather results of check middlewares to determine what parts of body are valid, what parts invalid
  const validationErrors = validationResult(req);

  //if there are errors
  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => {
        const path = error.path==='credential' ? "email" : error.path;
        errors[path] = error.msg
      });

    const err = Error("Validation Error");
    err.errors = errors; //formatted errors passed on here
    err.status = 400;
    err.title = "Validation Error";
    next(err);
  }
  next();
};

/************************* BODY VALIDATORS ******************* */
const validateGroup = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({max: 60, min: 1}) //inclusive
    .withMessage("Name must be 60 characters or less"),
  check('about')
    .exists({ checkFalsy: true })
    .isLength({min: 50}) //inclusive
    .withMessage("About must be 50 characters or more"),
  check('type')
    .exists({ checkFalsy: true })
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .exists({ checkFalsy: false })
    .isBoolean() //if want strictly true, false, use {strict: true}
    .withMessage("Private must be a boolean"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  handleValidationErrors
];

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

const validateEvent = [
  check("venueId")
    .exists({ checkFalsy: true })
    .custom( async(venueId) => {
      const {Venue} = require('../db/models');
      const venueExists = await Venue.findByPk(venueId)

      if (!venueExists) throw new Error()
      return true;
    })
    .withMessage("Venue does not exist"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({min: 5})
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .exists({ checkFalsy: false })
    .isInt()
    .withMessage("Capacity must be an integer"),
  check("price")
    .exists({ checkFalsy: false })
    .isDecimal()
    .withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .isAfter(new Date().toLocaleDateString())
    .withMessage("Start date must be in the future"),
  check("endDate")
    .exists({ checkFalsy: true })
    .isAfter(this.startDate)
    .withMessage("End date is less than start date"),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateGroup,
  validateVenue,
  validateEvent,
};
