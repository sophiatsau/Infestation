// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth, checkEvent, authorizationError, isCoHost} = require('../../utils/auth');
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

    if (!isCoHost && !isAttending) return next(authorizationError());

    next();
}

async function addGroupIdToEvent(req,res,next) {
    req.params.groupId = req.event.toJSON().groupId
    next();
}

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

/***************** ROUTE HANDLERS *********** */

const router = express.Router();

//get all events
router.get('/', async(req,res,next) => {
    const events = await Event.findAll()

    res.json({Events: await addEventDetails(events)})
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
router.put('/:eventId', requireAuth, checkEvent, addGroupIdToEvent, isCoHost, validateEvent, async (req,res,next) => {
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

router.delete('/:eventId', requireAuth, checkEvent, addGroupIdToEvent, isCoHost, async (req,res,next) => {
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

    console.log("event", eventId, "group", groupId)

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

    return res.json({Attendees: attendees})

    const Members = members.map(member => {
        member = member.toJSON();
        member.Membership = member.Memberships[0];
        delete member.Memberships;
        return member;
    })

    res.json({Members});
})

//Request to Attend an Event based on the Event's id

//Change the status of an attendance for an event specified by id

//Delete attendance to an event specified by id



module.exports = router;
