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

/***************** HELPER FUNCTIONS ********** */
async function addEventDetails(events) {
    let jsonEvents = events.map((event) => event.toJSON())

    for (let i=0; i<events.length; i++) {
        jsonEvents[i].numAttending = (await events[i].getAttendances({
            where: {status: "attending"}
        })).length;

        const previewImage = (await events[i].getEventImages({where: {preview: true}}))[0];
        jsonEvents[i].previewImage = previewImage ? previewImage.url : null

        const Group = await events[i].getGroup({
            attributes: ["id","name","city","state"]
        });
        jsonEvents[i].Group = Group;

        const Venue = await events[i].getVenue({
            attributes: ["id","city","state"]
        });
        jsonEvents[i].Venue = Venue;
    }

    return jsonEvents;
}

/***************** ROUTE HANDLERS *********** */

const router = express.Router();

//get all events
router.get('/', async(req,res,next) => {
    const events = await Event.findAll({
        attributes: [ "id", "groupId", "venueId", "name", "type", "startDate", "endDate" ]
    })

    res.json({Events: await addEventDetails(events)})
})

module.exports = router;
