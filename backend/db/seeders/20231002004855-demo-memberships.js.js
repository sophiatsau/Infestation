'use strict';

const {Membership} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Memberships";

const membershipsData = [
  {
    userId: 1,
    groupId: 1,
    status: "co-host",
  },
  {
    userId: 2,
    groupId: 1,
    status: "member",
  },
  {
    userId: 2,
    groupId: 2,
    status: "pending",
  },
  {
    userId: 1,
    groupId: 2,
    status: "co-host",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Membership.bulkCreate(membershipsData, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
await queryInterface.bulkDelete(options, {userId: membershipsData.map(data => data.userId),
      groupId: {[Op.in]: membershipsData.map(data => data.groupId)},
    }, {});

  }
};
