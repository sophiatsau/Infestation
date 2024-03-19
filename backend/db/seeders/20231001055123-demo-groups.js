'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Groups"

const groupsData = [
  {
    "organizerId": 1,
    "name": "30 Minute Meals",
    "about": "Learn how to prepare delicious and healthy meals out of rancid leftovers!",
    "type": "In person",
    "private": false,
    "city": "Garbageside",
    "state": "Kitchen",
  },
  {
    "organizerId": 2,
    "name": "Roach Labour Party",
    "about": "The Roach Labour Party: Advocating crumbs for all, one scuttle at a time.",
    "type": "In person",
    "private": false,
    "city": "Saint Pantriesburg",
    "state": "Kitchen",
  },
  {
    "organizerId": 2,
    "name": "Cockroach Comrades",
    "about": "Revolutionaries by day, pro-gamers by night. All roaches welcome to our gamer group!",
    "type": "Online",
    "private": true,
    "city": "Matt's PC",
    "state": "Office",
  },
  {
    "organizerId": 3,
    "name": "Bookworm Gathering",
    "about": "A cozy book club where we discuss our favorite reads and share recommendations.",
    "type": "In person",
    "private": false,
    "city": "Library",
    "state": "Study Room"
  },
  {
    "organizerId": 4,
    "name": "Yoga Enthusiasts",
    "about": "Join us for some rejuvenating yoga sessions and find your inner peace.",
    "type": "In person",
    "private": false,
    "city": "Living Room",
    "state": "Yoga Mat"
  },
  {
    "organizerId": 5,
    "name": "Film Buffs Society",
    "about": "A community for cinephiles to discuss movies, share reviews, and organize movie nights.",
    "type": "Online",
    "private": true,
    "city": "Home Theater",
    "state": "Couch"
  },
  {
    "organizerId": 6,
    "name": "Cooking Connoisseurs",
    "about": "Passionate about cooking? Join us to share recipes, cooking tips, and indulge in culinary delights.",
    "type": "In person",
    "private": false,
    "city": "Kitchen",
    "state": "Dining Table"
  },
  {
    "organizerId": 7,
    "name": "Crafty Creators Collective",
    "about": "Get creative with us! Share your DIY projects, crafts, and artsy endeavors.",
    "type": "Online",
    "private": false,
    "city": "Craft Room",
    "state": "Workbench"
  },
  {
    "organizerId": 8,
    "name": "Gaming Guild",
    "about": "For gamers of all levels and interests. Let's play together and have fun!",
    "type": "Online",
    "private": false,
    "city": "Gaming Den",
    "state": "Console"
  },
  {
    "organizerId": 9,
    "name": "Fitness Fanatics Club",
    "about": "Join us for workouts, fitness challenges, and motivational support to stay active and healthy.",
    "type": "In person",
    "private": false,
    "city": "Home Gym",
    "state": "Treadmill"
  },
  {
    "organizerId": 10,
    "name": "Chess Champions Society",
    "about": "Sharpen your strategic thinking with us. All skill levels welcome!",
    "type": "In person",
    "private": false,
    "city": "Study Room",
    "state": "Chessboard"
  },
  {
    "organizerId": 11,
    "name": "Music Makers Alliance",
    "about": "A community for musicians and music enthusiasts to collaborate, share compositions, and jam together.",
    "type": "Online",
    "private": true,
    "city": "Home Studio",
    "state": "Keyboard"
  },
  {
    "organizerId": 12,
    "name": "Hiking Heroes",
    "about": "Explore the great outdoors with fellow hiking enthusiasts. Let's conquer new trails together!",
    "type": "In person",
    "private": false,
    "city": "Backyard",
    "state": "Trail Map"
  },
  {
    "organizerId": 13,
    "name": "Photography Society",
    "about": "Capture moments, share tips, and inspire each other through the art of photography.",
    "type": "Online",
    "private": false,
    "city": "Photography Studio",
    "state": "Camera"
  },
  {
    "organizerId": 14,
    "name": "Board Game Brigade",
    "about": "Gather 'round for some board game fun! From classics to modern favorites, let's roll the dice!",
    "type": "In person",
    "private": false,
    "city": "Living Room",
    "state": "Table"
  },
  {
    "organizerId": 15,
    "name": "Language Learners League",
    "about": "Expand your linguistic horizons with us. Practice, learn, and discover new languages together.",
    "type": "Online",
    "private": true,
    "city": "Study Room",
    "state": "Language Books"
  },
  {
    "organizerId": 16,
    "name": "Art Appreciation Society",
    "about": "Discuss art history, critique contemporary works, and appreciate the beauty of artistic expression.",
    "type": "Online",
    "private": false,
    "city": "Art Gallery",
    "state": "Easel"
  },
  {
    "organizerId": 17,
    "name": "Writing Workshop",
    "about": "Unleash your creativity, share your writing, and receive constructive feedback from fellow writers.",
    "type": "Online",
    "private": false,
    "city": "Writing Nook",
    "state": "Desk"
  },
  {
    "organizerId": 18,
    "name": "Film Fanatics Forum",
    "about": "A space for film buffs to discuss, analyze, and debate all things related to cinema.",
    "type": "Online",
    "private": true,
    "city": "Home Theater",
    "state": "Projector"
  },
  {
    "organizerId": 19,
    "name": "Dance Dynamics Crew",
    "about": "From salsa to hip-hop, join us to groove, learn new dance moves, and have a blast!",
    "type": "In person",
    "private": false,
    "city": "Living Room",
    "state": "Dance Floor"
  },
  {
    "organizerId": 20,
    "name": "Tech Talk Tribe",
    "about": "Geeks unite! Let's discuss the latest in technology, gadgets, and innovations.",
    "type": "Online",
    "private": false,
    "city": "Tech Lab",
    "state": "Workstation"
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { Group } = require('../models');
    await Group.bulkCreate(groupsData, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {name: {[Op.in]: groupsData.map(data => data.name)}}, {});
  }
};
