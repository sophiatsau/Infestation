// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth, authorizationError } = require('../../utils/auth');
const { Group, Membership, GroupImage, User, Venue, sequelize } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

function groupValidate(group, next) {
    if (!group) {
        const err = new Error("Group couldn't be found")
        err.status = 404;
        return next(err)
    }

    return true;
}

async function isCoHost(userId, group, next) {
    const isCoHost = await Membership.findOne({
        where: {
            userId: userId,
            groupId: group.toJSON().id,
            status: "co-host"
        }
    })

    if (!isCoHost) return false;

    return true;
}

/******************* MIDDLEWARE *************** */
const validateGroup = [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({max: 60, min: 1}) //inclusive
      .withMessage("Name must be 60 characters or less"),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({min: 50}) //inclusive
      .withMessage("About must be 50 characters or more"),
    check('type')
      .exists({ checkFalsy: true })
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .exists({ checkFalsy: false })
      .isBoolean() //if want strictly true, false, use {strict: true}
      .withMessage("Private must be a boolean"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage("State is required"),
    handleValidationErrors
];

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

    res.json({Groups: await addNumMembersPreviewImage(groups)});

})

//Get details of a Group from an id
//authenticate: false
router.get('/:groupId', async (req,res,next) => {
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

    groupValidate(group, next);

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
    const newMembership = await newGroup.createMembership({userId: req.user.id, status: "co-host"})

    console.log(newMembership)

    return res.status(201).json(newGroup);
})

// Create and return a new image for a group specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the organizer for the group
router.post('/:groupId/images', requireAuth, async (req,res,next) => {
    const organizerId = req.user.id;
    const {groupId} = req.params;

    const group = await Group.findByPk(groupId);

    groupValidate(group, next);

    if (group.toJSON().organizerId !== organizerId) {
        return next(authorizationError(next))
    }

    const newImg = await group.createGroupImage(req.body);
    const {id, url, preview} = newImg.toJSON()

    return res.json({id, url, preview});
})

// Updates and returns an existing group.
// Require Authentication: true
// Require proper authorization: Group must belong to the current user
router.put('/:groupId', requireAuth, validateGroup, async (req,res,next) => {
    const organizerId = req.user.id;
    const {groupId} = req.params;

    const group = await Group.findByPk(groupId);

    groupValidate(group, next);

    if (group.toJSON().organizerId !== organizerId) {
        return next(authorizationError(next))
    }

    await group.update(req.body)

    return res.json(group);
})

// Deletes an existing group.
// Require Authentication: true
// Require proper authorization: Group must belong to the current user
router.delete('/:groupId', requireAuth, async (req,res,next) => {
    const organizerId = req.user.id;
    const {groupId} = req.params;

    const group = await Group.findByPk(groupId);

    groupValidate(group, next);

    if (group.toJSON().organizerId !== organizerId) {
        return next(authorizationError(next))
    }

    await group.destroy()

    return res.json({
        "message": "Successfully deleted"
    });
})

/*Returns all venues for a group specified by its id
Require Authentication: true
Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"
*/
router.get('/:groupId/venues', requireAuth, async (req,res,next) => {
    const userId = req.user.id;
    const {groupId} = req.params;

    const group = await Group.findByPk(groupId);

    groupValidate(group, next);

    //check is user is co-host
    if (! await isCoHost(userId, group, next)) {
        return authorizationError(next);
    }

    const venues = await group.getVenues();

    res.json({Venues: venues});
})

router.post('/:groupId/venues', requireAuth, async (req,res,next) => {
    const userId = req.user.id;
    const {groupId} = req.params;

    const group = await Group.findByPk(groupId);

    groupValidate(group, next);

    //check is user is co-host
    if (! await isCoHost(userId, group, next)) {
        return authorizationError(next);
    }

    const venues = await group.getVenues();

    res.json(venues);
})

module.exports = router;
