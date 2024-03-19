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
    email: 'user1@example.com',
    username: 'DragonFire',
    hashedPassword: bcrypt.hashSync('password1'),
    firstName: 'Alice',
    lastName: 'Johnson',
  },
  {
    email: 'user2@example.com',
    username: 'Phoenix',
    hashedPassword: bcrypt.hashSync('password2'),
    firstName: 'David',
    lastName: 'Brown',
  },
  {
    email: 'user3@example.com',
    username: 'ThunderBird',
    hashedPassword: bcrypt.hashSync('password3'),
    firstName: 'Emily',
    lastName: 'Taylor',
  },
  {
    email: 'user4@example.com',
    username: 'Sapphire',
    hashedPassword: bcrypt.hashSync('password4'),
    firstName: 'Jack',
    lastName: 'Davis',
  },
  {
    email: 'user5@example.com',
    username: 'ShadowWolf',
    hashedPassword: bcrypt.hashSync('password5'),
    firstName: 'Sophia',
    lastName: 'Martinez',
  },
  {
    email: 'user6@example.com',
    username: 'MysticGaze',
    hashedPassword: bcrypt.hashSync('password6'),
    firstName: 'Oliver',
    lastName: 'Anderson',
  },
  {
    email: 'user7@example.com',
    username: 'LunarEclipse',
    hashedPassword: bcrypt.hashSync('password7'),
    firstName: 'Charlotte',
    lastName: 'Hernandez',
  },
  {
    email: 'user8@example.com',
    username: 'StormRider',
    hashedPassword: bcrypt.hashSync('password8'),
    firstName: 'Ethan',
    lastName: 'Lopez',
  },
  {
    email: 'user9@example.com',
    username: 'SilverFox',
    hashedPassword: bcrypt.hashSync('password9'),
    firstName: 'Ava',
    lastName: 'Gonzalez',
  },
  {
    email: 'user10@example.com',
    username: 'NeonBlaze',
    hashedPassword: bcrypt.hashSync('password10'),
    firstName: 'Logan',
    lastName: 'Wilson',
  },
  {
    email: 'user11@example.com',
    username: 'FrostBite',
    hashedPassword: bcrypt.hashSync('password11'),
    firstName: 'Grace',
    lastName: 'Moore',
  },
  {
    email: 'user12@example.com',
    username: 'CrimsonTide',
    hashedPassword: bcrypt.hashSync('password12'),
    firstName: 'Liam',
    lastName: 'Jackson',
  },
  {
    email: 'user13@example.com',
    username: 'NovaStar',
    hashedPassword: bcrypt.hashSync('password13'),
    firstName: 'Zoe',
    lastName: 'White',
  },
  {
    email: 'user14@example.com',
    username: 'MidnightWraith',
    hashedPassword: bcrypt.hashSync('password14'),
    firstName: 'Mia',
    lastName: 'Harris',
  },
  {
    email: 'user15@example.com',
    username: 'AstralVoyager',
    hashedPassword: bcrypt.hashSync('password15'),
    firstName: 'Noah',
    lastName: 'Clark',
  },
  {
    email: 'user16@example.com',
    username: 'SolarFlare',
    hashedPassword: bcrypt.hashSync('password16'),
    firstName: 'Ella',
    lastName: 'Lewis',
  },
  {
    email: 'user17@example.com',
    username: 'TwilightWanderer',
    hashedPassword: bcrypt.hashSync('password17'),
    firstName: 'William',
    lastName: 'Roberts',
  },
  {
    email: 'user18@example.com',
    username: 'AuroraDreams',
    hashedPassword: bcrypt.hashSync('password18'),
    firstName: 'Chloe',
    lastName: 'Turner',
  },
  {
    email: 'user19@example.com',
    username: 'BlazeKnight',
    hashedPassword: bcrypt.hashSync('password19'),
    firstName: 'James',
    lastName: 'Scott',
  },
  {
    email: 'user20@example.com',
    username: 'LunarWhisper',
    hashedPassword: bcrypt.hashSync('password20'),
    firstName: 'Harper',
    lastName: 'King',
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
