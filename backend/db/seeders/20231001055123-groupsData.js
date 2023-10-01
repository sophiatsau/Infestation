'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Groups"

const groupsData = [
  {
    "organizerId": 1,
    "name": "Evening Tennis on the Water",
    "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
    "type": "In person",
    "private": true,
    "city": "New York",
    "state": "NY",
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { Group } = require('../models');
    await Group.bulkCreate(groupsData, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, {name: groupsData.map(data => data.name)});
  }
};
