'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {

    static async findCountMembersGetPreview(queryObj) {
      const {numMembers, previewImage, currentUser} = queryObj;

      const {Membership, GroupImage} = require('../models')
      const include = [];
      const where = {};
      if (numMembers) {
        include.push({
            model: Membership,
            group: ['groupId'],
        })
      }

      if (previewImage) {
        include.push({
          model: GroupImage,
          where: {
              preview: true,
          },
          attributes: ['url'],
        })
      }

      //can concat separate query for memberships?
      if (currentUser) {
        where.where = {
          organizerId: currentUser,
        }
      }

      let groups = await Group.findAll({include, ...where});

      groups = groups.map( group => {
          group = group.toJSON();
          group.numMembers = group.Memberships.length;
          group.previewImage = group.GroupImages[0].url || "Preview not found";
          delete group.Memberships;
          delete group.GroupImages;
          return group
      })

      return groups
    }

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

      Group.hasMany(models.Membership, {
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
