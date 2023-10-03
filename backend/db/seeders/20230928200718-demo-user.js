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
    firstName: 'fake',
    lastName: 'user',
  },
  {
    email: 'user1@user.io',
    username: 'FakeUser1',
    hashedPassword: bcrypt.hashSync('password2'),
    firstName: 'fake',
    lastName: 'user',
  },
  {
    email: 'user2@user.io',
    username: 'FakeUser2',
    hashedPassword: bcrypt.hashSync('password3'),
    firstName: 'fake',
    lastName: 'user',
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await User.bulkCreate(userInfo, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete(options)

    // await queryInterface.bulkDelete('Users', {
    //   email: userInfo.map(user => user.email),
    // });
  }
};
