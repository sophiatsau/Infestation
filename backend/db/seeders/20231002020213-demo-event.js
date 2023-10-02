'use strict';

const {Event} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const eventInfo = [
  {
    venueId: 1,
    groupId: 1,
    name: "Venue 1",
    description: "Description",
    type: "Online",
    capacity: 20,
    price: 200,
    startDate: "2024-11-19 20:00:00",
    endDate: "2024-11-20 20:00:00",
  },
  {
    venueId: 1,
    groupId: 2,
    name: "Venue 1",
    description: "Description",
    type: "In person",
    capacity: 20,
    price: 200,
    startDate: "2024-11-19 20:00:00",
    endDate: "2024-11-20 20:00:00",
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Event.bulkCreate(eventInfo, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Events', {
      name: eventInfo.map(event => event.name),
    });
  }
};
