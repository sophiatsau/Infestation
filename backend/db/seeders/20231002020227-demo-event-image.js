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
    url: "https://www.shutterstock.com/image-vector/grunge-blue-rubber-preview-word-260nw-1332132605.jpg",
    preview: true,
  },
  {
    eventId: 1,
    url: 'https://www.afvalbakdirect.nl/14366-large_default/trash-can-verzinkt.jpg',
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
