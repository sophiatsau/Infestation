'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {

    static associate(models) {
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId',
        onDelete: "CASCADE", hooks: true})

      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId',
      })
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      },
    city:{
      type:  DataTypes.STRING,
      allowNull: false,
      },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      },
    lat: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      }
      },
    lng: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      }
      }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Venue;
};
