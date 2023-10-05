'use strict';

const {EventImage} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "EventImages"

const eventImageInfo = [
  {
    eventId: 1,
    url: 'image1.png',
    preview: true,
  },
  {
    eventId: 1,
    url: 'image2.png',
    preview: false,
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await EventImage.bulkCreate(eventImageInfo, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
await queryInterface.bulkDelete('EventImages', {
      url: {[Op.in]: eventImageInfo.map(data => data.url)},
    }, {});
  }
};
