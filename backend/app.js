const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

//check config.index.js to see if environment is production
const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

//middleware for logging info about requests & responses
app.use(morgan('dev'));

//middleware for parsing cookies and json
app.use(cookieParser());
app.use(express.json());

//middleware for security
if (!isProduction) {
    // enable cors only in development
    // in production, all React & Express resources come from same source ==> don't need CORS
    app.use(cors());
}

// helmet helps set a variety of headers to better secure app, allows images with URLs to render in deployment
// react generally mitigates XSS
app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
// XSRF-TOKEN cookie value should be sent in header of all non-GET requests
// this header will be used to validate _csrf cookie to confirm the request comes from authorized site
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

//add routes
const routes = require('./routes');

app.use(routes);

module.exports = app;
