// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth, checkEvent, authorizationError} = require('../../utils/auth');
const { Event, Attendance, Group, Membership, sequelize } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors, validateVenue } = require('../../utils/validation');

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

    const previewImage = (await event.getEventImages({where: {preview: true}}))[0];
    jsonEvent.previewImage = previewImage ? previewImage.url : null

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

module.exports = router;
