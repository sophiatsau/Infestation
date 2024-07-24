'use strict';

const {Attendance} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = 'Attendances';

const AttendanceInfo = [
    {
      eventId: 1,
      userId: 2,
      status: "attending",
    },
    {
      eventId: 2,
      userId: 2,
      status: "waitlist",
    },
    {
      eventId: 2,
      userId: 1,
      status: "pending",
    },
    {
        "eventId": 5,
        "userId": 17,
        "status": "attending"
    },
    {
        "eventId": 8,
        "userId": 3,
        "status": "pending"
    },
    {
        "eventId": 14,
        "userId": 12,
        "status": "waitlist"
    },
    {
        "eventId": 2,
        "userId": 9,
        "status": "attending"
    },
    {
        "eventId": 16,
        "userId": 1,
        "status": "pending"
    },
    {
        "eventId": 11,
        "userId": 5,
        "status": "attending"
    },
    {
        "eventId": 19,
        "userId": 18,
        "status": "waitlist"
    },
    {
        "eventId": 6,
        "userId": 4,
        "status": "attending"
    },
    {
        "eventId": 7,
        "userId": 20,
        "status": "pending"
    },
    {
        "eventId": 12,
        "userId": 15,
        "status": "attending"
    },
    {
        "eventId": 1,
        "userId": 8,
        "status": "waitlist"
    },
    {
        "eventId": 10,
        "userId": 7,
        "status": "pending"
    },
    {
        "eventId": 3,
        "userId": 19,
        "status": "attending"
    },
    {
        "eventId": 15,
        "userId": 11,
        "status": "waitlist"
    },
    {
        "eventId": 4,
        "userId": 14,
        "status": "pending"
    },
    {
        "eventId": 17,
        "userId": 13,
        "status": "attending"
    },
    {
        "eventId": 20,
        "userId": 2,
        "status": "waitlist"
    },
    {
        "eventId": 9,
        "userId": 10,
        "status": "pending"
    },
    {
        "eventId": 13,
        "userId": 6,
        "status": "attending"
    },
    {
        "eventId": 18,
        "userId": 16,
        "status": "waitlist"
    }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Attendance.bulkCreate(AttendanceInfo, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,
    {
      id: { [Op.in]: AttendanceInfo.map(data => data.eventId), }
    }, {});
  }
};
