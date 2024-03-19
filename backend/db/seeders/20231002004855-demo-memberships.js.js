'use strict';

const {Membership} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Memberships";

const membershipsData = [
  {
    "userId": 1,
    "groupId": 1,
    "status": "co-host"
  },
  {
    "userId": 2,
    "groupId": 2,
    "status": "co-host"
  },
  {
    "userId": 2,
    "groupId": 3,
    "status": "co-host"
  },
  {
    "userId": 3,
    "groupId": 4,
    "status": "co-host"
  },
  {
    "userId": 4,
    "groupId": 5,
    "status": "co-host"
  },
  {
    "userId": 5,
    "groupId": 6,
    "status": "co-host"
  },
  {
    "userId": 6,
    "groupId": 7,
    "status": "co-host"
  },
  {
    "userId": 7,
    "groupId": 8,
    "status": "co-host"
  },
  {
    "userId": 8,
    "groupId": 9,
    "status": "co-host"
  },
  {
    "userId": 9,
    "groupId": 10,
    "status": "co-host"
  },
  {
    "userId": 10,
    "groupId": 11,
    "status": "co-host"
  },
  {
    "userId": 11,
    "groupId": 12,
    "status": "co-host"
  },
  {
    "userId": 12,
    "groupId": 13,
    "status": "co-host"
  },
  {
    "userId": 13,
    "groupId": 14,
    "status": "co-host"
  },
  {
    "userId": 14,
    "groupId": 15,
    "status": "co-host"
  },
  {
    "userId": 15,
    "groupId": 16,
    "status": "co-host"
  },
  {
    "userId": 16,
    "groupId": 17,
    "status": "co-host"
  },
  {
    "userId": 17,
    "groupId": 18,
    "status": "co-host"
  },
  {
    "userId": 18,
    "groupId": 19,
    "status": "co-host"
  },
  {
    "userId": 19,
    "groupId": 20,
    "status": "co-host"
  },
  {
    "userId": 20,
    "groupId": 21,
    "status": "co-host"
  },
  {
    "userId": 2,
    "groupId": 1,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 2,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 3,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 4,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 5,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 6,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 7,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 8,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 9,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 10,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 11,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 12,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 13,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 14,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 15,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 16,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 17,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 18,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 19,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 20,
    "status": "pending"
  },
  {
    "userId": 1,
    "groupId": 21,
    "status": "pending"
  },
  {
    "userId": 2,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 3,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 4,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 5,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 6,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 7,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 8,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 9,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 10,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 11,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 9,
    "groupId": 2,
    "status": "member"
  },
  {
    "userId": 10,
    "groupId": 2,
    "status": "member"
  },
  {
    "userId": 11,
    "groupId": 2,
    "status": "member"
  },
  {
    "userId": 12,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 13,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 14,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 15,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 16,
    "groupId": 1,
    "status": "member"
  },
  {
    "userId": 17,
    "groupId": 2,
    "status": "member"
  },
  {
    "userId": 18,
    "groupId": 2,
    "status": "member"
  },
  {
    "userId": 19,
    "groupId": 2,
    "status": "member"
  },
  {
    "userId": 20,
    "groupId": 2,
    "status": "member"
  }
]

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
