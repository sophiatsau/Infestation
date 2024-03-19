'use strict';

const {Venue} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Venues"

const venueInfo = [
  {
    groupId: 1,
    address: "1st Street",
    city: "City",
    state: "CA",
    lat: 0,
    lng: 0,
  },
  {
    groupId: 2,
    address: "2nd Street",
    city: "City",
    state: "CA",
    lat: 0,
    lng: 0,
  },
  {
    "groupId": 3,
    "address": "123 Main Street",
    "city": "Virtual",
    "state": "Online",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 4,
    "address": "456 Elm Street",
    "city": "Library",
    "state": "Study Room",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 5,
    "address": "789 Oak Street",
    "city": "Living Room",
    "state": "Yoga Mat",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 6,
    "address": "101 Pine Street",
    "city": "Home Theater",
    "state": "Couch",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 7,
    "address": "222 Maple Street",
    "city": "Kitchen",
    "state": "Dining Table",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 8,
    "address": "333 Walnut Street",
    "city": "Craft Room",
    "state": "Workbench",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 9,
    "address": "444 Cherry Street",
    "city": "Gaming Den",
    "state": "Console",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 10,
    "address": "555 Pineapple Street",
    "city": "Home Gym",
    "state": "Treadmill",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 11,
    "address": "666 Strawberry Street",
    "city": "Study Room",
    "state": "Chessboard",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 12,
    "address": "777 Watermelon Street",
    "city": "Home Studio",
    "state": "Keyboard",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 13,
    "address": "888 Blueberry Street",
    "city": "Backyard",
    "state": "Trail Map",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 14,
    "address": "999 Raspberry Street",
    "city": "Photography Studio",
    "state": "Camera",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 15,
    "address": "111 Blackberry Street",
    "city": "Living Room",
    "state": "Table",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 16,
    "address": "222 Cranberry Street",
    "city": "Study Room",
    "state": "Language Books",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 17,
    "address": "333 Grape Street",
    "city": "Art Gallery",
    "state": "Easel",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 18,
    "address": "444 Lemon Street",
    "city": "Writing Nook",
    "state": "Desk",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 19,
    "address": "555 Lime Street",
    "city": "Home Theater",
    "state": "Projector",
    "lat": 0,
    "lng": 0
  },
  {
    "groupId": 20,
    "address": "666 Orange Street",
    "city": "Living Room",
    "state": "Dance Floor",
    "lat": 0,
    "lng": 0
  }
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Venue.bulkCreate(venueInfo, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Venues', {
      address: {[Op.in]: venueInfo.map(venue => venue.address)},
    }, {});
  }
};
