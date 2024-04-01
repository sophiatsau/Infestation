// backend/routes/api/session.js
const express = require('express');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Membership } = require('../../db/models');

//used to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

/******************* MIDDLEWARE *************** */
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage("Password is required"),
    handleValidationErrors
];

/***************** ROUTE HANDLERS *********** */

const router = express.Router();

//Login: POST /api/session
router.post('/', validateLogin, async(req,res,next) => {
    const {credential, password} = req.body;

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential,
            }
        },
        include: {
          model: Membership,
          attributes: ['groupId', 'status', "id"]
        }
    });

    // const members = await user.getMemberships({
    //   attributes: ["status", "groupId", "id"]
    // })

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
    }

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        memberships: user.Memberships.map(member => {
          return {groupId: member.groupId, status: member.status, membershipId: member.id}
        })
    }

    //set cookies based on safe user info
    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser,
    })
});


//Logout: DELETE /api/session
router.delete('/', (_req,res,_next) => {
    res.clearCookie('token');
    res.json({message: "Successfully logged out"});
})


//Get session user: GET /api/session
router.get('/', async (req, res) => {
    //req.user is assigned when restoreUser middleware is called
    const { user } = req;
    if (user) {
      user.Memberships.forEach(element => {
        console.log("THE THING 🚀👨‍🎤🚀", element)
      });
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        memberships: user.Memberships.map(member => {
          return {groupId: member.groupId, status: member.status, membershipId: member.id}
        })
      };

      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
}
);

module.exports = router;
