'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {

    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
      })

      Group.hasMany(models.Event, {
        foreignKey: "groupId",
      }, {onDelete: "CASCADE"})

      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
      }, {onDelete: "CASCADE"})

      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
      }, {onDelete: "CASCADE"})

      Group.hasMany(models.Memberships, {
        foreignKey: "groupId",
      }, {onDelete: "CASCADE"})
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
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
