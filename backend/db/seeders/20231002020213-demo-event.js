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
    startDate: "2023-10-29 06:15:00",
    endDate: "2023-10-29 08:30:00",
  },
  {
    venueId: 1,
    groupId: 1,
    name: "Celebration of life: The Roachson Family",
    description: "The Roachson family of 20 have sadly passed away last week. We are not sure the cause of death, but we will forever remember how they joyously devoured all of the food in the weird black thing 5 minutes ago!",
    type: "In person",
    capacity: 100,
    price: 0,
    startDate: "2023-10-29 06:20:00",
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
    venueId: 3,
    groupId: 3,
    name: "Keyboard SMASH!!!",
    description: "Matt has been coding too fast and being too productive. We need to add some random typos to his code.",
    type: "Online",
    capacity: 20,
    price: 0,
    startDate: "2023-11-20 03:00:00",
    endDate: "2023-11-20 10:00:00",
  },
  {
    "venueId": 4,
    "groupId": 4,
    "name": "Yoga Session",
    "description": "Join us for a rejuvenating yoga session to start your day off right!",
    "type": "In person",
    "capacity": 15,
    "price": 0,
    "startDate": "2024-10-10 09:00:00",
    "endDate": "2024-10-10 10:00:00"
  },
  {
    "venueId": 5,
    "groupId": 5,
    "name": "Movie Night: Classic Films Marathon",
    "description": "Grab your popcorn and join us for a marathon of classic films!",
    "type": "In person",
    "capacity": 20,
    "price": 0,
    "startDate": "2024-10-12 18:00:00",
    "endDate": "2024-10-12 22:00:00"
  },
  {
    "venueId": 6,
    "groupId": 6,
    "name": "Cooking Class: Italian Cuisine",
    "description": "Learn how to cook delicious Italian dishes with our expert chef!",
    "type": "In person",
    "capacity": 10,
    "price": 30,
    "startDate": "2024-10-15 16:00:00",
    "endDate": "2024-10-15 18:00:00"
  },
  {
    "venueId": 7,
    "groupId": 7,
    "name": "Crafting Workshop: DIY Greeting Cards",
    "description": "Get creative and make your own personalized greeting cards!",
    "type": "Online",
    "capacity": 25,
    "price": 0,
    "startDate": "2024-10-18 14:00:00",
    "endDate": "2024-10-18 16:00:00"
  },
  {
    "venueId": 8,
    "groupId": 8,
    "name": "Gaming Night: Among Us Tournament",
    "description": "Join us for an exciting Among Us tournament with prizes for the winners!",
    "type": "Online",
    "capacity": 30,
    "price": 0,
    "startDate": "2024-10-20 20:00:00",
    "endDate": "2024-10-20 22:00:00"
  },
  {
    "venueId": 9,
    "groupId": 9,
    "name": "Morning Workout Session",
    "description": "Start your day with a high-energy workout session!",
    "type": "In person",
    "capacity": 15,
    "price": 0,
    "startDate": "2024-10-22 07:00:00",
    "endDate": "2024-10-22 08:00:00"
  },
  {
    "venueId": 10,
    "groupId": 10,
    "name": "Chess Tournament",
    "description": "Test your strategic skills in our chess tournament!",
    "type": "In person",
    "capacity": 20,
    "price": 0,
    "startDate": "2024-10-25 18:00:00",
    "endDate": "2024-10-25 20:00:00"
  },
  {
    "venueId": 11,
    "groupId": 11,
    "name": "Music Jam Session",
    "description": "Bring your instruments and join us for a fun music jam session!",
    "type": "Online",
    "capacity": 15,
    "price": 0,
    "startDate": "2024-10-28 19:00:00",
    "endDate": "2024-10-28 21:00:00"
  },
  {
    "venueId": 12,
    "groupId": 12,
    "name": "Hiking Trip: Forest Trail Exploration",
    "description": "Explore the beauty of nature with our hiking trip through the forest trails!",
    "type": "In person",
    "capacity": 12,
    "price": 0,
    "startDate": "2024-11-01 10:00:00",
    "endDate": "2024-11-01 14:00:00"
  },
  {
    "venueId": 13,
    "groupId": 13,
    "name": "Photography Workshop: Landscape Photography",
    "description": "Learn how to capture stunning landscape photos with our expert photographer!",
    "type": "Online",
    "capacity": 20,
    "price": 0,
    "startDate": "2024-11-04 15:00:00",
    "endDate": "2024-11-04 17:00:00"
  },
  {
    "venueId": 14,
    "groupId": 14,
    "name": "Board Game Night: Settlers of Catan",
    "description": "Join us for an evening of strategic board game fun with Settlers of Catan!",
    "type": "In person",
    "capacity": 15,
    "price": 10,
    "startDate": "2024-11-08 19:00:00",
    "endDate": "2024-11-08 22:00:00"
  },
  {
    "venueId": 15,
    "groupId": 15,
    "name": "Language Exchange Session: Spanish & English",
    "description": "Practice your Spanish and English language skills in our interactive language exchange session!",
    "type": "Online",
    "capacity": 20,
    "price": 0,
    "startDate": "2024-11-12 16:00:00",
    "endDate": "2024-11-12 18:00:00"
  },
  {
    "venueId": 16,
    "groupId": 16,
    "name": "Online Art Exhibition: Contemporary Artists Showcase",
    "description": "Explore the works of talented contemporary artists in our online art exhibition!",
    "type": "Online",
    "capacity": 50,
    "price": 5,
    "startDate": "2024-11-16 14:00:00",
    "endDate": "2024-11-16 16:00:00"
  },
  {
    "venueId": 17,
    "groupId": 17,
    "name": "Writing Workshop: Fiction Writing Techniques",
    "description": "Learn effective fiction writing techniques in our interactive writing workshop!",
    "type": "Online",
    "capacity": 15,
    "price": 15,
    "startDate": "2024-11-20 18:00:00",
    "endDate": "2024-11-20 20:00:00"
  },
  {
    "venueId": 18,
    "groupId": 18,
    "name": "Film Discussion: Critique of Modern Cinema",
    "description": "Join us for a lively discussion on the critique of modern cinema!",
    "type": "Online",
    "capacity": 30,
    "price": 0,
    "startDate": "2024-11-24 20:00:00",
    "endDate": "2024-11-24 22:00:00"
  },
  {
    "venueId": 19,
    "groupId": 19,
    "name": "Dance Workshop: Salsa Basics",
    "description": "Learn the basics of salsa dancing with our fun and energetic dance workshop!",
    "type": "In person",
    "capacity": 20,
    "price": 15,
    "startDate": "2024-11-28 17:00:00",
    "endDate": "2024-11-28 19:00:00"
  },
  {
    "venueId": 20,
    "groupId": 20,
    "name": "Tech Talk: Latest Innovations in AI",
    "description": "Discover the latest innovations in AI technology in our tech talk session!",
    "type": "Online",
    "capacity": 25,
    "price": 10,
    "startDate": "2024-12-02 14:00:00",
    "endDate": "2024-12-02 16:00:00"
  }
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
