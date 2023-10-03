// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth,
    authorizationError,
    checkGroup,
    isOrganizer,
    isCoHost, } = require('../../utils/auth');
const { Group, Membership, GroupImage, User, Venue, sequelize } = require('../../db/models');

//used to validate request bodies. check, handleValidationErrors are now unnecessary.
const { check } = require('express-validator');
const { handleValidationErrors, validateVenue, validateGroup } = require('../../utils/validation');

/******************* HELPER FUNCTIONS ********* */

async function addNumMembersPreviewImage(groups) {
    let jsonGroups = groups.map((group) => group.toJSON())

    for (let i=0; i<groups.length; i++) {
        jsonGroups[i].numMembers = (await groups[i].getMemberships()).length;

        const previewImage = (await groups[i].getGroupImages({where: {preview: true}}))[0];

        jsonGroups[i].previewImage = previewImage ? previewImage.url : null
    }

    return jsonGroups;
}

function addNumMembers(group) {
    group.numMembers = group.Memberships.length;
    delete group.Memberships;
    return group;
}

/******************* MIDDLEWARE *************** */


/***************** ROUTE HANDLERS *********** */

const router = express.Router();

//Returns all the groups.
//authenticate: false
router.get('/', async (req,res,next) => {

    const groups = await Group.findAll();

    let Groups = await addNumMembersPreviewImage(groups)

    res.json({Groups});
})

//Get all Groups joined or organized by the Current User
//authentication: true
router.get('/current', requireAuth, async (req,res,next) => {
    const userId = req.user.id;

    const groups = await Group.findAll({
        include: {
            model: Membership,
            attributes: [],
            where: {
                status:
                  {[Op.in]: ["co-host","member"]},
                userId,
            }
        }
    });

    let Groups = await addNumMembersPreviewImage(groups)

    res.json({Groups});
})

//Get details of a Group from an id
//authenticate: false
router.get('/:groupId', checkGroup, async (req,res,next) => {
    const include = [
        {
            model: GroupImage,
            attributes: ["id", 'url', 'preview']
        },
        {
            model: User,
            as: "Organizer",
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: Venue,
            attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
        },
        {
            model: Membership,
        }
    ]

    let group = await Group.findByPk(req.params.groupId, {include});

    group = addNumMembers(group.toJSON());

    res.json({Groups: group});
})

//Creates and returns a new group.
//authentication: true
//validate body
router.post('/', requireAuth, validateGroup, async (req,res,next) => {
    req.body.organizerId = req.user.id
    const newGroup = await Group.create(req.body);

    //create new membership, automatically adding user as a co-host
    await newGroup.createMembership({userId: req.user.id, status: "co-host"})

    return res.status(201).json(newGroup);
})

// Create and return a new image for a group specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the organizer for the group
router.post('/:groupId/images', requireAuth, checkGroup, async (req,res,next) => {
    const organizerId = req.user.id;
    const group = req.group

    if (group.toJSON().organizerId !== organizerId) {
        return next(authorizationError())
    }

    const {url, preview} = req.body;

    const newImg = await group.createGroupImage(req.body);
    const {id} = newImg.toJSON()

    return res.json({id, url, preview});
})

// Updates and returns an existing group.
// Require Authentication: true
// Require proper authorization: Group must belong to the current user
router.put('/:groupId', requireAuth, checkGroup, isOrganizer, validateGroup, async (req,res,next) => {
    let group = req.group;
    const {name, about, type, private, city, state} = req.body

    await group.update({name, about, type, private, city, state})

    group = group.toJSON();
    delete group.updatedAt;

    return res.json(group);
})

// Deletes an existing group.
// Require Authentication: true
// Require proper authorization: Group must belong to the current user
router.delete('/:groupId', requireAuth, checkGroup, isOrganizer, async (req,res,next) => {
    await req.group.destroy()

    return res.json({
        "message": "Successfully deleted"
    });
})

/*Returns all venues for a group specified by its id
Require Authentication: true
Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
*/
router.get('/:groupId/venues', requireAuth, checkGroup, isCoHost, async (req,res,next) => {
    const group = req.group;

    const venues = await group.getVenues();

    res.json({Venues: venues});
})

router.post('/:groupId/venues', requireAuth, checkGroup, isCoHost, validateVenue, async (req,res,next) => {
    const group = req.group

    const {address, city, state, lat, lng} = req.body;

    let venue = await group.createVenue({address, city, state, lat, lng});

    venue = venue.toJSON();

    delete venue.createdAt
    delete venue.updatedAt

    res.json(venue);
})

module.exports = router;
