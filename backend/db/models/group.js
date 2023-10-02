'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {

    addNumMembers() {
      const group = this.toJSON();
      group.numMembers = group.Memberships.length;
      delete group.Memberships;
      return group;
    }

    static async findCountMembersGetPreview(queryObj) {
      const {numMembers, previewImage, currentUser} = queryObj;

      const {Membership, GroupImage} = require('../models')
      const include = queryObj.include || [];

      if (numMembers) {
        const query = {
          model: Membership,
          group: ['groupId'],
        };

        //!problem if numMembers isn't involved
        if (currentUser) {
          query.where = {
            status:
              {[Op.in]: ["co-host","member"]},
            userId: currentUser,
          };
        }
        include.push(query);
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

      let groups = await Group.findAll({include});

      groups = groups.map(group => group.toJSON())

      if (numMembers) {
        groups = groups.map( group => {
          group.numMembers = group.Memberships.length;
          delete group.Memberships;
          return group
        })
      }

      if (previewImage) {
        groups = groups.map( group => {
          group.previewImage = group.GroupImages[0].url || "Preview not found";
          delete group.GroupImages;
          return group
        })
      }

      return groups
    }

    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
        as: "Organizer"
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
