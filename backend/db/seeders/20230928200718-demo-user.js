'use strict';

const {User} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = "Users";

const userInfo = [
  {
    email: 'demo@user.io',
    username: 'Demo-lition',
    hashedPassword: bcrypt.hashSync('password'),
    firstName: 'Roachel',
    lastName: 'Ray',
  },
  {
    email: 'user1@user.io',
    username: 'Roach1',
    hashedPassword: bcrypt.hashSync('password2'),
    firstName: 'Blattimir',
    lastName: 'Lenin',
  },
  {
    email: 'user2@user.io',
    username: 'Roach2',
    hashedPassword: bcrypt.hashSync('password3'),
    firstName: 'Real',
    lastName: 'Cockroach',
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await User.bulkCreate(userInfo, {validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'Roach1', 'Roach2'] }
    }, {});
  }
};
