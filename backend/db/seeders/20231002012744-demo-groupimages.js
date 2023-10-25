'use strict';

const {GroupImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "GroupImages";

const GroupImagesData = [
  {
    groupId: 1,
    url: "https://www.shutterstock.com/image-vector/grunge-blue-rubber-preview-word-260nw-1332132605.jpg",
    preview: true,
  },
  {
    groupId: 1,
    url: "https://www.afvalbakdirect.nl/14366-large_default/trash-can-verzinkt.jpg",
    preview: false,
  },
  {
    groupId: 2,
    url: "https://www.shutterstock.com/image-vector/grunge-blue-rubber-preview-word-260nw-1332132605.jpg",
    preview: true,
  },
  {
    groupId: 2,
    url: "https://www.afvalbakdirect.nl/14366-large_default/trash-can-verzinkt.jpg",
    preview: false,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate(GroupImagesData, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
await queryInterface.bulkDelete(options,
    {url: {[Op.in]: GroupImagesData.map(data => data.url)}}, {});

  }
};
