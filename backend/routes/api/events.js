// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth, checkEvent, authorizationError, isCoHost, isEventOrganizerOrCohost,
    checkCohost,
    checkOrganizer,
} = require('../../utils/auth');
const { Event, Attendance, Group, Membership, Venue, User, sequelize, } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors, validateVenue, validateEvent } = require('../../utils/validation');

/***************** HELPER FUNCTIONS ********** */
async function addEventDetails(events) {
    let jsonEvents = events.map((event) => event.toJSON())

    for (let i=0; i<events.length; i++) {
        jsonEvents[i].numAttending = (await events[i].getAttendances({
            where: {status: "attending"}
        })).length;

        const previewImage = (await events[i].getEventImages({where: {preview: true}}))[0];
        jsonEvents[i].previewImage = previewImage ? previewImage.url : null

        jsonEvents[i].Group = await events[i].getGroup({
            attributes: ["id","name","city","state"]
        });

        jsonEvents[i].Venue = await events[i].getVenue({
            attributes: ["id","city","state"]
        });
    }

    return jsonEvents;
}

async function isAttending(req,res,next) {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const groupId = req.event.groupId;

    const isAttending = await Attendance.findOne({
        where: {
            eventId, userId, status: "attending"
        }
    })

    const isCoHost = await Membership.findOne({
        where: {
            userId,
            groupId,
            status: "co-host"
        }
    })

    req.group = await Group.findByPk(req.event.groupId);

    let isOrganizer;

    if (req.group) {
      isOrganizer = req.group.organizerId === req.user.id;
    }

    if (isCoHost || isAttending || isOrganizer) {
        return next();
    } else {
        return next(authorizationError());
    }
}

async function addGroupIdToEvent(req,res,next) {
    req.params.groupId = req.event.toJSON().groupId
    next();
}

async function isGroupMember(req,res,next) {
    //find event => groupId => membership
    const groupId = req.event.groupId;
    const membership = await Membership.findOne({
        where: {
            groupId,
            userId: req.user.id,
            status: {
                [Op.in]: ["member", "co-host"]
            }
        }
    })

    if (!membership) {
        return next(authorizationError());
    }

    next()
}

const validateAttendeeStatus = [
    check('status')
      .exists({ checkFalsy: true })
      .isIn(["attending", "waitlist", "pending"])
      .withMessage('Allowed status values: "attending", "waitlist", "pending"'),
    handleValidationErrors
];

async function isHostOrAttendeeDelete(req,res,next) {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const groupId = req.event.groupId;

    req.attendee = await Attendance.findOne({
        where: {
            eventId, userId,
        }
    })

    const isAttendee = req.attendee.id === req.body.userId;

    const group = await Group.findByPk(groupId)
    const isOrganizer = checkOrganizer(group.organizerId,userId)

    if (!isAttendee && !isOrganizer) return next(authorizationError("Only the User or organizer may delete an Attendance"));

    return next();
}

const validateQuery = [
    check('page')
      .optional({values: 'falsy'})
      .isInt({min:1})
      .withMessage("Page must be greater than or equal to 1"),
    check('size')
      .optional({values: 'falsy'})
      .isInt({min:1})
      .withMessage("Size must be greater than or equal to 1"),
    check('name')
      .optional({values: 'falsy'})
      .isString()
      .withMessage("Name must be a string"),
    check('type')
      .optional({values: 'falsy'})
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In Person'"),
    check('startDate')
      .optional({values: 'falsy'})
      .custom(startDate => {
        if (isNaN(new Date(startDate).getTime())) {
            throw new Error()
        };
        return true;
      })
      .withMessage("Start date must be a valid datetime"),
    handleValidationErrors
];

/***************** ROUTE HANDLERS *********** */

const router = express.Router();

//get all events
router.get('/', validateQuery, async(req,res,next) => {
    let {page,size,name,type,startDate} = req.query;

    const where = {};

    if (name) where.name = name;
    if (type) where.type = type;
    if (startDate) where.startDate = startDate;

    page = !page ?  1 : page > 10 ? 10 : page;
    size = !size || size > 20 ? 20 : size;

    const pagination = {
        limit: size,
        offset: size * (page-1),
    };

    const events = await Event.findAll({
        where,
        ...pagination
    })

    const Events = await addEventDetails(events)

    res.json({Events})
})

//get details of events by id
router.get('/:eventId', checkEvent, async(req,res,next) => {
    const event = await Event.unscoped().findByPk(req.params.eventId, {
        attributes: {
            exclude: ['updatedAt', 'createdAt']
        }
    });

    const jsonEvent = event.toJSON()

    jsonEvent.numAttending = (await event.getAttendances({
        where: {status: "attending"}
    })).length;

    jsonEvent.Group = await event.getGroup({
        attributes: ["id","name","private","city","state"]
    });

    jsonEvent.Venue = await event.getVenue({
        attributes: ["id","address","city","state","lat","lng"]
    });

    jsonEvent.EventImages = await event.getEventImages({
        attributes: ["id","url","preview"]
    });

    res.json(jsonEvent);
});

router.post("/:eventId/images", requireAuth, checkEvent, isAttending, async (req,res,next) => {
    const {url, preview} = req.body;

    const event = req.event;

    const image = await event.createEventImage({url, preview});

    const {id} = image.toJSON();

    res.json({id, url, preview});
})

//do we really need to check venue...
router.put('/:eventId', requireAuth, checkEvent, addGroupIdToEvent, isEventOrganizerOrCohost, validateEvent, async (req,res,next) => {
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
    const {id, groupId} = req.event

    const venue = await Venue.findByPk(venueId);

    // kinda redundant since we already have validateEvent?
    if (!venue) {
        const err = new Error("Venue couldn't be found");
        err.status = 404;
        next(err);
    }

    await req.event.update({venueId, name, type, capacity, price, description, startDate, endDate})

    const eventObj = {id, groupId, venueId, name, type, capacity, price, description, startDate, endDate}

    res.json(eventObj);
});

router.delete('/:eventId', requireAuth, checkEvent, addGroupIdToEvent, isEventOrganizerOrCohost, async (req,res,next) => {
    await req.event.destroy();

    res.json({"message": "Successfully deleted"})
})

/**************************** ATTENDEES ************** */
//Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', checkEvent, async (req,res,next) => {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    const userId = req.user.id
    const group = await event.getGroup();
    const groupId = group.id;

    const status = ["attending", "waitlist"]

    if (await checkCohost(userId,groupId) || checkOrganizer(group.organizerId, userId)) {
        status.push('pending')
    }

    const attendees = await User.findAll({
        attributes: ['id','firstName','lastName'],
        include: {
            model: Attendance,
            where: {
                status,
                eventId,
            },
            attributes: ["status"]
        }
    });

    const Attendees = attendees.map(attendee => {
        attendee = attendee.toJSON();
        [attendee.Attendance] = attendee.Attendances;
        delete attendee.Attendances;
        return attendee;
    })

    return res.json({Attendees})
})

//Request to Attend an Event based on the Event's id
router.post('/:eventId/attendance', requireAuth, checkEvent, isGroupMember, async (req,res,next) => {
    const userId = req.user.id;
    const eventId = req.event.id;

    const attendance = await Attendance.findOne({
        where: {
            userId,
            eventId,
        }
    })

    if (!attendance) {
        await Attendance.create({
            userId,
            eventId,
            status: "pending",
        });
        return res.json({userId, status:"pending"});

    } else if (attendance.status === "pending") {
        //if already pending attendance, error
        const err = new Error("Attendance has already been requested");
        err.status = 400;
        return next(err);

    } else if (attendance.status === "attending") {
        //if already attending, error
        const err = new Error("User is already an attendee of the event");
        err.status = 400;
        return next(err);

    } else if (attendance.status === "waitlist") {
        //if waitList, error, but this ain't on the docs
        const err = new Error("User is already on the waitlist for the event");
        err.status = 400;
        return next(err);
    }
})

//Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, checkEvent, isEventOrganizerOrCohost, validateAttendeeStatus, async (req,res,next) => {
    const {userId, status} = req.body;
    const eventId = req.event.id;

    if (status==="pending") {
        const err = new Error("Cannot change an attendance status to pending")
        err.status = 400;
        return next(err);
    }

    const attendance = await Attendance.findOne({
        where: {
            userId,
            eventId,
        }
    })

    if (!attendance) {
        const err = new Error("Attendance between the user and the event does not exist");
        err.status = 404;
        return next(err);
    } else {
        await attendance.update({status});
        return res.json({id: attendance.id, eventId, userId, status});
    }
})

//Delete attendance to an event specified by id
router.delete('/:eventId/attendance', requireAuth, checkEvent, isHostOrAttendeeDelete, async (req,res,next) => {
    const {userId} = req.body;
    const eventId = req.params.eventId;

    const attendance = await Attendance.findOne({
        where: {
            userId,
            eventId,
        }
    })

    if (!attendance) {
        const err = new Error("Attendance does not exist for this User");
        err.status = 404;
        return next(err)
    } else {
        await attendance.destroy();

        return res.json({
            message: "Successfully deleted attendance from event"
        });
    }
})

module.exports = router;
