'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Groups"

const groupsData = [
  {
    "organizerId": 1,
    "name": "30 Minute Meals",
    "about": "Learn how to prepare delicious and healthy meals out of rancid leftovers!",
    "type": "In person",
    "private": false,
    "city": "Garbageside",
    "state": "Kitchen",
  },
  {
    "organizerId": 2,
    "name": "Roach Bolshevik Party",
    "about": "The Roach Bolshevik Party: Advocating crumbs for all, one scuttle at a time.",
    "type": "In person",
    "private": false,
    "city": "Saint Pantriesburg",
    "state": "Kitchen",
  },
  {
    "organizerId": 2,
    "name": "Cockroach Comrades",
    "about": "Revolutionaries by day, pro-gamers by night. All roaches welcome to our gamer group!",
    "type": "Online",
    "private": true,
    "city": "Matt's PC",
    "state": "Office",
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { Group } = require('../models');
    await Group.bulkCreate(groupsData, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {name: {[Op.in]: groupsData.map(data => data.name)}}, {});
  }
};
