// backend/utils/auth.js

//middlewares for authentication

const jwt = require('jsonwebtoken');
const {jwtConfig} = require('../config');
const {Group, Membership, GroupImage, User, Venue, Event, EventImage, sequelize} = require('../db/models');

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
                include: ['email', 'createdAt', 'updatedAt', ]
              },
              include: {
                model: Membership,
                attributes: ['groupId', 'status', 'id']
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

const authorizationError = function (message) {
  const err = new Error();
  err.message = message || "Forbidden"
  err.title = 'Authorization required';
  err.errors = { message: 'Forbidden' };
  err.status = 403;
  return err;
}

/*************** HELPERS *************************** */
async function checkCohost(userId, groupId) {
  const isCoHost = await Membership.findOne({
      where: {
          userId,
          groupId,
          status: "co-host"
      }
  })

  return !!isCoHost
}

function checkOrganizer(organizerId, userId) {
  return organizerId === userId;
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

async function isGroupOrganizerOrCohost(req,res,next) {
  const groupId = req.group.id;
  const organizerId = req.group.organizerId;
  const userId = req.user.id

  const isCohost = await checkCohost(userId, groupId);
  const isOrganizer = checkOrganizer(organizerId, userId);

  if (isOrganizer || isCohost) {
    return next();
  } else {
    return next(authorizationError());
  }
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
async function addGroupToVenue(req, res, next) {
  req.group = await Group.findByPk(req.venue.groupId);

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

async function isEventOrganizerOrCohost(req,res,next) {
  const isCohost = await Membership.findOne({
      where: {
          userId: req.user.id,
          groupId: req.event.groupId,
          status: "co-host"
      }
  })

  req.group = await Group.findByPk(req.event.groupId);

  let isOrganizer;

  if (req.group) {
    isOrganizer = req.group.organizerId === req.user.id;
  }

  if (isOrganizer || isCohost) {
    return next();
  } else {
    return next(authorizationError());
  }
}

/********************* IMAGES *********************** */
async function addGroupToGroupImage(req,res,next) {
  req.image = await GroupImage.unscoped().findByPk(req.params.imageId);
  if (!req.image) {
    const err = new Error("Group Image couldn't be found");
    err.status = 404;
    return next(err);
  }

  req.group = await Group.findByPk(req.image.groupId);

  return next();
}

async function addGroupToEventImage(req,res,next) {
  req.image = await EventImage.unscoped().findByPk(req.params.imageId);
  if (!req.image) {
    const err = new Error("Event Image couldn't be found");
    err.status = 404;
    return next(err);
  }

  const event = await Event.findByPk(req.image.eventId);
  req.group = await event.getGroup();
  return next();
}

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  authorizationError,

  checkCohost,
  checkOrganizer,

  checkGroup,
  isOrganizer,
  isGroupOrganizerOrCohost,

  checkVenue,
  addGroupToVenue,
  isCoHost,

  checkEvent,
  isEventOrganizerOrCohost,

  addGroupToGroupImage,
  addGroupToEventImage
};
