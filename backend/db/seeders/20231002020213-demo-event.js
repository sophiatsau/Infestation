'use strict';

const {Event} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Events"

const eventInfo = [
  {
    venueId: 1,
    groupId: 1,
    name: "Event 1",
    description: "Description",
    type: "Online",
    capacity: 20,
    price: 200,
    startDate: "2024-11-18 20:00:00",
    endDate: "2024-11-20 20:00:00",
  },
  {
    venueId: 2,
    groupId: 2,
    name: "Event 2",
    description: "Description",
    type: "In person",
    capacity: 20,
    price: 200,
    startDate: "2024-11-19 20:00:00",
    endDate: "2024-11-20 20:00:00",
  },
  {
    venueId: 2,
    groupId: 2,
    name: "Event 3",
    description: "Description",
    type: "In person",
    capacity: 20,
    price: 200,
    startDate: "2024-11-20 20:00:00",
    endDate: "2024-11-21 20:00:00",
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Event.bulkCreate(eventInfo, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
await queryInterface.bulkDelete('Events', {
      name: {[Op.in]: eventInfo.map(event => event.name)},
    }, {});
  }
};
