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
    url: "https://64.media.tumblr.com/2788ec6d0becae00c9db96ee53b1a7ee/tumblr_inline_ogotj1VCel1rffyvr_500.jpg",
    preview: true,
  },
  {
    eventId: 2,
    url: 'https://64.media.tumblr.com/10e0bb101f5b2d851f8b4a2f336d5263/tumblr_inline_nqpjftUcx31r9omv4_1280.jpg',
    preview: true,
  },
  {
    eventId: 3,
    url: 'https://64.media.tumblr.com/452fd3495b403cb4a5466286a2cbc893/tumblr_inline_np4x8pJOnK1qb3qcf_1280.jpg',
    preview: true,
  },
  {
    eventId: 4,
    url: 'https://upload-os-bbs.hoyolab.com/upload/2021/11/01/111038170/396b5aa729a59c3dda88ed2333b1939e_5813360969437319082.jpg',
    preview: true,
  },
  {
    eventId: 5,
    url: 'https://c8.alamy.com/comp/DCBH94/cockroach-climbing-on-keyboard-to-present-about-computer-attacked-DCBH94.jpg',
    preview: true,
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
