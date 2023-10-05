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
