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
