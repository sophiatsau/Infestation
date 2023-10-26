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
    url: "https://www.afvalbakdirect.nl/14366-large_default/trash-can-verzinkt.jpg",
    preview: true,
  },
  {
    groupId: 1,
    url: "https://www.afvalbakdirect.nl/14366-large_default/trash-can-verzinkt.jpg",
    preview: false,
  },
  {
    groupId: 2,
    url: "https://64.media.tumblr.com/738606900872b9eec60c663eae0c94a1/37c9aa4d9599f1cf-30/s500x750/df3f1c80d5a947cbdafeac6f05898a2e0fc0d32a.jpg",
    preview: true,
  },
  {
    groupId: 3,
    url: "https://64.media.tumblr.com/840021b335c744f4ec30fb59d0fd9c5f/tumblr_nzbe4etm3d1ubsjupo1_1280.jpg",
    preview: true,
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
