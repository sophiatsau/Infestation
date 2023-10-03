// backend/utils/auth.js

//middlewares for authentication

const jwt = require('jsonwebtoken');
const {jwtConfig} = require('../config');
const {Group, Membership, GroupImage, User, Venue, Event, sequelize} = require('../db/models');

const {secret, expiresIn} = jwtConfig;

//sets JWT cookie after user is logged in / signed up
function setTokenCookie(res, user) {
    const {id, username, email} = user;
    const safeUser = {id, username, email}

    const token = jwt.sign({data: safeUser},
        secret,
        {expiresIn: parseInt(expiresIn)}); //in seconds

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
        maxAge: expiresIn * 1000, //convert sec ==> ms
        httpOnly: true,
        //security for when in production
        secure: isProduction,
        sameSite: isProduction && 'Lax',
    })

    return token;
};

//restore session user based on content of JWT cookie
//checks if any user is currently logged in
function restoreUser(req,res,next) {
    //parse, verify JWT payload
    const {token} = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        };

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
              attributes: {
                include: ['email', 'createdAt', 'updatedAt']
              }
            });
          } catch (e) {
            res.clearCookie('token');
            return next();
          }

          if (!req.user) res.clearCookie('token');

          return next();
    });
}

//requires session user to be authenticated before accessing a route
//connected to all route handlers where user must be logged in to perform action
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

const authorizationError = function () {
  const err = new Error('Forbidden');
  err.title = 'Authorization required';
  err.errors = { message: 'Forbidden' };
  err.status = 403;
  return err;
}

/*************** GROUP **************** */

async function checkGroup(req,res,next) {
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
      const err = new Error("Group couldn't be found")
      err.status = 404;
      return next(err)
  }

  req.group = group;

  return next();
}

function isOrganizer(req,res,next) {
  if (req.group.toJSON().organizerId !== req.user.id) {
      return next(authorizationError())
  }

  next();
}

/*************** VENUE **************** */

async function checkVenue(req, res, next) {
  req.venue = await Venue.findByPk(req.params.venueId)

  if (!req.venue) {
      const err = new Error("Venue couldn't be found")
      err.status = 404;
      return next(err)
  }

  return next();
}

//optional? remove? not optimal?
function addGroupToVenue(req, res, next) {
  req.params.groupId = req.venue.toJSON().groupId;

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

  if (!isCoHost) return next(authorizationError());

  return next()
}

/********************* EVENTS ******************* */
async function checkEvent(req, res, next) {
  req.event = await Event.findByPk(req.params.eventId)

  if (!req.event) {
      const err = new Error("Event couldn't be found")
      err.status = 404;
      return next(err)
  }

  return next();
}

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  authorizationError,

  checkGroup,
  isOrganizer,

  checkVenue,
  addGroupToVenue,
  isCoHost,

  checkEvent,
};
