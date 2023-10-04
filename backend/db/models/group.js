'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  // const {Membership, GroupImage} = require('../models')

  class Group extends Model {

    // addNumMembers() {
    //   const group = this.toJSON();
    //   group.numMembers = group.Memberships.length;
    //   delete group.Memberships;
    //   return group;
    // }

    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
        as: "Organizer"
      })

      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE", hooks: true})

      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        onDelete: "CASCADE", hooks: true})

      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: "CASCADE", hooks: true})

      Group.hasMany(models.Membership, {
        foreignKey: "groupId",
        onDelete: "CASCADE", hooks: true})
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        min: 50,
      }
    },
    type: {
      type: DataTypes.ENUM("In person",'Online'),
      allowNull: false,
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Group',
    // defaultScope: {
    //   attributes: {
    //     exclude: ['createdAt', 'updatedAt']
    //   }
    // },
  });
  return Group;
};
