'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "CASCADE", hooks: true})

      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
        onDelete: "CASCADE", hooks: true})

      Event.belongsTo(models.Venue, {
        foreignKey: "venueId"
      })

      Event.belongsTo(models.Group, {
        foreignKey: "groupId"
      },)
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0,
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: new Date().toLocaleDateString(),
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        afterStartDate(value) {
          if (this.startDate > value) {
            throw new Error("End date must be after start date")
          }
        },
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    }
  }, {
    sequelize,
    modelName: 'Event',
    // defaultScope: {
    //   attributes: {
    //     exclude: ['createdAt', 'updatedAt', "description", "capacity", "price"],
    //   }
    // }
  });
  return Event;
};
