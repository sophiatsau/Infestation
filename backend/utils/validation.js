// backend/utils/validation.js
const { validationResult } = require('express-validator');

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

    const err = Error("Bad request.");
    err.errors = errors; //formatted errors passed on here
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};
