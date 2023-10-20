// /api
const router = require('express').Router();
const sessionRouter = require('./session');
const usersRouter = require('./users');
const groupsRouter = require('./groups');
const venueRouter = require('./venues');
const eventRouter = require('./events');

const { restoreUser, requireAuth, isGroupOrganizerOrCohost,
  addGroupToGroupImage,
  addGroupToEventImage } = require('../../utils/auth.js');
const { GroupImage, EventImage, } = require('../../db/models');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/venues', venueRouter);
router.use('/events', eventRouter);

// router.post('/test', function(req,res) {
//     res.json({requestBody: req.body});
// });

/********************* IMAGES ********************** */
//organizer or cohost of group
router.delete('/group-images/:imageId', requireAuth, addGroupToGroupImage, isGroupOrganizerOrCohost, async (req,res,next) => {
  await req.image.destroy();
  res.json({
    "message": "Successfully deleted"
  });
})

//organizer or cohost of group of event
router.delete('/event-images/:imageId', requireAuth, addGroupToEventImage, isGroupOrganizerOrCohost, async (req,res,next) => {
  await req.image.destroy();
  res.json({
    "message": "Successfully deleted"
  });
})

module.exports = router;

/******************* MIDDLEWARE ***************** */


/*************************** TEST ******************** */
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// // GET /api/restore-user

// // router.use(restoreUser);

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// // GET /api/require-auth
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// http://localhost:8000/api/csrf/restore
