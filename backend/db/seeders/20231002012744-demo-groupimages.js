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
    url: "group1-1.png",
    preview: true,
  },
  {
    groupId: 1,
    url: "group1-2.png",
    preview: false,
  },
  {
    groupId: 2,
    url: "group2-1.png",
    preview: true,
  },
  {
    groupId: 2,
    url: "group2-2.png",
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
