// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth, checkEvent} = require('../../utils/auth');
const { Event, sequelize } = require('../../db/models');

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

module.exports = router;
