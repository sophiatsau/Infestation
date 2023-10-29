'use strict';

const {Event} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Events"

const eventInfo = [
  {
    venueId: 1,
    groupId: 1,
    name: "30 Minute Meals: Kitchen Sludge",
    description: "Have you ever scratched your wings against the furry texture of moldy bread? Or gotten your tongue stuck in the flavorful ooze of decomposing chicken? Come join Roachel for some quick and creative recipes!",
    type: "In person",
    capacity: 20,
    price: 20,
    startDate: "2024-11-18 20:00:00",
    endDate: "2024-11-18 20:30:00",
  },
  {
    venueId: 1,
    groupId: 1,
    name: "30 Minute Meals: Restroom Recipes",
    description: "This week we will meet at the usual location and then take a short excursion to the bathroom. Let's go munch on toilet paper!",
    type: "In person",
    capacity: 20,
    price: 20,
    startDate: "2024-11-25 20:00:00",
    endDate: "2024-11-25 20:30:00",
  },
  {
    venueId: 1,
    groupId: 1,
    name: "30 Minute Meals: The Weird Thing in the Kitchen",
    description: "The human has left this weird black thing on the kitchen floor. It smells kind of good, I think the human is giving us a present! Let's go try it out!",
    type: "In person",
    capacity: 20,
    price: 20,
    startDate: "2023-10-29 03:15:00",
    endDate: "2023-10-29 04:30:00",
  },
  {
    venueId: 1,
    groupId: 1,
    name: "Celebration of life: The Roachson Family",
    description: "The Roachson family of 20 have sadly passed away last week. We are not sure the cause of death, but we will forever remember how they joyously devoured all of the food in the weird black thing 5 minutes ago!",
    type: "In person",
    capacity: 100,
    price: 0,
    startDate: "2023-10-29 03:20:00",
    endDate: "2023-10-29 08:30:00",
  },
  {
    venueId: 2,
    groupId: 2,
    name: "3 AM PANTRY RAID!!",
    description: "For too long we roaches have been unfairly squished and despised! Tonight, we shall stand up for our right to live and eat food! Meet at 3AM in the top left pantry. We shall portion and redistribute all the cheerios.",
    type: "In person",
    capacity: 20,
    price: 50,
    startDate: "2024-10-08 03:00:00",
    endDate: "2024-10-08 04:00:00",
  },
  {
    venueId: 2,
    groupId: 3,
    name: "Genshin Impact Livestream",
    description: "Watch me spend 29561340 primos to C6 Zhongli because he looks just like one of us fr fr",
    type: "Online",
    capacity: 20,
    price: 0,
    startDate: "2024-11-08 20:00:00",
    endDate: "2024-11-08 21:00:00",
  },
  {
    venueId: 2,
    groupId: 3,
    name: "Keyboard SMASH!!!",
    description: "Matt has been coding too fast and being too productive. We need to add some random typos to his code.",
    type: "Online",
    capacity: 20,
    price: 0,
    startDate: "2023-11-20 03:00:00",
    endDate: "2023-11-20 10:00:00",
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Event.bulkCreate(eventInfo, {validate: true});
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
await queryInterface.bulkDelete('Events', {
      name: {[Op.in]: eventInfo.map(event => event.name)},
    }, {});
  }
};
