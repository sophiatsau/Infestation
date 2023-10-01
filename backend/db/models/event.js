'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
      }, {onDelete: "CASCADE"})

      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
      }, {onDelete: "CASCADE"})

      Event.belongsTo(models.Venue, {
        foreignKey: "venueId"
      })

      Event.belongsTo(models.Group, {
        foreignKey: "groupId"
      })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,},
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,},
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5,255],
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,},
    type: {
      type: DataTypes.ENUM("Online", "In person"),
      allowNull: false,},
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,},
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: new Date(),
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: this.startDate,
      }
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
