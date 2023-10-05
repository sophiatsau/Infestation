// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { requireAuth,
    authorizationError,
    checkGroup,
    isOrganizer,
    isCoHost,
    isGroupOrganizerOrCohost
 } = require('../../utils/auth');
const { Group, Membership, GroupImage, User, Venue, Event, sequelize } = require('../../db/models');

//used to validate request bodies. check, handleValidationErrors are now unnecessary.
const { check } = require('express-validator');
const { handleValidationErrors, validateVenue, validateGroup, validateEvent } = require('../../utils/validation');

/******************* HELPER FUNCTIONS ********* */
//!might move into event model
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
const validateMemberStatus = [
    check('status')
        .exists({ checkFalsy: true })
        .isIn(["co-host", "member"])
        .withMessage('Allowed status values: "co-host", "member", "pending"'),
    check("status")
        .not().isIn(["pending"])
        .withMessage("Cannot change a membership status to pending"),
    handleValidationErrors,
]
const validateUser = [
    check("memberId")
        .custom( async(memberId) => {
            const userExists = await User.findByPk(memberId)

            if (!userExists) throw new Error()
            return true;
        })
        .withMessage("User couldn't be found"),
    handleValidationErrors,
]

async function authChangeMembershipStatus(req,res,next) {
    const status = req.body.status;
    if (status==="member") {
        const isCoHost = await Membership.findOne({
            where: {
                userId: req.user.id,
                groupId: req.params.groupId,
                status: "co-host"
            }
        })

        if (!isCoHost) {
            next(authorizationError())
        }
    } else if (status==="co-host") {
        const isOrganizer = req.group.organizerId === req.user.id;

        if (!isOrganizer) {
            next(authorizationError())
        }
    }
    next();
}

async function isHostOrMemberDelete(req,res,next) {
    const isCoHost = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: req.params.groupId,
            status: "co-host"
        }
    })

    const isOrganizer = req.group.organizerId === req.user.id;

    if (isCoHost || isOrganizer) return next();
    else return next(authorizationError());
}

/***************** ROUTE HANDLERS *********** */

const router = express.Router();

//Returns all the groups.
router.get('/', async (req,res,next) => {

    const groups = await Group.findAll();

    let Groups = await addNumMembersPreviewImage(groups)

    res.json({Groups});
})

//Get all Groups joined or organized by the Current User
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
router.post('/', requireAuth, validateGroup, async (req,res,next) => {
    req.body.organizerId = req.user.id
    const newGroup = await Group.create(req.body);

    //create new membership, automatically adding user as a co-host
    await newGroup.createMembership({userId: req.user.id, status: "co-host"})

    return res.status(201).json(newGroup);
})

// Create and return a new image for a group specified by id.
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

// Updates/edits and returns an existing group.
router.put('/:groupId', requireAuth, checkGroup, isOrganizer, validateGroup, async (req,res,next) => {
    let group = req.group;
    const {name, about, type, private, city, state} = req.body

    await group.update({name, about, type, private, city, state})

    return res.json(group);
})

// Deletes an existing group.
router.delete('/:groupId', requireAuth, checkGroup, isOrganizer, async (req,res,next) => {
    await req.group.destroy()

    return res.json({
        "message": "Successfully deleted"
    });
})

/************************** VENUES ***************** */

/*Returns all venues for a group specified by its id*/
router.get('/:groupId/venues', requireAuth, checkGroup, isGroupOrganizerOrCohost, async (req,res,next) => {
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

/************************** EVENTS ***************** */
router.get('/:groupId/events', checkGroup, async (req,res,next) => {
    const events = await Event.findAll({
        where: {groupId: req.params.groupId},
    })

    const Events = await addEventDetails(events)

    res.json({Events})
});

router.post('/:groupId/events', requireAuth, checkGroup, isCoHost, validateEvent, async (req,res,next) => {
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
    const groupId = parseInt(req.params.groupId);

    const newEvent = await Event.create({groupId, venueId, name, type, capacity, price, description, startDate, endDate})

    const cleanEvent = newEvent.toJSON()
    delete cleanEvent.createdAt;
    delete cleanEvent.updatedAt;

    res.json(cleanEvent);
})

/************************* MEMBERSHIPS ***************** */

//Get all Members of a Group specified by its id
router.get('/:groupId/members', checkGroup, async (req,res,next) => {
    const {groupId} = req.params;

    const isCoHost = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId,
            status: "co-host"
        }
    })

    const isOrganizer = req.group.organizerId === req.user.id;

    const status = ['co-host', 'member']
    //if is co-host, include pending
    if (isCoHost || isOrganizer) status.push('pending')

    const members = await User.findAll({
        attributes: ['id','firstName','lastName'],
        include: {
            model: Membership,
            where: {
                status,
                groupId,
            },
            attributes: ["status"]
        }
    });

    const Members = members.map(member => {
        member = member.toJSON();
        member.Membership = member.Memberships[0];
        delete member.Memberships;
        return member;
    })

    res.json({Members});
})

//Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, checkGroup, async (req,res,next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;

    const existingMembership = await Membership.findOne({
        where: {
            userId,
            groupId,
        }
    })

    if (!existingMembership) {
        await Membership.create({
            userId,
            groupId,
            status: "pending",
        })

        return res.json({
            memberId: userId,
            status: "pending",
        })
    } else if (existingMembership.status==="pending") {
        //if membership already requested
        const err = new Error("Membership has already been requested");
        err.status = 400;
        return next(err);
    } else {
        //if already member
        const err = new Error("User is already a member of the group");
        err.status = 400;
        return next(err);
    }
})

//Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, checkGroup,authChangeMembershipStatus, validateMemberStatus, validateUser, async (req,res,next) => {
    const {memberId, status} = req.body;

    const updateMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: req.params.groupId,
        }
    })

    if (!updateMembership) {
        const err = new Error("Membership between the user and the group does not exist");
        err.status = 404;
        return next(err)
    }

    await updateMembership.update({status})

    const membership = {
        id: updateMembership.id,
        groupId: parseInt(req.params.groupId),
        memberId,
        status
    }

    res.json(membership)
})

//Delete membership to a group specified by id
router.delete('/:groupId/membership', requireAuth, checkGroup, isHostOrMemberDelete, validateUser, async (req,res,next) => {
    const {memberId} = req.body;

    const membership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: req.params.groupId,
        }
    })

    if (!membership) {
        const err = new Error("Membership does not exist for this User");
        err.status = 404;
        return next(err)
    }

    await membership.destroy();

    res.json({
        message: "Successfully deleted membership from group"
    })
})


module.exports = router;
